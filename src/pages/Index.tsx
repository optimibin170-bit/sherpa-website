import {
  ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Mail, MapPin, Search,
  Building2, Laptop, Briefcase, ShoppingCart, HeartPulse, Zap,
  Clock, Users, Globe, Menu,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import ssaLogo from "@/assets/ssa-logo.jpg";
import { resources, services, testimonials } from "@/data/ssa";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  TopographyPattern,
  GridPattern,
  MountainSilhouette,
  AbstractRings,
  DotsPattern,
  WavyLines,
  Mountain3D,
  IsometricCareer,
  NepalSilhouette,
  IsometricOffice,
  TestimonialVisual1,
  TestimonialVisual2,
} from "@/components/BackgroundPatterns";
import ParticlesComponent from "@/components/ui/particles-bg";

const headline = {
  eyebrow: "From Nepal to the world",
  title: "We build the systems that let your business run without you",
  body: "Most founders discover that the hardest part of scaling isn't finding clients — it's removing themselves from every daily decision. We design the operational infrastructure so your expertise compounds instead of bottlenecks.",
};

const metrics = [
  { value: "40%", label: "Average back-office cost reduction" },
  { value: "13", label: "Practice areas across strategy, finance & technology" },
  { value: "Nepal", label: "Global delivery hub" },
];

const capabilities = [
  { step: "01", title: "Strategy & Operations", text: "We map your current workflows, identify the bottlenecks, and design an operating rhythm that scales with your growth — not against it.", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=90" },
  { step: "02", title: "Finance Leadership", text: "From FP&A to cash management, we build the financial systems that give you visibility and control without drowning you in spreadsheets.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=90" },
  { step: "03", title: "Tailored Software", text: "We build the tools your team actually needs — not off-the-shelf compromises. Internal dashboards, automation pipelines, institutional memory systems.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=90" },
  { step: "04", title: "Offshore Delivery", text: "Our Kathmandu team delivers the same quality as a London or New York firm, at a fraction of the cost. Senior attention on every engagement.", image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&q=90" },
];

const industries = [
  { name: "Financial Services", icon: Building2, description: "Banking, insurance, and wealth management", color: "text-primary" },
  { name: "Technology", icon: Laptop, description: "SaaS, fintech, and digital platforms", color: "text-accent" },
  { name: "Professional Services", icon: Briefcase, description: "Consulting, legal, and advisory", color: "text-secondary" },
  { name: "Consumer & Retail", icon: ShoppingCart, description: "E-commerce, D2C, and retail", color: "text-primary" },
  { name: "Healthcare", icon: HeartPulse, description: "Health tech, pharma, and providers", color: "text-accent" },
  { name: "Energy", icon: Zap, description: "Renewables, utilities, and resources", color: "text-secondary" },
];

const caseStudies = [
  {
    title: "How a US Advisory Firm Reduced Back-Office Costs by 40%",
    category: "Finance Operations",
    metric: "40%",
    metricLabel: "Cost Reduction",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90",
  },
  {
    title: "Building Institutional Memory for a Scaling SaaS Company",
    category: "Technology",
    metric: "3x",
    metricLabel: "Faster Onboarding",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=90",
  },
  {
    title: "Offshore Delivery Model for a Global Consulting Firm",
    category: "Operations",
    metric: "60%",
    metricLabel: "Cost Savings",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=90",
  },
];

const clientLogos = [
  "TechVenture", "GlobalFinance", "MedCare", "RetailPro", "EnergyCorp", "ConsultingGroup"
];

const team = [
  {
    name: "Navin Giri",
    initials: "NG",
    color: "#dbeafe",
    textColor: "#1e40af",
    role: "CEO",
    tags: ["Strategy", "Client Engagement", "Growth Advisory"],
    bio: "Ex-Ernst and Young(EY),Chartered Accountant with More than 8 years of experiance in accounting,Auditing ,Financial Advisory  and Management consultant in India and Nepal.",
  },
  {
    name: "Nischal Gautam",
    initials: "NG",
    color: "#d1fae5",
    textColor: "#065f46",
    role: "Srtategic Partner, ",
    tags: ["FP&A", "CFO Advisory", "Financial Modeling"],
    bio: "Heads CFO services, financial planning, and analysis practice across industries.",
  },
  {
    name: "Lalit Budha",
    initials: "LB",
    color: "#ede9fe",
    textColor: "#5b21b6",
    role: "Partner, Business Development",
    tags: ["Offshore Delivery", "Process Design", "Team Building"],
    bio: "Leads product delivery and capability building.",
  },
  {
    name: "Pratik Budha Chettri",
    initials: "PB",
    color: "#dbeafe",
    textColor: "#1e40af",
    role: "AI Engineer, Technology Stack",
    tags: ["Software Architecture", "Automation", "System Integration"],
    bio: "Designs and builds tailored software solutions for operational efficiency.",
  },
];

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(255, "Email is too long"),
  message: z.string().trim().min(10, "Tell us a little more").max(1000, "Message is too long"),
});

