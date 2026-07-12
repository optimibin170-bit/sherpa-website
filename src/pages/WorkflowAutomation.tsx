import { ArrowLeft, ArrowRight, CheckCircle2, Bell, FileText, RefreshCw, GitBranch, Zap, Shield, ClipboardList, Activity, Eye, Hand, DollarSign, Clock, AlertTriangle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ssaLogo from "@/assets/ssa-logo.jpg";

const whatWeAutomate = [
  { icon: Bell, title: "Automated notifications and reminders", items: ["Payment due dates, appointment confirmations, renewal deadlines", "Escalations when a task sits untouched past a defined threshold"] },
  { icon: FileText, title: "Document generation", items: ["Invoices, contracts, and reports assembled automatically from live data and templates", "Personalized client communications generated from a single source of truth"] },
  { icon: RefreshCw, title: "Data syncing between systems", items: ["Keeping your CRM, accounting platform, and operational tools in agreement without manual re-entry", "Two-way sync where updates in either system propagate automatically"] },
  { icon: GitBranch, title: "Approval chains and task routing", items: ["Requests routed to the correct approver based on type, amount, or department", "Automatic handoff to the next person in a sequence once a step is complete"] },
];

const opportunityRows = [
  { signal: "Same message sent repeatedly", example: "Payment reminders, appointment confirmations", type: "Automated notifications", saved: "3–5 hrs / week" },
  { signal: "Same document assembled by hand", example: "Invoices, contracts, standard reports", type: "Document generation", saved: "4–8 hrs / week" },
  { signal: "Data typed into two systems", example: "Order info in both CRM and accounting", type: "Data syncing", saved: "2–6 hrs / week" },
  { signal: "Task waits on someone's inbox", example: "Approvals, handoffs between departments", type: "Approval routing", saved: "1–3 days per cycle" },
];

const pipelineSteps = [
  { icon: Zap, title: "Trigger", desc: "The event that starts the automation: a date arriving, a form submission, a status change, or a scheduled interval. Triggers are defined precisely so the automation fires exactly when intended — no missed runs, no duplicate fires.", color: "from-primary/20 to-primary/5" },
  { icon: ClipboardList, title: "Rules engine", desc: "The logic layer that evaluates conditions against your actual business rules — who qualifies, what threshold applies, which exceptions matter. This is where your institutional knowledge gets encoded as decision logic.", color: "from-accent/20 to-accent/5" },
  { icon: Zap, title: "Action", desc: "The system-executed step itself: sending a message, generating a document, updating a record, or routing a task to the next person.", color: "from-secondary/20 to-secondary/5" },
  { icon: RefreshCw, title: "System update", desc: "The action is logged, the source systems are synced, and the task is marked complete — so there's a full audit trail of what happened and when, without anyone having to write it down.", color: "from-ridge/20 to-ridge/5" },
];

const reliability = [
  { icon: Shield, title: "Idempotency", desc: "An automation that fires twice for the same event must not double-send, double-charge, or double-create a record." },
  { icon: AlertTriangle, title: "Error handling", desc: "Failed steps are caught, logged, and surfaced to a person — not silently dropped." },
  { icon: ClipboardList, title: "Audit trail", desc: "Every automated action is logged with what triggered it and what it did, so any outcome can be traced back." },
  { icon: Activity, title: "Monitoring", desc: "Automations are watched for failure rates and unexpected volume, the same way any production system would be." },
  { icon: Hand, title: "Human override", desc: "Every automated workflow has a manual path for the exception cases that fall outside the rules." },
];

const roiItems = [
  { icon: DollarSign, title: "Direct labor hours recovered", desc: "Eliminated manual steps free your team for higher-value work instead of repetitive data entry.", color: "from-mint/20 to-mint/5" },
  { icon: AlertTriangle, title: "Reduced error costs", desc: "Removing manual data entry and copy-paste eliminates the mistakes that cascade into rework and corrections.", color: "from-sky/30 to-sky/10" },
  { icon: Clock, title: "Faster cycle times", desc: "Processes that took days complete in minutes, improving client experience and team throughput.", color: "from-sand/30 to-sand/10" },
];

export default function WorkflowAutomation() {
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
                <div className="text-xs text-muted-foreground">Workflow Automation</div>
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
            Workflow <span className="bg-gradient-to-r from-teal to-mint bg-clip-text text-transparent">Automation</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base text-muted-foreground">
            Workflow automation is the practice of identifying the repetitive, rule-based steps inside a business process and having a system execute them without a person re-triggering each one by hand.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* What we automate */}
        <section className="surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">What we automate</h2>
          <p className="mt-2 text-muted-foreground">Workflow automation covers four recurring categories of manual work:</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {whatWeAutomate.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="group relative rounded-2xl border border-primary/10 p-5 transition-all duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10">
                    <Icon className="h-5 w-5 text-deep" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-deep">{cat.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Spotting automation opportunities */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">Spotting automation opportunities</h2>
          <p className="mt-2 text-muted-foreground">Not every manual task is worth automating — the return has to justify the build. In practice, the strongest candidates share a recognizable signal: the same action, repeated on a predictable trigger, following rules that don't change from one occurrence to the next.</p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
                  <th className="rounded-l-md px-4 py-3">Signal</th>
                  <th className="px-4 py-3">Example</th>
                  <th className="px-4 py-3">Automation type</th>
                  <th className="rounded-r-md px-4 py-3">Typical time saved</th>
                </tr>
              </thead>
              <tbody>
                {opportunityRows.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-deep">{r.signal}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.example}</td>
                    <td className="px-4 py-3 text-primary font-medium">{r.type}</td>
                    <td className="px-4 py-3 font-semibold text-deep">{r.saved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How an automation is built */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">How an automation is built</h2>
          <p className="mt-2 text-muted-foreground">Every automation we build follows the same underlying pipeline, regardless of what it's automating. Understanding this structure matters because it's what makes an automation debuggable, auditable, and maintainable.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {pipelineSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="group relative rounded-2xl border border-primary/10 p-6 transition-all duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.color}`}>
                      <span className="font-display text-sm font-bold text-deep">{i + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <h3 className="font-display text-lg font-semibold text-deep">{step.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Pipeline flow */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">Trigger</span>
            <ArrowRight className="h-4 w-4" />
            <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">Rules</span>
            <ArrowRight className="h-4 w-4" />
            <span className="rounded-full bg-secondary/10 px-3 py-1 font-medium text-secondary">Action</span>
            <ArrowRight className="h-4 w-4" />
            <span className="rounded-full bg-ridge/10 px-3 py-1 font-medium text-ridge">Update</span>
          </div>
        </section>

        {/* Operating reliably */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">Operating automations reliably</h2>
          <p className="mt-2 text-muted-foreground">Building the automation is only half the job. Operating it reliably requires discipline in five areas:</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reliability.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-primary/10 p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-mint/30 to-teal/15">
                    <Icon className="h-4 w-4 text-deep" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-deep">{item.title}</h3>
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
          <p className="mt-2 text-muted-foreground">Automation ROI compounds in three ways:</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {roiItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`rounded-2xl bg-gradient-to-br ${item.color} p-5 ring-1 ring-border/60`}>
                  <Icon className="h-8 w-8 text-deep" />
                  <h3 className="mt-3 font-display text-base font-semibold text-deep">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-10 rounded-3xl bg-gradient-to-r from-teal to-deep p-8 text-center text-white shadow-xl">
          <h2 className="font-display text-2xl font-semibold">Ready to eliminate the manual steps slowing you down?</h2>
          <p className="mt-3 text-white/80">Talk to us about your repetitive processes and we'll identify the highest-return automation opportunities.</p>
          <Link to="/#contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-deep transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/60 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <img src={ssaLogo} alt="" className="h-6 w-6 rounded-full" />
            <span>© {new Date().getFullYear()} SSA · Workflow Automation Deep Dive</span>
          </div>
          <span>Every automation is designed for reliability and auditability.</span>
        </div>
      </footer>
    </div>
  );
}
