// Period master helpers: fiscal-year presets and custom date ranges.
// Supports Nepali-style "2082-83" style FY strings AND arbitrary from/to dates.

export type PeriodMode = "fy" | "range";

export type PeriodInfo = {
  label: string;         // display label, e.g. "FY 2082-83" or "1 Apr 2024 – 31 Mar 2025"
  fy?: string;           // fiscal year string when mode = fy
  from?: string;         // ISO date when mode = range
  to?: string;           // ISO date when mode = range
};

/** Parse an FY label like "2082-83" or "2024-25" and return the numeric start year. */
function parseFyStart(fy: string): number | null {
  const m = fy.trim().match(/^(\d{4})[\/\-](\d{2,4})$/);
  if (!m) return null;
  return Number(m[1]);
}

/** Build FY label from start year, matching the input's suffix width. */
function fyLabel(start: number, suffixWidth: 2 | 4 = 2): string {
  const end = start + 1;
  const suffix = suffixWidth === 4 ? String(end) : String(end).slice(-2);
  return `${start}-${suffix}`;
}

/** Given a CY fiscal year label, return the prior FY label. */
export function priorFY(fy: string): string | null {
  const start = parseFyStart(fy);
  if (start == null) return null;
  const suffix = fy.split(/[\/\-]/)[1] ?? "";
  return fyLabel(start - 1, suffix.length === 4 ? 4 : 2);
}

/** Given a CY date range, return the prior period of equal length immediately before. */
export function priorRange(fromISO: string, toISO: string): { from: string; to: string } | null {
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

export function formatRange(fromISO?: string, toISO?: string): string {
  if (!fromISO || !toISO) return "";
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  return `${fmt(fromISO)} – ${fmt(toISO)}`;
}

/** Build the CY + PY PeriodInfo pair from a master config. */
export function derivePeriods(
  mode: PeriodMode,
  cyFY: string,
  cyFrom: string,
  cyTo: string,
): { cy: PeriodInfo; py: PeriodInfo } | null {
  if (mode === "fy") {
    if (!cyFY) return null;
    const py = priorFY(cyFY);
    if (!py) return null;
    return {
      cy: { label: `FY ${cyFY}`, fy: cyFY },
      py: { label: `FY ${py}`, fy: py },
    };
  }
  if (!cyFrom || !cyTo) return null;
  const py = priorRange(cyFrom, cyTo);
  if (!py) return null;
  return {
    cy: { label: formatRange(cyFrom, cyTo), from: cyFrom, to: cyTo },
    py: { label: formatRange(py.from, py.to), from: py.from, to: py.to },
  };
}
