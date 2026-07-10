import { useMemo } from "react";
import { AppShell, PageHeader } from "./AppShell";
import { useTrialBalance } from "@/store/trialBalance";
import { useAdjustments } from "@/store/adjustments";
import { computeNetProfit } from "@/lib/computeNetProfit";
import { StatementTable, PendingBanner, type Line } from "./StatementShell";
import { rowNet, type TBRow } from "@/store/trialBalance";
import { lookupSchedule } from "@/lib/tbAggregate";
import { formatNPR } from "@/lib/format";

function bucket(rows: TBRow[], predicate: (info: { classification: string; parent: string; category: string; category2: string }) => boolean, sign: 1 | -1 = 1): number {
  let total = 0;
  for (const r of rows) {
    const info = lookupSchedule(r.scheduleHead);
    if (!info) continue;
    if (!predicate(info)) continue;
    total += rowNet(r) * sign;
  }
  return total;
}

export default function CashFlowPage() {
  const cyRows = useTrialBalance((s) => s.cy.rows);
  const pyRows = useTrialBalance((s) => s.py.rows);
  const master = useTrialBalance((s) => s.master);
  const { closingStock, depreciation, accruals, ledgerAdj, cogs } = useAdjustments();

  const np = useMemo(() => computeNetProfit({ cyRows, pyRows, closingStock, depreciation, accruals, ledgerAdj, cogs }), [cyRows, pyRows, closingStock, depreciation, accruals, ledgerAdj, cogs]);

  const depTotal = depreciation.reduce((s, d) => s + d.depreciation, 0);
  const prepaid = accruals.filter((a) => a.kind === "prepaid").reduce((s, a) => s + a.amount, 0);
  const accrued = accruals.filter((a) => a.kind === "accrued").reduce((s, a) => s + a.amount, 0);

  const receivablesCy = bucket(cyRows, (i) => i.category2 === "Trade Receivables", 1);
  const receivablesPy = bucket(pyRows, (i) => i.category2 === "Trade Receivables", 1);
  const inventoryCy = bucket(cyRows, (i) => i.category2 === "Inventories", 1);
  const inventoryPy = bucket(pyRows, (i) => i.category2 === "Inventories", 1);
  const payablesCy = bucket(cyRows, (i) => i.category2 === "Trade payables", -1);
  const payablesPy = bucket(pyRows, (i) => i.category2 === "Trade payables", -1);
  const otherCurrentAssetsCy = bucket(cyRows, (i) => i.parent === "Current Assets" && i.category2 === "Other Current Assets", 1) + bucket(cyRows, (i) => i.parent === "Current Assets" && i.category2 === "Other Financial Assets", 1);
  const otherCurrentAssetsPy = bucket(pyRows, (i) => i.parent === "Current Assets" && i.category2 === "Other Current Assets", 1) + bucket(pyRows, (i) => i.parent === "Current Assets" && i.category2 === "Other Financial Assets", 1);

  const changeReceivables = -(receivablesCy - receivablesPy);
  const changeInventory = -(inventoryCy - inventoryPy);
  const changePrepaid = prepaid > 0 ? -prepaid : 0;
  const changePayables = payablesCy - payablesPy;
  const changeAccrued = accrued > 0 ? accrued : 0;
  const changeOtherCurrentAssets = -(otherCurrentAssetsCy - otherCurrentAssetsPy);

  const operatingCashCy = np.profitCy + depTotal + changeReceivables + changeInventory + changePrepaid + changePayables + changeAccrued + changeOtherCurrentAssets;

  const ppeCy = bucket(cyRows, (i) => i.parent === "Non-Current Assets" && i.category2 === "Property, Plant and Equipment", -1);
  const ppePy = bucket(pyRows, (i) => i.parent === "Non-Current Assets" && i.category2 === "Property, Plant and Equipment", -1);
  const intangCy = bucket(cyRows, (i) => i.parent === "Non-Current Assets" && i.category2 === "Intangible assets", -1);
  const intangPy = bucket(pyRows, (i) => i.parent === "Non-Current Assets" && i.category2 === "Intangible assets", -1);
  const investmentsCy = bucket(cyRows, (i) => i.parent === "Non-Current Assets" && i.category2 === "Financial Assets", -1);
  const investmentsPy = bucket(pyRows, (i) => i.parent === "Non-Current Assets" && i.category2 === "Financial Assets", -1);

  const investingCashCy = -(ppeCy - ppePy) + -(intangCy - intangPy) + -(investmentsCy - investmentsPy);
  const capexCy = -(ppeCy - ppePy);

  const borrowingsCy = bucket(cyRows, (i) => i.parent === "Current Liabilities" && i.category2 === "Borrowings", -1) + bucket(cyRows, (i) => i.parent === "Non-Current Liabilities" && i.category2 === "Borrowings", -1);
  const borrowingsPy = bucket(pyRows, (i) => i.parent === "Current Liabilities" && i.category2 === "Borrowings", -1) + bucket(pyRows, (i) => i.parent === "Non-Current Liabilities" && i.category2 === "Borrowings", -1);
  const interestCy = bucket(cyRows, (i) => i.parent === "Finance Costs", 1);

  const financingCashCy = (borrowingsCy - borrowingsPy) - interestCy;

  const netChangeCy = operatingCashCy + investingCashCy + financingCashCy;

  const lines: Line[] = [
    { label: "Cash flows from operating activities", emphasis: "header" },
    { label: "Profit before tax", cy: np.pbtCy, py: np.pbtPy, emphasis: "subtotal" },
    { label: "Tax expense", cy: np.taxCy, py: np.taxPy, indent: 1 },
    { label: "Adjustments for:", emphasis: "header" },
    { label: "Depreciation & amortisation", cy: depTotal, py: 0, indent: 1 },
    { label: "Operating profit before working capital changes", cy: np.profitCy + depTotal, py: np.profitPy, emphasis: "subtotal" },
    { label: "Changes in working capital:", emphasis: "header" },
    { label: "Increase/decrease in trade receivables", cy: changeReceivables, py: 0, indent: 1 },
    { label: "Increase/decrease in inventories", cy: changeInventory, py: 0, indent: 1 },
    { label: "Increase/decrease in prepaid expenses", cy: changePrepaid, py: 0, indent: 1 },
    { label: "Increase/decrease in other current assets", cy: changeOtherCurrentAssets, py: 0, indent: 1 },
    { label: "Increase/decrease in trade payables", cy: changePayables, py: 0, indent: 1 },
    { label: "Increase/decrease in accrued expenses", cy: changeAccrued, py: 0, indent: 1 },
    { label: "Net cash from operating activities", cy: operatingCashCy, py: 0, emphasis: "total" },
    { label: "Cash flows from investing activities", emphasis: "header" },
    { label: "Purchase of PPE", cy: capexCy, py: 0, indent: 1 },
    { label: "Net cash from investing activities", cy: investingCashCy, py: 0, emphasis: "total" },
    { label: "Cash flows from financing activities", emphasis: "header" },
    { label: "Net change in borrowings", cy: borrowingsCy - borrowingsPy, py: 0, indent: 1 },
    { label: "Interest paid", cy: -interestCy, py: 0, indent: 1 },
    { label: "Net cash from financing activities", cy: financingCashCy, py: 0, emphasis: "total" },
    { label: "Net increase/decrease in cash", cy: netChangeCy, py: 0, emphasis: "total" },
  ];

  return (
    <AppShell>
      <PageHeader eyebrow="Statement" title="Cash Flow Statement" subtitle="Indirect Method" description="Operating, investing and financing cash flows derived from the Trial Balance and Platform adjustments." />
      <div className="px-4 py-6 space-y-4 md:px-8 md:py-8 md:space-y-6">
        <PendingBanner>This is a simplified cash flow from TB data. For a complete NAS 7 statement, reconcile with bank statements and non-cash items.</PendingBanner>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Operating</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(operatingCashCy, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Investing</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(investingCashCy, { showZero: true })}</div></div>
          <div className="rounded-lg border bg-card p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Financing</div><div className="mt-1 font-display text-xl tabular-nums">{formatNPR(financingCashCy, { showZero: true })}</div></div>
        </div>
        <StatementTable title="Cash Flow Statement" subtitle="Indirect method — simplified" cyLabel={master.cy.label} pyLabel={master.py.label} lines={lines} />
      </div>
    </AppShell>
  );
}
