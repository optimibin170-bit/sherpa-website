import { useMemo } from "react";
import { AppShell, PageHeader, PrintButton } from "./AppShell";
import { HierarchyStatement } from "./HierarchyStatement";
import { PendingBanner } from "./StatementShell";
import { AnalysisPanel, type AnalysisSection } from "./AnalysisPanel";
import type { StatementSection, ExtraLine } from "./HierarchyStatement";
import { useAdjustments, summarizeStock } from "@/store/adjustments";
import { useTrialBalance } from "@/store/trialBalance";
import { buildHierarchy, sumNodes } from "@/lib/hierarchy";
import { tbScheduleTotals } from "@/lib/tbAggregate";
import { reclassifyRows } from "@/lib/reclassify";
import { allocateAccumDepreciation } from "@/lib/depreciationAllocation";
import { findUnmappedRows } from "@/lib/unmapped";
import { UnmappedLedgers } from "./UnmappedLedgers";
import { computeNetProfit } from "@/lib/computeNetProfit";


function BalanceSheetPage() {
  const adj = useAdjustments();
  const tb = useTrialBalance();
  const hasTB = tb.cy.rows.length > 0;
  const cyLabel = tb.master.cy.label !== "Current Year" ? tb.master.cy.label : "Current Year";
  const pyLabel = tb.master.py.label !== "Prior Year" ? tb.master.py.label : "Prior Year";

  const stock = useMemo(() => summarizeStock(adj.closingStock), [adj.closingStock]);
  const depTotal = adj.depreciation.reduce((s, d) => s + d.depreciation, 0);
  const prepaid = adj.accruals.filter((a) => a.kind === "prepaid").reduce((s, a) => s + a.amount, 0);
  const accrued = adj.accruals.filter((a) => a.kind === "accrued").reduce((s, a) => s + a.amount, 0);

  // Net profit (after closing stock & all adjustments) flows into Other Equity.
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
    [tb.cy.rows, tb.py.rows, adj.closingStock, adj.depreciation, adj.accruals, adj.ledgerAdj, adj.cogs],
  );

  // Reclassify contra balances (e.g. Trade Receivables with Cr closing →
  // "Advance from Customers" on the liability side) AND redistribute
  // accumulated depreciation across PPE / Intangible ledgers pro-rata,
  // BEFORE building either tree so the numbers flow through correctly.
  const cyRowsRc = useMemo(
    () => allocateAccumDepreciation(reclassifyRows(tb.cy.rows)),
    [tb.cy.rows],
  );
  const pyRowsRc = useMemo(
    () => allocateAccumDepreciation(reclassifyRows(tb.py.rows)),
    [tb.py.rows],
  );

  const unmapped = useMemo(
    () => findUnmappedRows(tb.cy.rows, tb.py.rows),
    [tb.cy.rows, tb.py.rows],
  );

  // Liabilities & Equity tree (TB stores Cr balances as negative net → flip with sign=-1).
  const liabNodes = useMemo(
    () =>
      buildHierarchy({
        cyRows: cyRowsRc,
        pyRows: pyRowsRc,
        filter: (i) => i.classification === "Liabilities" && i.parent !== "Equity",
        sign: -1,
      }),
    [cyRowsRc, pyRowsRc],
  );

  const liabSum = sumNodes(liabNodes);

  // Equity always comes from Platform; values default to TB-derived seeds when
  // the Platform overrides are blank, so the line is never missing on the BS.
  const sc = adj.equity.shareCapital;
  const re = adj.equity.retainedEarnings;
  const scOpenSeed = Math.round(-tbScheduleTotals(tb.py.rows, ["Share Capital"]).closing);
  const scCloseSeed = Math.round(-tbScheduleTotals(tb.cy.rows, ["Share Capital"]).closing);
  const reOpenSeed = Math.round(-tbScheduleTotals(tb.py.rows, ["Other Equity"]).closing);
  const scOpening = sc.opening ?? scOpenSeed;
  const scClosing = sc.closing ?? scCloseSeed;
  const reOpening = re.opening ?? reOpenSeed;
  const reClosing = reOpening + np.profitCy + (re.adjustments ?? 0);
  const equityExtras: ExtraLine[] = [];
  let equityOverlayOp = 0;
  let equityOverlayCy = 0;
  let equityOverlayPy = 0;

  equityExtras.push({
    label: "Share capital (Platform)",
    hint: "P",
    op: scOpening,
    cy: scClosing,
    py: scOpenSeed,
  });
  equityOverlayOp += scOpening;
  equityOverlayCy += scClosing;
  equityOverlayPy += scOpenSeed;

  equityExtras.push({
    label: "Other equity — opening (Platform)",
    hint: "P",
    op: reOpening,
    cy: reOpening,
    py: reOpening,
  });
  equityExtras.push({
    label: "Add: Net profit for the year",
    hint: "Auto",
    op: 0,
    cy: np.profitCy,
    py: np.profitPy,
  });
  if (re.adjustments) {
    equityExtras.push({
      label: `Adjustments${re.note ? ` (${re.note})` : ""}`,
      hint: "P",
      op: 0,
      cy: re.adjustments,
    });
  }
  equityExtras.push({
    label: "Other equity — closing",
    emphasis: "subtotal",
    op: reOpening,
    cy: reClosing,
    py: reOpening,
  });
  equityOverlayOp += reOpening;
  equityOverlayCy += reClosing;
  equityOverlayPy += reOpening;

  // Adjustments that change liability totals:
  if (accrued) {
    equityExtras.push({
      label: "Accrued expenses (Platform)",
      hint: "P",
      op: 0,
      cy: accrued,
    });
  }

  const liabSection: StatementSection = {
    header: "Equity & Liabilities",
    nodes: liabNodes,
    extras: equityExtras,
    totalLabel: "Total equity & liabilities",
    totalOp: liabSum.op + equityOverlayOp,
    totalCy: liabSum.cy + equityOverlayCy + accrued,
    totalPy: liabSum.py + equityOverlayPy,
    defaultOpenDepth: 1,
  };

  // Assets tree.
  const assetNodes = useMemo(
    () =>
      buildHierarchy({
        cyRows: cyRowsRc,
        pyRows: pyRowsRc,
        filter: (i) => i.classification === "Assets",
        sign: 1,
        excludeScheduleHeads: ["Inventories"],
      }),
    [cyRowsRc, pyRowsRc],
  );

  const assetSum = sumNodes(assetNodes);

  const assetExtras: ExtraLine[] = [];
  let assetOverlayOp = 0;
  let assetOverlayCy = 0;
  if (depTotal) {
    assetExtras.push({
      label: "Less: Depreciation charge (Platform)",
      hint: "P",
      op: 0,
      cy: -depTotal,
    });
    assetOverlayCy -= depTotal;
  }
  // Inventory line is driven entirely by the Stock platform (TB "Inventories" excluded above).
  const invOpening = Math.round(tbScheduleTotals(tb.cy.rows, ["Inventories"]).opening || 0);
  const invPYClosing = Math.round(tbScheduleTotals(tb.py.rows, ["Inventories"]).closing || 0);
  if (stock.good || stock.expiry || stock.defect || invPYClosing || invOpening) {
    assetExtras.push({
      label: "Inventory — good stock (Stock platform)",
      hint: "P",
      op: invOpening || invPYClosing,
      cy: stock.good,
      py: invPYClosing,
    });
    assetOverlayOp += invOpening || invPYClosing;
    assetOverlayCy += stock.good;
    if (stock.expiry) {
      assetExtras.push({
        label: "Inventory — expiry (written off)",
        hint: "P",
        op: 0,
        cy: 0,
      });
    }
    if (stock.defect) {
      assetExtras.push({
        label: "Inventory — defect (written off)",
        hint: "P",
        op: 0,
        cy: 0,
      });
    }
  }
  if (prepaid) {
    assetExtras.push({
      label: "Prepaid expenses (Platform)",
      hint: "P",
      op: 0,
      cy: prepaid,
    });
    assetOverlayCy += prepaid;
  }

  const assetSection: StatementSection = {
    header: "Assets",
    nodes: assetNodes,
    extras: assetExtras,
    totalLabel: "Total assets",
    totalOp: assetSum.op + assetOverlayOp,
    totalCy: assetSum.cy + assetOverlayCy,
    totalPy: assetSum.py + invPYClosing,
    defaultOpenDepth: 1,
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Statement"
        title="Balance Sheet"
        description={"Comparative position with opening and closing balances. Drill from Classification down to individual ledger accounts. Lines tagged \u201cP\u201d come from Platform adjustments."}
        actions={<PrintButton />}
      />
      <div className="px-8 py-8">
        {!hasTB && (
          <PendingBanner>
            Trial Balance not uploaded yet — only Platform-driven lines show values. Upload the
            year-end TB to populate the hierarchy.
          </PendingBanner>
        )}
        <HierarchyStatement
          title="Statement of Financial Position"
          subtitle="Prepared under NFRS · all amounts in NPR · click any row to drill deeper"
          opLabel="Opening (CY)"
          cyLabel={`Closing ${cyLabel}`}
          pyLabel={`Closing ${pyLabel}`}
          sections={[liabSection, assetSection]}
        />
        <BSAnalysis
          liabSection={liabSection}
          assetSection={assetSection}
          liabNodes={liabNodes}
          assetNodes={assetNodes}
          cyLabel={cyLabel}
          pyLabel={pyLabel}
        />
        <UnmappedLedgers rows={unmapped} cyLabel={cyLabel} pyLabel={pyLabel} />
      </div>
    </AppShell>
  );
}

