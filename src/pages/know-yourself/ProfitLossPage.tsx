import { useMemo } from "react";
import { AppShell, PageHeader } from "./AppShell";
import { useTrialBalance } from "@/store/trialBalance";
import { useAdjustments } from "@/store/adjustments";
import { buildHierarchy, sumNodes } from "@/lib/hierarchy";
import { computeNetProfit } from "@/lib/computeNetProfit";
import { HierarchyStatement, type StatementSection } from "./HierarchyStatement";
import { AnalysisPanel, type AnalysisSection } from "./AnalysisPanel";
import { formatNPR } from "@/lib/format";

export default function ProfitLossPage() {
  const cyRows = useTrialBalance((s) => s.cy.rows);
  const pyRows = useTrialBalance((s) => s.py.rows);
  const master = useTrialBalance((s) => s.master);
  const { closingStock: stock, depreciation, accruals, ledgerAdj, cogs } = useAdjustments();

  const np = useMemo(() => computeNetProfit({ cyRows, pyRows, closingStock: stock, depreciation, accruals, ledgerAdj, cogs }), [cyRows, pyRows, stock, depreciation, accruals, ledgerAdj, cogs]);

  const depTotal = depreciation.reduce((s, d) => s + d.depreciation, 0);
  const prepaid = accruals.filter((a) => a.kind === "prepaid").reduce((s, a) => s + a.amount, 0);
  const accrued = accruals.filter((a) => a.kind === "accrued").reduce((s, a) => s + a.amount, 0);

  const revenueNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && i.category === "Revenue from Operations", sign: -1 }), [cyRows, pyRows]);
  const otherIncNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && i.category === "Other Income", sign: -1 }), [cyRows, pyRows]);
  const cogsNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && (i.category2 === "Purchase" || i.category2 === "Direct Expenses"), sign: 1 }), [cyRows, pyRows]);
  const empNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && i.category2 === "Employee Benefit Expense", sign: 1 }), [cyRows, pyRows]);
  const finNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && i.category2 === "Finance Costs", sign: 1 }), [cyRows, pyRows]);
  const depNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && i.category2 === "Depreciation and Amortization", sign: 1, excludeScheduleHeads: ["Depreciation & Amortisation"] }), [cyRows, pyRows]);
  const sellNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && i.category2 === "Selling and Distribution Expenses", sign: 1 }), [cyRows, pyRows]);
  const adminNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && i.category2 === "Administrative Expenses", sign: 1 }), [cyRows, pyRows]);
  const otherExpNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && i.category2 === "Other Expenses", sign: 1 }), [cyRows, pyRows]);
  const taxNodes = useMemo(() => buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "PL" && i.category2 === "Tax Expense", sign: 1 }), [cyRows, pyRows]);

  const rev = sumNodes(revenueNodes);
  const oi = sumNodes(otherIncNodes);
  const totalIncCy = rev.cy + oi.cy;
  const totalIncPy = rev.py + oi.py;
  const cogsS = sumNodes(cogsNodes);
  const empS = sumNodes(empNodes);
  const finS = sumNodes(finNodes);
  const depS = sumNodes(depNodes);
  const sellS = sumNodes(sellNodes);
  const adminS = sumNodes(adminNodes);
  const otherExpS = sumNodes(otherExpNodes);
  const taxS = sumNodes(taxNodes);

  const totalExpCy = cogsS.cy + empS.cy + finS.cy + depS.cy + sellS.cy + adminS.cy + otherExpS.cy - prepaid + accrued;
  const totalExpPy = cogsS.py + empS.py + finS.py + depS.py + sellS.py + adminS.py + otherExpS.py;

  const plSections: StatementSection[] = [
    { header: "Revenue", nodes: revenueNodes, totalLabel: "Revenue from Operations", totalCy: rev.cy, totalPy: rev.py },
    { header: "Other Income", nodes: otherIncNodes, totalLabel: "Other Income", totalCy: oi.cy, totalPy: oi.py },
    { header: "Total Income", nodes: [], totalLabel: "", totalCy: totalIncCy, totalPy: totalIncPy },
    { header: "Expenses", nodes: cogsNodes, extras: [{ label: "Closing inventory (Platform)", hint: "platform", cy: -stock.reduce((s, e) => s + (e.bucket === "good" ? e.value : 0), 0), py: 0, emphasis: "subtotal", indent: 1 }], totalLabel: "Cost of Goods Sold", totalCy: cogsS.cy - stock.reduce((s, e) => s + (e.bucket === "good" ? e.value : 0), 0), totalPy: cogsS.py },
    { header: "", nodes: empNodes, totalLabel: "Employee Benefits", totalCy: empS.cy, totalPy: empS.py },
    { header: "", nodes: finNodes, extras: [{ label: "Interest adjustment (Platform)", hint: "platform", cy: 0, py: 0, emphasis: "subtotal", indent: 1 }], totalLabel: "Finance Costs", totalCy: finS.cy, totalPy: finS.py },
    { header: "", nodes: depNodes, extras: [{ label: "Platform depreciation", hint: "platform", cy: depTotal, py: 0, emphasis: "subtotal", indent: 1 }], totalLabel: "Depreciation & Amortisation", totalCy: depS.cy + depTotal, totalPy: depS.py },
    { header: "", nodes: sellNodes, totalLabel: "Selling & Distribution", totalCy: sellS.cy, totalPy: sellS.py },
    { header: "", nodes: adminNodes, extras: [{ label: "Repair & Maintenance adj.", hint: "platform", cy: 0, py: 0, emphasis: "subtotal", indent: 1 }], totalLabel: "Administrative Expenses", totalCy: adminS.cy, totalPy: adminS.py },
    { header: "", nodes: otherExpNodes, totalLabel: "Other Expenses", totalCy: otherExpS.cy, totalPy: otherExpS.py },
    { header: "Total Expenses", nodes: [], totalLabel: "", totalCy: totalExpCy, totalPy: totalExpPy },
    { header: "Profit before tax", nodes: [], totalLabel: "", totalCy: np.pbtCy, totalPy: np.pbtPy },
    { header: "", nodes: taxNodes, totalLabel: "Tax Expense", totalCy: taxS.cy, totalPy: taxS.py },
    { header: "Net profit", nodes: [], totalLabel: "", totalCy: np.profitCy, totalPy: np.profitPy },
  ];

  const plAnalysis: AnalysisSection[] = [
    { header: "Income", rows: [{ label: "Revenue", cy: rev.cy, py: rev.py, emphasis: "subtotal" }, { label: "Other income", cy: oi.cy, py: oi.py, emphasis: "subtotal" }, { label: "Total income", cy: totalIncCy, py: totalIncPy, emphasis: "total" }] },
    { header: "Expenses", rows: [{ label: "COGS", cy: cogsS.cy - stock.reduce((s, e) => s + (e.bucket === "good" ? e.value : 0), 0), py: cogsS.py }, { label: "Employee benefits", cy: empS.cy, py: empS.py }, { label: "Finance costs", cy: finS.cy, py: finS.py }, { label: "Depreciation", cy: depS.cy + depTotal, py: depS.py }, { label: "Selling & distribution", cy: sellS.cy, py: sellS.py }, { label: "Administrative", cy: adminS.cy, py: adminS.py }, { label: "Other expenses", cy: otherExpS.cy, py: otherExpS.py }, { label: "Total expenses", cy: totalExpCy, py: totalExpPy, emphasis: "total" }] },
    { header: "Bottom line", rows: [{ label: "Profit before tax", cy: np.pbtCy, py: np.pbtPy, emphasis: "subtotal" }, { label: "Tax expense", cy: taxS.cy, py: taxS.py }, { label: "Net profit", cy: np.profitCy, py: np.profitPy, emphasis: "total" }] },
  ];

  return (
    <AppShell>
      <PageHeader eyebrow="Step 04" title="Profit & Loss" subtitle="Statement of Profit or Loss" description="Comparative NFRS P&L with revenue, COGS, operating expenses, finance costs, depreciation and tax — with drill-down to ledger level." />
      <div className="px-4 py-6 space-y-4 md:px-8 md:py-8 md:space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Revenue</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(rev.cy, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Net Profit</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(np.profitCy, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Net Margin</div><div className="mt-1 font-display text-xl tabular-nums">{rev.cy ? ((np.profitCy / rev.cy) * 100).toFixed(1) + "%" : "—"}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Expenses</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(totalExpCy, { showZero: true })}</div></div>
        </div>
        <HierarchyStatement title="Statement of Profit or Loss" subtitle="Comparative income statement with opening, current and prior year values" opLabel="Opening" cyLabel={master.cy.label} pyLabel={master.py.label} sections={plSections} />
        <AnalysisPanel title="Vertical & Horizontal Analysis" subtitle="Structure and year-on-year movement" cyLabel={master.cy.label} pyLabel={master.py.label} sections={plAnalysis} />
      </div>
    </AppShell>
  );
}
