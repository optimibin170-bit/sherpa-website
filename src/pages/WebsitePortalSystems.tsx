import { ArrowLeft, ArrowRight, CheckCircle2, Globe, Lock, Users, Layout, Shield, Key, Monitor, Smartphone, Server, Eye, FileText, CreditCard, BarChart3, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import ssaLogo from "@/assets/ssa-logo.jpg";

const comparisonRows = [
  { dimension: "Audience", website: "Anyone, no identity required", portal: "Specific clients or staff, verified" },
  { dimension: "Purpose", website: "Inform, market, capture leads", portal: "Transact, track, self-serve" },
  { dimension: "Content", website: "Same for every visitor", portal: "Personalized to the logged-in user" },
  { dimension: "Data sensitivity", website: "Public by design", portal: "Private records, access-controlled" },
  { dimension: "Typical actions", website: "Read, browse, submit a form", portal: "View invoices, upload files, approve" },
];

const websiteItems = [
  { icon: Layout, title: "Informational pages", desc: "Services, pricing, about, and contact information written to convert an unfamiliar visitor." },
  { icon: Globe, title: "Service and e-commerce functionality", desc: "Booking forms, quote requests, or a full storefront depending on your business." },
  { icon: Inbox, title: "Lead capture", desc: "Forms and calls-to-action that feed directly into your CRM, not a disconnected inbox." },
  { icon: BarChart3, title: "Performance and SEO foundations", desc: "Fast load times and clean markup so the site is actually found by the people searching for you." },
];

const portalClientItems = [
  "Invoice history and online payment",
  "Service or support request submission and status tracking",
  "Document exchange — contracts, reports, deliverables",
];

const portalStaffItems = [
  "Internal dashboards pulling live data from your operational systems",
  "Task and approval queues scoped to each employee's role",
  "Reporting tools that don't require touching the underlying database directly",
];

const accessSteps = [
  { icon: Key, title: "Login request", desc: "The person authenticates with a password, or through single sign-on if your business already runs an identity provider. Credentials are never handled or stored by us in plain form." },
  { icon: Shield, title: "Auth service", desc: "Verifies the identity and issues a session token, so the person doesn't have to re-authenticate on every click." },
  { icon: Lock, title: "Role check", desc: "Every subsequent request is checked against that person's role — client, staff, or admin — before any data is returned, not just at login." },
  { icon: Monitor, title: "Portal rendered", desc: "The interface shown reflects exactly what that role is permitted to see. Two people logging into the same portal can see entirely different screens." },
];

const techConsiderations = [
  { icon: Shield, title: "Data isolation", desc: "Every query is scoped so one account can never retrieve another account's records, even by accident." },
  { icon: Lock, title: "Session security", desc: "Encrypted sessions, automatic timeout, and forced re-authentication for sensitive actions." },
  { icon: Smartphone, title: "Responsive design", desc: "Both the public site and the portal work correctly on phones, tablets, and desktops — client portals are frequently checked from a phone." },
  { icon: Server, title: "Uptime and hosting", desc: "Infrastructure sized for your actual traffic, with monitoring so outages are caught before a client reports them." },
  { icon: Eye, title: "Accessibility", desc: "Public-facing pages built to standard accessibility guidelines so the site works for every visitor." },
];

const roiItems = [
  { icon: Globe, title: "Website ROI", desc: "Measured in leads captured and conversions that used to require a phone call.", color: "from-mint/20 to-mint/5" },
  { icon: Users, title: "Portal ROI", desc: "Measured in support calls and emails eliminated because clients can self-serve through the portal.", color: "from-sky/30 to-sky/10" },
  { icon: CreditCard, title: "Combined ROI", desc: "Faster payments from online invoicing, reduced admin from automated routing, and higher client satisfaction from 24/7 access.", color: "from-sand/30 to-sand/10" },
];

export default function WebsitePortalSystems() {
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
                <div className="text-xs text-muted-foreground">Website and Portal Systems</div>
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
            Website and <span className="bg-gradient-to-r from-teal to-mint bg-clip-text text-transparent">Portal Systems</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base text-muted-foreground">
            A website and a portal solve two different problems, even though they're often built as one project. A website's job is to be found and to explain — it faces the open internet and has to work for a stranger. A portal's job is to serve — it faces verified users and has to work for each one individually.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* Two systems, one front door */}
        <section className="surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">Two systems, one front door</h2>
          <p className="mt-2 text-muted-foreground">The public website and the authenticated portal are architecturally distinct, but they share an entry point. A visitor lands on the public site, and if they need account-specific access, they cross a login boundary into the portal.</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-white to-primary/5 p-6 ring-1 ring-border/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10">
                  <Globe className="h-5 w-5 text-deep" />
                </div>
                <h3 className="font-display text-lg font-semibold text-deep">Public website</h3>
              </div>
              <p className="mt-3 text-sm text-ink-soft">Faces the open internet. Built for strangers who need to understand what you do, trust that you can do it, and take the next step — whether that's submitting a form, booking a call, or making a purchase.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-accent/5 p-6 ring-1 ring-border/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5">
                  <Lock className="h-5 w-5 text-deep" />
                </div>
                <h3 className="font-display text-lg font-semibold text-deep">Authenticated portal</h3>
              </div>
              <p className="mt-3 text-sm text-ink-soft">Faces verified users. Built for clients and staff who need to see their own data, submit requests, approve tasks, and interact with your business — each person seeing only what's relevant to them.</p>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">Public website vs. authenticated portal</h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
                  <th className="rounded-l-md px-4 py-3">Dimension</th>
                  <th className="px-4 py-3">Public website</th>
                  <th className="rounded-r-md px-4 py-3">Authenticated portal</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-deep">{r.dimension}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.website}</td>
                    <td className="px-4 py-3 font-medium text-primary">{r.portal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* What goes into the public website */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">What goes into the public website</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {websiteItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="group relative rounded-2xl border border-primary/10 p-5 transition-all duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10">
                    <Icon className="h-5 w-5 text-deep" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-deep">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* What goes into the portal */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">What goes into the portal</h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-white to-primary/5 p-5 ring-1 ring-border/60">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-semibold text-deep">Client portal</h3>
              </div>
              <ul className="space-y-2.5">
                {portalClientItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-accent/5 p-5 ring-1 ring-border/60">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-accent" />
                <h3 className="font-display text-base font-semibold text-deep">Staff portal</h3>
              </div>
              <ul className="space-y-2.5">
                {portalStaffItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How access is controlled */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">How access is controlled</h2>
          <p className="mt-2 text-muted-foreground">Every request into the portal passes through the same sequence: the person proves who they are, the system checks what they're allowed to see, and only then does it render anything.</p>

          <div className="mt-8 space-y-4">
            {accessSteps.map((step, i) => {
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

        {/* Technical considerations */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-deep">Technical considerations we account for</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techConsiderations.map((item) => {
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
          <h2 className="font-display text-2xl font-semibold">Ready to build a website and portal that actually work for your business?</h2>
          <p className="mt-3 text-white/80">Talk to us about what your clients and team need to access online.</p>
          <Link to="/#contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-deep transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/60 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <img src={ssaLogo} alt="" className="h-6 w-6 rounded-full" />
            <span>© {new Date().getFullYear()} SSA · Website and Portal Systems Deep Dive</span>
          </div>
          <span>Every system is designed for security, performance, and scale.</span>
        </div>
      </footer>
    </div>
  );
}
