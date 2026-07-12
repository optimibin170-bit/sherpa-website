import { ArrowLeft, ArrowRight, CheckCircle2, Brain, FileText, Database, Search, Clock, Users, Shield, BookOpen, Target, BarChart3, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import ssaLogo from "@/assets/ssa-logo.jpg";
import figure1 from "/assets/playbook/3c47abd4c763f363e9940c784f834210fa32d679.png";
import figure2 from "/assets/playbook/c4ba5f46bc12a5d5cfaf46c006fa956f3694528d.png";

const knowledgeTypes = [
  { type: "Expert Heuristics", desc: "Judgment rules developed through experience", capture: "Exit interviews, pair documentation", risk: "Repeated mistakes, slow decisions" },
  { type: "Tribal Relationships", desc: "Informal influence maps and trust networks", capture: "Stakeholder mapping workshops", risk: "Failed escalations, broken alliances" },
  { type: "Undocumented Fixes", desc: "Workarounds for known system quirks", capture: "Runbook sprints, incident retrospectives", risk: "Recurring outages, duplicate effort" },
  { type: "Design Rationale", desc: "Why decisions were made, not just what", capture: "Architecture Decision Records (ADRs)", risk: "Architectural regression, rework" },
  { type: "Anti-Patterns", desc: "Approaches proven not to work", capture: "Post-mortem libraries", risk: "Repeating costly failures" },
  { type: "Network Know-How", desc: "Who to call for what, informal channels", capture: "Relationship directories, RACI matrices", risk: "Bottlenecks, orphaned escalations" },
];

const docArtifacts = [
  "Process Playbooks — Step-by-step operational guides with decision trees, escalation paths, and edge case handling",
  "Decision Logs — Time-stamped records of major decisions with the context, options considered, and rationale",
  "Architecture Decision Records (ADRs) — Lightweight documents capturing technical decisions and their trade-offs",
  "Runbooks and SOPs — Executable procedures for operational tasks, incidents, and maintenance",
  "Post-Mortem Libraries — Blameless incident retrospectives with root cause analysis and prevention measures",
  "Onboarding Guides — Role-specific knowledge packages for new team members",
  "Training Materials — Structured learning content derived from expert knowledge",
];

const embeddedSystems = [
  { type: "Workflow Automation", example: "Jira workflow rules, Slack bots", knowledge: "Process sequences, approval gates", level: "Intermediate" },
  { type: "Code Standards & Linters", example: "ESLint configs, pre-commit hooks", knowledge: "Coding conventions, security rules", level: "Intermediate" },
  { type: "CI/CD Pipelines", example: "GitHub Actions, Jenkins pipelines", knowledge: "Deployment procedures, quality gates", level: "Advanced" },
  { type: "Alert Playbooks", example: "PagerDuty runbook links", knowledge: "Incident response procedures", level: "Advanced" },
  { type: "Infrastructure as Code", example: "Terraform, Ansible playbooks", knowledge: "Environment setup, config standards", level: "Advanced" },
  { type: "Review Scorecards", example: "PR checklists, design review templates", knowledge: "Quality criteria, decision frameworks", level: "Foundation" },
];

const kbPrinciples = [
  "Single Source of Truth — Each knowledge artifact lives in exactly one authoritative location",
  "Semantic Search — Beyond keyword matching; surface concepts, synonyms, and related entities",
  "Contextual Triggering — Surface relevant knowledge at the moment of need within operational tools",
  "AI-Augmented Retrieval (RAG) — Use Retrieval-Augmented Generation to answer natural language questions",
  "Analytics-Driven Curation — Track what is searched for but not found; use gaps to drive priorities",
  "Federated Access — Knowledge accessible across all team tools without context switching",
];

const decayComparison = [
  { metric: "Knowledge retained at 5 years", undocumented: "~5%", documented: "~55%", factor: "11×" },
  { metric: "Onboarding time to productivity", undocumented: "6-12 months", documented: "2-4 months", factor: "3×" },
  { metric: "Incident resolution time", undocumented: "Baseline", documented: "40-60% faster", factor: "1.7×" },
  { metric: "Cost of staff turnover", undocumented: "200% of salary", documented: "80-120% of salary", factor: "~2×" },
  { metric: "Decision reversal rate", undocumented: "High (25-35%)", documented: "Low (8-12%)", factor: "3×" },
];

const halfLife = [
  { category: "Operational procedures", undoc: "6-18 months", doc: "3-7 years", priority: "Critical" },
  { category: "Technical architecture decisions", undoc: "12-24 months", doc: "5-10 years", priority: "Critical" },
  { category: "Customer relationship context", undoc: "3-12 months", doc: "2-5 years", priority: "High" },
  { category: "Vendor/partner agreements", undoc: "6-18 months", doc: "5+ years", priority: "High" },
  { category: "Organizational culture norms", undoc: "18-36 months", doc: "Sustained", priority: "Medium" },
  { category: "Strategic rationale for products", undoc: "24-48 months", doc: "10+ years", priority: "Medium" },
];

const scens = [
  { letter: "S", word: "Scenarios", desc: "Ask for specific past situations, not general principles. 'Tell me about a time when...'" },
  { letter: "C", word: "Contrasts", desc: "Ask what distinguishes excellent outcomes from mediocre ones. Contrast forces articulation of implicit criteria." },
  { letter: "E", word: "Edge Cases", desc: "Probe for exceptions, workarounds, and situations where normal procedures break down." },
  { letter: "N", word: "Networks", desc: "Map who else the expert consults, who they alert, and who they avoid for specific problem types." },
  { letter: "S", word: "Sequences", desc: "Reconstruct the exact mental and physical steps taken, including the micro-decisions invisible in final outputs." },
];

const sprintStructure = [
  { time: "Day 1, Morning (3h)", title: "Knowledge Mapping", desc: "Identify all undocumented processes and rank by criticality and decay risk" },
  { time: "Day 1, Afternoon (4h)", title: "Capture Sessions", desc: "Paired documentation (expert + scribe) using template-driven recording" },
  { time: "Day 2, Morning (3h)", title: "Review and Validation", desc: "Cross-functional review of captured knowledge for completeness and accuracy" },
  { time: "Day 2, Afternoon (4h)", title: "Integration", desc: "Upload to knowledge base, tag, cross-link, and assign ownership" },
];

const rituals = [
  { ritual: "Weekly Knowledge Log", freq: "Weekly", duration: "15 min", output: "Knowledge digest entry" },
  { ritual: "Sprint Retrospective + Doc", freq: "Bi-weekly", duration: "30 min", output: "Process update / new runbook" },
  { ritual: "Decision Log Update", freq: "Per major decision", duration: "20 min", output: "Decision Log entry" },
  { ritual: "Post-Incident Review", freq: "Within 48h", duration: "60-90 min", output: "Post-mortem document" },
  { ritual: "Quarterly Knowledge Audit", freq: "Quarterly", duration: "Half day", output: "Knowledge gap report" },
  { ritual: "Pre-Departure Transfer", freq: "On resignation", duration: "3-5 sessions", output: "Handoff package" },
];

const maturityStages = [
  { stage: "1", name: "Reactive", desc: "Documentation occurs only after crises. Knowledge primarily resides in individuals.", capability: "Crisis documentation" },
  { stage: "2", name: "Defined", desc: "Process playbooks exist for core workflows. Onboarding guides created.", capability: "Repeatable process execution" },
  { stage: "3", name: "Managed", desc: "Decision logs, ADRs, post-mortems in place. Knowledge base searchable.", capability: "Knowledge retrieval at scale" },
  { stage: "4", name: "Optimized", desc: "Knowledge embedded in tooling. Automated capture triggers. Analytics-driven.", capability: "Self-improving knowledge system" },
  { stage: "5", name: "Generative", desc: "AI-augmented knowledge retrieval. Continuous learning loops.", capability: "Institutional intelligence" },
];

const roadmap = [
  { stage: "Stage 1 → 2: Foundation", timeline: "0-3 Months", items: ["Identify top 10 most critical undocumented processes by risk", "Establish documentation templates for playbooks, runbooks, and decision logs", "Conduct first Documentation Sprint to capture critical processes", "Create basic onboarding guide for most common new hire role", "Designate a Knowledge Owner responsible for documentation standards"] },
  { stage: "Stage 2 → 3: Structure", timeline: "3-9 Months", items: ["Implement Architecture Decision Records for all major technical decisions", "Launch blameless post-mortem process with publishing workflow", "Establish centralized knowledge base (Confluence, Notion, or equivalent)", "Implement tagging taxonomy and cross-linking standards", "Begin quarterly knowledge audits to measure coverage and decay"] },
  { stage: "Stage 3 → 4: Embedding", timeline: "9-18 Months", items: ["Integrate runbooks directly into incident management tooling", "Embed documentation gates in definition-of-done for all projects", "Automate knowledge base indexing from code repositories and wikis", "Implement analytics to identify high-search/low-result knowledge gaps", "Build knowledge retrieval into developer toolchains"] },
  { stage: "Stage 4 → 5: Intelligence", timeline: "18-36 Months", items: ["Deploy RAG-based AI assistant trained on organizational knowledge corpus", "Implement automated knowledge gap detection from support tickets", "Create feedback loops that surface usage patterns to improve content", "Build predictive models to identify high-decay-risk knowledge before departure", "Establish knowledge as a formal organizational asset in planning and budgeting"] },
];

const roles = [
  { role: "Chief Knowledge Officer (CKO)", responsibilities: "Strategy, budget, executive sponsorship", time: "10-20% of role", level: "VP / Director" },
  { role: "Knowledge Domain Leads", responsibilities: "Owning documentation quality for a specific domain", time: "15-25% of role", level: "Senior IC / Manager" },
  { role: "Documentation Engineers", responsibilities: "Building knowledge infrastructure, tooling integrations", time: "Full time", level: "IC / Engineer" },
  { role: "Subject Matter Experts", responsibilities: "Contributing knowledge through structured capture sessions", time: "5-10% of role", level: "All senior ICs" },
  { role: "Knowledge Stewards", responsibilities: "Reviewing content for accuracy, currency, completeness", time: "10-15% of role", level: "Mid-senior ICs" },
];

const qualityStandards = [
  "Completeness — Artifact answers Who, What, When, Where, Why, and How without requiring prior context",
  "Accuracy — Content reviewed by at least one domain expert not involved in creation",
  "Currency — Each artifact has a defined Review Date; nothing remains unpublished for more than 12 months without review",
  "Findability — Artifact tagged with at minimum: domain, knowledge type, audience, and related processes",
  "Actionability — Operational artifacts include specific steps, decision criteria, and escalation paths",
  "Ownership — Every artifact has a named owner accountable for its accuracy and maintenance",
];

const kpis = [
  { metric: "Knowledge Coverage Rate", target: ">85%", desc: "Percentage of critical processes with documented playbooks" },
  { metric: "Documentation Freshness", target: ">90%", desc: "Artifacts reviewed within their defined review window" },
  { metric: "Post-Incident Documentation Rate", target: ">95%", desc: "P0/P1 incidents with published post-mortems within 72h" },
  { metric: "Decision Log Compliance", target: ">80%", desc: "Major decisions with Decision Log entries" },
  { metric: "Knowledge Search Success Rate", target: ">80%", desc: "Searches returning satisfactory results" },
];

export default function InstitutionalMemoryPlaybook() {
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
                <div className="text-xs text-muted-foreground">Institutional Memory Playbooks</div>
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
            Institutional Memory <span className="bg-gradient-to-r from-teal to-mint bg-clip-text text-transparent">Playbooks</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base text-muted-foreground">
            A Comprehensive Framework for Capturing, Preserving, and Scaling Organizational Knowledge. Organizations lose between 30 and 60 percent of their operational knowledge within 18 months of significant team turnover.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* Section 1: Knowledge Flow Model */}
        <section className="surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Section 1</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-deep">The Four-Stage Knowledge Flow</h2>
          <p className="mt-2 text-muted-foreground">Institutional memory does not spontaneously persist. It must be actively engineered through a deliberate pipeline that transforms perishable tacit knowledge into durable, scalable assets.</p>

          {/* Figure 1 */}
          <div className="mt-6 rounded-2xl border border-primary/10 overflow-hidden bg-white">
            <img src={figure1} alt="Tacit Knowledge Flow — From People's Heads Through Documentation Into Embedded Systems" className="w-full h-auto" />
            <p className="px-5 py-3 text-xs text-muted-foreground text-center border-t border-border/60">Figure 1: Tacit Knowledge Flow — From People's Heads Through Documentation Into Embedded Systems and Searchable Knowledge Bases</p>
          </div>

          {/* Four stages */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-primary/10 p-5 bg-gradient-to-br from-white to-primary/5">
              <Brain className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-display text-base font-semibold text-deep">Stage 1: Tacit Knowledge</h3>
              <p className="mt-2 text-sm text-ink-soft">The source. Resides in the minds of experienced practitioners. The most valuable and most vulnerable form of organizational intelligence.</p>
            </div>
            <div className="rounded-2xl border border-primary/10 p-5 bg-gradient-to-br from-white to-secondary/5">
              <FileText className="h-8 w-8 text-secondary" />
              <h3 className="mt-3 font-display text-base font-semibold text-deep">Stage 2: Documentation</h3>
              <p className="mt-2 text-sm text-ink-soft">The bridge. Transforms ephemeral tacit knowledge into persistent, version-controlled artifacts that can be retrieved and shared.</p>
            </div>
            <div className="rounded-2xl border border-primary/10 p-5 bg-gradient-to-br from-white to-accent/5">
              <Database className="h-8 w-8 text-accent" />
              <h3 className="mt-3 font-display text-base font-semibold text-deep">Stage 3: Embedded Systems</h3>
              <p className="mt-2 text-sm text-ink-soft">The enforcer. Knowledge embedded directly into operational tooling. Compliance becomes the path of least resistance.</p>
            </div>
            <div className="rounded-2xl border border-primary/10 p-5 bg-gradient-to-br from-white to-ridge/5">
              <Search className="h-8 w-8 text-ridge" />
              <h3 className="mt-3 font-display text-base font-semibold text-deep">Stage 4: Knowledge Base</h3>
              <p className="mt-2 text-sm text-ink-soft">The amplifier. Transforms isolated artifacts into an integrated, discoverable ecosystem. The difference between knowledge that exists and knowledge that is used.</p>
            </div>
          </div>

          {/* Knowledge types table */}
          <div className="mt-8 overflow-x-auto">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Tacit Knowledge Types</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
                  <th className="rounded-l-md px-4 py-3">Knowledge Type</th>
                  <th className="px-4 py-3">Capture Method</th>
                  <th className="rounded-r-md px-4 py-3">Risk if Lost</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeTypes.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-deep">{r.type}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.capture}</td>
                    <td className="px-4 py-3 text-red-600/80">{r.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Documentation artifacts */}
          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Core Documentation Artifact Types</h3>
            <div className="space-y-2">
              {docArtifacts.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Embedded systems table */}
          <div className="mt-8 overflow-x-auto">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Embedded Systems Examples</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
                  <th className="rounded-l-md px-4 py-3">System Type</th>
                  <th className="px-4 py-3">Example</th>
                  <th className="px-4 py-3">Knowledge Embedded</th>
                  <th className="rounded-r-md px-4 py-3">Level</th>
                </tr>
              </thead>
              <tbody>
                {embeddedSystems.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-deep">{r.type}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.example}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.knowledge}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.level === "Advanced" ? "bg-primary/10 text-primary" : r.level === "Intermediate" ? "bg-accent/10 text-accent" : "bg-secondary/10 text-secondary"}`}>{r.level}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* KB Principles */}
          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Knowledge Base Architecture Principles</h3>
            <div className="space-y-2">
              {kbPrinciples.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Knowledge Decay */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Section 2</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-deep">Knowledge Decay Dynamics</h2>
          <p className="mt-2 text-muted-foreground">Organizational knowledge does not decay uniformly. It degrades in response to specific events — personnel changes, restructuring, technology migrations — and the rate of decay is dramatically influenced by documentation practices.</p>

          {/* Figure 2 */}
          <div className="mt-6 rounded-2xl border border-primary/10 overflow-hidden bg-white">
            <img src={figure2} alt="Knowledge Retention Comparison — Undocumented vs. Documented Organizations" className="w-full h-auto" />
            <p className="px-5 py-3 text-xs text-muted-foreground text-center border-t border-border/60">Figure 2: Knowledge Retention Comparison — Undocumented vs. Properly Documented Organizations Over 5 Years</p>
          </div>

          {/* Decay comparison */}
          <div className="mt-8 overflow-x-auto">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Documented vs. Undocumented Impact</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
                  <th className="rounded-l-md px-4 py-3">Metric</th>
                  <th className="px-4 py-3">Undocumented</th>
                  <th className="px-4 py-3">Documented</th>
                  <th className="rounded-r-md px-4 py-3">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {decayComparison.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-deep">{r.metric}</td>
                    <td className="px-4 py-3 text-red-600/80">{r.undocumented}</td>
                    <td className="px-4 py-3 text-primary font-medium">{r.documented}</td>
                    <td className="px-4 py-3 font-semibold text-deep">{r.factor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Half-life table */}
          <div className="mt-8 overflow-x-auto">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Knowledge Half-Life by Category</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
                  <th className="rounded-l-md px-4 py-3">Category</th>
                  <th className="px-4 py-3">Undocumented</th>
                  <th className="px-4 py-3">Documented</th>
                  <th className="rounded-r-md px-4 py-3">Priority</th>
                </tr>
              </thead>
              <tbody>
                {halfLife.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-deep">{r.category}</td>
                    <td className="px-4 py-3 text-red-600/80">{r.undoc}</td>
                    <td className="px-4 py-3 text-primary font-medium">{r.doc}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.priority === "Critical" ? "bg-red-100 text-red-700" : r.priority === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{r.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Capture Methodologies */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Section 3</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-deep">Knowledge Capture Methodologies</h2>

          {/* SCENS Framework */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-white to-primary/5 p-5 ring-1 ring-border/60">
            <h3 className="font-display text-lg font-semibold text-deep">The SCENS Framework — Knowledge Elicitation Interview</h3>
            <div className="mt-4 space-y-3">
              {scens.map((s) => (
                <div key={s.letter} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/10 font-display text-sm font-bold text-deep">{s.letter}</span>
                  <div>
                    <span className="font-semibold text-deep">{s.word}</span>
                    <span className="text-ink-soft"> — {s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Sprints */}
          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Documentation Sprints (2-Day Format)</h3>
            <div className="space-y-3">
              {sprintStructure.map((step) => (
                <div key={step.time} className="flex items-start gap-4 rounded-2xl border border-primary/10 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10">
                    <Clock className="h-4 w-4 text-deep" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">{step.time}</div>
                    <div className="font-display text-base font-semibold text-deep">{step.title}</div>
                    <p className="mt-1 text-sm text-ink-soft">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continuous rituals */}
          <div className="mt-8 overflow-x-auto">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Continuous Knowledge Capture Rituals</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
                  <th className="rounded-l-md px-4 py-3">Ritual</th>
                  <th className="px-4 py-3">Frequency</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="rounded-r-md px-4 py-3">Output</th>
                </tr>
              </thead>
              <tbody>
                {rituals.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-deep">{r.ritual}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.freq}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.duration}</td>
                    <td className="px-4 py-3 text-primary">{r.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Maturity Model */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Section 4</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-deep">Institutional Memory Maturity Model</h2>

          {/* Maturity stages */}
          <div className="mt-6 space-y-3">
            {maturityStages.map((s) => (
              <div key={s.stage} className="flex items-start gap-4 rounded-2xl border border-primary/10 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 font-display text-lg font-bold text-deep">{s.stage}</div>
                <div>
                  <div className="font-display text-base font-semibold text-deep">{s.name}</div>
                  <p className="text-sm text-ink-soft">{s.desc}</p>
                  <p className="mt-1 text-xs font-semibold text-primary">Unlocks: {s.capability}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Implementation roadmap */}
          <div className="mt-8 space-y-6">
            {roadmap.map((phase) => (
              <div key={phase.stage} className="rounded-2xl border border-primary/10 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-deep">{phase.stage}</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{phase.timeline}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Governance */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Section 5</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-deep">Governance Framework</h2>

          {/* Roles */}
          <div className="mt-6 overflow-x-auto">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Roles and Responsibilities</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
                  <th className="rounded-l-md px-4 py-3">Role</th>
                  <th className="px-4 py-3">Responsibilities</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="rounded-r-md px-4 py-3">Level</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-deep">{r.role}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.responsibilities}</td>
                    <td className="px-4 py-3 text-ink-soft">{r.time}</td>
                    <td className="px-4 py-3 text-primary">{r.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quality standards */}
          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold text-deep mb-4">Knowledge Quality Standards</h3>
            <div className="space-y-2">
              {qualityStandards.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ridge" /> {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Measurement */}
        <section className="mt-8 surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Section 6</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-deep">Measurement Framework</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpis.map((kpi) => (
              <div key={kpi.metric} className="rounded-2xl border border-primary/10 p-5">
                <div className="text-2xl font-bold text-primary">{kpi.target}</div>
                <h3 className="mt-2 font-display text-base font-semibold text-deep">{kpi.metric}</h3>
                <p className="mt-1 text-sm text-ink-soft">{kpi.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-10 rounded-3xl bg-gradient-to-r from-teal to-deep p-8 text-center text-white shadow-xl">
          <h2 className="font-display text-2xl font-semibold">Ready to capture and scale your organizational knowledge?</h2>
          <p className="mt-3 text-white/80">Talk to us about building an institutional memory system that survives team changes.</p>
          <Link to="/#contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-deep transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/60 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <img src={ssaLogo} alt="" className="h-6 w-6 rounded-full" />
            <span>© {new Date().getFullYear()} SSA · Institutional Memory Playbook</span>
          </div>
          <span>Advanced Reference Edition · 2025</span>
        </div>
      </footer>
    </div>
  );
}
