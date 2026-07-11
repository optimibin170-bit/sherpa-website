import { useMemo } from "react";
import { AppShell, PageHeader, PrintButton } from "./AppShell";
import { HierarchyStatement } from "./HierarchyStatement";
import { PendingBanner } from "./StatementShell";
import { AnalysisPanel, type AnalysisSection } from "./AnalysisPanel";
import type { StatementSection, ExtraLine } from "./HierarchyStatement";
import { useAdjustments, summarizeStock, sumLedgerAdjByScheduleHeads } from "@/store/adjustments";
import { useTrialBalance } from "@/store/trialBalance";
import { buildHierarchy, sumNodes } from "@/lib/hierarchy";
import { tbScheduleTotals } from "@/lib/tbAggregate";
import { findUnmappedRows } from "@/lib/unmapped";
import { UnmappedLedgers } from "./UnmappedLedgers";
import { computeNetProfit } from "@/lib/computeNetProfit";


function ProfitLossPage() {
  const adj = useAdjustments();
  const tb = useTrialBalance();
  const hasTB = tb.cy.rows.length > 0;
  const cyLabel = tb.master.cy.label !== "Current Year" ? tb.master.cy.label : "Current Year";
  const pyLabel = tb.master.py.label !== "Prior Year" ? tb.master.py.label : "Prior Year";

  const stock = useMemo(() => summarizeStock(adj.closingStock), [adj.closingStock]);
  const depTotal = adj.depreciation.reduce((s, d) => s + d.depreciation, 0);
  const prepaid = adj.accruals.filter((a) => a.kind === "prepaid").reduce((s, a) => s + a.amount, 0);
  const accrued = adj.accruals.filter((a) => a.kind === "accrued").reduce((s, a) => s + a.amount, 0);
  const rmAdj = sumLedgerAdjByScheduleHeads(adj.ledgerAdj, ["Repair & Maintenance"]);
  const intAdj = sumLedgerAdjByScheduleHeads(adj.ledgerAdj, [
    "Bank Interest",
    "Interest on Unsecured Loans",
  ]);

  // Income tree (PL classification, Income parent, Cr-side → flip sign).
  const incomeNodes = useMemo(
    () =>
      buildHierarchy({
        cyRows: tb.cy.rows,
        pyRows: tb.py.rows,
        filter: (i) => i.classification === "PL" && /income|revenue/i.test(i.parent),
        sign: -1,
      }),
    [tb.cy.rows, tb.py.rows],
  );
  const incSum = sumNodes(incomeNodes);

  // Expense tree (PL classification, anything not income).
  // Depreciation & Amortization is excluded from TB — it only comes from Platform adjustments.
  const expenseNodes = useMemo(
    () =>
      buildHierarchy({
        cyRows: tb.cy.rows,
        pyRows: tb.py.rows,
        filter: (i) =>
          i.classification === "PL" &&
          !/income|revenue/i.test(i.parent) &&
          !/deprecia|amorti/i.test(i.parent) &&
          !/deprecia|amorti/i.test(i.category2),
        sign: 1,
      }),
    [tb.cy.rows, tb.py.rows],
  );
  const expSum = sumNodes(expenseNodes);

  // COGS bridge using closing stock & platform overrides.
  const invCY = tbScheduleTotals(tb.cy.rows, ["Inventories"]);
  const invPY = tbScheduleTotals(tb.py.rows, ["Inventories"]);
  const openingInv = adj.cogs.openingInventory ?? Math.round(invCY.opening || invPY.closing || 0);
  const purchCY = tbScheduleTotals(tb.cy.rows, ["Purchase of Goods"]);
  const purchases = adj.cogs.purchases ?? Math.round(purchCY.additions - purchCY.credits || purchCY.closing);

  const expenseExtras: ExtraLine[] = [];
  let expenseOverlay = 0;
  if (openingInv || purchases || stock.good) {
    expenseExtras.push({ label: "COGS bridge — Opening inventory", hint: "P", cy: openingInv });
    expenseExtras.push({ label: "COGS bridge — Less: Closing inventory (Good)", hint: "P", cy: -stock.good });
    expenseOverlay += openingInv - stock.good;
  }
  if (stock.expiry) {
    expenseExtras.push({ label: "Inventory written off — expiry", hint: "P", cy: stock.expiry });
    expenseOverlay += stock.expiry;
  }
  if (stock.defect) {
    expenseExtras.push({ label: "Inventory written off — defect", hint: "P", cy: stock.defect });
    expenseOverlay += stock.defect;
  }
  if (depTotal) {
    expenseExtras.push({ label: "Depreciation & amortisation", hint: "P", cy: depTotal });
    expenseOverlay += depTotal;
  }
  if (rmAdj) {
    expenseExtras.push({ label: "Repair & Maintenance adjustments", hint: "P", cy: rmAdj });
    expenseOverlay += rmAdj;
  }
  if (intAdj) {
    expenseExtras.push({ label: "Finance cost adjustments", hint: "P", cy: intAdj });
    expenseOverlay += intAdj;
  }
  if (prepaid) {
    expenseExtras.push({ label: "Less: Prepaid expenses (deferred)", hint: "P", cy: -prepaid });
    expenseOverlay -= prepaid;
  }
  if (accrued) {
    expenseExtras.push({ label: "Add: Accrued expenses (recognised)", hint: "P", cy: accrued });
    expenseOverlay += accrued;
  }

  const incomeSection: StatementSection = {
    header: "Income",
    nodes: incomeNodes,
    totalLabel: "Total income",
    totalCy: incSum.cy,
    totalPy: incSum.py,
    defaultOpenDepth: 1,
  };
  const expenseSection: StatementSection = {
    header: "Expenses",
    nodes: expenseNodes,
    extras: expenseExtras,
    totalLabel: "Total expenses",
    totalCy: expSum.cy + expenseOverlay,
    totalPy: expSum.py,
    defaultOpenDepth: 1,
  };

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

  const profitSection: StatementSection = {
    header: "Result for the year",
    nodes: [],
    extras: [
      { label: "Profit before tax", emphasis: "subtotal", cy: np.pbtCy, py: np.pbtPy },
      { label: "Less: Tax expense", cy: np.taxCy, py: np.taxPy },
    ],
    totalLabel: "Profit for the year",
    totalCy: np.profitCy,
    totalPy: np.profitPy,
  };

  const unmapped = useMemo(
    () => findUnmappedRows(tb.cy.rows, tb.py.rows),
    [tb.cy.rows, tb.py.rows],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Statement"
        title="Profit & Loss"
        description={"Comparative Statement of Profit or Loss. Drill from Classification down to individual ledger accounts. Lines tagged \u201cP\u201d come from Platform adjustments."}
        actions={<PrintButton />}
      />
      <div className="px-8 py-8">
        {!hasTB && (
          <PendingBanner>
            Awaiting Trial Balance — income and expense ledgers will populate from the TB
            mapping. Platform adjustments (depreciation, stock, accruals) already appear.
          </PendingBanner>
        )}
        <HierarchyStatement
          title="Statement of Profit or Loss"
          subtitle="Prepared under NFRS · all amounts in NPR · click any row to drill deeper"
          cyLabel={cyLabel}
          pyLabel={pyLabel}
          sections={[incomeSection, expenseSection, profitSection]}
        />
        <PLAnalysis
          incomeSection={incomeSection}
          expenseSection={expenseSection}
          incomeNodes={incomeNodes}
          expenseNodes={expenseNodes}
          np={np}
          cyLabel={cyLabel}
          pyLabel={pyLabel}
        />
        <UnmappedLedgers rows={unmapped} cyLabel={cyLabel} pyLabel={pyLabel} />
      </div>
    </AppShell>
  );
}

