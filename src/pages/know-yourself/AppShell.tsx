import { useLocation, Link } from "react-router-dom";
import { type ReactNode, useState, useEffect } from "react";
import { useTrialBalance } from "@/store/trialBalance";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/know-yourself", label: "Overview", caption: "Dashboard", exact: true },
  { to: "/know-yourself/coa", label: "Chart of Accounts", caption: "2,089 ledgers" },
  { to: "/know-yourself/trial-balance", label: "Trial Balance", caption: "Upload" },
  { to: "/know-yourself/platform", label: "Platform", caption: "Adjustments" },
  { to: "/know-yourself/balance-sheet", label: "Balance Sheet", caption: "Statement" },
  { to: "/know-yourself/profit-loss", label: "Profit & Loss", caption: "Statement" },
  { to: "/know-yourself/cash-flow", label: "Cash Flow", caption: "Indirect" },
  { to: "/know-yourself/ratios", label: "Ratio Analysis", caption: "Insights" },
  { to: "/know-yourself/report", label: "Generate Report", caption: "Comprehensive" },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useLocation().pathname;
  const master = useTrialBalance((s) => s.master);
  const subtitle = master.companyName ? `${master.companyName} · ${master.cy.label}` : "NFRS · No period set";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-3 top-3 z-50 inline-flex items-center justify-center rounded-md border border-border bg-card p-2 shadow-md md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-border bg-card transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 md:shrink-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-7">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-summit text-white font-display text-lg">
              F
            </div>
            <div>
              <div className="font-display text-lg leading-tight">Finstate</div>
              <div className="text-xs text-muted-foreground">{subtitle}</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 px-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-baseline justify-between rounded-md px-3 py-2.5 text-sm transition ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{item.caption}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-5 text-xs text-muted-foreground">
          <Link to="/" className="underline hover:text-foreground">← Back to Sherpa</Link>
          <div className="mt-2">Reporting currency · NPR</div>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden min-w-0">{children}</main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="border-b border-border bg-muted/30 px-4 py-5 md:px-8 md:py-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow && <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">{eyebrow}</div>}
          <h1 className="font-display text-2xl text-foreground md:text-3xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2 print:hidden">{actions}</div>}
      </div>
    </header>
  );
}

export function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      {label}
    </button>
  );
}
