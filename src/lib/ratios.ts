import type { TBRow } from "@/store/trialBalance";
import { rowNet } from "@/store/trialBalance";
import { lookupSchedule } from "./tbAggregate";
import { computeNetProfit, type NetProfitInputs, type NetProfitResult } from "./computeNetProfit";
import { summarizeStock, sumLedgerAdjByScheduleHeads } from "@/store/adjustments";

function bucket(rows: TBRow[], predicate: (i: { classification: string; parent: string; category: string; category2: string }) => boolean, sign: 1 | -1 = 1, excludeScheduleHeads: string[] = []) {
  const excluded = new Set(excludeScheduleHeads.map((s) => s.toLowerCase()));
  let total = 0;
  for (const r of rows) {
    if (excluded.has((r.scheduleHead || "").toLowerCase())) continue;
    const info = lookupSchedule(r.scheduleHead);
    if (!info) continue;
    if (!predicate(info)) continue;
    total += rowNet(r) * sign;
  }
  return total;
}

export type RatioAggregates = {
  revenue: number; otherIncome: number; totalIncome: number; cogs: number; grossProfit: number;
  operatingExpenses: number; operatingProfit: number; depreciation: number; interest: number; ebit: number;
  pbt: number; tax: number; netProfit: number; cash: number; receivables: number; inventory: number;
  otherCurrentAssets: number; currentAssets: number; nonCurrentAssets: number; totalAssets: number;
  payables: number; shortTermDebt: number; otherCurrentLiabilities: number; currentLiabilities: number;
  longTermDebt: number; otherNonCurrentLiabilities: number; nonCurrentLiabilities: number; totalLiabilities: number;
  shareCapital: number; retainedEarnings: number; equity: number; totalDebt: number; capitalEmployed: number;
};

function bucketOpex(rows: TBRow[], useCy: boolean, overlays: { prepaid: number; accrued: number }) {
  const admin = bucket(rows, (i) => i.category2 === "Administrative Expenses", 1);
  const selling = bucket(rows, (i) => i.category2 === "Selling and Distribution Expenses", 1);
  const other = bucket(rows, (i) => i.category2 === "Other Expenses", 1);
  const accAdj = useCy ? overlays.accrued - overlays.prepaid : 0;
  return admin + selling + other + accAdj;
}

