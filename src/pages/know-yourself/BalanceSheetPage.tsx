import { useMemo } from "react";
import { AppShell, PageHeader } from "./AppShell";
import { useTrialBalance } from "@/store/trialBalance";
import { useAdjustments } from "@/store/adjustments";
import { buildHierarchy, sumNodes } from "@/lib/hierarchy";
import { HierarchyStatement, type StatementSection } from "./HierarchyStatement";
import { AnalysisPanel, type AnalysisSection } from "./AnalysisPanel";
import { reclassifyRows } from "@/lib/reclassify";
import { allocateAccumDepreciation } from "@/lib/depreciationAllocation";
import { formatNPR } from "@/lib/format";

export default function BalanceSheetPage() {
  const cyRows = useTrialBalance((s) => s.cy.rows);
  const pyRows = useTrialBalance((s) => s.py.rows);
  const master = useTrialBalance((s) => s.master);
  const depreciation = useAdjustments((s) => s.depreciation);
  const accruals = useAdjustments((s) => s.accruals);
  const stock = useAdjustments((s) => s.closingStock);
  const equity = useAdjustments((s) => s.equity);

  const depTotal = depreciation.reduce((s, d) => s + d.depreciation, 0);
  const prepaid = accruals.filter((a) => a.kind === "prepaid").reduce((s, a) => s + a.amount, 0);
  const accrued = accruals.filter((a) => a.kind === "accrued").reduce((s, a) => s + a.amount, 0);

  const ncAssets = useMemo(() => {
    const processed = allocateAccumDepreciation(reclassifyRows(cyRows));
    return buildHierarchy({ cyRows: processed, pyRows: allocateAccumDepreciation(reclassifyRows(pyRows)), filter: (i) => i.classification === "Assets" && i.parent === "Non-Current Assets", sign: 1 });
  }, [cyRows, pyRows]);

  const cAssets = useMemo(() => {
    return buildHierarchy({ cyRows: reclassifyRows(cyRows), pyRows: reclassifyRows(pyRows), filter: (i) => i.classification === "Assets" && i.parent === "Current Assets", sign: 1 });
  }, [cyRows, pyRows]);

  const ncl = useMemo(() => {
    return buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "Liabilities" && i.parent === "Non-Current Liabilities", sign: -1 });
  }, [cyRows, pyRows]);

  const cl = useMemo(() => {
    return buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "Liabilities" && i.parent === "Current Liabilities", sign: -1 });
  }, [cyRows, pyRows]);

  const eq = useMemo(() => {
    return buildHierarchy({ cyRows, pyRows, filter: (i) => i.classification === "Liabilities" && i.parent === "Equity", sign: -1 });
  }, [cyRows, pyRows]);

  const ncA = sumNodes(ncAssets);
  const cA = sumNodes(cAssets);
  const nclS = sumNodes(ncl);
  const clS = sumNodes(cl);
  const eqS = sumNodes(eq);

  const totalAssetsOp = ncA.op + cA.op;
  const totalAssetsCy = ncA.cy + cA.cy;
  const totalAssetsPy = ncA.py + cA.py;
  const totalLEOp = nclS.op + clS.op + eqS.op;
  const totalLECy = nclS.cy + clS.cy + eqS.cy;
  const totalLEPy = nclS.py + clS.py + eqS.py;

  const bsSections: StatementSection[] = [
    { header: "Non-Current Assets", nodes: ncAssets, totalLabel: "Total Non-Current Assets", totalOp: ncA.op, totalCy: ncA.cy, totalPy: ncA.py },
    { header: "Current Assets", nodes: cAssets, extras: [{ label: "Closing inventory (Platform)", hint: "platform", op: 0, cy: stock.reduce((s, e) => s + (e.bucket === "good" ? e.value : 0), 0), py: 0, emphasis: "subtotal", indent: 1 }, { label: "Prepaid expenses (Platform)", hint: "platform", op: 0, cy: prepaid, py: 0, emphasis: "subtotal", indent: 1 }], totalLabel: "Total Current Assets", totalOp: cA.op, totalCy: cA.cy + stock.reduce((s, e) => s + (e.bucket === "good" ? e.value : 0), 0) + prepaid, totalPy: cA.py },
    { header: "TOTAL ASSETS", nodes: [], totalLabel: "", totalOp: totalAssetsOp, totalCy: totalAssetsCy, totalPy: totalAssetsPy },
    { header: "Equity", nodes: eq, extras: [{ label: "Retained earnings", hint: equity.retainedEarnings.adjustments ? "adjusted" : undefined, op: 0, cy: equity.retainedEarnings.opening ?? 0, py: 0, emphasis: "subtotal", indent: 1 }], totalLabel: "Total Equity", totalOp: eqS.op, totalCy: eqS.cy, totalPy: eqS.py },
    { header: "Non-Current Liabilities", nodes: ncl, totalLabel: "Total Non-Current Liabilities", totalOp: nclS.op, totalCy: nclS.cy, totalPy: nclS.py },
    { header: "Current Liabilities", nodes: cl, extras: [{ label: "Accrued expenses (Platform)", hint: "platform", op: 0, cy: accrued, py: 0, emphasis: "subtotal", indent: 1 }], totalLabel: "Total Current Liabilities", totalOp: clS.op, totalCy: clS.cy + accrued, totalPy: clS.py },
    { header: "TOTAL EQUITY & LIABILITIES", nodes: [], totalLabel: "", totalOp: totalLEOp, totalCy: totalLECy, totalPy: totalLEPy },
  ];

  const bsAnalysis: AnalysisSection[] = [
    { header: "Non-Current Assets", rows: [{ label: "Total Non-Current Assets", cy: ncA.cy, py: ncA.py, emphasis: "total" }] },
    { header: "Current Assets", rows: [{ label: "Total Current Assets", cy: cA.cy + stock.reduce((s, e) => s + (e.bucket === "good" ? e.value : 0), 0) + prepaid, py: cA.py, emphasis: "total" }] },
    { header: "Total Assets", rows: [{ label: "Total Assets", cy: totalAssetsCy, py: totalAssetsPy, emphasis: "total" }] },
    { header: "Equity", rows: [{ label: "Total Equity", cy: eqS.cy, py: eqS.py, emphasis: "total" }] },
    { header: "Non-Current Liabilities", rows: [{ label: "Total Non-Current Liabilities", cy: nclS.cy, py: nclS.py, emphasis: "total" }] },
    { header: "Current Liabilities", rows: [{ label: "Total Current Liabilities", cy: clS.cy + accrued, py: clS.py, emphasis: "total" }] },
    { header: "Total Equity & Liabilities", rows: [{ label: "Total Equity & Liabilities", cy: totalLECy, py: totalLEPy, emphasis: "total" }] },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 04"
        title="Balance Sheet"
        subtitle="Statement of Financial Position"
        description="Comparative NFRS Balance Sheet with drill-down from Non-Current Assets, Current Assets, Equity, Non-Current Liabilities and Current Liabilities."
      />
      <div className="px-4 py-6 space-y-4 md:px-8 md:py-8 md:space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Total Assets</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(totalAssetsCy, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Total Equity</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(eqS.cy, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Total Liabilities</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(nclS.cy + clS.cy, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Balance check</div><div className={`mt-1 font-display text-xl tabular-nums ${Math.abs(totalAssetsCy - totalLECy) > 1 ? "text-destructive" : "text-emerald-600"}`}>{Math.abs(totalAssetsCy - totalLECy) <= 1 ? "Balanced ✓" : `Diff: ${formatNPR(totalAssetsCy - totalLECy)}`}</div></div>
        </div>
        <HierarchyStatement title="Statement of Financial Position" subtitle="Comparative balance sheet with opening, current and prior year values" opLabel="Opening" cyLabel={master.cy.label} pyLabel={master.py.label} sections={bsSections} />
        <AnalysisPanel title="Vertical & Horizontal Analysis" subtitle="Structure and year-on-year movement" cyLabel={master.cy.label} pyLabel={master.py.label} sections={bsAnalysis} />
      </div>
    </AppShell>
  );
}