function PLAnalysis({
  incomeSection,
  expenseSection,
  incomeNodes,
  expenseNodes,
  np,
  cyLabel,
  pyLabel,
}: {
  incomeSection: StatementSection;
  expenseSection: StatementSection;
  incomeNodes: ReturnType<typeof buildHierarchy>;
  expenseNodes: ReturnType<typeof buildHierarchy>;
  np: ReturnType<typeof computeNetProfit>;
  cyLabel: string;
  pyLabel: string;
}) {
  const revenueCy = incomeSection.totalCy;
  const revenuePy = incomeSection.totalPy;

  const sections: AnalysisSection[] = [
    {
      header: "Income (% of Total Income)",
      base: { cy: revenueCy, py: revenuePy },
      rows: [
        ...incomeNodes.map((n) => ({ label: n.label, cy: n.cy, py: n.py })),
        { label: incomeSection.totalLabel, cy: revenueCy, py: revenuePy, emphasis: "total" as const },
      ],
    },
    {
      header: "Expenses (% of Total Income)",
      base: { cy: revenueCy, py: revenuePy },
      rows: [
        ...expenseNodes.map((n) => ({ label: n.label, cy: n.cy, py: n.py })),
        ...(expenseSection.extras ?? [])
          .filter((e) => e.emphasis !== "subtotal")
          .map((e) => ({ label: e.label, cy: e.cy ?? 0, py: e.py ?? 0 })),
        { label: expenseSection.totalLabel, cy: expenseSection.totalCy, py: expenseSection.totalPy, emphasis: "total" as const },
      ],
    },
    {
      header: "Result (% of Total Income)",
      base: { cy: revenueCy, py: revenuePy },
      rows: [
        { label: "Profit before tax", cy: np.pbtCy, py: np.pbtPy, emphasis: "subtotal" as const },
        { label: "Tax expense", cy: np.taxCy, py: np.taxPy },
        { label: "Profit for the year", cy: np.profitCy, py: np.profitPy, emphasis: "total" as const },
      ],
    },
  ];

  return (
    <AnalysisPanel
      title="Vertical & Horizontal Analysis"
      subtitle="Each line shown as a percentage of total income (common-size) along with year-on-year movement."
      cyLabel={cyLabel}
      pyLabel={pyLabel}
      sections={sections}
    />
  );
}

export default ProfitLossPage;
