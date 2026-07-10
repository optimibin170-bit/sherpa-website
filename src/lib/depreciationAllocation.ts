import type { TBRow } from "@/store/trialBalance";
import { lookupSchedule } from "./tbAggregate";

const ACCUM_RE = /accum(ulated)?\s+(depreciation|amortization|amortisation)/i;
const TARGET_CATEGORIES = new Set(["Property, Plant and Equipment", "Intangible assets"]);

function grossNet(r: TBRow) { return (r.closingDr || 0) - (r.closingCr || 0); }
function grossOpen(r: TBRow) { return (r.openingDr || 0) - (r.openingCr || 0); }

export function allocateAccumDepreciation(rows: TBRow[]): TBRow[] {
  type Bucket = { gross: TBRow[]; accum: TBRow[] };
  const buckets = new Map<string, Bucket>();
  const passthrough: TBRow[] = [];
  for (const r of rows) {
    const info = lookupSchedule(r.scheduleHead);
    if (!info || !TARGET_CATEGORIES.has(info.category)) { passthrough.push(r); continue; }
    const key = info.category;
    const b = buckets.get(key) ?? { gross: [], accum: [] };
    if (ACCUM_RE.test(r.accountName)) b.accum.push(r);
    else b.gross.push(r);
    buckets.set(key, b);
  }
  const out: TBRow[] = [...passthrough];
  for (const [, b] of buckets) {
    if (b.accum.length === 0) { out.push(...b.gross); continue; }
    const accumOpen = b.accum.reduce((s, r) => s + ((r.openingCr || 0) - (r.openingDr || 0)), 0);
    const accumClose = b.accum.reduce((s, r) => s + ((r.closingCr || 0) - (r.closingDr || 0)), 0);
    const weightsClose = b.gross.map((r) => Math.abs(grossNet(r)));
    const weightsOpen = b.gross.map((r) => Math.abs(grossOpen(r)));
    const totalClose = weightsClose.reduce((s, v) => s + v, 0);
    const totalOpen = weightsOpen.reduce((s, v) => s + v, 0);
    if (b.gross.length === 0 || (totalClose === 0 && totalOpen === 0)) { out.push(...b.gross, ...b.accum); continue; }
    b.gross.forEach((r, i) => {
      const shareClose = totalClose > 0 ? (weightsClose[i] / totalClose) * accumClose : 0;
      const shareOpen = totalOpen > 0 ? (weightsOpen[i] / totalOpen) * accumOpen : 0;
      out.push({ ...r, openingCr: (r.openingCr || 0) + shareOpen, closingCr: (r.closingCr || 0) + shareClose });
    });
  }
  return out;
}
