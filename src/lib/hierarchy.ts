import { rowNet, rowOpening, type TBRow } from "@/store/trialBalance";
import { lookupSchedule } from "./tbAggregate";

export type HNode = {
  key: string;
  label: string;
  level: number;
  op: number;
  cy: number;
  py: number;
  children: HNode[];
};

export type HFilterInfo = { classification: string; parent: string; category: string; category2: string };

export function buildHierarchy(opts: { cyRows: TBRow[]; pyRows: TBRow[]; filter: (info: HFilterInfo) => boolean; sign: 1 | -1; excludeScheduleHeads?: string[] }): HNode[] {
  const excluded = new Set((opts.excludeScheduleHeads ?? []).map((h) => h.trim().toLowerCase()));
  type Bag = { label: string; level: number; op: number; cy: number; py: number; children: Map<string, Bag> };
  const root: Bag = { label: "", level: -1, op: 0, cy: 0, py: 0, children: new Map() };

  const addRow = (r: TBRow, kind: "cy" | "py") => {
    if (excluded.has((r.scheduleHead || "").trim().toLowerCase())) return;
    const info = lookupSchedule(r.scheduleHead);
    if (!info) return;
    if (!opts.filter({ classification: info.classification, parent: info.parent, category: info.category, category2: info.category2 })) return;
    const path = [info.classification, info.parent, info.category, info.category2, r.scheduleHead, r.accountName];
    const closing = rowNet(r) * opts.sign;
    const opening = rowOpening(r) * opts.sign;
    let cur = root;
    path.forEach((seg, i) => {
      let next = cur.children.get(seg);
      if (!next) {
        next = { label: seg, level: i, op: 0, cy: 0, py: 0, children: new Map() };
        cur.children.set(seg, next);
      }
      if (kind === "py") next.py += closing;
      else { next.cy += closing; next.op += opening; }
      cur = next;
    });
  };

  opts.cyRows.forEach((r) => addRow(r, "cy"));
  opts.pyRows.forEach((r) => addRow(r, "py"));

  const toNode = (b: Bag, keyPath: string): HNode => ({
    key: keyPath,
    label: b.label,
    level: b.level,
    op: b.op,
    cy: b.cy,
    py: b.py,
    children: [...b.children.entries()].map(([k, v]) => toNode(v, `${keyPath}/${k}`)).sort((a, z) => Math.abs(z.cy) - Math.abs(a.cy)),
  });

  return [...root.children.entries()].map(([k, v]) => toNode(v, k)).filter((n) => n.op !== 0 || n.cy !== 0 || n.py !== 0 || n.children.length > 0);
}

export function sumNodes(nodes: HNode[]): { op: number; cy: number; py: number } {
  return nodes.reduce((s, n) => ({ op: s.op + n.op, cy: s.cy + n.cy, py: s.py + n.py }), { op: 0, cy: 0, py: 0 });
}
