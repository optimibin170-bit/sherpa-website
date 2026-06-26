import { FormEvent, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "Namaste — I can help you explore SSA services, outsourcing strategy, finance support, and consultation next steps.",
  },
];

const parseStream = async (response: Response, onDelta: (chunk: string) => void) => {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response stream available");

  const decoder = new TextDecoder();
  let buffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ") || line.trim() === "") continue;

      const payload = line.slice(6).trim();
      if (payload === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(payload);
        const content = parsed.choices?.[0]?.delta?.content;
        if (typeof content === "string") onDelta(content);
      } catch {
        buffer = `${line}\n${buffer}`;
        break;
      }
    }
  }
};

export const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const requestInFlight = useRef(false);
  const functionUrl = useMemo(() => `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || requestInFlight.current) return;

    const userMessage: ChatMessage = { role: "user", content: question };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    requestInFlight.current = true;

    let assistantText = "";
    const updateAssistant = (chunk: string) => {
      assistantText += chunk;
      setMessages((current) => {
        const last = current[current.length - 1];
        if (last?.role === "assistant") {
          return current.map((message, index) => index === current.length - 1 ? { ...message, content: assistantText } : message);
        }
        return [...current, { role: "assistant", content: assistantText }];
      });
    };

    try {
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: nextMessages.filter((message) => message.content.trim()) }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error ?? "AI assistance could not respond. Please try again.");
      }

      await parseStream(response, updateAssistant);
    } catch (error) {
      toast({ title: "Chat assistant", description: error instanceof Error ? error.message : "Something went wrong." });
      setMessages((current) => current.filter((message) => message !== userMessage));
    } finally {
      setLoading(false);
      requestInFlight.current = false;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <section className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-primary/15 bg-card/95 shadow-elevated backdrop-blur-xl">
          <header className="flex items-center justify-between bg-peak-flow px-5 py-4 text-primary-foreground">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card/20"><Bot className="h-5 w-5" /></span>
              <div>
                <h2 className="text-base font-bold">SSA Assistant</h2>
                <p className="text-xs font-semibold opacity-85">Ask about services or proposals</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-2 transition-colors hover:bg-card/20" aria-label="Close chat assistant">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="max-h-[380px] min-h-[300px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm font-semibold leading-6 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && <div className="flex items-center gap-2 px-2 text-sm font-bold text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Thinking</div>}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border bg-background/80 p-3">
            <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={600} placeholder="Ask SSA..." className="min-w-0 flex-1 rounded-full border border-input bg-card px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring" />
            <button disabled={loading || !input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-opacity disabled:opacity-45" aria-label="Send message">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </section>
      )}

      <button onClick={() => setOpen((value) => !value)} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:-translate-y-1" aria-label="Open chat assistant">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};