const Index = () => {
  const [status, setStatus] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = contactSchema.safeParse({ name: form.get("name"), email: form.get("email"), message: form.get("message") });
    if (!result.success) { setStatus(result.error.issues[0]?.message ?? "Please check the form"); return; }
    const subject = encodeURIComponent(`SSA consultation request from ${result.data.name}`);
    const body = encodeURIComponent(`${result.data.message}\n\nReply to: ${result.data.email}`);
    window.location.href = `mailto:sherpastrategicc@gmail.com?subject=${subject}&body=${body}`;
    setStatus("Opening your email app with a prepared request.");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-primary/10 glass-card-strong">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink-soft sm:px-8">
          <span>Sherpa Strategic Advisors · Kathmandu</span>
          <div className="hidden gap-6 sm:flex">
            <a href="#capabilities" className="underline-slide hover:text-primary transition-colors duration-300">What we do</a>
            <a href="#thinking" className="underline-slide hover:text-primary transition-colors duration-300">Thinking</a>
            <a href="#contact" className="underline-slide hover:text-primary transition-colors duration-300">Contact</a>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-primary/10 glass-card-strong">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <img src={ssaLogo} alt="Sherpa Strategic Advisors" className="h-10 w-10 rounded-sm border border-primary/20 object-cover shadow-sm" />
            <span className="font-display text-[19px] font-semibold tracking-tight text-summit">Sherpa Strategic Advisors</span>
          </a>
          <div className="hidden items-center gap-8 text-[14px] font-medium text-summit lg:flex">
            <div className="group relative py-3">
              <button className="inline-flex items-center gap-1.5 hover:text-primary transition-colors duration-300">Services <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" /></button>
              <div className="invisible absolute left-1/2 top-full z-50 grid w-[520px] -translate-x-1/2 grid-cols-2 gap-1 rounded-lg border border-primary/15 glass-card p-3 opacity-0 shadow-elevated transition-all duration-300 group-hover:visible group-hover:opacity-100">
                {services.map((s) => (
                  <Link key={s.slug} to={`/services/${s.slug}`} className="rounded-md px-3 py-2.5 text-[13.5px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">{s.title}</Link>
                ))}
              </div>
            </div>
            <a href="#industries" className="underline-slide hover:text-primary transition-colors duration-300">Industries</a>
            <a href="#thinking" className="underline-slide hover:text-primary transition-colors duration-300">Insights</a>
            <a href="#people" className="underline-slide hover:text-primary transition-colors duration-300">People</a>
            <a href="#contact" className="underline-slide hover:text-primary transition-colors duration-300">Contact</a>
            <div className="group relative py-3">
              <button className="inline-flex items-center gap-1.5 hover:text-primary transition-colors duration-300">Know Yourself <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" /></button>
              <div className="invisible absolute left-1/2 top-full z-50 w-[280px] -translate-x-1/2 rounded-lg border border-primary/15 glass-card p-3 opacity-0 shadow-elevated transition-all duration-300 group-hover:visible group-hover:opacity-100">
                <a href="/know-yourself" className="block rounded-md px-3 py-2.5 text-[13.5px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">Finstate · Financial Analysis</a>
                <a href="/tax-calculator" className="block rounded-md px-3 py-2.5 text-[13.5px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">SSA Tax Calculator</a>
                <a href="/emi-calculator" className="block rounded-md px-3 py-2.5 text-[13.5px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">EMI Calculator</a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Search" className="hidden rounded-full border border-primary/20 p-2.5 text-summit transition-all duration-300 hover:bg-primary/8 hover:border-primary/30 hover:shadow-sm sm:inline-flex"><Search className="h-4 w-4" /></button>
            <a href="#contact" className="hidden sm:inline-flex items-center gap-2 rounded-sm gradient-cta px-6 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">Start a project <ArrowRight className="h-3.5 w-3.5" /></a>
            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <button aria-label="Open menu" className="inline-flex lg:hidden items-center justify-center rounded-md border border-primary/20 p-2.5 text-summit transition-all duration-300 hover:bg-primary/8">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <div className="flex h-full flex-col">
                  <div className="flex items-center border-b border-primary/10 px-5 py-4">
                    <span className="font-display text-[17px] font-semibold text-summit">Menu</span>
                  </div>
                  <nav className="flex-1 overflow-y-auto px-5 py-6">
                    <div className="space-y-1">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Services</p>
                      {services.map((s) => (
                        <SheetClose asChild key={s.slug}>
                          <Link to={`/services/${s.slug}`} className="block rounded-md px-3 py-2.5 text-[14px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">{s.title}</Link>
                        </SheetClose>
                      ))}
                    </div>
                    <div className="mt-6 space-y-1">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
                      <SheetClose asChild><a href="#industries" className="block rounded-md px-3 py-2.5 text-[14px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">Industries</a></SheetClose>
                      <SheetClose asChild><a href="#thinking" className="block rounded-md px-3 py-2.5 text-[14px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">Insights</a></SheetClose>
                      <SheetClose asChild><a href="#people" className="block rounded-md px-3 py-2.5 text-[14px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">People</a></SheetClose>
                      <SheetClose asChild><a href="#contact" className="block rounded-md px-3 py-2.5 text-[14px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">Contact</a></SheetClose>
                    </div>
                    <div className="mt-6 space-y-1">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tools</p>
                      <SheetClose asChild><a href="/know-yourself" className="block rounded-md px-3 py-2.5 text-[14px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">Finstate · Financial Analysis</a></SheetClose>
                      <SheetClose asChild><a href="/tax-calculator" className="block rounded-md px-3 py-2.5 text-[14px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">SSA Tax Calculator</a></SheetClose>
                      <SheetClose asChild><a href="/emi-calculator" className="block rounded-md px-3 py-2.5 text-[14px] text-ink-soft transition-all duration-200 hover:bg-primary/5 hover:text-primary">EMI Calculator</a></SheetClose>
                    </div>
                  </nav>
                  <div className="border-t border-primary/10 px-5 py-4">
                    <SheetClose asChild>
                      <a href="#contact" className="flex w-full items-center justify-center gap-2 rounded-sm gradient-cta px-6 py-3 text-[13px] font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">Start a project <ArrowRight className="h-3.5 w-3.5" /></a>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero — full-width with background image (McKinsey/BCG style) */}
      <section id="top" className="relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-summit/95 via-summit/80 to-summit/60" />
        <ParticlesComponent />
        <TopographyPattern />
        <div className="relative mx-auto max-w-7xl px-5 py-32 sm:px-8 lg:py-40 z-10">
          <div className="max-w-3xl">
            <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/80">{headline.eyebrow}</p>
            <h1 className="font-display text-[1.75rem] font-medium leading-[1.08] tracking-tight text-white sm:text-[2.5rem] md:text-5xl lg:text-[3.75rem]">
              {headline.title}
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-white/80 sm:text-[17px]">
              {headline.body}
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <a href="#capabilities" className="inline-flex items-center gap-2.5 rounded-sm bg-white px-8 py-4 text-[14px] font-semibold uppercase tracking-wider text-summit transition-all duration-300 hover:bg-white/90 hover:shadow-lg">See how we work <ArrowRight className="h-4 w-4" /></a>
              <a href="#contact" className="inline-flex items-center gap-2 border-b-2 border-white/50 pb-1.5 font-semibold text-white transition-all duration-300 hover:border-white">Talk to us <ArrowRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-1" /></a>
            </div>
          </div>
        </div>
        {/* Floating geometric elements */}
        <div className="absolute top-32 right-[15%] h-24 w-24 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm animate-float opacity-40" />
        <div className="absolute bottom-40 right-[10%] h-16 w-16 rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm rotate-45 animate-float opacity-30" style={{ animationDelay: "1.5s" }} />
      </section>

      {/* Metrics strip (Bain style) */}
      <section className="relative border-b border-primary/10 bg-summit">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-3 divide-x divide-white/10 px-5 sm:px-8">
          {metrics.map((m) => (
            <div key={m.label} className="py-10 text-center sm:py-14">
              <div className="font-display text-[1.75rem] font-medium text-white sm:text-[2.25rem] md:text-[2.75rem]">{m.value}</div>
              <div className="mt-2.5 text-[12px] uppercase tracking-wider text-white/60 leading-snug px-4">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Case Studies (McKinsey style) */}
      <section className="relative border-b border-primary/10 overflow-hidden">
        <DotsPattern />
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
          <div className="mb-12 flex items-end justify-between border-b border-primary/10 pb-7">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-summit">Client Success</p>
              <h2 className="mt-3 font-display text-[1.85rem] text-summit sm:text-[2.35rem]">Results that speak for themselves</h2>
            </div>
            <a href="#" className="hidden text-[14px] font-semibold text-summit hover:text-primary transition-all duration-300 sm:inline-flex">View all case studies →</a>
          </div>
          <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
            {caseStudies.map((study, i) => (
              <article key={study.title} className={`group relative overflow-hidden rounded-lg border border-primary/10 transition-all duration-300 hover-lift ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                <div className={`w-full bg-cover bg-center transition-all duration-500 group-hover:scale-105 ${i === 0 ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/3]"}`} style={{ backgroundImage: `url('${study.image}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-summit/90 via-summit/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">{study.category}</p>
                  <h3 className="mt-2 font-display text-[1.15rem] leading-snug text-white group-hover:text-primary-foreground transition-colors duration-300">{study.title}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-[2rem] font-medium text-white">{study.metric}</span>
                    <span className="text-[13px] text-white/70">{study.metricLabel}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative border-b border-primary/10 overflow-hidden min-h-[400px] sm:min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-background to-secondary/[0.02]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.4fr_0.6fr]">
          <div className="flex items-center justify-center">
            <Mountain3D />
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-summit">Who we are</p>
            <h2 className="mt-3 font-display text-[1.85rem] leading-[1.15] text-summit sm:text-[2.35rem]">
              We convert your institutional knowledge into systems that scale — so your business runs on process, not on you.
            </h2>
            <p className="mt-7 max-w-3xl text-[17px] leading-relaxed text-ink-soft">
              Sherpa Strategic Advisors partners with founders, CFOs, and operators from Kathmandu to global markets. We bring the rigor of a top-tier consulting firm with the cost advantage of a Nepal-based delivery model.
            </p>
            <div className="mt-12 flex flex-wrap gap-3">
              {["Strategy", "Finance", "Technology", "Operations"].map((tag) => (
                <span key={tag} className="rounded-full border border-primary/15 bg-background/80 backdrop-blur-sm px-4 py-2 text-[13px] font-medium text-summit shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md cursor-default">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities — card grid with images (BCG style) */}
      <section id="capabilities" className="relative border-b border-primary/10 overflow-hidden">
        <GridPattern />
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-summit">What we do</p>
            <h2 className="mt-3 font-display text-[1.85rem] text-summit sm:text-[2.35rem]">Four ways we help you grow</h2>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {capabilities.map((c, i) => (
              <Link key={c.step} to={`/services/${services[i]?.slug ?? services[0].slug}`} className={`group relative overflow-hidden rounded-lg border border-primary/10 transition-all duration-300 hover-lift ${i === 0 ? "md:col-span-2" : ""}`}>
                <div className={`w-full bg-cover bg-center transition-all duration-500 group-hover:scale-105 ${i === 0 ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[16/9]"}`} style={{ backgroundImage: `url('${c.image}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-summit/90 via-summit/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
                    <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary text-[12px] sm:text-[13px] font-medium text-primary-foreground">{c.step}</span>
                    <h3 className="font-display text-[1.1rem] sm:text-[1.25rem] text-white">{c.title}</h3>
                  </div>
                  <p className="max-w-2xl text-[13px] sm:text-[15px] leading-relaxed text-white/80">{c.text}</p>
                  <span className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-[13px] sm:text-[14px] font-semibold text-white opacity-0 transition-all duration-300 group-hover:opacity-100">Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries — icon grid */}
      <section id="industries" className="relative border-b border-primary/10 overflow-hidden">
        <WavyLines />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-secondary/[0.02]" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.38fr_0.62fr]">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-summit">Industries</p>
              <h2 className="mt-3 font-display text-[1.85rem] leading-tight text-summit sm:text-[2.35rem]">Deep expertise across the sectors that shape the global economy.</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                We partner with leaders across high-impact industries, bringing domain-specific insight to every engagement.
              </p>
              <div className="mt-8 hidden lg:block overflow-hidden rounded-2xl shadow-xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=80"
                  alt="Modern office workspace with data screens"
                  className="h-[260px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-summit/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">Global Reach</p>
                    <p className="text-[12px] text-white/70">Kathmandu → World</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {industries.map((ind, i) => {
                const Icon = ind.icon;
                const stats = ["$2.4T+", "38%", "520K+", "$890B+", "14%", "12%"];
                return (
                  <div key={ind.name} className="group relative rounded-xl border border-primary/10 p-6 transition-all duration-300 hover:border-primary/25 hover:bg-primary/[0.03] hover:shadow-xl hover:shadow-primary/5 cursor-pointer overflow-hidden">
                    <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
                    <div className="flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110 group-hover:shadow-md`}>
                        <Icon className={`h-5 w-5 ${ind.color}`} />
                      </div>
                      <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-primary/40 group-hover:text-primary/70 transition-colors duration-300">{stats[i]}</span>
                    </div>
                    <h3 className="mt-4 font-display text-[1.05rem] text-summit group-hover:text-primary transition-colors duration-300">{ind.name}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{ind.description}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-primary opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Explore industry <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Thinking / Insights */}
      <section id="thinking" className="relative border-b border-primary/10 overflow-hidden">
        <DotsPattern />
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
          <div className="mb-12 flex items-end justify-between border-b border-primary/10 pb-7">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-summit">Latest thinking</p>
              <h2 className="mt-3 font-display text-[1.85rem] text-summit sm:text-[2.35rem]">Ideas that shape how we work</h2>
            </div>
            <a href="#" className="hidden text-[14px] font-semibold text-summit hover:text-primary transition-all duration-300 sm:inline-flex">View all →</a>
          </div>
          <div className="grid gap-8 md:grid-cols-2" style={{ perspective: "1200px" }}>
            {resources.map((r, i) => (
              <Link key={r.slug} to={`/resources/${r.slug}`} className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-500 ${i === 0 ? "md:col-span-2" : ""}`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: i === 0 ? "none" : `rotateY(${i % 2 === 0 ? 2 : -2}deg) rotateX(1deg)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(12px)";
                  e.currentTarget.style.boxShadow = "0 25px 60px -12px rgba(2, 119, 189, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = i === 0 ? "none" : `rotateY(${i % 2 === 0 ? 2 : -2}deg) rotateX(1deg)`;
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div className="relative w-full overflow-hidden rounded-t-xl border border-primary/10 bg-card shadow-sm">
                  <div className="relative overflow-hidden" style={{ aspectRatio: i === 0 ? "2.5/1" : "4/3" }}>
                    <img
                      src={r.image}
                      alt={r.title}
                      className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-summit/60 via-summit/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col rounded-b-xl border border-t-0 border-primary/10 bg-card p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-summit">{r.type}</p>
                  <h3 className={`mt-2 font-display leading-snug text-summit group-hover:text-primary transition-colors duration-300 ${i === 0 ? "text-[1.5rem]" : "text-[1.15rem]"}`}>{r.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{r.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-primary">Read more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial — scrollable carousel with floating panels */}
      <section className="relative border-b border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-summit/5 via-background to-primary/5" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-12 sm:px-8 sm:pt-20">
          <span className="inline-block rounded-full border border-primary/20 bg-white/60 px-5 py-2 text-[13px] font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">Testimonial</span>
        </div>
        <TopographyPattern />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] items-start">
            <div className="hidden lg:flex justify-center lg:sticky lg:top-32">
              {testimonialIndex === 0 && <TestimonialVisual1 />}
              {testimonialIndex === 1 && <TestimonialVisual2 />}
            </div>
            <div className="mx-auto max-w-3xl">
              <blockquote key={testimonialIndex} className="animate-fade-in-up relative rounded-2xl border border-primary/10 bg-white/50 p-6 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
                <span className="block text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-none text-summit/10 sm:text-primary/10 font-serif mb-3 sm:mb-4 select-none" aria-hidden="true">&quot;</span>
                <p className="text-[17px] md:text-[18px] lg:text-[19px] leading-relaxed text-summit/90 sm:text-[16px]">
                  {testimonials[testimonialIndex].quote}
                </p>
                <span className="block text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-none text-summit/10 sm:text-primary/10 font-serif text-right mt-3 sm:mt-4 select-none" aria-hidden="true">&quot;</span>
              </blockquote>
              <figcaption className="mt-6 sm:mt-8 border-t border-primary/10 pt-4 sm:pt-5">
                <div className="font-semibold text-summit">{testimonials[testimonialIndex].name}</div>
                <div className="text-[13px] text-muted-foreground">{testimonials[testimonialIndex].title}</div>
              </figcaption>
              <div className="mt-6 sm:mt-8 flex items-center gap-4">
                <button
                  onClick={() => setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 text-summit transition-all duration-300 hover:bg-primary/5 hover:border-primary/40"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === testimonialIndex ? "w-8 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"}`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 text-summit transition-all duration-300 hover:bg-primary/5 hover:border-primary/40"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* People */}
      <section id="people" className="relative border-b border-primary/10 overflow-hidden">
        <GridPattern />
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
          <div className="mb-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-summit">Our People</p>
            <h2 className="mt-3 font-display text-[1.85rem] text-summit sm:text-[2.35rem]">Meet the team</h2>
            <p className="mt-3 text-[15px] text-ink-soft">The experts behind our work — strategy, finance, technology, and operations.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <article key={m.name} className="group rounded-2xl border border-primary/10 bg-white p-6 transition-all duration-300 hover:shadow-md">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold" style={{ backgroundColor: m.color, color: m.textColor }}>
                    {m.initials}
                  </div>
                  <div>
                    <h3 className="font-display text-[1.05rem] text-summit">{m.name}</h3>
                    <p className="text-[12px] text-ink-soft">{m.role}</p>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {m.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-primary/10 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-ink-soft">{tag}</span>
                  ))}
                </div>
                <p className="text-[13px] leading-relaxed text-ink-soft">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="relative border-b border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.03] via-background to-primary/[0.02]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.45fr_0.55fr]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-summit">Careers</p>
            <h2 className="mt-3 font-display text-[1.85rem] leading-[1.15] text-summit sm:text-[2.35rem]">
              Build a consulting career that takes you to the world — from Nepal.
            </h2>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              We hire problem-solvers who want mentorship, exposure to senior decisions, and the discipline of working across strategy, finance, and technology.
            </p>
            <div className="mt-8 space-y-3">
              {[
                { icon: Users, text: "Direct mentorship from partners" },
                { icon: Globe, text: "Global client exposure from day one" },
                { icon: ArrowRight, text: "Clear growth path to leadership" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-[14px] text-ink-soft">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/5">
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
            <a href="mailto:sherpastrategicc@gmail.com" className="mt-9 inline-flex items-center gap-2.5 gradient-cta px-8 py-4 text-[14px] font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]">Explore open roles <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="flex flex-col items-center gap-8">
            <IsometricCareer />
            <div className="grid w-full grid-cols-2 gap-3">
              {[
                ["Consultant", "Strategy & Operations", "hsl(188 79% 42%)"],
                ["Analyst", "Financial Planning", "hsl(145 69% 47%)"],
                ["Engineer", "Tailored Software", "hsl(209 77% 52%)"],
                ["Associate", "Research & Insights", "hsl(204 86% 38%)"],
              ].map(([t, s, color]) => (
                <div key={t} className="group rounded-lg border border-primary/10 bg-background/80 p-6 transition-all duration-300 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 cursor-pointer overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-1 w-1 rounded-full opacity-60 transition-all duration-300 group-hover:w-full group-hover:rounded-none" style={{ backgroundColor: color as string }} />
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-summit">{s}</p>
                  <p className="mt-2.5 font-display text-[1.1rem] text-summit">{t}</p>
                  <p className="mt-1.5 text-[13px] text-muted-foreground">Kathmandu · Full-time</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact — form left, info right */}
      <section id="contact" className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.04]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/[0.03]" />
        <DotsPattern />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:gap-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.6fr]">
          <form onSubmit={handleSubmit} className="grid gap-5 rounded-xl border-t-2 border-primary p-2 pt-8 glass-card shadow-elevated">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-summit">Request a proposal</p>
            <label className="grid gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Name<input name="name" maxLength={100} className="rounded-md border border-primary/10 bg-white/50 px-4 py-3.5 text-[15px] font-normal normal-case tracking-normal text-summit outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300" /></label>
            <label className="grid gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Email<input name="email" maxLength={255} className="rounded-md border border-primary/10 bg-white/50 px-4 py-3.5 text-[15px] font-normal normal-case tracking-normal text-summit outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300" /></label>
            <label className="grid gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-soft">How can we help?<textarea name="message" maxLength={1000} className="min-h-36 rounded-md border border-primary/10 bg-white/50 px-4 py-3.5 text-[15px] font-normal normal-case tracking-normal text-summit outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 resize-none" /></label>
            <button className="mt-5 inline-flex w-fit items-center gap-3 rounded-lg gradient-cta px-8 py-4 text-[14px] font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]">Send request <ArrowRight className="h-4 w-4" /></button>
            {status && <p className="text-[14px] font-semibold text-primary">{status}</p>}
          </form>
          <div className="flex flex-col justify-center">
            <div className="flex items-start gap-6">
              <div>
                <h3 className="font-display text-[1.5rem] text-summit">Let's talk about what's next</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  Tell us about the challenge on your desk. We'll respond with a focused proposal within 48 hours.
                </p>
              </div>
              <div className="hidden xl:block">
                <IsometricOffice />
              </div>
            </div>
            <div className="mt-10 space-y-5 text-summit">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Kalanki-10, Kathmandu, Nepal</div>
                  <div className="text-[14px] text-muted-foreground">Cell: 9745370131</div>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">sherpastrategicc@gmail.com</div>
                  <div className="text-[14px] text-muted-foreground">Partnership inquiries</div>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Office Hours</div>
                  <div className="text-[14px] text-muted-foreground">Sun–Fri, 9:00 AM – 6:00 PM NPT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-primary/10 bg-summit text-primary-foreground overflow-hidden">
        <MountainSilhouette />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-[1.2rem]">Sherpa Strategic Advisors</div>
            <p className="mt-3.5 max-w-md text-[14px] opacity-80 leading-relaxed">Strategy, finance, and technology consulting — from Nepal to the world.</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] opacity-60">Firm</p>
            <ul className="mt-3.5 space-y-2.5 text-[14px]">
              <li><a href="#about" className="transition-colors duration-300 hover:underline hover:text-white/90">About</a></li>
              <li><a href="#careers" className="transition-colors duration-300 hover:underline hover:text-white/90">Careers</a></li>
              <li><a href="#thinking" className="transition-colors duration-300 hover:underline hover:text-white/90">Insights</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] opacity-60">Contact</p>
            <ul className="mt-3.5 space-y-2.5 text-[14px] opacity-90">
              <li>Kalanki-10, Kathmandu</li>
              <li>+977 9745370131</li>
              <li>sherpastrategicc@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 text-[12px] opacity-60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <span>© {new Date().getFullYear()} Sherpa Strategic Advisors Pvt. Ltd.</span>
            <span className="flex gap-3"><a href="#" className="hover:underline transition-colors duration-300">Privacy</a> · <a href="#" className="hover:underline transition-colors duration-300">Terms</a> · <a href="#" className="hover:underline transition-colors duration-300">Cookies</a></span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
