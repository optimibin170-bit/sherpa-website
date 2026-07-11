import { Link } from "react-router-dom";
import { AppShell, PageHeader } from "./AppShell";
import { COA } from "@/data/coa";


function KnowYourselfLanding() {
  const byClass = COA.reduce<Record<string, number>>((acc, a) => {
    acc[a.classification] = (acc[a.classification] ?? 0) + 1;
    return acc;
  }, {});
  const stats = [
    { label: "Ledgers", value: COA.length.toLocaleString(), hint: "in chart of accounts" },
    { label: "Assets", value: byClass.Assets ?? 0, hint: "asset ledgers" },
    { label: "Liab. & Equity", value: byClass.Liabilities ?? 0, hint: "liability ledgers" },
    { label: "P&L", value: byClass.PL ?? 0, hint: "income & expense" },
  ];
  const steps = [
    {
      n: "01",
      title: "Chart of Accounts",
      to: "/know-yourself/coa" as const,
      body: "Browse all 2,089 ledgers grouped by Classification → Parent → Category → Schedule Head.",
    },
    {
      n: "02",
      title: "Trial Balance",
      to: "/know-yourself/trial-balance" as const,
      body: "Upload your year-end Trial Balance — mapped automatically to the COA hierarchy.",
    },
    {
      n: "03",
      title: "Platform · Adjustments",
      to: "/know-yourself/platform" as const,
      body: "Post closing stock (Good / Expiry / Defect), depreciation and prepaid/accrued expenses.",
    },
    {
      n: "04",
      title: "Statements",
      to: "/know-yourself/balance-sheet" as const,
      body: "Comparative NFRS Balance Sheet and Profit & Loss with deep-dive schedules.",
    },
  ];
  return (
    <AppShell>
      <PageHeader
        eyebrow="NFRS workflow"
        title="Financial statements, end to end"
        description="A deliberate workflow from chart of accounts to a board-ready Balance Sheet and P&L — with a Platform layer for closing stock, depreciation and accruals before finalisation."
      />
      <div className="px-8 py-8">
        <div className="grid gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 font-display text-3xl tabular">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl">Workflow</h2>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              4 steps · current stage: Chart of Accounts
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((s) => (
              <Link
                key={s.n}
                to={s.to}
                className="group relative flex flex-col rounded-lg border bg-card p-5 transition hover:border-accent hover:shadow-sm"
              >
                <div className="text-xs font-medium tracking-[0.18em] text-accent">{s.n}</div>
                <div className="mt-2 font-display text-lg">{s.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                <span className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-accent">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default KnowYourselfLanding;
