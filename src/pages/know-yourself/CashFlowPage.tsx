import { useMemo } from "react";
import { AppShell, PageHeader, PrintButton } from "./AppShell";
import { StatementTable, PendingBanner, type Line } from "./StatementShell";
import { useAdjustments, summarizeStock } from "@/store/adjustments";
import { useTrialBalance, type TBRow } from "@/store/trialBalance";
import { tbScheduleTotals, sumByCategory2, tbByScheduleHead, ledgersByCategory2, type LedgerDrill } from "@/lib/tbAggregate";
import { computeNetProfit } from "@/lib/computeNetProfit";


// Schedule heads used to derive movements.
const RECEIVABLE_HEADS = ["Trade Receivables"];
const PAYABLE_HEADS = ["Trade payables", "Other Creditors"];
const OTHER_CL_HEADS = ["Audit Fee Payable"];
const PPE_HEADS = [
  "Computer & Peripherals",
  "Furniture & Fixtures",
  "Vehicles",
  "Other Assets",
];
const INTANGIBLE_HEADS = ["Software"];
const BORROWING_HEADS = ["Borrowings", "Overdraft"];
const SHARE_CAP_HEADS = ["Share Capital"];
const CASH_HEADS = ["Cash & Cash Equivalents", "Bank Margins"];

function movement(rows: TBRow[], heads: string[], sign: 1 | -1 = 1) {
  const t = tbScheduleTotals(rows, heads);
  return {
    opening: t.opening * sign,
    closing: t.closing * sign,
    change: (t.closing - t.opening) * sign,
  };
}

/** Ledger-level movement drill: opening → closing per accountName within the
 *  given schedule heads, for both CY and PY. `cy` / `py` columns show the
 *  change (signed by `sign`). Empty lines are filtered out. */
function movementDrill(
  cyRows: TBRow[],
  pyRows: TBRow[],
  heads: string[],
  sign: 1 | -1 = 1,
): LedgerDrill[] {
  const cy = tbByScheduleHead(cyRows, heads);
  const py = tbByScheduleHead(pyRows, heads);
  const map = new Map<string, LedgerDrill>();
  for (const l of cy) {
    map.set(l.accountName.trim(), {
      accountName: l.accountName,
      scheduleHead: l.scheduleHead,
      category2: "",
      cy: (l.closing - l.opening) * sign,
      py: 0,
    });
  }
  for (const l of py) {
    const k = l.accountName.trim();
    const e = map.get(k) ?? {
      accountName: l.accountName,
      scheduleHead: l.scheduleHead,
      category2: "",
      cy: 0,
      py: 0,
    };
    e.py = (l.closing - l.opening) * sign;
    map.set(k, e);
  }
  return [...map.values()]
    .filter((d) => Math.abs(d.cy) > 0.5 || Math.abs(d.py) > 0.5)
    .sort((a, b) => Math.abs(b.cy) - Math.abs(a.cy));
}

/** Ledger-level balance drill (opening or closing) per accountName. */
function balanceDrill(
  cyRows: TBRow[],
  pyRows: TBRow[],
  heads: string[],
  which: "opening" | "closing",
  sign: 1 | -1 = 1,
): LedgerDrill[] {
  const cy = tbByScheduleHead(cyRows, heads);
  const py = tbByScheduleHead(pyRows, heads);
  const map = new Map<string, LedgerDrill>();
  for (const l of cy) {
    map.set(l.accountName.trim(), {
      accountName: l.accountName,
      scheduleHead: l.scheduleHead,
      category2: "",
      cy: l[which] * sign,
      py: 0,
    });
  }
  for (const l of py) {
    const k = l.accountName.trim();
    const e = map.get(k) ?? {
      accountName: l.accountName,
      scheduleHead: l.scheduleHead,
      category2: "",
      cy: 0,
      py: 0,
    };
    e.py = l[which] * sign;
    map.set(k, e);
  }
  return [...map.values()]
    .filter((d) => Math.abs(d.cy) > 0.5 || Math.abs(d.py) > 0.5)
    .sort((a, b) => Math.abs(b.cy) - Math.abs(a.cy));
}