function aggregateOne(rows: TBRow[], np: NetProfitResult, useCy: boolean, overlays: { depTotal: number; prepaid: number; accrued: number; goodStock: number; invTbClosing: number; intAdj: number; scClosing: number; reClosing: number }): RatioAggregates {
  const revenue = bucket(rows, (i) => i.category === "Revenue from Operations", -1);
  const otherIncome = bucket(rows, (i) => i.category === "Other Income", -1);
  const totalIncome = revenue + otherIncome;
  const depreciation = useCy ? overlays.depTotal : 0;
  const interest = bucket(rows, (i) => i.parent === "Finance Costs", 1) + (useCy ? overlays.intAdj : 0);
  const opex = bucketOpex(rows, useCy, overlays);
  const totalExp = useCy ? np.totalExpCy : np.totalExpPy;
  const cogs = totalExp - depreciation - interest - opex;
  const grossProfit = revenue - cogs;
  const operatingProfit = grossProfit + otherIncome - opex - depreciation;
  const pbt = useCy ? np.pbtCy : np.pbtPy;
  const tax = useCy ? np.taxCy : np.taxPy;
  const netProfit = useCy ? np.profitCy : np.profitPy;
  const ebit = pbt + interest;
  const cash = bucket(rows, (i) => i.category2 === "Cash & Cash Equivalents", 1);
  const receivables = bucket(rows, (i) => i.category2 === "Trade Receivables", 1);
  const otherCurrentAssets = bucket(rows, (i) => i.parent === "Current Assets" && i.category2 === "Other Current Assets", 1) + bucket(rows, (i) => i.parent === "Current Assets" && i.category2 === "Other Financial Assets", 1) + bucket(rows, (i) => i.parent === "Current Assets" && i.category2 === "Current Tax Assets", 1) + (useCy ? overlays.prepaid : 0);
  const inventory = useCy ? overlays.goodStock : overlays.invTbClosing;
  const currentAssets = cash + receivables + inventory + otherCurrentAssets;
  const nonCurrentAssetsRaw = bucket(rows, (i) => i.parent === "Non-Current Assets", 1);
  const nonCurrentAssets = nonCurrentAssetsRaw - (useCy ? depreciation : 0);
  const totalAssets = currentAssets + nonCurrentAssets;
  const payables = bucket(rows, (i) => i.category2 === "Trade payables", -1);
  const shortTermDebt = bucket(rows, (i) => i.parent === "Current Liabilities" && i.category2 === "Borrowings", -1);
  const otherCurrentLiabilities = bucket(rows, (i) => i.parent === "Current Liabilities" && i.category2 === "Other Financial Liabilities", -1) + bucket(rows, (i) => i.parent === "Current Liabilities" && i.category2 === "Other current liabilities", -1) + (useCy ? overlays.accrued : 0);
  const currentLiabilities = payables + shortTermDebt + otherCurrentLiabilities;
  const longTermDebt = bucket(rows, (i) => i.parent === "Non-Current Liabilities" && i.category2 === "Borrowings", -1);
  const otherNonCurrentLiabilities = bucket(rows, (i) => i.parent === "Non-Current Liabilities" && i.category2 !== "Borrowings", -1);
  const nonCurrentLiabilities = longTermDebt + otherNonCurrentLiabilities;
  const totalLiabilities = currentLiabilities + nonCurrentLiabilities;
  const shareCapital = useCy ? overlays.scClosing : bucket(rows, (i) => i.category === "Share Capital", -1);
  const retainedEarnings = useCy ? overlays.reClosing : bucket(rows, (i) => i.category === "Other Equity", -1);
  const equity = shareCapital + retainedEarnings;
  const totalDebt = shortTermDebt + longTermDebt;
  const capitalEmployed = equity + totalDebt;
  return { revenue, otherIncome, totalIncome, cogs, grossProfit, operatingExpenses: opex, operatingProfit, depreciation, interest, ebit, pbt, tax, netProfit, cash, receivables, inventory, otherCurrentAssets, currentAssets, nonCurrentAssets, totalAssets, payables, shortTermDebt, otherCurrentLiabilities, currentLiabilities, longTermDebt, otherNonCurrentLiabilities, nonCurrentLiabilities, totalLiabilities, shareCapital, retainedEarnings, equity, totalDebt, capitalEmployed };
}

export type RatiosBundle = { cy: RatioAggregates; py: RatioAggregates };

export function computeRatioAggregates(p: NetProfitInputs & { scOpening?: number; scClosing?: number; reOpening?: number; reClosing?: number }): RatiosBundle {
  const np = computeNetProfit(p);
  const stock = summarizeStock(p.closingStock);
  const depTotal = p.depreciation.reduce((s, d) => s + d.depreciation, 0);
  const prepaid = p.accruals.filter((a) => a.kind === "prepaid").reduce((s, a) => s + a.amount, 0);
  const accrued = p.accruals.filter((a) => a.kind === "accrued").reduce((s, a) => s + a.amount, 0);
  const intAdj = sumLedgerAdjByScheduleHeads(p.ledgerAdj, ["Bank Interest", "Interest on Unsecured Loans"]);
  const invCyClosing = bucket(p.cyRows, (i) => i.category2 === "Inventories", 1);
  const invPyClosing = bucket(p.pyRows, (i) => i.category2 === "Inventories", 1);
  const cy = aggregateOne(p.cyRows, np, true, { depTotal, prepaid, accrued, goodStock: stock.good || invCyClosing, invTbClosing: invCyClosing, intAdj, scClosing: p.scClosing ?? bucket(p.cyRows, (i) => i.category === "Share Capital", -1), reClosing: p.reClosing ?? bucket(p.cyRows, (i) => i.category === "Other Equity", -1) });
  const py = aggregateOne(p.pyRows, np, false, { depTotal: 0, prepaid: 0, accrued: 0, goodStock: invPyClosing, invTbClosing: invPyClosing, intAdj: 0, scClosing: p.scOpening ?? bucket(p.pyRows, (i) => i.category === "Share Capital", -1), reClosing: p.reOpening ?? bucket(p.pyRows, (i) => i.category === "Other Equity", -1) });
  return { cy, py };
}

