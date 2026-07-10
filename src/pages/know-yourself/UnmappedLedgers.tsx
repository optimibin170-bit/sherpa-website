import { formatNPR } from "@/lib/format";
import type { UnmappedRow } from "@/lib/unmapped";

export function UnmappedLedgers({ rows, cyLabel, pyLabel, title = "Unmapped ledgers", subtitle = "Ledgers in the trial balance that are not included in this statement because their schedule head is not registered in the Chart of Accounts." }: {
  rows: UnmappedRow[]; cyLabel: string; pyLabel: string; title?: string; subtitle?: string;
}) {
  if (!rows.length) return null;
  return (
    <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5">
      <header className="border-b border-destructive/20 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-destructive" />
          <h3 className="font-display text-lg">{title}</h3>
          <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-xs text-destructive">{rows.length}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </header>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-6 py-3 text-left">Account</th>
            <th className="px-3 py-3 text-left">Schedule head (as in TB)</th>
            <th className="w-44 px-6 py-3 text-right">{cyLabel}</th>
            <th className="w-44 px-6 py-3 text-right text-muted-foreground/80">{pyLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/30">
              <td className="px-6 py-2 text-foreground/90">{r.accountName}</td>
              <td className="px-3 py-2 text-muted-foreground">{r.scheduleHead}</td>
              <td className="px-6 py-2 text-right tabular">{formatNPR(r.cy)}</td>
              <td className="px-6 py-2 text-right tabular text-muted-foreground">{formatNPR(r.py)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
