import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StockBucket = "good" | "expiry" | "defect";
export type ClosingStockEntry = { id: string; item: string; bucket: StockBucket; value: number; notes?: string };
export type DepreciationEntry = { id: string; asset: string; scheduleHead: string; rate: number; opening: number; additions: number; depreciation: number };
export type AccrualEntry = { id: string; accountName: string; kind: "prepaid" | "accrued"; amount: number; notes?: string };
export type LedgerAdjustment = { id: string; scheduleHead: string; accountName: string; amount: number; notes?: string };
export type CogsOverride = { openingInventory: number | null; purchases: number | null; directExpenses: number | null };
export type EquityState = {
  shareCapital: { opening: number | null; closing: number | null };
  retainedEarnings: { opening: number | null; adjustments: number; note?: string };
};

type AdjState = {
  closingStock: ClosingStockEntry[];
  depreciation: DepreciationEntry[];
  accruals: AccrualEntry[];
  ledgerAdj: LedgerAdjustment[];
  cogs: CogsOverride;
  equity: EquityState;
  addStock: (e: Omit<ClosingStockEntry, "id">) => void;
  removeStock: (id: string) => void;
  addDep: (e: Omit<DepreciationEntry, "id">) => void;
  removeDep: (id: string) => void;
  addAccrual: (e: Omit<AccrualEntry, "id">) => void;
  removeAccrual: (id: string) => void;
  setLedgerAdj: (e: LedgerAdjustment) => void;
  removeLedgerAdj: (id: string) => void;
  setCogs: (e: Partial<CogsOverride>) => void;
  resetCogs: () => void;
  setShareCapital: (e: Partial<EquityState["shareCapital"]>) => void;
  setRetainedEarnings: (e: Partial<EquityState["retainedEarnings"]>) => void;
  resetEquity: () => void;
  reset: () => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

const EMPTY_EQUITY: EquityState = {
  shareCapital: { opening: null, closing: null },
  retainedEarnings: { opening: null, adjustments: 0, note: "" },
};

export const useAdjustments = create<AdjState>()(
  persist(
    (set) => ({
      closingStock: [],
      depreciation: [],
      accruals: [],
      ledgerAdj: [],
      cogs: { openingInventory: null, purchases: null, directExpenses: null },
      equity: EMPTY_EQUITY,
      addStock: (e) => set((s) => ({ closingStock: [...s.closingStock, { ...e, id: uid() }] })),
      removeStock: (id) => set((s) => ({ closingStock: s.closingStock.filter((x) => x.id !== id) })),
      addDep: (e) => set((s) => ({ depreciation: [...s.depreciation, { ...e, id: uid() }] })),
      removeDep: (id) => set((s) => ({ depreciation: s.depreciation.filter((x) => x.id !== id) })),
      addAccrual: (e) => set((s) => ({ accruals: [...s.accruals, { ...e, id: uid() }] })),
      removeAccrual: (id) => set((s) => ({ accruals: s.accruals.filter((x) => x.id !== id) })),
      setLedgerAdj: (e) =>
        set((s) => {
          const rest = s.ledgerAdj.filter((x) => x.id !== e.id);
          if (!e.amount && !e.notes) return { ledgerAdj: rest };
          return { ledgerAdj: [...rest, e] };
        }),
      removeLedgerAdj: (id) => set((s) => ({ ledgerAdj: s.ledgerAdj.filter((x) => x.id !== id) })),
      setCogs: (e) => set((s) => ({ cogs: { ...s.cogs, ...e } })),
      resetCogs: () => set({ cogs: { openingInventory: null, purchases: null, directExpenses: null } }),
      setShareCapital: (e) => set((s) => ({ equity: { ...s.equity, shareCapital: { ...s.equity.shareCapital, ...e } } })),
      setRetainedEarnings: (e) => set((s) => ({ equity: { ...s.equity, retainedEarnings: { ...s.equity.retainedEarnings, ...e } } })),
      resetEquity: () => set({ equity: EMPTY_EQUITY }),
      reset: () => set({ closingStock: [], depreciation: [], accruals: [], ledgerAdj: [], cogs: { openingInventory: null, purchases: null, directExpenses: null }, equity: EMPTY_EQUITY }),
    }),
    { name: "finstate.adjustments.v4" },
  ),
);

export function summarizeStock(stock: ClosingStockEntry[]) {
  const totals = { good: 0, expiry: 0, defect: 0 };
  for (const s of stock) totals[s.bucket] += s.value;
  return { ...totals, closingInventory: totals.good, writtenOff: totals.expiry + totals.defect, total: totals.good + totals.expiry + totals.defect };
}

export function sumLedgerAdjByScheduleHeads(adj: LedgerAdjustment[], heads: string[]) {
  const set = new Set(heads.map((h) => h.trim().toLowerCase()));
  return adj.reduce((s, a) => (set.has((a.scheduleHead || "").trim().toLowerCase()) ? s + (a.amount || 0) : s), 0);
}
