import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "https://your-domain.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const isValidMessage = (message: unknown): message is ChatMessage => {
  if (!message || typeof message !== "object") return false;
  const candidate = message as Record<string, unknown>;
  return (candidate.role === "user" || candidate.role === "assistant") && typeof candidate.content === "string" && candidate.content.trim().length > 0;
};

// --- Rate Limiting ---
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIp = getClientIp(req);
    if (!checkRateLimit(clientIp)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? body.messages.filter(isValidMessage).slice(-12) : [];

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "Please send a message to start the assistant." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Input length validation ---
    const MAX_MESSAGE_LENGTH = 2000;
    const hasTooLong = messages.some((m) => m.content.length > MAX_MESSAGE_LENGTH);
    if (hasTooLong) {
      return new Response(JSON.stringify({ error: "Message is too long. Please keep messages under 2000 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL") || "https://api.openai.com/v1";
    const AI_MODEL = Deno.env.get("AI_MODEL") || "gpt-4o";

    if (!AI_API_KEY) {
      console.error("AI_API_KEY is not configured in Supabase secrets.");
      return new Response(JSON.stringify({ error: "AI assistance is temporarily unavailable. Please try again later." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate AI_BASE_URL to prevent redirect attacks
    const ALLOWED_AI_HOSTS = ["api.openai.com", "api.anthropic.com", "generativelanguage.googleapis.com"];
    try {
      const urlObj = new URL(AI_BASE_URL);
      if (!ALLOWED_AI_HOSTS.includes(urlObj.hostname)) {
        console.error("AI_BASE_URL hostname not in allowlist:", urlObj.hostname);
        return new Response(JSON.stringify({ error: "AI assistance is temporarily unavailable. Please try again later." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch {
      console.error("AI_BASE_URL is not a valid URL");
      return new Response(JSON.stringify({ error: "AI assistance is temporarily unavailable. Please try again later." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        stream: true,
        messages: [
          {
            role: "system",
            content: "You are the Sherpa Strategic Advisors website assistant. Answer clearly and concisely about SSA services, outsourcing strategy, finance operations, offshore teams in Nepal, resources, and consultation next steps. Encourage users to book a consultation when appropriate. Do not invent prices, private client names, or guarantees.",
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI assistance is busy right now. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI assistance is temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI API error:", response.status);
      return new Response(JSON.stringify({ error: "AI assistance could not respond. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat-assistant error:", error instanceof Error ? error.message : "unknown");
    return new Response(JSON.stringify({ error: "An error occurred. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