function BSAnalysis({
  liabSection,
  assetSection,
  liabNodes,
  assetNodes,
  cyLabel,
  pyLabel,
}: {
  liabSection: StatementSection;
  assetSection: StatementSection;
  liabNodes: ReturnType<typeof buildHierarchy>;
  assetNodes: ReturnType<typeof buildHierarchy>;
  cyLabel: string;
  pyLabel: string;
}) {
  const sections: AnalysisSection[] = [
    {
      header: "Equity & Liabilities",
      base: { cy: liabSection.totalCy, py: liabSection.totalPy },
      rows: [
        ...liabNodes.map((n) => ({ label: n.label, cy: n.cy, py: n.py })),
        ...(liabSection.extras ?? [])
          .filter((e) => e.emphasis !== "subtotal")
          .map((e) => ({ label: e.label, cy: e.cy ?? 0, py: e.py ?? 0 })),
        { label: liabSection.totalLabel, cy: liabSection.totalCy, py: liabSection.totalPy, emphasis: "total" as const },
      ],
    },
    {
      header: "Assets",
      base: { cy: assetSection.totalCy, py: assetSection.totalPy },
      rows: [
        ...assetNodes.map((n) => ({ label: n.label, cy: n.cy, py: n.py })),
        ...(assetSection.extras ?? [])
          .filter((e) => e.emphasis !== "subtotal")
          .map((e) => ({ label: e.label, cy: e.cy ?? 0, py: e.py ?? 0 })),
        { label: assetSection.totalLabel, cy: assetSection.totalCy, py: assetSection.totalPy, emphasis: "total" as const },
      ],
    },
  ];
  return (
    <AnalysisPanel
      title="Vertical & Horizontal Analysis"
      subtitle="Common-size (% of section total) and year-on-year movement on each major Balance Sheet head."
      cyLabel={cyLabel}
      pyLabel={pyLabel}
      sections={sections}
    />
  );
}

export default BalanceSheetPage;
