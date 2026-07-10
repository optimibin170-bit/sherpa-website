import { formatNPR } from "@/lib/format";

type Row = { label: string; cy: number; py: number; emphasis?: "subtotal" | "total" | "normal" };
export type AnalysisSection = { header: string; rows: Row[]; base?: { cy: number; py: number } };

export function AnalysisPanel({ title, subtitle, cyLabel, pyLabel, sections }: {
  title: string; subtitle?: string; cyLabel: string; pyLabel: string; sections: AnalysisSection[];
}) {
  return (
    <div className="mt-8 rounded-xl border bg-card">
      <header className="border-b px-6 py-5">
        <h2 className="font-display text-xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3 text-left">Particulars</th>
              <th className="w-32 px-3 py-3 text-right">{cyLabel}</th>
              <th className="w-20 px-3 py-3 text-right">% CY</th>
              <th className="w-32 px-3 py-3 text-right text-muted-foreground/80">{pyLabel}</th>
              <th className="w-20 px-3 py-3 text-right text-muted-foreground/80">% PY</th>
              <th className="w-28 px-3 py-3 text-right">YoY change</th>
              <th className="w-20 px-3 py-3 text-right">YoY %</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s, si) => {
              const baseCy = s.base?.cy ?? s.rows.find((r) => r.emphasis === "total")?.cy ?? 0;
              const basePy = s.base?.py ?? s.rows.find((r) => r.emphasis === "total")?.py ?? 0;
              return <SectionBody key={si} section={s} baseCy={baseCy} basePy={basePy} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionBody({ section, baseCy, basePy }: { section: AnalysisSection; baseCy: number; basePy: number }) {
  return (
    <>
      <tr className="bg-muted/40 font-display"><td className="px-6 py-2.5" colSpan={7}>{section.header}</td></tr>
      {section.rows.map((r, i) => {
        const verticalCy = baseCy ? (r.cy / baseCy) * 100 : NaN;
        const verticalPy = basePy ? (r.py / basePy) * 100 : NaN;
        const change = r.cy - r.py;
        const changePct = r.py !== 0 ? (change / Math.abs(r.py)) * 100 : NaN;
        const cls = r.emphasis === "total" ? "border-t-2 border-foreground font-display" : r.emphasis === "subtotal" ? "border-t-2 border-foreground/20 font-medium" : "";
        const indent = r.emphasis ? 24 : 40;
        return (
          <tr key={i} className={cls}>
            <td className="py-1.5" style={{ paddingLeft: indent + "px", paddingRight: 24 }}>{r.label}</td>
            <td className="px-3 py-1.5 text-right tabular">{formatNPR(r.cy)}</td>
            <td className="px-3 py-1.5 text-right tabular text-muted-foreground">{fmtPct(verticalCy)}</td>
            <td className="px-3 py-1.5 text-right tabular text-muted-foreground">{formatNPR(r.py)}</td>
            <td className="px-3 py-1.5 text-right tabular text-muted-foreground">{fmtPct(verticalPy)}</td>
            <td className="px-3 py-1.5 text-right tabular"><span className={change > 0 ? "text-emerald-600" : change < 0 ? "text-rose-600" : ""}>{formatNPR(change)}</span></td>
            <td className="px-3 py-1.5 text-right tabular"><span className={change > 0 ? "text-emerald-600" : change < 0 ? "text-rose-600" : ""}>{fmtPct(changePct)}</span></td>
          </tr>
        );
      })}
    </>
  );
}

function fmtPct(n: number) { if (!isFinite(n)) return "—"; return n.toFixed(1) + "%"; }
