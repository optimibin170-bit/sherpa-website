import { useMemo, useState } from "react";
import { AppShell, PageHeader, PrintButton } from "./AppShell";
import { PendingBanner } from "./StatementShell";
import { useAdjustments } from "@/store/adjustments";
import { useTrialBalance } from "@/store/trialBalance";
import { computeRatioAggregates, RATIOS, formatRatio, deltaPct, type RatioCategory, type RatioDef, type RatioAggregates } from "@/lib/ratios";
import { formatNPR } from "@/lib/format";
import { tbScheduleTotals } from "@/lib/tbAggregate";
import { computeNetProfit } from "@/lib/computeNetProfit";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


const CATEGORIES: { key: RatioCategory; blurb: string }[] = [
  {
    key: "Profitability",
    blurb:
      "How efficiently the business converts sales, assets and equity into profit. Strong profitability ratios indicate pricing power and operational efficiency.",
  },
  {
    key: "Liquidity",
    blurb:
      "Ability to meet short-term obligations from current assets. Healthy liquidity ratios show that the operating cycle is not stretched.",
  },
  {
    key: "Leverage",
    blurb:
      "Capital-structure intensity — how much of the asset base is financed by debt rather than equity. Higher leverage amplifies both returns and risk.",
  },
  {
    key: "Solvency",
    blurb:
      "Long-run ability to service debt and stay solvent. Solvency ratios extend the leverage view to include earnings coverage of finance costs.",
  },
  {
    key: "Efficiency",
    blurb:
      "Working-capital efficiency — how fast inventory turns into sales, sales into cash and how long suppliers fund the operating cycle. Includes DSO, DIO, DPO, the Operating Cycle and the Cash Conversion Cycle.",
  },
];

function RatiosPage() {
  const adj = useAdjustments();
  const tb = useTrialBalance();
  const hasTB = tb.cy.rows.length > 0;

  const np = useMemo(
    () =>
      computeNetProfit({
        cyRows: tb.cy.rows,
        pyRows: tb.py.rows,
        closingStock: adj.closingStock,
        depreciation: adj.depreciation,
        accruals: adj.accruals,
        ledgerAdj: adj.ledgerAdj,
        cogs: adj.cogs,
      }),
    [tb.cy.rows, tb.py.rows, adj],
  );

  const scOpenSeed = Math.round(-tbScheduleTotals(tb.py.rows, ["Share Capital"]).closing);
  const scCloseSeed = Math.round(-tbScheduleTotals(tb.cy.rows, ["Share Capital"]).closing);
  const reOpenSeed = Math.round(-tbScheduleTotals(tb.py.rows, ["Other Equity"]).closing);
  const scOpening = adj.equity.shareCapital.opening ?? scOpenSeed;
  const scClosing = adj.equity.shareCapital.closing ?? scCloseSeed;
  const reOpening = adj.equity.retainedEarnings.opening ?? reOpenSeed;
  const reClosing = reOpening + np.profitCy + (adj.equity.retainedEarnings.adjustments ?? 0);

  const bundle = useMemo(
    () =>
      computeRatioAggregates({
        cyRows: tb.cy.rows,
        pyRows: tb.py.rows,
        closingStock: adj.closingStock,
        depreciation: adj.depreciation,
        accruals: adj.accruals,
        ledgerAdj: adj.ledgerAdj,
        cogs: adj.cogs,
        scOpening,
        scClosing,
        reOpening,
        reClosing,
      }),
    [tb.cy.rows, tb.py.rows, adj, scOpening, scClosing, reOpening, reClosing],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Analysis"
        title="Ratio Analysis"
        description="Profitability, liquidity, leverage and solvency ratios. Each metric includes a definition, its formula, computed values for CY and PY, and a deep-dive into the numbers behind the ratio."
        actions={<PrintButton />}
      />
      <div className="space-y-10 px-8 py-8">
        {!hasTB && (
          <PendingBanner>
            Trial Balance not uploaded yet — ratios will populate once the year-end TB is loaded.
          </PendingBanner>
        )}
        {CATEGORIES.map(({ key, blurb }) => (
          <CategoryBlock key={key} category={key} blurb={blurb} bundle={bundle} />
        ))}
      </div>
    </AppShell>
  );
}

function CategoryBlock({
  category,
  blurb,
  bundle,
}: {
  category: RatioCategory;
  blurb: string;
  bundle: { cy: RatioAggregates; py: RatioAggregates };
}) {
  const list = RATIOS.filter((r) => r.category === category);
  return (
    <section>
      <div className="mb-4">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-accent">{category} Ratios</div>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{blurb}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {list.map((r) => (
          <RatioCard key={r.key} def={r} cy={bundle.cy} py={bundle.py} />
        ))}
      </div>
    </section>
  );
}

