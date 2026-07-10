import { useState, type ReactNode } from "react";
import { formatNPR } from "@/lib/format";
import { ChevronRight } from "lucide-react";
import type { LedgerDrill } from "@/lib/tbAggregate";

export type Line = { label: string; cy?: number; py?: number; emphasis?: "header" | "subtotal" | "total" | "normal"; note?: string; indent?: number; drill?: LedgerDrill[] };

export function StatementTable({ title, subtitle, lines, cyLabel = "FY 2083-84", pyLabel = "FY 2082-83" }: {
  title: string; subtitle?: string; lines: Line[]; cyLabel?: string; pyLabel?: string;
}) {
  return (
    <div className="rounded-xl border bg-card">
      <header className="border-b px-6 py-5">
        <h2 className="font-display text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3 text-left">Particulars</th>
              <th className="w-20 px-3 py-3 text-right">Note</th>
              <th className="w-44 px-6 py-3 text-right">{cyLabel}</th>
              <th className="w-44 px-6 py-3 text-right text-muted-foreground/80">{pyLabel}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => <StatementRow key={i} line={l} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatementRow({ line }: { line: Line }) {
  const emphasis = line.emphasis ?? "normal";
  const [open, setOpen] = useState(false);
  const cls: Record<string, string> = { header: "bg-muted/40 font-display text-foreground", subtotal: "border-t-2 border-foreground/20 font-medium", total: "border-t-2 border-foreground font-display text-base", normal: "" };
  const isAmount = emphasis !== "header";
  const canDrill = !!line.drill && line.drill.length > 0 && emphasis !== "header";
  return (
    <>
      <tr className={`${cls[emphasis]} ${canDrill ? "cursor-pointer hover:bg-muted/30" : ""}`} onClick={canDrill ? () => setOpen((v) => !v) : undefined}>
        <td className="px-6 py-2.5" style={{ paddingLeft: `${(line.indent ?? 0) * 16 + 24}px` }}>
          <span className="inline-flex items-center gap-1.5">
            {canDrill && <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />}
            {line.label}
            {canDrill && <span className="ml-1 text-[10px] text-muted-foreground/70">{line.drill!.length}</span>}
          </span>
        </td>
        <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">{line.note ?? ""}</td>
        <td className="px-6 py-2.5 text-right tabular">{isAmount ? formatNPR(line.cy ?? 0, { showZero: emphasis === "total" }) : ""}</td>
        <td className="px-6 py-2.5 text-right tabular text-muted-foreground">{isAmount ? formatNPR(line.py ?? 0) : ""}</td>
      </tr>
      {canDrill && open && (
        <tr className="bg-muted/15">
          <td colSpan={4} className="px-0 py-0">
            <div className="border-y border-border/60">
              <table className="w-full text-xs">
                <tbody>
                  {line.drill!.map((d, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-0">
                      <td className="py-1.5 text-muted-foreground" style={{ paddingLeft: `${(line.indent ?? 0) * 16 + 56}px` }}>
                        <span className="text-foreground/85">{d.accountName}</span>
                        <span className="ml-2 text-[10px] text-muted-foreground/60">{d.scheduleHead}</span>
                      </td>
                      <td className="w-20" />
                      <td className="w-44 px-6 py-1.5 text-right tabular text-foreground/85">{formatNPR(d.cy)}</td>
                      <td className="w-44 px-6 py-1.5 text-right tabular text-muted-foreground">{formatNPR(d.py)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function PendingBanner({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      <div className="text-foreground/80">{children}</div>
    </div>
  );
}
