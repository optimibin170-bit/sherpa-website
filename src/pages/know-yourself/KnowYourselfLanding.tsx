import { Link } from "react-router-dom";
import { AppShell, PageHeader } from "./AppShell";
import { COA } from "@/data/coa";

export default function KnowYourselfLanding() {
  const byClass = COA.reduce<Record<string, number>>((acc, a) => { acc[a.classification] = (acc[a.classification] ?? 0) + 1; return acc; }, {});
  const stats = [
    { label: "Ledgers", value: COA.length.toLocaleString(), hint: "in chart of accounts" },
    { label: "Assets", value: byClass.Assets ?? 0, hint: "asset ledgers" },
    { label: "Liab. & Equity", value: byClass.Liabilities ?? 0, hint: "liability ledgers" },
    { label: "P&L", value: byClass.PL ?? 0, hint: "income & expense" },
  ];
  const steps = [
    { n: "01", title: "Chart of Accounts", to: "/know-yourself/coa", body: "Browse all 2,089 ledgers grouped by Classification → Parent → Category → Schedule Head." },
    { n: "02", title: "Trial Balance", to: "/know-yourself/trial-balance", body: "Upload your year-end Trial Balance — mapped automatically to the COA hierarchy." },
    { n: "03", title: "Platform · Adjustments", to: "/know-yourself/platform", body: "Post closing stock, depreciation and prepaid/accrued expenses." },
    { n: "04", title: "Statements", to: "/know-yourself/balance-sheet", body: "Comparative NFRS Balance Sheet and Profit & Loss with deep-dive schedules." },
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
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-2 font-display text-3xl tabular-nums">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl">Workflow</h2>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">4 steps</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((s) => (
              <Link key={s.n} to={s.to} className="group relative flex flex-col rounded-lg border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
                <div className="text-xs font-medium tracking-[0.18em] text-primary">{s.n}</div>
                <div className="mt-2 font-display text-lg">{s.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                <span className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-primary">Open →</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl">Reports & Analysis</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Link to="/know-yourself/balance-sheet" className="group relative flex flex-col rounded-lg border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
              <div className="mt-2 font-display text-lg">Balance Sheet</div>
              <p className="mt-2 text-sm text-muted-foreground">Comparative NFRS Statement of Financial Position with drill-down hierarchy.</p>
              <span className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-primary">Open →</span>
            </Link>
            <Link to="/know-yourself/profit-loss" className="group relative flex flex-col rounded-lg border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
              <div className="mt-2 font-display text-lg">Profit & Loss</div>
              <p className="mt-2 text-sm text-muted-foreground">Comparative Statement of Profit or Loss with income, expenses and analysis.</p>
              <span className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-primary">Open →</span>
            </Link>
            <Link to="/know-yourself/cash-flow" className="group relative flex flex-col rounded-lg border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
              <div className="mt-2 font-display text-lg">Cash Flow</div>
              <p className="mt-2 text-sm text-muted-foreground">Indirect method — operating, investing and financing cash flows.</p>
              <span className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-primary">Open →</span>
            </Link>
            <Link to="/know-yourself/ratios" className="group relative flex flex-col rounded-lg border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
              <div className="mt-2 font-display text-lg">Ratio Analysis</div>
              <p className="mt-2 text-sm text-muted-foreground">21 financial ratios across profitability, liquidity, leverage, solvency and efficiency.</p>
              <span className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-primary">Open →</span>
            </Link>
            <Link to="/know-yourself/report" className="group relative flex flex-col rounded-lg border bg-card p-5 transition hover:border-primary/30 hover:shadow-sm">
              <div className="mt-2 font-display text-lg">Generate Report</div>
              <p className="mt-2 text-sm text-muted-foreground">Comprehensive financial report with executive summary and recommendations.</p>
              <span className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-primary">Open →</span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
