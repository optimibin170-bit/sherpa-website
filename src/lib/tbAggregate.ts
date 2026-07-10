import { COA } from "@/data/coa";
import { rowNet, type TBRow } from "@/store/trialBalance";

export type SchedInfo = {
  classification: "Assets" | "Liabilities" | "PL";
  parent: string;
  category: string;
  category2: string;
};

const schedMap: Map<string, SchedInfo> = (() => {
  const m = new Map<string, SchedInfo>();
  for (const a of COA) {
    const key = a.scheduleHead.trim().toLowerCase();
    if (!m.has(key)) {
      m.set(key, { classification: a.classification, parent: a.parent, category: a.category, category2: a.category2 });
    }
  }
  return m;
})();

export function lookupSchedule(scheduleHead: string): SchedInfo | undefined {
  return schedMap.get((scheduleHead || "").trim().toLowerCase());
}

export function registerSchedule(scheduleHead: string, info: SchedInfo) {
  schedMap.set(scheduleHead.trim().toLowerCase(), info);
}

export function classifyRows(rows: TBRow[]) {
  return rows.map((r) => ({ ...r, info: lookupSchedule(r.scheduleHead) }));
}

export type GroupSum = { key: string; label: string; net: number; rows: Array<TBRow & { info?: SchedInfo }> };

export function groupBy(rows: Array<TBRow & { info?: SchedInfo }>, pick: (r: TBRow & { info?: SchedInfo }) => string) {
  const groups = new Map<string, GroupSum>();
  for (const r of rows) {
    const key = pick(r) || "Unmapped";
    if (!groups.has(key)) groups.set(key, { key, label: key, net: 0, rows: [] });
    const g = groups.get(key)!;
    g.net += rowNet(r);
    g.rows.push(r);
  }
  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function sumByCategory2(rows: TBRow[]) {
  const mapped = classifyRows(rows);
  const out: Record<string, number> = {};
  for (const r of mapped) {
    const k = r.info?.category2 ?? "Unmapped";
    out[k] = (out[k] ?? 0) + rowNet(r);
  }
  return out;
}

export function sumByClassification(rows: TBRow[]) {
  const mapped = classifyRows(rows);
  const out = { Assets: 0, Liabilities: 0, PL: 0, Unmapped: 0 } as Record<string, number>;
  for (const r of mapped) {
    const k = r.info?.classification ?? "Unmapped";
    out[k] = (out[k] ?? 0) + rowNet(r);
  }
  return out;
}

export type LedgerDrill = { accountName: string; scheduleHead: string; category2: string; cy: number; py: number };

export function ledgersByCategory2(cyRows: TBRow[], pyRows: TBRow[], keys: string[], sign: 1 | -1 = 1): LedgerDrill[] {
  const set = new Set(keys.map((k) => k.toLowerCase()));
  const matches = (r: TBRow) => { const info = lookupSchedule(r.scheduleHead); return set.has((info?.category2 ?? "Unmapped").toLowerCase()); };
  const map = new Map<string, LedgerDrill>();
  for (const r of cyRows) {
    if (!matches(r)) continue;
    const info = lookupSchedule(r.scheduleHead);
    const k = r.accountName.trim();
    const existing = map.get(k) ?? { accountName: r.accountName, scheduleHead: r.scheduleHead, category2: info?.category2 ?? "Unmapped", cy: 0, py: 0 };
    existing.cy += rowNet(r) * sign;
    map.set(k, existing);
  }
  for (const r of pyRows) {
    if (!matches(r)) continue;
    const info = lookupSchedule(r.scheduleHead);
    const k = r.accountName.trim();
    const existing = map.get(k) ?? { accountName: r.accountName, scheduleHead: r.scheduleHead, category2: info?.category2 ?? "Unmapped", cy: 0, py: 0 };
    existing.py += rowNet(r) * sign;
    map.set(k, existing);
  }
  return [...map.values()].filter((l) => l.cy !== 0 || l.py !== 0).sort((a, b) => Math.abs(b.cy) - Math.abs(a.cy));
}

export type LedgerTB = { accountName: string; scheduleHead: string; opening: number; additions: number; credits: number; closing: number };

export function tbByScheduleHead(rows: TBRow[], heads: string[]): LedgerTB[] {
  const set = new Set(heads.map((h) => h.trim().toLowerCase()));
  const map = new Map<string, LedgerTB>();
  for (const r of rows) {
    if (!set.has((r.scheduleHead || "").trim().toLowerCase())) continue;
    const k = r.accountName.trim();
    const e = map.get(k) ?? { accountName: r.accountName, scheduleHead: r.scheduleHead, opening: 0, additions: 0, credits: 0, closing: 0 };
    e.opening += (r.openingDr || 0) - (r.openingCr || 0);
    e.additions += r.debit || 0;
    e.credits += r.credit || 0;
    e.closing += (r.closingDr || 0) - (r.closingCr || 0);
    map.set(k, e);
  }
  return [...map.values()].sort((a, b) => Math.abs(b.closing) - Math.abs(a.closing));
}

export function tbScheduleTotals(rows: TBRow[], heads: string[]) {
  const list = tbByScheduleHead(rows, heads);
  return list.reduce((s, l) => ({ opening: s.opening + l.opening, additions: s.additions + l.additions, credits: s.credits + l.credits, closing: s.closing + l.closing }), { opening: 0, additions: 0, credits: 0, closing: 0 });
}
