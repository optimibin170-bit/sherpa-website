import { rowNet, rowOpening, type TBRow } from "@/store/trialBalance";
import { lookupSchedule } from "./tbAggregate";

export type UnmappedRow = { scheduleHead: string; accountName: string; cy: number; py: number; opening: number; reason: string };

export function findUnmappedRows(cyRows: TBRow[], pyRows: TBRow[], extraFilter?: (r: TBRow) => boolean): UnmappedRow[] {
  const map = new Map<string, UnmappedRow>();
  const bump = (r: TBRow, kind: "cy" | "py") => {
    const info = lookupSchedule(r.scheduleHead);
    const isUnmapped = !info;
    if (!isUnmapped && !(extraFilter && extraFilter(r))) return;
    const reason = !info ? `Schedule head "${r.scheduleHead || "(blank)"}" is not mapped in the Chart of Accounts` : "Excluded from statements";
    const key = `${r.scheduleHead}::${r.accountName}`;
    const existing = map.get(key) ?? { scheduleHead: r.scheduleHead || "(blank)", accountName: r.accountName, cy: 0, py: 0, opening: 0, reason };
    if (kind === "cy") { existing.cy += rowNet(r); existing.opening += rowOpening(r); }
    else { existing.py += rowNet(r); }
    map.set(key, existing);
  };
  cyRows.forEach((r) => bump(r, "cy"));
  pyRows.forEach((r) => bump(r, "py"));
  return [...map.values()].filter((r) => r.cy !== 0 || r.py !== 0 || r.opening !== 0).sort((a, z) => Math.abs(z.cy) - Math.abs(a.cy));
}
