import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "./AppShell";
import { useTrialBalance } from "@/store/trialBalance";
import { useAdjustments } from "@/store/adjustments";
import { computeRatioAggregates, RATIOS, formatRatio, deltaPct, type RatioDef, type RatioCategory } from "@/lib/ratios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const CATEGORIES: RatioCategory[] = ["Profitability", "Liquidity", "Leverage", "Solvency", "Efficiency"];

export default function RatiosPage() {
  const cyRows = useTrialBalance((s) => s.cy.rows);
  const pyRows = useTrialBalance((s) => s.py.rows);
  const master = useTrialBalance((s) => s.master);
  const { closingStock, depreciation, accruals, ledgerAdj, cogs, equity } = useAdjustments();
  const [selected, setSelected] = useState<RatioDef>(RATIOS[0]);

  const agg = useMemo(() => {
    if (!cyRows.length) return null;
    return computeRatioAggregates({ cyRows, pyRows, closingStock, depreciation, accruals, ledgerAdj, cogs, scOpening: equity.shareCapital.opening ?? undefined, scClosing: equity.shareCapital.closing ?? undefined, reOpening: equity.retainedEarnings.opening ?? undefined, reClosing: equity.retainedEarnings.opening != null ? equity.retainedEarnings.opening + equity.retainedEarnings.adjustments : undefined });
  }, [cyRows, pyRows, closingStock, depreciation, accruals, ledgerAdj, cogs, equity]);

  if (!agg) {
    return (
      <AppShell>
        <PageHeader eyebrow="Step 05" title="Ratio Analysis" description="21 financial ratios across profitability, liquidity, leverage, solvency and efficiency — computed from your Trial Balance and Platform adjustments." />
        <div className="px-8 py-8">
          <div className="rounded-lg border border-dashed bg-card p-10 text-center">
            <div className="font-display text-xl">No data to compute ratios</div>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Upload your Trial Balance first to see ratio analysis.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const result = selected.compute(agg.cy);
  const numLines = selected.numeratorLines(agg.cy);
  const denLines = selected.denominatorLines(agg.cy);
  const pyResult = selected.compute(agg.py);
  const change = deltaPct(result.value, pyResult.value);

  return (
    <AppShell>
      <PageHeader eyebrow="Step 05" title="Ratio Analysis" description="21 financial ratios across profitability, liquidity, leverage, solvency and efficiency — computed from your Trial Balance and Platform adjustments." />
      <div className="px-4 py-6 space-y-4 md:px-8 md:py-8 md:space-y-6">
        <Tabs defaultValue="Profitability">
          <TabsList className="grid w-full grid-cols-5">
            {CATEGORIES.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
          </TabsList>
          {CATEGORIES.map((c) => (
            <TabsContent key={c} value={c}>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {RATIOS.filter((r) => r.category === c).map((r) => {
                  const val = r.compute(agg.cy).value;
                  return (
                    <button key={r.key} type="button" onClick={() => setSelected(r)} className={`rounded-lg border p-4 text-left transition hover:border-primary/30 hover:shadow-sm ${selected.key === r.key ? "border-primary bg-primary/5" : "bg-card"}`}>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">{r.name}</div>
                      <div className="mt-2 font-display text-2xl tabular-nums">{formatRatio(val, r.unit)}</div>
                    </button>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border bg-card p-6">
            <div className="flex items-baseline justify-between">
              <div><h2 className="font-display text-xl">{selected.name}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.definition}</p></div>
              <div className="text-right"><div className="font-display text-3xl tabular-nums">{formatRatio(result.value, selected.unit)}</div>
                {isFinite(change) && <div className={`mt-1 text-sm ${change > 0 ? "text-emerald-600" : change < 0 ? "text-rose-600" : ""}`}>{change > 0 ? "+" : ""}{change.toFixed(1)}% vs PY</div>}
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground"><span className="font-medium text-foreground/80">Formula: </span>{selected.formulaText}</div>
            <div className="mt-4 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground"><span className="font-medium text-foreground/80">Interpretation: </span>{selected.interpretation}</div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div><div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Numerator breakdown</div><div className="rounded-lg border bg-card p-3">
                {numLines.map((l, i) => <div key={i} className="flex justify-between py-1 text-sm"><span className="text-muted-foreground">{l.label}</span><span className="tabular-nums">{formatRatio(l.value, selected.unit === "percent" ? "percent" : "times")}</span></div>)}
              </div></div>
              <div><div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Denominator breakdown</div><div className="rounded-lg border bg-card p-3">
                {denLines.map((l, i) => <div key={i} className="flex justify-between py-1 text-sm"><span className="text-muted-foreground">{l.label}</span><span className="tabular-nums">{formatRatio(l.value, selected.unit === "percent" ? "percent" : "times")}</span></div>)}
              </div></div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 font-display text-lg">All ratios</h3>
            <div className="space-y-2">
              {RATIOS.map((r) => {
                const val = r.compute(agg.cy).value;
                const pyVal = r.compute(agg.py).value;
                const d = deltaPct(val, pyVal);
                return (
                  <button key={r.key} type="button" onClick={() => setSelected(r)} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-muted ${selected.key === r.key ? "bg-primary/5" : ""}`}>
                    <span className="truncate text-muted-foreground">{r.name}</span>
                    <span className="ml-2 shrink-0 tabular-nums">{formatRatio(val, r.unit)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
