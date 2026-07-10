import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TBRow = {
  scheduleHead: string;
  accountName: string;
  openingDr: number;
  openingCr: number;
  debit: number;
  credit: number;
  closingDr: number;
  closingCr: number;
};

export type TBPeriod = "cy" | "py";

export type PeriodMode = "fy" | "range";
export type PeriodInfo = {
  label: string;
  fy?: string;
  from?: string;
  to?: string;
};

export type TBMaster = {
  companyName: string;
  mode: PeriodMode;
  cyFY: string;
  cyFrom: string;
  cyTo: string;
  cy: PeriodInfo;
  py: PeriodInfo;
};

const DEFAULT_MASTER: TBMaster = {
  companyName: "",
  mode: "fy",
  cyFY: "",
  cyFrom: "",
  cyTo: "",
  cy: { label: "Current Year" },
  py: { label: "Prior Year" },
};

type TBState = {
  master: TBMaster;
  cy: { fileName?: string; uploadedAt?: string; rows: TBRow[] };
  py: { fileName?: string; uploadedAt?: string; rows: TBRow[] };
  setMaster: (input: { companyName: string; mode: PeriodMode; cyFY: string; cyFrom: string; cyTo: string }) => boolean;
  clearMaster: () => void;
  setTB: (period: TBPeriod, fileName: string, rows: TBRow[]) => void;
  clear: (period: TBPeriod) => void;
};

export const useTrialBalance = create<TBState>()(
  persist(
    (set) => ({
      master: DEFAULT_MASTER,
      cy: { rows: [] },
      py: { rows: [] },
      setMaster: (input) => {
        const derived = derivePeriods(input.mode, input.cyFY, input.cyFrom, input.cyTo);
        if (!derived) return false;
        set((s) => ({ ...s, master: { ...input, cy: derived.cy, py: derived.py } }));
        return true;
      },
      clearMaster: () => set((s) => ({ ...s, master: DEFAULT_MASTER })),
      setTB: (period, fileName, rows) =>
        set((s) => ({ ...s, [period]: { fileName, uploadedAt: new Date().toISOString(), rows } })),
      clear: (period) => set((s) => ({ ...s, [period]: { rows: [] } })),
    }),
    { name: "finstate.tb.v2" },
  ),
);

export function rowNet(r: TBRow) {
  return (r.closingDr || 0) - (r.closingCr || 0);
}

export function rowOpening(r: TBRow) {
  return (r.openingDr || 0) - (r.openingCr || 0);
}

export function tbTotals(rows: TBRow[]) {
  let dr = 0;
  let cr = 0;
  for (const r of rows) {
    dr += r.closingDr || 0;
    cr += r.closingCr || 0;
  }
  return { dr, cr, diff: dr - cr };
}

function parseFyStart(fy: string): number | null {
  const m = fy.trim().match(/^(\d{4})[\/\-](\d{2,4})$/);
  if (!m) return null;
  return Number(m[1]);
}

function fyLabel(start: number, suffixWidth: 2 | 4 = 2): string {
  const end = start + 1;
  const suffix = suffixWidth === 4 ? String(end) : String(end).slice(-2);
  return `${start}-${suffix}`;
}

function priorFY(fy: string): string | null {
  const start = parseFyStart(fy);
  if (start == null) return null;
  const suffix = fy.split(/[\/\-]/)[1] ?? "";
  return fyLabel(start - 1, suffix.length === 4 ? 4 : 2);
}

function priorRange(fromISO: string, toISO: string): { from: string; to: string } | null {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  if (isNaN(from.getTime()) || isNaN(to.getTime()) || to < from) return null;
  const dayMs = 24 * 60 * 60 * 1000;
  const spanDays = Math.round((to.getTime() - from.getTime()) / dayMs) + 1;
  const pyTo = new Date(from.getTime() - dayMs);
  const pyFrom = new Date(pyTo.getTime() - (spanDays - 1) * dayMs);
  const toISOStr = (d: Date) => d.toISOString().slice(0, 10);
  return { from: toISOStr(pyFrom), to: toISOStr(pyTo) };
}

function formatRange(fromISO?: string, toISO?: string): string {
  if (!fromISO || !toISO) return "";
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  return `${fmt(fromISO)} – ${fmt(toISO)}`;
}

function derivePeriods(mode: PeriodMode, cyFY: string, cyFrom: string, cyTo: string): { cy: PeriodInfo; py: PeriodInfo } | null {
  if (mode === "fy") {
    if (!cyFY) return null;
    const py = priorFY(cyFY);
    if (!py) return null;
    return { cy: { label: `FY ${cyFY}`, fy: cyFY }, py: { label: `FY ${py}`, fy: py } };
  }
  if (!cyFrom || !cyTo) return null;
  const py = priorRange(cyFrom, cyTo);
  if (!py) return null;
  return { cy: { label: formatRange(cyFrom, cyTo), from: cyFrom, to: cyTo }, py: { label: formatRange(py.from, py.to), from: py.from, to: py.to } };
}
