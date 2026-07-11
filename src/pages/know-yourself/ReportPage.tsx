import { useMemo } from "react";
import { AppShell, PageHeader, PrintButton } from "./AppShell";
import { PendingBanner } from "./StatementShell";
import { useAdjustments } from "@/store/adjustments";
import { useTrialBalance } from "@/store/trialBalance";
import { computeNetProfit } from "@/lib/computeNetProfit";
import { computeRatioAggregates, RATIOS, formatRatio, deltaPct } from "@/lib/ratios";
import { tbScheduleTotals } from "@/lib/tbAggregate";
import { formatNPR } from "@/lib/format";


type Recommendation = {
  area: string;
  severity: "positive" | "watch" | "critical";
  headline: string;
  detail: string;
};

function ReportPage() {
  const adj = useAdjustments();
  const tb = useTrialBalance();
  const hasTB = tb.cy.rows.length > 0;
  const cyLabel = tb.master.cy.label !== "Current Year" ? tb.master.cy.label : "Current Year";
  const pyLabel = tb.master.py.label !== "Prior Year" ? tb.master.py.label : "Prior Year";
  const company = tb.master.companyName || "The Company";

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

  const computed = RATIOS.map((r) => {
    const cy = r.compute(bundle.cy);
    const py = r.compute(bundle.py);
    return { def: r, cy, py, change: deltaPct(cy.value, py.value) };
  });

  const findRatio = (key: string) => computed.find((c) => c.def.key === key);

  const recs: Recommendation[] = [];

  const push = (r: Recommendation) => recs.push(r);

  const gross = findRatio("gross-margin");
  if (gross && isFinite(gross.cy.value)) {
    if (gross.cy.value < 0.15) {
      push({
        area: "Profitability",
        severity: "critical",
        headline: `Gross margin is thin at ${(gross.cy.value * 100).toFixed(1)}%`,
        detail:
          "Review pricing, product mix, and direct-cost management. A margin below 15% leaves little room to absorb operating overheads or finance costs.",
      });
    } else if (gross.change < -5) {
      push({
        area: "Profitability",
        severity: "watch",
        headline: `Gross margin fell ${Math.abs(gross.change).toFixed(1)}% YoY`,
        detail:
          "Input-cost inflation or discounting is compressing margins. Renegotiate supplier contracts and review discount policy.",
      });
    } else if (gross.change > 5) {
      push({
        area: "Profitability",
        severity: "positive",
        headline: `Gross margin improved ${gross.change.toFixed(1)}% YoY`,
        detail: "Pricing power or cost control is working. Preserve the discipline that drove the gain.",
      });
    }
  }

  const net = findRatio("net-margin");
  if (net && isFinite(net.cy.value)) {
    if (net.cy.value < 0) {
      push({
        area: "Profitability",
        severity: "critical",
        headline: "The business is loss-making at the net level",
        detail:
          "Prioritise a cost-reduction plan, evaluate discontinuing unprofitable lines, and rebuild a viable operating budget.",
      });
    } else if (net.cy.value < 0.03) {
      push({
        area: "Profitability",
        severity: "watch",
        headline: `Net margin is only ${(net.cy.value * 100).toFixed(1)}%`,
        detail: "A very thin bottom line makes the business fragile to shocks. Focus on high-margin products and fixed-cost efficiency.",
      });
    }
  }

  const current = findRatio("current-ratio");
  if (current && isFinite(current.cy.value)) {
    if (current.cy.value < 1) {
      push({
        area: "Liquidity",
        severity: "critical",
        headline: `Current ratio is ${current.cy.value.toFixed(2)} — below 1.0`,
        detail:
          "Current liabilities exceed current assets. Refinance short-term debt, tighten receivable collection, and defer non-essential payables.",
      });
    } else if (current.cy.value < 1.2) {
      push({
        area: "Liquidity",
        severity: "watch",
        headline: `Current ratio ${current.cy.value.toFixed(2)} is tight`,
        detail: "Maintain a rolling 13-week cash forecast and secure a committed working-capital facility.",
      });
    } else if (current.cy.value > 3) {
      push({
        area: "Liquidity",
        severity: "watch",
        headline: `Current ratio ${current.cy.value.toFixed(2)} suggests idle working capital`,
        detail: "Consider deploying excess current assets into productive uses or returning them to shareholders.",
      });
    }
  }

  const quick = findRatio("quick-ratio");
  if (quick && isFinite(quick.cy.value) && quick.cy.value < 0.8) {
    push({
      area: "Liquidity",
      severity: "watch",
      headline: `Quick ratio ${quick.cy.value.toFixed(2)} is below the 0.8 benchmark`,
      detail: "Inventory-heavy liquidity exposes the business if sales slow. Improve inventory turns and grow the receivables/cash base.",
    });
  }

  const de = findRatio("de");
  if (de && isFinite(de.cy.value)) {
    if (de.cy.value > 2) {
      push({
        area: "Leverage",
        severity: "critical",
        headline: `Debt-to-equity is ${de.cy.value.toFixed(2)}`,
        detail: "The capital structure is heavily debt-funded. Prioritise debt reduction or a fresh equity injection.",
      });
    } else if (de.cy.value > 1) {
      push({
        area: "Leverage",
        severity: "watch",
        headline: `Debt-to-equity ${de.cy.value.toFixed(2)} is elevated`,
        detail: "Monitor covenant headroom and interest coverage; avoid additional borrowings for non-return-generating uses.",
      });
    }
  }

  const ic = findRatio("interest-coverage");
  if (ic && isFinite(ic.cy.value) && ic.cy.value < 2) {
    push({
      area: "Solvency",
      severity: ic.cy.value < 1 ? "critical" : "watch",
      headline: `Interest coverage is ${ic.cy.value.toFixed(2)}x`,
      detail:
        ic.cy.value < 1
          ? "EBIT does not cover finance costs. Restructure debt or inject equity urgently."
          : "Below 2x indicates limited earnings buffer to service debt if EBIT dips.",
    });
  }

  const dso = findRatio("dso");
  if (dso && isFinite(dso.cy.value) && dso.cy.value > 90) {
    push({
      area: "Efficiency",
      severity: "watch",
      headline: `DSO is ${dso.cy.value.toFixed(0)} days`,
      detail: "Customers are paying slowly. Tighten credit policy, invoice earlier, and follow up on overdue accounts weekly.",
    });
  }

  const dio = findRatio("dio");
  if (dio && isFinite(dio.cy.value) && dio.cy.value > 120) {
    push({
      area: "Efficiency",
      severity: "watch",
      headline: `DIO is ${dio.cy.value.toFixed(0)} days`,
      detail: "Inventory is turning slowly. Rationalise SKUs, run promotions on slow-movers, and align procurement with demand.",
    });
  }

  const ccc = findRatio("ccc");
  if (ccc && isFinite(ccc.cy.value) && ccc.cy.value > 90) {
    push({
      area: "Efficiency",
      severity: "watch",
      headline: `Cash conversion cycle is ${ccc.cy.value.toFixed(0)} days`,
      detail: "The operating cycle ties up working capital. Focus on receivables collection and payable term negotiation.",
    });
  }

  if (recs.length === 0 && hasTB) {
    push({
      area: "Overall",
      severity: "positive",
      headline: "No material red flags detected across the standard ratio set",
      detail: "Continue monitoring monthly and revisit this report each reporting cycle.",
    });
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Report"
        title="Comprehensive Financial Report"
        description="Executive summary, statements of Profit or Loss and Financial Position, full ratio analysis and management recommendations — designed to print."
        actions={<PrintButton label="Print report" />}
      />
      <div className="space-y-10 px-8 py-8 print:px-0 print:py-4">
        {!hasTB && (
          <PendingBanner>
            Trial Balance not uploaded yet — figures below will populate from Platform overrides only.
          </PendingBanner>
        )}

        <ReportSection title="1. Executive Summary">
          <p className="text-sm leading-relaxed">
            This report presents the financial performance and position of <strong>{company}</strong> for{" "}
            <strong>{cyLabel}</strong> compared with <strong>{pyLabel}</strong>, prepared on an NFRS basis.
            Profit for the year was <strong>{formatNPR(np.profitCy)}</strong> (PY {formatNPR(np.profitPy)}),
            on total income of <strong>{formatNPR(bundle.cy.totalIncome)}</strong> (PY{" "}
            {formatNPR(bundle.py.totalIncome)}). Total assets closed at{" "}
            <strong>{formatNPR(bundle.cy.totalAssets)}</strong> against total equity of{" "}
            <strong>{formatNPR(bundle.cy.equity)}</strong>.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <KPI label="Total income" cy={bundle.cy.totalIncome} py={bundle.py.totalIncome} />
            <KPI label="Profit for the year" cy={np.profitCy} py={np.profitPy} />
            <KPI label="Total assets" cy={bundle.cy.totalAssets} py={bundle.py.totalAssets} />
            <KPI label="Total equity" cy={bundle.cy.equity} py={bundle.py.equity} />
          </div>
        </ReportSection>

        <ReportSection title="2. Statement of Profit or Loss">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 text-left">Particulars</th>
                <th className="w-40 py-2 text-right">{cyLabel}</th>
                <th className="w-40 py-2 text-right text-muted-foreground/80">{pyLabel}</th>
              </tr>
            </thead>
            <tbody>
              <PLRow label="Revenue from operations" cy={bundle.cy.revenue} py={bundle.py.revenue} />
              <PLRow label="Other income" cy={bundle.cy.otherIncome} py={bundle.py.otherIncome} />
              <PLRow label="Total income" cy={bundle.cy.totalIncome} py={bundle.py.totalIncome} bold />
              <PLRow label="Cost of goods sold" cy={bundle.cy.cogs} py={bundle.py.cogs} />
              <PLRow label="Gross profit" cy={bundle.cy.grossProfit} py={bundle.py.grossProfit} bold />
              <PLRow label="Operating expenses" cy={bundle.cy.operatingExpenses} py={bundle.py.operatingExpenses} />
              <PLRow label="Depreciation & amortisation" cy={bundle.cy.depreciation} py={bundle.py.depreciation} />
              <PLRow label="Operating profit / EBIT" cy={bundle.cy.ebit} py={bundle.py.ebit} bold />
              <PLRow label="Finance cost" cy={bundle.cy.interest} py={bundle.py.interest} />
              <PLRow label="Profit before tax" cy={np.pbtCy} py={np.pbtPy} bold />
              <PLRow label="Tax expense" cy={np.taxCy} py={np.taxPy} />
              <PLRow label="Profit for the year" cy={np.profitCy} py={np.profitPy} bold />
            </tbody>
          </table>
        </ReportSection>

        <ReportSection title="3. Statement of Financial Position">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 text-left">Particulars</th>
                <th className="w-40 py-2 text-right">{cyLabel}</th>
                <th className="w-40 py-2 text-right text-muted-foreground/80">{pyLabel}</th>
              </tr>
            </thead>
            <tbody>
              <PLRow label="ASSETS" cy={NaN} py={NaN} bold />
              <PLRow label="Non-current assets" cy={bundle.cy.nonCurrentAssets} py={bundle.py.nonCurrentAssets} />
              <PLRow label="Current assets" cy={bundle.cy.currentAssets} py={bundle.py.currentAssets} />
              <PLRow label="Total assets" cy={bundle.cy.totalAssets} py={bundle.py.totalAssets} bold />
              <PLRow label="EQUITY & LIABILITIES" cy={NaN} py={NaN} bold />
              <PLRow label="Share capital" cy={bundle.cy.shareCapital} py={bundle.py.shareCapital} />
              <PLRow label="Retained earnings / Other equity" cy={bundle.cy.retainedEarnings} py={bundle.py.retainedEarnings} />
              <PLRow label="Total equity" cy={bundle.cy.equity} py={bundle.py.equity} bold />
              <PLRow label="Non-current liabilities" cy={bundle.cy.nonCurrentLiabilities} py={bundle.py.nonCurrentLiabilities} />
              <PLRow label="Current liabilities" cy={bundle.cy.currentLiabilities} py={bundle.py.currentLiabilities} />
              <PLRow label="Total equity & liabilities" cy={bundle.cy.equity + bundle.cy.totalLiabilities} py={bundle.py.equity + bundle.py.totalLiabilities} bold />
            </tbody>
          </table>
        </ReportSection>

        <ReportSection title="4. Ratio Analysis">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 text-left">Ratio</th>
                <th className="py-2 text-left">Category</th>
                <th className="w-28 py-2 text-right">CY</th>
                <th className="w-28 py-2 text-right">PY</th>
                <th className="w-24 py-2 text-right">YoY</th>
              </tr>
            </thead>
            <tbody>
              {computed.map((c) => (
                <tr key={c.def.key} className="border-t border-rule/40">
                  <td className="py-1.5">{c.def.name}</td>
                  <td className="py-1.5 text-muted-foreground">{c.def.category}</td>
                  <td className="py-1.5 text-right tabular">{formatRatio(c.cy.value, c.def.unit)}</td>
                  <td className="py-1.5 text-right tabular text-muted-foreground">{formatRatio(c.py.value, c.def.unit)}</td>
                  <td className="py-1.5 text-right tabular">
                    {isFinite(c.change) ? `${c.change >= 0 ? "+" : ""}${c.change.toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>

        <ReportSection title="5. Recommendations">
          {recs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Upload a Trial Balance to generate tailored recommendations.
            </p>
          ) : (
            <ul className="space-y-3">
              {recs.map((r, i) => (
                <li key={i} className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider " +
                        (r.severity === "critical"
                          ? "bg-rose-500/15 text-rose-600"
                          : r.severity === "watch"
                            ? "bg-amber-500/15 text-amber-700"
                            : "bg-emerald-500/15 text-emerald-700")
                      }
                    >
                      {r.severity}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {r.area}
                    </span>
                  </div>
                  <div className="mt-1.5 font-display text-base">{r.headline}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </ReportSection>

        <p className="text-xs text-muted-foreground print:mt-8">
          Report generated by Finstate · Prepared under NFRS · All amounts in NPR unless otherwise stated.
          Recommendations are indicative and should be reviewed with management judgement.
        </p>
      </div>
    </AppShell>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6 print:break-inside-avoid">
      <h2 className="mb-4 font-display text-xl">{title}</h2>
      {children}
    </section>
  );
}

function KPI({ label, cy, py }: { label: string; cy: number; py: number }) {
  const delta = py === 0 ? NaN : ((cy - py) / Math.abs(py)) * 100;
  return (
    <div className="rounded-lg border bg-surface-raised p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg">{formatNPR(cy)}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">
        PY {formatNPR(py)}
        {isFinite(delta) && (
          <span className={"ml-2 " + (delta >= 0 ? "text-emerald-600" : "text-rose-600")}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

function PLRow({ label, cy, py, bold }: { label: string; cy: number; py: number; bold?: boolean }) {
  return (
    <tr className={"border-t border-rule/40 " + (bold ? "statement-rule font-medium" : "")}>
      <td className="py-1.5">{label}</td>
      <td className="py-1.5 text-right tabular">{isNaN(cy) ? "" : formatNPR(cy)}</td>
      <td className="py-1.5 text-right tabular text-muted-foreground">{isNaN(py) ? "" : formatNPR(py)}</td>
    </tr>
  );
}

export default ReportPage;
