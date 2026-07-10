import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "./AppShell";
import { useTrialBalance } from "@/store/trialBalance";
import { useAdjustments } from "@/store/adjustments";
import { computeNetProfit } from "@/lib/computeNetProfit";
import { computeRatioAggregates, RATIOS, formatRatio, deltaPct } from "@/lib/ratios";
import { formatNPR } from "@/lib/format";
import { summarizeStock } from "@/store/adjustments";
import { findUnmappedRows } from "@/lib/unmapped";

export default function ReportPage() {
  const cyRows = useTrialBalance((s) => s.cy.rows);
  const pyRows = useTrialBalance((s) => s.py.rows);
  const master = useTrialBalance((s) => s.master);
  const { closingStock, depreciation, accruals, ledgerAdj, cogs, equity } = useAdjustments();
  const [busy, setBusy] = useState(false);

  const np = useMemo(() => computeNetProfit({ cyRows, pyRows, closingStock, depreciation, accruals, ledgerAdj, cogs }), [cyRows, pyRows, closingStock, depreciation, accruals, ledgerAdj, cogs]);
  const agg = useMemo(() => {
    if (!cyRows.length) return null;
    return computeRatioAggregates({ cyRows, pyRows, closingStock, depreciation, accruals, ledgerAdj, cogs, scOpening: equity.shareCapital.opening ?? undefined, scClosing: equity.shareCapital.closing ?? undefined, reOpening: equity.retainedEarnings.opening ?? undefined, reClosing: equity.retainedEarnings.opening != null ? equity.retainedEarnings.opening + equity.retainedEarnings.adjustments : undefined });
  }, [cyRows, pyRows, closingStock, depreciation, accruals, ledgerAdj, cogs, equity]);
  const unmapped = useMemo(() => findUnmappedRows(cyRows, pyRows), [cyRows, pyRows]);
  const stock = summarizeStock(closingStock);

  const ready = cyRows.length > 0 && master.companyName;

  function generateReport() {
    setBusy(true);
    setTimeout(() => {
      const w = window.open("", "_blank");
      if (!w) { setBusy(false); return; }
      const ratiosHtml = agg ? RATIOS.map((r) => {
        const val = r.compute(agg.cy).value;
        const pyVal = r.compute(agg.py).value;
        const d = deltaPct(val, pyVal);
        const dStr = isFinite(d) ? ` (${d > 0 ? "+" : ""}${d.toFixed(1)}%)` : "";
        return `<tr><td>${r.name}</td><td style="text-align:right">${formatRatio(val, r.unit)}</td><td style="text-align:right;color:#888">${formatRatio(pyVal, r.unit)}</td><td style="text-align:right">${dStr}</td></tr>`;
      }).join("") : "<tr><td colspan='4'>No data</td></tr>";

      w.document.write(`<!DOCTYPE html><html><head><title>${master.companyName} - Financial Report</title><style>
        body{font-family:Georgia,serif;margin:40px;color:#111;line-height:1.6}
        h1{font-size:24px;border-bottom:2px solid #111;padding-bottom:8px}
        h2{font-size:18px;margin-top:32px;border-bottom:1px solid #ccc;padding-bottom:4px}
        table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
        th,td{border:1px solid #ddd;padding:6px 10px}
        th{background:#f5f5f5;text-align:left;font-weight:600}
        .amount{text-align:right;font-family:monospace}
        .total{font-weight:bold;border-top:2px solid #111}
        .section{margin-bottom:32px}
        @media print{body{margin:20px}}
      </style></head><body>
        <h1>${master.companyName}</h1>
        <p><strong>Report Period:</strong> ${master.cy.label}</p>
        <p><strong>Prior Period:</strong> ${master.py.label}</p>
        <p><strong>Prepared on:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <h2>Executive Summary</h2>
        <div class="section">
          <p>This report presents the financial position and performance of <strong>${master.companyName}</strong> for the period <strong>${master.cy.label}</strong>, prepared in accordance with Nepal Financial Reporting Standards (NFRS).</p>
          ${agg ? `<p>Key highlights:</p>
          <ul>
            <li>Revenue: ${formatNPR(agg.cy.revenue, { showZero: true })}</li>
            <li>Net Profit: ${formatNPR(np.profitCy, { showZero: true })} (Net Margin: ${agg.cy.revenue ? ((np.profitCy / agg.cy.revenue) * 100).toFixed(1) + "%" : "N/A"})</li>
            <li>Total Assets: ${formatNPR(agg.cy.totalAssets, { showZero: true })}</li>
            <li>Total Equity: ${formatNPR(agg.cy.equity, { showZero: true })}</li>
            <li>Current Ratio: ${formatRatio(RATIOS.find((r) => r.key === "current-ratio")!.compute(agg.cy).value, "times")}</li>
            <li>Debt-to-Equity: ${formatRatio(RATIOS.find((r) => r.key === "de")!.compute(agg.cy).value, "times")}</li>
          </ul>` : "<p>Upload Trial Balance to see key highlights.</p>"}
        </div>

        <h2>Profit & Loss Summary</h2>
        <div class="section">
          <table>
            <tr><th>Particulars</th><th style="text-align:right">${master.cy.label}</th><th style="text-align:right">${master.py.label}</th></tr>
            <tr><td>Revenue from Operations</td><td class="amount">${formatNPR(agg?.cy.revenue ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.revenue ?? 0, { showZero: true })}</td></tr>
            <tr><td>Other Income</td><td class="amount">${formatNPR(agg?.cy.otherIncome ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.otherIncome ?? 0, { showZero: true })}</td></tr>
            <tr><td>Cost of Goods Sold</td><td class="amount">${formatNPR(agg?.cy.cogs ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.cogs ?? 0, { showZero: true })}</td></tr>
            <tr><td>Operating Expenses</td><td class="amount">${formatNPR(agg?.cy.operatingExpenses ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.operatingExpenses ?? 0, { showZero: true })}</td></tr>
            <tr><td>Depreciation & Amortisation</td><td class="amount">${formatNPR(agg?.cy.depreciation ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.depreciation ?? 0, { showZero: true })}</td></tr>
            <tr><td>Finance Costs</td><td class="amount">${formatNPR(agg?.cy.interest ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.interest ?? 0, { showZero: true })}</td></tr>
            <tr class="total"><td>Profit Before Tax</td><td class="amount">${formatNPR(np.pbtCy, { showZero: true })}</td><td class="amount">${formatNPR(np.pbtPy, { showZero: true })}</td></tr>
            <tr><td>Tax Expense</td><td class="amount">${formatNPR(np.taxCy, { showZero: true })}</td><td class="amount">${formatNPR(np.taxPy, { showZero: true })}</td></tr>
            <tr class="total"><td>Net Profit</td><td class="amount">${formatNPR(np.profitCy, { showZero: true })}</td><td class="amount">${formatNPR(np.profitPy, { showZero: true })}</td></tr>
          </table>
        </div>

        <h2>Balance Sheet Summary</h2>
        <div class="section">
          <table>
            <tr><th>Particulars</th><th style="text-align:right">${master.cy.label}</th><th style="text-align:right">${master.py.label}</th></tr>
            <tr><td>Non-Current Assets</td><td class="amount">${formatNPR(agg?.cy.nonCurrentAssets ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.nonCurrentAssets ?? 0, { showZero: true })}</td></tr>
            <tr><td>Current Assets</td><td class="amount">${formatNPR(agg?.cy.currentAssets ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.currentAssets ?? 0, { showZero: true })}</td></tr>
            <tr class="total"><td>Total Assets</td><td class="amount">${formatNPR(agg?.cy.totalAssets ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.totalAssets ?? 0, { showZero: true })}</td></tr>
            <tr><td>Shareholders' Equity</td><td class="amount">${formatNPR(agg?.cy.equity ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.equity ?? 0, { showZero: true })}</td></tr>
            <tr><td>Non-Current Liabilities</td><td class="amount">${formatNPR(agg?.cy.nonCurrentLiabilities ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.nonCurrentLiabilities ?? 0, { showZero: true })}</td></tr>
            <tr><td>Current Liabilities</td><td class="amount">${formatNPR(agg?.cy.currentLiabilities ?? 0, { showZero: true })}</td><td class="amount">${formatNPR(agg?.py.currentLiabilities ?? 0, { showZero: true })}</td></tr>
            <tr class="total"><td>Total Equity & Liabilities</td><td class="amount">${formatNPR((agg?.cy.totalLiabilities ?? 0) + (agg?.cy.equity ?? 0), { showZero: true })}</td><td class="amount">${formatNPR((agg?.py.totalLiabilities ?? 0) + (agg?.py.equity ?? 0), { showZero: true })}</td></tr>
          </table>
        </div>

        <h2>Ratio Analysis</h2>
        <div class="section">
          <table>
            <tr><th>Ratio</th><th style="text-align:right">${master.cy.label}</th><th style="text-align:right">${master.py.label}</th><th style="text-align:right">YoY Change</th></tr>
            ${ratiosHtml}
          </table>
        </div>

        <h2>Recommendations</h2>
        <div class="section">
          <ul>
            ${agg ? (() => {
              const recs: string[] = [];
              const currentRatio = RATIOS.find((r) => r.key === "current-ratio")!.compute(agg.cy).value;
              const netMargin = agg.cy.revenue ? (np.profitCy / agg.cy.revenue) * 100 : 0;
              const de = RATIOS.find((r) => r.key === "de")!.compute(agg.cy).value;
              if (currentRatio < 1.5) recs.push("Liquidity is tight (Current Ratio < 1.5x). Consider accelerating receivable collection or arranging a revolving credit facility.");
              if (netMargin < 5) recs.push("Net profit margin is thin. Review cost structure — focus on operating leverage and pricing optimisation.");
              if (de > 2) recs.push("Debt-to-equity exceeds 2x. Evaluate refinancing options or equity infusion to reduce leverage risk.");
              if (unmapped.length > 0) recs.push(`${unmapped.length} unmapped schedule heads detected. Review Trial Balance mapping for complete financial statement preparation.`);
              if (stock.expiry + stock.defect > 0) recs.push("Expired or defective stock detected. Review inventory management policies and consider write-down procedures.");
              if (recs.length === 0) recs.push("Financial position appears healthy. Continue monitoring key ratios and maintaining operational efficiency.");
              return recs.map((r) => `<li>${r}</li>`).join("");
            })() : "<li>Upload Trial Balance to generate recommendations.</li>"}
          </ul>
        </div>

        <h2>Notes</h2>
        <div class="section">
          <p>This report is auto-generated from Trial Balance data and Platform adjustments. It should be reviewed by a qualified accountant before being relied upon for decision-making.</p>
          <p>Platform adjustments applied: ${depreciation.length} depreciation entries (${formatNPR(depreciation.reduce((s, d) => s + d.depreciation, 0), { showZero: true })}), ${accruals.length} prepaid/accrued entries, closing stock (${formatNPR(stock.good, { showZero: true })}).</p>
          ${unmapped.length > 0 ? `<p><strong>Note:</strong> ${unmapped.length} unmapped schedule heads were excluded from the statements. These should be reviewed for completeness.</p>` : ""}
        </div>

        <div style="margin-top:40px;padding-top:16px;border-top:1px solid #ccc;font-size:12px;color:#888">
          <p>Generated by Sherpa Strategic Advisors Financial Analysis Platform</p>
          <p>${new Date().toLocaleString()}</p>
        </div>
      </body></html>`);
      w.document.close();
      setBusy(false);
    }, 500);
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Step 06" title="Generate Report" description="Comprehensive financial report with executive summary, P&L, balance sheet, ratio analysis and recommendations — ready to print or save as PDF." />
      <div className="px-4 py-6 space-y-4 md:px-8 md:py-8 md:space-y-6">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="font-display text-xl">Report Preview</h2>
              <p className="mt-1 text-sm text-muted-foreground">{master.companyName || "Company name not set"} · {master.cy.label}</p>
            </div>
            <button onClick={generateReport} disabled={!ready || busy} className={`rounded-md px-6 py-3 text-sm font-medium ${ready && !busy ? "bg-primary text-primary-foreground hover:bg-primary/90" : "cursor-not-allowed bg-muted text-muted-foreground"}`}>
              {busy ? "Generating…" : "Open Report"}
            </button>
          </div>
          {!ready && <p className="mt-3 text-xs text-destructive">Set company name and upload Trial Balance first.</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Revenue</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(agg?.cy.revenue ?? 0, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Net Profit</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(np.profitCy, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Total Assets</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(agg?.cy.totalAssets ?? 0, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Total Equity</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(agg?.cy.equity ?? 0, { showZero: true })}</div></div>
        </div>

        {unmapped.length > 0 && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
            <div className="text-sm font-medium text-amber-700">{unmapped.length} unmapped schedule heads detected</div>
            <p className="mt-1 text-xs text-amber-600">These ledgers are excluded from statements. Review Trial Balance mapping for completeness.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