export type RatioCategory = "Profitability" | "Liquidity" | "Leverage" | "Solvency" | "Efficiency";
export type RatioUnit = "percent" | "times" | "days";

export type RatioDef = {
  key: string;
  name: string;
  category: RatioCategory;
  unit: RatioUnit;
  formulaText: string;
  definition: string;
  interpretation: string;
  compute: (a: RatioAggregates) => { numerator: number; denominator: number; value: number };
  numeratorLines: (a: RatioAggregates) => Array<{ label: string; value: number }>;
  denominatorLines: (a: RatioAggregates) => Array<{ label: string; value: number }>;
};

const safe = (n: number, d: number) => (d === 0 ? NaN : n / d);

export const RATIOS: RatioDef[] = [
  { key: "gross-margin", name: "Gross Profit Margin", category: "Profitability", unit: "percent", formulaText: "Gross Profit / Revenue x 100", definition: "Share of revenue left after deducting the direct cost of goods sold. Measures pricing power and production efficiency before operating overheads.", interpretation: "Higher is better. A rising trend indicates improving pricing, product mix, or input-cost control. A fall flags margin pressure from input costs or discounting.", compute: (a) => ({ numerator: a.grossProfit, denominator: a.revenue, value: safe(a.grossProfit, a.revenue) * 100 }), numeratorLines: (a) => [{ label: "Revenue from operations", value: a.revenue }, { label: "Less: Cost of goods sold", value: -a.cogs }, { label: "Gross profit", value: a.grossProfit }], denominatorLines: (a) => [{ label: "Revenue from operations", value: a.revenue }] },
  { key: "operating-margin", name: "Operating Profit Margin", category: "Profitability", unit: "percent", formulaText: "Operating Profit / Revenue x 100", definition: "Earnings from core operations expressed as a percentage of revenue, after operating expenses and depreciation but before interest and tax.", interpretation: "Indicates how efficiently the business converts sales into operating earnings. Compare across periods to see whether overhead growth outpaces revenue.", compute: (a) => ({ numerator: a.operatingProfit, denominator: a.revenue, value: safe(a.operatingProfit, a.revenue) * 100 }), numeratorLines: (a) => [{ label: "Gross profit", value: a.grossProfit }, { label: "Add: Other income", value: a.otherIncome }, { label: "Less: Operating expenses", value: -a.operatingExpenses }, { label: "Less: Depreciation & amortisation", value: -a.depreciation }, { label: "Operating profit (EBIT proxy)", value: a.operatingProfit }], denominatorLines: (a) => [{ label: "Revenue from operations", value: a.revenue }] },
  { key: "net-margin", name: "Net Profit Margin", category: "Profitability", unit: "percent", formulaText: "Net Profit / Revenue x 100", definition: "Bottom-line profitability — the percentage of revenue retained as profit after every expense, interest and tax.", interpretation: "Captures overall earnings quality. A widening gap with operating margin signals heavy finance cost or high effective tax.", compute: (a) => ({ numerator: a.netProfit, denominator: a.revenue, value: safe(a.netProfit, a.revenue) * 100 }), numeratorLines: (a) => [{ label: "Profit before tax", value: a.pbt }, { label: "Less: Tax expense", value: -a.tax }, { label: "Net profit", value: a.netProfit }], denominatorLines: (a) => [{ label: "Revenue from operations", value: a.revenue }] },
  { key: "roa", name: "Return on Assets (ROA)", category: "Profitability", unit: "percent", formulaText: "Net Profit / Total Assets x 100", definition: "Profit generated per rupee of assets deployed. Measures how productively the asset base is being used.", interpretation: "Higher ROA = more output per rupee of assets. Watch for a falling ROA alongside rising assets — capacity may be outrunning demand.", compute: (a) => ({ numerator: a.netProfit, denominator: a.totalAssets, value: safe(a.netProfit, a.totalAssets) * 100 }), numeratorLines: (a) => [{ label: "Net profit", value: a.netProfit }], denominatorLines: (a) => [{ label: "Current assets", value: a.currentAssets }, { label: "Non-current assets", value: a.nonCurrentAssets }, { label: "Total assets", value: a.totalAssets }] },
  { key: "roe", name: "Return on Equity (ROE)", category: "Profitability", unit: "percent", formulaText: "Net Profit / Shareholders' Equity x 100", definition: "Return earned for every rupee of shareholders' funds — the single most-watched metric of owner returns.", interpretation: "Sustainably high ROE signals strong franchise economics. A jump in ROE driven purely by leverage is a risk flag — cross-check Debt-to-Equity.", compute: (a) => ({ numerator: a.netProfit, denominator: a.equity, value: safe(a.netProfit, a.equity) * 100 }), numeratorLines: (a) => [{ label: "Net profit", value: a.netProfit }], denominatorLines: (a) => [{ label: "Share capital", value: a.shareCapital }, { label: "Other equity / reserves", value: a.retainedEarnings }, { label: "Total equity", value: a.equity }] },
  { key: "roce", name: "Return on Capital Employed (ROCE)", category: "Profitability", unit: "percent", formulaText: "EBIT / (Equity + Total Debt) x 100", definition: "Pre-tax, pre-interest return on the long-term capital invested in the business — independent of capital structure.", interpretation: "Compare against the cost of capital. ROCE above the weighted cost of capital indicates value creation.", compute: (a) => ({ numerator: a.ebit, denominator: a.capitalEmployed, value: safe(a.ebit, a.capitalEmployed) * 100 }), numeratorLines: (a) => [{ label: "Profit before tax", value: a.pbt }, { label: "Add: Finance cost", value: a.interest }, { label: "EBIT", value: a.ebit }], denominatorLines: (a) => [{ label: "Total equity", value: a.equity }, { label: "Total debt (short + long term)", value: a.totalDebt }, { label: "Capital employed", value: a.capitalEmployed }] },
  { key: "current-ratio", name: "Current Ratio", category: "Liquidity", unit: "times", formulaText: "Current Assets / Current Liabilities", definition: "Short-term solvency — how many times current assets cover obligations falling due within twelve months.", interpretation: "A value of 1.5-2x is generally healthy. Below 1x signals stretched working capital; very high values may indicate idle cash or stale inventory.", compute: (a) => ({ numerator: a.currentAssets, denominator: a.currentLiabilities, value: safe(a.currentAssets, a.currentLiabilities) }), numeratorLines: (a) => [{ label: "Cash & cash equivalents", value: a.cash }, { label: "Trade receivables", value: a.receivables }, { label: "Inventories", value: a.inventory }, { label: "Other current assets", value: a.otherCurrentAssets }, { label: "Current assets", value: a.currentAssets }], denominatorLines: (a) => [{ label: "Trade payables", value: a.payables }, { label: "Short-term borrowings", value: a.shortTermDebt }, { label: "Other current liabilities", value: a.otherCurrentLiabilities }, { label: "Current liabilities", value: a.currentLiabilities }] },
  { key: "quick-ratio", name: "Quick (Acid-Test) Ratio", category: "Liquidity", unit: "times", formulaText: "(Current Assets - Inventory) / Current Liabilities", definition: "Stricter liquidity test — excludes inventory because it may not be quickly convertible to cash at book value.", interpretation: "Above 1x is comfortable. Materially below the current ratio indicates the business is inventory-heavy.", compute: (a) => ({ numerator: a.currentAssets - a.inventory, denominator: a.currentLiabilities, value: safe(a.currentAssets - a.inventory, a.currentLiabilities) }), numeratorLines: (a) => [{ label: "Current assets", value: a.currentAssets }, { label: "Less: Inventories", value: -a.inventory }, { label: "Quick assets", value: a.currentAssets - a.inventory }], denominatorLines: (a) => [{ label: "Current liabilities", value: a.currentLiabilities }] },
  { key: "cash-ratio", name: "Cash Ratio", category: "Liquidity", unit: "times", formulaText: "Cash & Equivalents / Current Liabilities", definition: "Most conservative liquidity measure — coverage of current liabilities using only cash and equivalents.", interpretation: "0.2-0.5x is typical for operating businesses. Persistently high cash ratio could indicate poor capital allocation.", compute: (a) => ({ numerator: a.cash, denominator: a.currentLiabilities, value: safe(a.cash, a.currentLiabilities) }), numeratorLines: (a) => [{ label: "Cash & cash equivalents", value: a.cash }], denominatorLines: (a) => [{ label: "Current liabilities", value: a.currentLiabilities }] },
  { key: "working-capital", name: "Net Working Capital / Revenue", category: "Liquidity", unit: "times", formulaText: "(Current Assets - Current Liabilities) / Revenue", definition: "Net working capital as a proportion of revenue — how much short-term funding the operating cycle consumes per rupee of sales.", interpretation: "Rising NWC/Revenue may indicate slowing receivable collection or building inventory. Falling values can be efficiency gains or a payables stretch.", compute: (a) => ({ numerator: a.currentAssets - a.currentLiabilities, denominator: a.revenue, value: safe(a.currentAssets - a.currentLiabilities, a.revenue) }), numeratorLines: (a) => [{ label: "Current assets", value: a.currentAssets }, { label: "Less: Current liabilities", value: -a.currentLiabilities }, { label: "Net working capital", value: a.currentAssets - a.currentLiabilities }], denominatorLines: (a) => [{ label: "Revenue from operations", value: a.revenue }] },
  { key: "de", name: "Debt-to-Equity", category: "Leverage", unit: "times", formulaText: "Total Debt / Total Equity", definition: "Capital-structure mix — how many rupees of interest-bearing debt support each rupee of equity.", interpretation: "Industry-dependent. Above 2x generally indicates aggressive leverage; below 0.5x may signal under-leverage and a higher cost of capital.", compute: (a) => ({ numerator: a.totalDebt, denominator: a.equity, value: safe(a.totalDebt, a.equity) }), numeratorLines: (a) => [{ label: "Short-term borrowings", value: a.shortTermDebt }, { label: "Long-term borrowings", value: a.longTermDebt }, { label: "Total debt", value: a.totalDebt }], denominatorLines: (a) => [{ label: "Total equity", value: a.equity }] },
  { key: "debt-assets", name: "Debt-to-Assets", category: "Leverage", unit: "percent", formulaText: "Total Debt / Total Assets x 100", definition: "Share of the asset base funded by interest-bearing debt — a creditor-side view of leverage.", interpretation: "Lenders generally prefer below 50%. Rising values without a matching rise in earnings power increase refinancing risk.", compute: (a) => ({ numerator: a.totalDebt, denominator: a.totalAssets, value: safe(a.totalDebt, a.totalAssets) * 100 }), numeratorLines: (a) => [{ label: "Total debt", value: a.totalDebt }], denominatorLines: (a) => [{ label: "Total assets", value: a.totalAssets }] },
  { key: "equity-mult", name: "Equity Multiplier", category: "Leverage", unit: "times", formulaText: "Total Assets / Total Equity", definition: "Total assets supported by each rupee of equity — the leverage lever in the DuPont decomposition of ROE.", interpretation: "A higher multiplier amplifies ROE but also amplifies downside in lean years.", compute: (a) => ({ numerator: a.totalAssets, denominator: a.equity, value: safe(a.totalAssets, a.equity) }), numeratorLines: (a) => [{ label: "Total assets", value: a.totalAssets }], denominatorLines: (a) => [{ label: "Total equity", value: a.equity }] },
  { key: "financial-leverage", name: "Financial Leverage", category: "Leverage", unit: "percent", formulaText: "Total Liabilities / Total Assets x 100", definition: "Share of assets funded by all liabilities (not just borrowings) — payables, accruals and debt.", interpretation: "Complements debt-to-assets by including non-interest-bearing liabilities. Useful for working-capital-heavy businesses.", compute: (a) => ({ numerator: a.totalLiabilities, denominator: a.totalAssets, value: safe(a.totalLiabilities, a.totalAssets) * 100 }), numeratorLines: (a) => [{ label: "Current liabilities", value: a.currentLiabilities }, { label: "Non-current liabilities", value: a.nonCurrentLiabilities }, { label: "Total liabilities", value: a.totalLiabilities }], denominatorLines: (a) => [{ label: "Total assets", value: a.totalAssets }] },
  { key: "interest-coverage", name: "Interest Coverage Ratio", category: "Solvency", unit: "times", formulaText: "EBIT / Interest Expense", definition: "How many times operating earnings cover the finance cost falling due in the year — the primary indicator of debt-servicing capacity.", interpretation: "Above 3x is generally comfortable. Below 1.5x indicates earnings volatility could threaten interest payments.", compute: (a) => ({ numerator: a.ebit, denominator: a.interest, value: safe(a.ebit, a.interest) }), numeratorLines: (a) => [{ label: "Profit before tax", value: a.pbt }, { label: "Add: Finance cost", value: a.interest }, { label: "EBIT", value: a.ebit }], denominatorLines: (a) => [{ label: "Finance cost (Interest)", value: a.interest }] },
  { key: "equity-ratio", name: "Equity Ratio", category: "Solvency", unit: "percent", formulaText: "Total Equity / Total Assets x 100", definition: "Proportion of assets owned outright by shareholders. The mirror image of financial leverage.", interpretation: "Higher equity ratio = stronger solvency cushion. Trends downward suggest growing reliance on creditors.", compute: (a) => ({ numerator: a.equity, denominator: a.totalAssets, value: safe(a.equity, a.totalAssets) * 100 }), numeratorLines: (a) => [{ label: "Total equity", value: a.equity }], denominatorLines: (a) => [{ label: "Total assets", value: a.totalAssets }] },
  { key: "ltd-cap", name: "Long-Term Debt to Capital", category: "Solvency", unit: "percent", formulaText: "Long-Term Debt / (Long-Term Debt + Equity) x 100", definition: "Share of permanent capital provided by long-term lenders — focused solvency metric ignoring short-term funding.", interpretation: "Stable, low values indicate a conservative capital structure. Sudden increases need to be matched by an EBIT uplift.", compute: (a) => { const denom = a.longTermDebt + a.equity; return { numerator: a.longTermDebt, denominator: denom, value: safe(a.longTermDebt, denom) * 100 }; }, numeratorLines: (a) => [{ label: "Long-term borrowings", value: a.longTermDebt }], denominatorLines: (a) => [{ label: "Long-term borrowings", value: a.longTermDebt }, { label: "Total equity", value: a.equity }, { label: "Permanent capital", value: a.longTermDebt + a.equity }] },
  { key: "debt-ebitda", name: "Debt to EBITDA", category: "Solvency", unit: "times", formulaText: "Total Debt / (EBIT + Depreciation)", definition: "Years of operating cash flow (proxied by EBITDA) needed to retire all debt at current earnings power.", interpretation: "Below 3x is comfortable for most industries; above 4x typically attracts lender covenants.", compute: (a) => { const ebitda = a.ebit + a.depreciation; return { numerator: a.totalDebt, denominator: ebitda, value: safe(a.totalDebt, ebitda) }; }, numeratorLines: (a) => [{ label: "Total debt", value: a.totalDebt }], denominatorLines: (a) => [{ label: "EBIT", value: a.ebit }, { label: "Add: Depreciation & amortisation", value: a.depreciation }, { label: "EBITDA", value: a.ebit + a.depreciation }] },
  { key: "dso", name: "Days Sales Outstanding (DSO)", category: "Efficiency", unit: "days", formulaText: "(Trade Receivables / Revenue) x 365", definition: "Average number of days the business waits to collect cash after a credit sale.", interpretation: "Lower is better. A rising DSO signals weaker collections or relaxed credit terms — a leading indicator of working-capital stress.", compute: (a) => ({ numerator: a.receivables, denominator: a.revenue, value: safe(a.receivables, a.revenue) * 365 }), numeratorLines: (a) => [{ label: "Trade receivables", value: a.receivables }], denominatorLines: (a) => [{ label: "Revenue from operations", value: a.revenue }] },
  { key: "dio", name: "Days Inventory Outstanding (DIO)", category: "Efficiency", unit: "days", formulaText: "(Inventory / COGS) x 365", definition: "Average number of days inventory is held before it is sold.", interpretation: "Lower is better. A rising DIO points to slow-moving stock or over-buying; very low DIO may risk stock-outs.", compute: (a) => ({ numerator: a.inventory, denominator: a.cogs, value: safe(a.inventory, a.cogs) * 365 }), numeratorLines: (a) => [{ label: "Inventories (closing)", value: a.inventory }], denominatorLines: (a) => [{ label: "Cost of goods sold", value: a.cogs }] },
  { key: "dpo", name: "Days Payable Outstanding (DPO)", category: "Efficiency", unit: "days", formulaText: "(Trade Payables / COGS) x 365", definition: "Average number of days the business takes to pay its trade suppliers.", interpretation: "Higher DPO frees up working capital, but stretching suppliers too far can harm credit terms and supply continuity.", compute: (a) => ({ numerator: a.payables, denominator: a.cogs, value: safe(a.payables, a.cogs) * 365 }), numeratorLines: (a) => [{ label: "Trade payables", value: a.payables }], denominatorLines: (a) => [{ label: "Cost of goods sold", value: a.cogs }] },
  { key: "operating-cycle", name: "Operating Cycle", category: "Efficiency", unit: "days", formulaText: "DIO + DSO", definition: "Total time, in days, from purchasing inventory to collecting cash from the resulting sale.", interpretation: "Shorter is better — capital is locked in the operating cycle for less time. Compare against industry norms.", compute: (a) => { const dio = safe(a.inventory, a.cogs) * 365; const dso = safe(a.receivables, a.revenue) * 365; const value = (isFinite(dio) ? dio : 0) + (isFinite(dso) ? dso : 0); return { numerator: value, denominator: 1, value }; }, numeratorLines: (a) => [{ label: "Days Inventory Outstanding (DIO)", value: Math.round(safe(a.inventory, a.cogs) * 365) }, { label: "Days Sales Outstanding (DSO)", value: Math.round(safe(a.receivables, a.revenue) * 365) }], denominatorLines: () => [{ label: "(sum of days — no denominator)", value: 1 }] },
  { key: "ccc", name: "Cash Conversion Cycle (CCC)", category: "Efficiency", unit: "days", formulaText: "DIO + DSO - DPO", definition: "Net number of days cash is tied up in the operating cycle, after accounting for credit taken from suppliers.", interpretation: "Lower is better; a negative CCC means suppliers effectively finance the business. A rising CCC warns of growing working-capital needs.", compute: (a) => { const dio = safe(a.inventory, a.cogs) * 365; const dso = safe(a.receivables, a.revenue) * 365; const dpo = safe(a.payables, a.cogs) * 365; const value = (isFinite(dio) ? dio : 0) + (isFinite(dso) ? dso : 0) - (isFinite(dpo) ? dpo : 0); return { numerator: value, denominator: 1, value }; }, numeratorLines: (a) => [{ label: "Days Inventory Outstanding (DIO)", value: Math.round(safe(a.inventory, a.cogs) * 365) }, { label: "Days Sales Outstanding (DSO)", value: Math.round(safe(a.receivables, a.revenue) * 365) }, { label: "Less: Days Payable Outstanding (DPO)", value: -Math.round(safe(a.payables, a.cogs) * 365) }], denominatorLines: () => [{ label: "(net of days — no denominator)", value: 1 }] },
];

export function formatRatio(value: number, unit: RatioUnit) {
  if (!isFinite(value)) return "—";
  if (unit === "percent") return value.toFixed(2) + "%";
  if (unit === "days") return value.toFixed(0) + " days";
  return value.toFixed(2) + "x";
}

export function deltaPct(cy: number, py: number) {
  if (!isFinite(cy) || !isFinite(py) || py === 0) return NaN;
  return ((cy - py) / Math.abs(py)) * 100;
}
