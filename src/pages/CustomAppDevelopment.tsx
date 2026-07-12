import { ArrowLeft, ArrowRight, CheckCircle2, Layers, Shield, Cog, Database, Plug, Search, PenTool, Wrench, Rocket, Lock, RefreshCw, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import ssaLogo from "@/assets/ssa-logo.jpg";

const internalTools = [
  "Inventory management systems tied to your actual SKU structure and supplier relationships",
  "Staff scheduling tools that encode your specific shift rules, certifications, and availability constraints",
  "Client record systems structured around how your business actually categorizes and serves clients",
  "Project and job tracking tools matching your real stages, not a generic kanban board",
];

const customerTools = [
  "Booking and appointment systems with your specific scheduling logic and resource constraints",
  "Service request portals that route requests according to your team's structure",
  "Order tracking systems reflecting your actual fulfillment pipeline",
];

const deploymentTargets = [
  "Mobile applications for field staff or customers, iOS and Android",
  "Desktop applications for staff working from fixed workstations",
  "Responsive web applications accessible from any device",
];

const comparisonRows = [
  { dimension: "Fit to process", offShelf: "You adapt your workflow to the tool", custom: "The tool is built around your workflow" },
  { dimension: "Licensing cost", offShelf: "Recurring, scales with seats", custom: "One-time build, you own the result" },
  { dimension: "Feature bloat", offShelf: "Pay for features you never use", custom: "Only what your business needs" },
  { dimension: "Integration", offShelf: "Limited to vendor's supported list", custom: "Built to connect to your exact stack" },
  { dimension: "Data ownership", offShelf: "Vendor controls access and portability", custom: "Full ownership, export anytime" },
  { dimension: "Change speed", offShelf: "Dependent on vendor roadmap", custom: "Modify on your timeline" },
];

const architectureLayers = [
  { icon: Layers, title: "Presentation layer", color: "from-primary/20 to-primary/5", desc: "The interface your team and customers actually touch — built for the devices and contexts your users work in, not a one-size-fits-all responsive template." },
  { icon: Cog, title: "Business logic layer", color: "from-accent/20 to-accent/5", desc: "The rules engine: approval thresholds, pricing logic, eligibility checks, and workflow sequencing that encode how your business actually makes decisions. This is the layer that makes a custom app fundamentally different from a configurable off-the-shelf tool." },
  { icon: Database, title: "Data layer", color: "from-secondary/20 to-secondary/5", desc: "A purpose-built database schema modeling your actual entities — clients, jobs, inventory, whatever your business runs on — rather than a generic schema retrofitted to your use case." },
  { icon: Plug, title: "Integration layer", color: "from-ridge/20 to-ridge/5", desc: "API connections out to the tools you already depend on: accounting platforms, CRMs, messaging systems, payment processors. This layer means a new custom app doesn't create a new data silo — it plugs into your existing ecosystem." },
];

const devSteps = [
  { icon: Search, title: "Discovery", desc: "Structured interviews and process observation to map how work actually happens today, including the informal workarounds staff have built." },
  { icon: PenTool, title: "Design", desc: "System architecture and interface design, reviewed with your team before a single line of production code is written." },
  { icon: Wrench, title: "Build", desc: "Development in short iterations with working checkpoints, so you're seeing and testing real functionality throughout, not just at the end." },
  { icon: CheckCircle2, title: "QA and testing", desc: "Functional testing against your actual use cases, plus security review and load testing for anything customer-facing." },
  { icon: Rocket, title: "Deploy", desc: "Staged rollout, data migration from existing systems, and hands-on staff training." },
];

const techConsiderations = [
  { icon: RefreshCw, title: "Scalability", desc: "Architecture that holds up as data volume and concurrent users grow, not just at launch scale." },
  { icon: Shield, title: "Security", desc: "Role-based access control, encrypted data at rest and in transit, and audit logging for sensitive actions." },
  { icon: Lock, title: "Maintainability", desc: "Clean, documented code so the system can be modified by any competent developer in the future — not locked to one vendor." },
  { icon: Database, title: "Ownership", desc: "You receive full source code and infrastructure access; there is no vendor lock-in by design." },
];

export default function CustomAppDevelopment() {
  return (
    <div className="min-h-screen surface-hero">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 backdrop-blur-md bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/services/business-automation-institutional-memory" className="flex items-center gap-2 rounded-full border border-border/60 bg-white/60 px-4 py-2 text-sm font-medium text-deep backdrop-blur-sm transition hover:bg-white/80">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <div className="flex items-center gap-3">
              <img src={ssaLogo} alt="SSA" className="h-11 w-11 rounded-full ring-2 ring-white shadow-md" />
              <div>
                <div className="font-display text-lg font-semibold text-deep">SSA Service</div>
                <div className="text-xs text-muted-foreground">Custom App Development</div>
              </div>
            </div>
          </div>
          <span className="chip-3d hidden rounded-full px-4 py-1.5 text-xs font-semibold text-deep sm:inline-block">
            Deliverable Deep Dive
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 blur-3xl" />
        <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-sky to-teal/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-20 sm:pb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">SSA Service — Deliverable</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-deep sm:text-4xl md:text-5xl lg:text-6xl">
            Custom App <span className="bg-gradient-to-r from-teal to-mint bg-clip-text text-transparent">Development</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base text-muted-foreground">
            Custom application development is the practice of designing and building software from the ground up around a specific business's operations, rather than configuring a generic product to approximate the same outcome.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* What counts as a custom application */}
        <section className="surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">What counts as a custom application</h2>
          <p className="mt-2 text-muted-foreground">Custom app development spans a wide range of system types, each solving a different class of operational problem:</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-br from-white to-primary/5 p-5 ring-1 ring-border/60">
              <h3 className="font-display text-lg font-semibold text-deep">Internal operations tools</h3>
              <ul className="mt-4 space-y-3">
                {internalTools.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-secondary/5 p-5 ring-1 ring-border/60">
              <h3 className="font-display text-lg font-semibold text-deep">Customer-facing applications</h3>
              <ul className="mt-4 space-y-3">
                {customerTools.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-accent/5 p-5 ring-1 ring-border/60">
              <h3 className="font-display text-lg font-semibold text-deep">Deployment targets</h3>
              <ul className="mt-4 space-y-3">
                {deploymentTargets.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Why custom instead of off-the-shelf */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">Why custom development instead of off-the-shelf software</h2>
          <p className="mt-2 text-muted-foreground">This is not purely a preference question — it has measurable operational and financial consequences.</p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
                  <th className="rounded-l-md px-4 py-3">Dimension</th>
                  <th className="px-4 py-3">Off-the-shelf software</th>
                  <th className="rounded-r-md px-4 py-3">Custom-built application</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-deep">{r.dimension}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.offShelf}</td>
                    <td className="px-4 py-3 font-medium text-primary">{r.custom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Architecture */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">System architecture</h2>
          <p className="mt-2 text-muted-foreground">Every custom application we build is structured into four distinct layers. Separating these layers is not a stylistic choice — it is what allows a system to be maintained, extended, and partially rebuilt over time.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {architectureLayers.map((layer) => {
              const Icon = layer.icon;
              return (
                <div key={layer.title} className="group relative rounded-2xl border border-primary/10 p-6 transition-all duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${layer.color}`}>
                    <Icon className="h-5 w-5 text-deep" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-deep">{layer.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{layer.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Development Methodology */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">Development methodology</h2>
          <p className="mt-2 text-muted-foreground">We follow a staged delivery process designed to surface misunderstandings early, when they're cheap to fix, rather than late, when they're expensive.</p>

          <div className="mt-8 space-y-4">
            {devSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex items-start gap-4 rounded-2xl border border-primary/10 p-5 transition-all duration-300 hover:border-primary/20 hover:bg-primary/[0.02]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 text-deep">
                    <span className="font-display text-sm font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <h3 className="font-display text-base font-semibold text-deep">{step.title}</h3>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technical Considerations */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">Technical considerations we account for</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {techConsiderations.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-primary/10 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mint/30 to-teal/15 text-deep">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-deep">{item.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ROI */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">Return on investment</h2>
          <p className="mt-2 text-muted-foreground">The financial case for custom development rests on three compounding effects:</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-br from-mint/20 to-mint/5 p-5 ring-1 ring-border/60">
              <DollarSign className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-display text-base font-semibold text-deep">Eliminated licensing fees</h3>
              <p className="mt-2 text-sm text-ink-soft">One-time build cost vs. recurring per-seat licensing that scales with your team size.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-sky/30 to-sky/10 p-5 ring-1 ring-border/60">
              <RefreshCw className="h-8 w-8 text-accent" />
              <h3 className="mt-3 font-display text-base font-semibold text-deep">Recovered staff time</h3>
              <p className="mt-2 text-sm text-ink-soft">Removing manual workarounds and duplicate data entry frees your team for higher-value work.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-sand/30 to-sand/10 p-5 ring-1 ring-border/60">
              <Shield className="h-8 w-8 text-secondary" />
              <h3 className="mt-3 font-display text-base font-semibold text-deep">Reduced error cost</h3>
              <p className="mt-2 text-sm text-ink-soft">Purpose-built validation and automation eliminate the data quality issues that generic tools allow through.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-10 rounded-3xl bg-gradient-to-r from-teal to-deep p-8 text-center text-white shadow-xl">
          <h2 className="font-display text-2xl font-semibold">Ready to build what your business actually needs?</h2>
          <p className="mt-3 text-white/80">Talk to us about your operational challenges and we'll propose the right custom solution.</p>
          <Link to="/#contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-deep transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/60 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <img src={ssaLogo} alt="" className="h-6 w-6 rounded-full" />
            <span>© {new Date().getFullYear()} SSA · Custom App Development Deep Dive</span>
          </div>
          <span>Every solution is tailored to your specific operational context.</span>
        </div>
      </footer>
    </div>
  );
}
