import { useState, useEffect, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { formatNPR } from "@/lib/format";
import type { HNode } from "@/lib/hierarchy";

export type ExtraLine = { label: string; op?: number; cy?: number; py?: number; hint?: string; emphasis?: "subtotal" | "normal"; indent?: number };
export type StatementSection = { header: string; nodes: HNode[]; extras?: ExtraLine[]; totalLabel: string; totalOp?: number; totalCy: number; totalPy: number; defaultOpenDepth?: number };

export function HierarchyStatement({ title, subtitle, cyLabel = "FY 2083-84", pyLabel = "FY 2082-83", opLabel, sections, children, showDepthControl = true, initialDepth = 1 }: {
  title: string; subtitle?: string; cyLabel?: string; pyLabel?: string; opLabel?: string; sections: StatementSection[]; children?: ReactNode; showDepthControl?: boolean; initialDepth?: number;
}) {
  const showOp = !!opLabel;
  const [depth, setDepth] = useState<number>(initialDepth);
  return (
    <div className="rounded-xl border bg-card">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b px-6 py-5">
        <div>
          <h2 className="font-display text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {showDepthControl && (
            <div className="flex items-center gap-1 rounded-md border bg-card p-1 text-xs print:hidden">
              <span className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground">Expand</span>
              {[0, 1, 2, 3, 4, 5].map((d) => (
                <button key={d} onClick={() => setDepth(d)} className={`min-w-[24px] rounded px-2 py-0.5 font-medium ${depth === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60"}`}>{d}</button>
              ))}
            </div>
          )}
          {children}
        </div>
      </header>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-6 py-3 text-left">Particulars</th>
            {showOp && <th className="w-40 px-6 py-3 text-right text-muted-foreground/80">{opLabel}</th>}
            <th className="w-44 px-6 py-3 text-right">{cyLabel}</th>
            <th className="w-44 px-6 py-3 text-right text-muted-foreground/80">{pyLabel}</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s, i) => <SectionBody key={i} section={s} showOp={showOp} depth={depth} />)}
        </tbody>
      </table>
    </div>
  );
}

function SectionBody({ section, showOp, depth }: { section: StatementSection; showOp: boolean; depth: number }) {
  const cols = showOp ? 4 : 3;
  return (
    <>
      <tr className="bg-muted/40 font-display"><td className="px-6 py-2.5 text-foreground" colSpan={cols}>{section.header}</td></tr>
      {section.nodes.map((n) => <TreeRow key={n.key} node={n} depth={depth} showOp={showOp} />)}
      {section.extras?.map((e, i) => (
        <tr key={`x-${i}`} className={e.emphasis === "subtotal" ? "border-t-2 border-foreground/20 font-medium" : ""}>
          <td className="px-6 py-2" style={{ paddingLeft: `${(e.indent ?? 1) * 16 + 24}px` }}>
            <span className="inline-flex items-center gap-2">
              <span>{e.label}</span>
              {e.hint && <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-accent">{e.hint}</span>}
            </span>
          </td>
          {showOp && <td className="px-6 py-2 text-right tabular text-muted-foreground">{formatNPR(e.op ?? 0)}</td>}
          <td className="px-6 py-2 text-right tabular">{formatNPR(e.cy ?? 0)}</td>
          <td className="px-6 py-2 text-right tabular text-muted-foreground">{formatNPR(e.py ?? 0)}</td>
        </tr>
      ))}
      <tr className="border-t-2 border-foreground font-display text-base">
        <td className="px-6 py-2.5">{section.totalLabel}</td>
        {showOp && <td className="px-6 py-2.5 text-right tabular text-muted-foreground">{formatNPR(section.totalOp ?? 0, { showZero: true })}</td>}
        <td className="px-6 py-2.5 text-right tabular">{formatNPR(section.totalCy, { showZero: true })}</td>
        <td className="px-6 py-2.5 text-right tabular text-muted-foreground">{formatNPR(section.totalPy, { showZero: true })}</td>
      </tr>
    </>
  );
}

function TreeRow({ node, depth, showOp }: { node: HNode; depth: number; showOp: boolean }) {
  const [open, setOpen] = useState(node.level <= depth);
  useEffect(() => { setOpen(node.level <= depth); }, [depth, node.level]);
  const hasChildren = node.children.length > 0;
  const indent = (node.level + 1) * 16 + 8;
  const cls = node.level === 0 ? "font-display text-foreground" : node.level === 1 ? "font-medium" : node.level >= 4 ? "text-muted-foreground" : "";
  return (
    <>
      <tr className={`${hasChildren ? "cursor-pointer hover:bg-muted/30" : ""} ${cls}`} onClick={hasChildren ? () => setOpen((v) => !v) : undefined}>
        <td className="px-6 py-1.5" style={{ paddingLeft: `${indent}px` }}>
          <span className="inline-flex items-center gap-1.5">
            {hasChildren ? <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} /> : <span className="inline-block w-3.5" />}
            <span>{node.label}</span>
            {hasChildren && <span className="ml-1 text-[10px] text-muted-foreground/60">{node.children.length}</span>}
          </span>
        </td>
        {showOp && <td className="px-6 py-1.5 text-right tabular text-muted-foreground">{formatNPR(node.op)}</td>}
        <td className="px-6 py-1.5 text-right tabular">{formatNPR(node.cy)}</td>
        <td className="px-6 py-1.5 text-right tabular text-muted-foreground">{formatNPR(node.py)}</td>
      </tr>
      {open && node.children.map((c) => <TreeRow key={c.key} node={c} depth={depth} showOp={showOp} />)}
    </>
  );
}