function CashFlowPage() {
  const adj = useAdjustments();
  const tb = useTrialBalance();
  const hasTB = tb.cy.rows.length > 0;
  const cyLabel = tb.master.cy.label !== "Current Year" ? tb.master.cy.label : "Current Year";
  const pyLabel = tb.master.py.label !== "Prior Year" ? tb.master.py.label : "Prior Year";

  const stock = useMemo(() => summarizeStock(adj.closingStock), [adj.closingStock]);
  const depTotal = adj.depreciation.reduce((s, d) => s + d.depreciation, 0);

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

  // Finance costs / other income from PL for add-backs.
  const catCy = useMemo(() => sumByCategory2(tb.cy.rows), [tb.cy.rows]);
  const catPy = useMemo(() => sumByCategory2(tb.py.rows), [tb.py.rows]);
  const financeCostCy = catCy["Finance Costs"] ?? 0;
  const financeCostPy = catPy["Finance Costs"] ?? 0;
  const otherIncCy = -(catCy["Other Income"] ?? 0);
  const otherIncPy = -(catPy["Other Income"] ?? 0);

  // Working capital movements (CY = opening→closing of CY rows; PY = opening→closing of PY rows).
  const recCY = movement(tb.cy.rows, RECEIVABLE_HEADS, 1);
  const recPY = movement(tb.py.rows, RECEIVABLE_HEADS, 1);
  const payCY = movement(tb.cy.rows, PAYABLE_HEADS, -1); // liabilities: closing more negative = increase
  const payPY = movement(tb.py.rows, PAYABLE_HEADS, -1);
  const oclCY = movement(tb.cy.rows, OTHER_CL_HEADS, -1);
  const oclPY = movement(tb.py.rows, OTHER_CL_HEADS, -1);

  // Inventory movement: use platform good stock as closing when set, else TB closing.
  const invCyTot = tbScheduleTotals(tb.cy.rows, ["Inventories"]);
  const invPyTot = tbScheduleTotals(tb.py.rows, ["Inventories"]);
  const invOpen = Math.round(invCyTot.opening || invPyTot.closing || 0);
  const invClose = stock.good || Math.round(invCyTot.closing || 0);
  const invChangeCy = invClose - invOpen;
  const invChangePy = Math.round(invPyTot.closing - invPyTot.opening);

  // Investing: change in gross carrying PPE + Intangibles (before depreciation add-back).
  const ppeCY = movement(tb.cy.rows, PPE_HEADS, 1);
  const ppePY = movement(tb.py.rows, PPE_HEADS, 1);
  const intCY = movement(tb.cy.rows, INTANGIBLE_HEADS, 1);
  const intPY = movement(tb.py.rows, INTANGIBLE_HEADS, 1);
  const capexCy = ppeCY.change + intCY.change + depTotal; // gross additions ≈ Δnet + depreciation
  const capexPy = ppePY.change + intPY.change;

  // Financing.
  const borrCY = movement(tb.cy.rows, BORROWING_HEADS, -1);
  const borrPY = movement(tb.py.rows, BORROWING_HEADS, -1);
  const scCY = movement(tb.cy.rows, SHARE_CAP_HEADS, -1);
  const scPY = movement(tb.py.rows, SHARE_CAP_HEADS, -1);

  // Cash & equivalents opening/closing.
  const cashCY = movement(tb.cy.rows, CASH_HEADS, 1);
  const cashPY = movement(tb.py.rows, CASH_HEADS, 1);

  // ---- Build lines ----
  const pbtAdjCy = np.pbtCy + depTotal + financeCostCy - otherIncCy;
  const pbtAdjPy = np.pbtPy + financeCostPy - otherIncPy;

  const wcCy = -recCY.change - invChangeCy + payCY.change + oclCY.change;
  const wcPy = -recPY.change - invChangePy + payPY.change + oclPY.change;

  const cashOpCy = pbtAdjCy + wcCy - financeCostCy - np.taxCy;
  const cashOpPy = pbtAdjPy + wcPy - financeCostPy - np.taxPy;

  const cashInvCy = -capexCy + otherIncCy;
  const cashInvPy = -capexPy + otherIncPy;

  const cashFinCy = borrCY.change + scCY.change;
  const cashFinPy = borrPY.change + scPY.change;

  const netChangeCy = cashOpCy + cashInvCy + cashFinCy;
  const netChangePy = cashOpPy + cashInvPy + cashFinPy;

  // Ledger-level drills so each figure shows the underlying accounts.
  const depDrill: LedgerDrill[] = adj.depreciation
    .filter((d) => Math.abs(d.depreciation) > 0.5)
    .map((d) => ({
      accountName: d.asset || d.scheduleHead,
      scheduleHead: d.scheduleHead,
      category2: "Depreciation schedule",
      cy: d.depreciation,
      py: 0,
    }));
  const financeCostDrill = ledgersByCategory2(tb.cy.rows, tb.py.rows, ["Finance Costs"], 1);
  const otherIncomeDrill = ledgersByCategory2(tb.cy.rows, tb.py.rows, ["Other Income"], -1);
  const taxDrill = ledgersByCategory2(tb.cy.rows, tb.py.rows, ["Tax Expense", "Income Tax"], 1);
  const pbtDrillHint: LedgerDrill[] = [
    { accountName: "From Profit & Loss (PBT)", scheduleHead: "Computed", category2: "", cy: np.pbtCy, py: np.pbtPy },
  ];

  const recDrill = movementDrill(tb.cy.rows, tb.py.rows, RECEIVABLE_HEADS, -1); // (Increase)/decrease
  const payDrill = movementDrill(tb.cy.rows, tb.py.rows, PAYABLE_HEADS, -1); // liab sign convention
  const oclDrill = movementDrill(tb.cy.rows, tb.py.rows, OTHER_CL_HEADS, -1);
  const invDrill: LedgerDrill[] = [
    { accountName: "Opening inventory (TB)", scheduleHead: "Inventories", category2: "", cy: -invOpen, py: -Math.round(invPyTot.opening) },
    { accountName: `Closing inventory ${stock.good ? "(platform)" : "(TB)"}`, scheduleHead: "Inventories", category2: "", cy: invClose, py: Math.round(invPyTot.closing) },
  ];

  const ppeDrill = movementDrill(tb.cy.rows, tb.py.rows, [...PPE_HEADS, ...INTANGIBLE_HEADS], 1);
  const capexDrill: LedgerDrill[] = [
    ...ppeDrill.map((d) => ({ ...d, cy: -d.cy, py: -d.py })),
    { accountName: "Add: depreciation add-back", scheduleHead: "Non-cash", category2: "", cy: -depTotal, py: 0 },
  ];

  const borrDrill = movementDrill(tb.cy.rows, tb.py.rows, BORROWING_HEADS, -1);
  const scDrill = movementDrill(tb.cy.rows, tb.py.rows, SHARE_CAP_HEADS, -1);

  const cashOpenDrill = balanceDrill(tb.cy.rows, tb.py.rows, CASH_HEADS, "opening", 1);
  const cashCloseDrill = balanceDrill(tb.cy.rows, tb.py.rows, CASH_HEADS, "closing", 1);

  const lines: Line[] = [
    { label: "A. Cash flows from operating activities", emphasis: "header" },
    { label: "Profit before tax", cy: np.pbtCy, py: np.pbtPy, drill: pbtDrillHint },
    { label: "Adjustments for:", emphasis: "header" },
    { label: "Depreciation & amortisation", cy: depTotal, py: 0, indent: 1, drill: depDrill },
    { label: "Finance costs", cy: financeCostCy, py: financeCostPy, indent: 1, drill: financeCostDrill },
    { label: "Interest & other non-operating income", cy: -otherIncCy, py: -otherIncPy, indent: 1, drill: otherIncomeDrill },
    {
      label: "Operating profit before working capital changes",
      emphasis: "subtotal",
      cy: pbtAdjCy,
      py: pbtAdjPy,
    },
    { label: "Working capital adjustments:", emphasis: "header" },
    { label: "(Increase) / decrease in trade receivables", cy: -recCY.change, py: -recPY.change, indent: 1, drill: recDrill },
    { label: "(Increase) / decrease in inventories", cy: -invChangeCy, py: -invChangePy, indent: 1, drill: invDrill },
    { label: "Increase / (decrease) in trade payables", cy: payCY.change, py: payPY.change, indent: 1, drill: payDrill },
    { label: "Increase / (decrease) in other current liabilities", cy: oclCY.change, py: oclPY.change, indent: 1, drill: oclDrill },
    { label: "Cash generated from operations", emphasis: "subtotal", cy: pbtAdjCy + wcCy, py: pbtAdjPy + wcPy },
    { label: "Finance costs paid", cy: -financeCostCy, py: -financeCostPy, drill: financeCostDrill.map((d) => ({ ...d, cy: -d.cy, py: -d.py })) },
    { label: "Income tax paid", cy: -np.taxCy, py: -np.taxPy, drill: taxDrill.map((d) => ({ ...d, cy: -d.cy, py: -d.py })) },
    { label: "Net cash from / (used in) operating activities  (A)", emphasis: "total", cy: cashOpCy, py: cashOpPy },

    { label: "B. Cash flows from investing activities", emphasis: "header" },
    { label: "Purchase of property, plant & equipment / intangibles", cy: -capexCy, py: -capexPy, drill: capexDrill },
    { label: "Interest & other income received", cy: otherIncCy, py: otherIncPy, drill: otherIncomeDrill.map((d) => ({ ...d, cy: -d.cy, py: -d.py })) },
    { label: "Net cash from / (used in) investing activities  (B)", emphasis: "total", cy: cashInvCy, py: cashInvPy },

    { label: "C. Cash flows from financing activities", emphasis: "header" },
    { label: "Proceeds / (repayment) of borrowings", cy: borrCY.change, py: borrPY.change, drill: borrDrill },
    { label: "Proceeds from issue of share capital", cy: scCY.change, py: scPY.change, drill: scDrill },
    { label: "Net cash from / (used in) financing activities  (C)", emphasis: "total", cy: cashFinCy, py: cashFinPy },

    { label: "Net increase / (decrease) in cash and cash equivalents  (A+B+C)", emphasis: "subtotal", cy: netChangeCy, py: netChangePy },
    { label: "Cash and cash equivalents at the beginning of the year", cy: cashCY.opening, py: cashPY.opening, drill: cashOpenDrill },
    { label: "Cash and cash equivalents at the end of the year", emphasis: "total", cy: cashCY.opening + netChangeCy, py: cashPY.opening + netChangePy, drill: cashCloseDrill },
  ];

  const reconDiffCy = cashCY.closing - (cashCY.opening + netChangeCy);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Statement"
        title="Cash Flow Statement"
        description="Indirect method — reconciles profit before tax to net cash generated across operating, investing and financing activities."
        actions={<PrintButton />}
      />
      <div className="px-8 py-8">
        {!hasTB && (
          <PendingBanner>
            Trial Balance not uploaded yet — upload the year-end TB to derive working capital,
            financing and investing movements.
          </PendingBanner>
        )}
        <StatementTable
          title="Statement of Cash Flows (Indirect Method)"
          subtitle="Prepared under NAS 7 · all amounts in NPR"
          lines={lines}
          cyLabel={cyLabel}
          pyLabel={pyLabel}
        />
        {hasTB && Math.abs(reconDiffCy) > 1 && (
          <div className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-foreground/80">
            Reconciliation variance vs TB closing cash: <span className="tabular font-medium">
              {reconDiffCy.toLocaleString()}
            </span>. Movements not captured (non-cash reclassifications, revaluations, or platform
            adjustments outside the mapped schedule heads) may explain the difference.
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default CashFlowPage;