function RatioCard({ def, cy, py }: { def: RatioDef; cy: RatioAggregates; py: RatioAggregates }) {
  const [open, setOpen] = useState(false);
  const [deepOpen, setDeepOpen] = useState(false);
  const cyR = def.compute(cy);
  const pyR = def.compute(py);
  const change = deltaPct(cyR.value, pyR.value);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <article className="rounded-xl border bg-card">
        <CollapsibleTrigger asChild>
          <header className="group cursor-pointer border-b px-5 py-4 hover:bg-muted/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg">{def.name}</h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{def.formulaText}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-right">
                  <div className="font-display text-2xl">{formatRatio(cyR.value, def.unit)}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    PY {formatRatio(pyR.value, def.unit)}
                  </div>
                  {isFinite(change) && (
                    <div
                      className={
                        "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium " +
                        (change >= 0
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-rose-500/10 text-rose-600")
                      }
                    >
                      {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% YoY
                    </div>
                  )}
                </div>
                <ChevronDown
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </div>
            </div>
          </header>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 py-4 space-y-3 text-sm">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Definition</div>
              <p className="mt-1 leading-relaxed">{def.definition}</p>
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Interpretation</div>
              <p className="mt-1 leading-relaxed text-muted-foreground">{def.interpretation}</p>
            </div>
            <button
              onClick={() => setDeepOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border bg-surface-raised px-2.5 py-1 text-xs font-medium hover:bg-muted/50"
            >
              <ChevronRight className={"h-3.5 w-3.5 transition-transform " + (deepOpen ? "rotate-90" : "")} />
              {deepOpen ? "Hide deep dive" : "Deep dive"}
            </button>
            {deepOpen && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <DeepDive def={def} cy={cy} py={py} cyR={cyR} pyR={pyR} />
              </div>
            )}
          </div>
        </CollapsibleContent>
      </article>
    </Collapsible>
  );
}

function DeepDive({
  def,
  cy,
  py,
  cyR,
  pyR,
}: {
  def: RatioDef;
  cy: RatioAggregates;
  py: RatioAggregates;
  cyR: { numerator: number; denominator: number; value: number };
  pyR: { numerator: number; denominator: number; value: number };
}) {
  const numCy = def.numeratorLines(cy);
  const numPy = def.numeratorLines(py);
  const denCy = def.denominatorLines(cy);
  const denPy = def.denominatorLines(py);

  return (
    <div className="space-y-4">
      <Block title="Numerator" cyLines={numCy} pyLines={numPy} cyTotal={cyR.numerator} pyTotal={pyR.numerator} />
      <Block title="Denominator" cyLines={denCy} pyLines={denPy} cyTotal={cyR.denominator} pyTotal={pyR.denominator} />
      <div className="rounded-md border bg-card px-3 py-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Computed value</span>
          <span className="font-display text-sm">
            {formatRatio(cyR.value, def.unit)}{" "}
            <span className="text-muted-foreground">(PY {formatRatio(pyR.value, def.unit)})</span>
          </span>
        </div>
        <div className="mt-1 font-mono text-[11px] text-muted-foreground">
          = {formatNPR(cyR.numerator)} / {formatNPR(cyR.denominator)}
          {def.unit === "percent" ? " x 100" : ""}
        </div>
      </div>
    </div>
  );
}

function Block({
  title,
  cyLines,
  pyLines,
  cyTotal,
  pyTotal,
}: {
  title: string;
  cyLines: Array<{ label: string; value: number }>;
  pyLines: Array<{ label: string; value: number }>;
  cyTotal: number;
  pyTotal: number;
}) {
  const labels = cyLines.map((l) => l.label);
  return (
    <div>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
            <th className="py-1 text-left">Component</th>
            <th className="w-28 py-1 text-right">CY</th>
            <th className="w-28 py-1 text-right">PY</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label, i) => (
            <tr key={i} className="border-t border-rule/40">
              <td className="py-1">{label}</td>
              <td className="py-1 text-right tabular">{formatNPR(cyLines[i]?.value ?? 0)}</td>
              <td className="py-1 text-right tabular text-muted-foreground">{formatNPR(pyLines[i]?.value ?? 0)}</td>
            </tr>
          ))}
          <tr className="border-t border-rule/60 font-medium">
            <td className="py-1">Total</td>
            <td className="py-1 text-right tabular">{formatNPR(cyTotal)}</td>
            <td className="py-1 text-right tabular text-muted-foreground">{formatNPR(pyTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RatiosPage;
