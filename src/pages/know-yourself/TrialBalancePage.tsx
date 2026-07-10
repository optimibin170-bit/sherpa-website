import { AppShell, PageHeader } from "./AppShell";
import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useTrialBalance, tbTotals, rowNet, type TBPeriod, type TBRow } from "@/store/trialBalance";
import { classifyRows, groupBy, lookupSchedule } from "@/lib/tbAggregate";
import { formatNPR } from "@/lib/format";

export default function TrialBalancePage() {
  const { cy, py, master, setTB, clear, setMaster, clearMaster } = useTrialBalance();
  const [period, setPeriod] = useState<TBPeriod>("cy");
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [companyName, setCompanyName] = useState(master.companyName);
  const [mode, setMode] = useState<"fy" | "range">(master.mode);
  const [cyFY, setCyFY] = useState(master.cyFY);
  const [cyFrom, setCyFrom] = useState(master.cyFrom);
  const [cyTo, setCyTo] = useState(master.cyTo);
  const fileRef = useRef<HTMLInputElement>(null);
  const current = period === "cy" ? cy : py;
  const totals = useMemo(() => tbTotals(current.rows), [current.rows]);
  const mapped = useMemo(() => classifyRows(current.rows), [current.rows]);
  const bySchedule = useMemo(() => groupBy(mapped, (r) => r.scheduleHead || "Unmapped"), [mapped]);
  const unmappedHeads = useMemo(() => { const s = new Set<string>(); for (const r of current.rows) { if (r.scheduleHead && !lookupSchedule(r.scheduleHead)) s.add(r.scheduleHead); } return [...s].sort(); }, [current.rows]);
  const masterReady = Boolean(master.companyName && master.cy.label !== "Current Year");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setError("");
    try {
      const rows = await parseTBFile(f);
      if (!rows.length) throw new Error("No data rows detected.");
      setTB(period, f.name, rows);
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  function handleSaveMaster() {
    if (!companyName.trim()) { setError("Company name is required."); return; }
    const ok = setMaster({ companyName: companyName.trim(), mode, cyFY, cyFrom, cyTo });
    if (!ok) setError("Invalid period. Enter a fiscal year like 2082-83 or valid dates.");
    else setError("");
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Step 02" title="Trial Balance" description="Upload the year-end Trial Balance (Excel). Once mapped to the Chart of Accounts, the Balance Sheet and P&L populate automatically." />
      <div className="px-8 py-8 space-y-8">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <div><h2 className="font-display text-lg">Company & Period master</h2><p className="text-xs text-muted-foreground">Save the company and reporting period before uploading.</p></div>
            {master.companyName && <button onClick={clearMaster} className="text-xs text-muted-foreground hover:text-foreground">Reset master</button>}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <label className="md:col-span-2 text-sm"><span className="text-xs uppercase tracking-wider text-muted-foreground">Company name</span><input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Everest Traders Pvt. Ltd." className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" /></label>
            <div className="md:col-span-2 text-sm"><span className="text-xs uppercase tracking-wider text-muted-foreground">Period type</span>
              <div className="mt-1 flex gap-2">{(["fy", "range"] as const).map((m) => <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full px-3 py-1.5 text-xs transition ${mode === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{m === "fy" ? "Fiscal year" : "Custom range"}</button>)}</div>
            </div>
            {mode === "fy" ? (
              <label className="md:col-span-2 text-sm">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Fiscal year (e.g. 2082-83)</span>
                <input value={cyFY} onChange={(e) => setCyFY(e.target.value)} placeholder="2082-83" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </label>
            ) : (
              <>
                <label className="text-sm">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">From</span>
                  <input type="date" value={cyFrom} onChange={(e) => setCyFrom(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
                </label>
                <label className="text-sm">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">To</span>
                  <input type="date" value={cyTo} onChange={(e) => setCyTo(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" />
                </label>
              </>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleSaveMaster} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save master</button>
            {master.companyName && <span className="text-xs text-muted-foreground">Saved: <span className="text-foreground">{master.companyName}</span> · {master.cy.label}</span>}
          </div>
          {error && <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Period</span>
            {(["cy", "py"] as const).map((p) => {
              const label = p === "cy"
                ? (master.cy.label !== "Current Year" ? `Current Year (${master.cy.label})` : "Current Year")
                : (master.py.label !== "Prior Year" ? `Prior Year (${master.py.label})` : "Prior Year");
              return <button key={p} onClick={() => setPeriod(p)} className={`rounded-full px-4 py-1.5 text-sm transition ${period === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{label}</button>;
            })}
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={downloadTBTemplate} className="rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Download template</button>
            <label className={`rounded-md border border-accent bg-accent/10 px-4 py-2 text-sm font-medium text-foreground ${masterReady ? "cursor-pointer hover:bg-accent/20" : "cursor-not-allowed opacity-50"}`}>
              {busy ? "Parsing…" : current.rows.length > 0 ? "Replace file" : "Upload Excel"}
              <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onFile} disabled={busy || !masterReady} />
            </label>
            {current.rows.length > 0 && <button onClick={() => clear(period)} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>}
          </div>
        </div>

        {current.rows.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card p-10 text-center">
            <div className="font-display text-xl">No Trial Balance loaded for this period</div>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Expected columns: <em>Schedule Head, Account Name, Opening Bal(Dr/Cr), Debit / Credit Transaction, Closing Bal(Dr/Cr)</em>.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Stat label="Ledgers" value={String(current.rows.length)} />
              <Stat label="Total Debit" value={formatNPR(totals.dr)} />
              <Stat label="Total Credit" value={formatNPR(totals.cr)} />
              <Stat label="Dr − Cr" value={formatNPR(totals.diff)} accent={Math.abs(totals.diff) > 1 ? "warn" : "ok"} />
            </div>
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <div><div className="font-display text-lg">Mapping diagnostics</div><div className="text-xs text-muted-foreground">{current.fileName} · {current.uploadedAt ? new Date(current.uploadedAt).toLocaleString() : "—"}</div></div>
                <div className="text-sm text-muted-foreground">{unmappedHeads.length === 0 ? <span className="text-emerald-600">All Schedule Heads mapped to COA ✓</span> : <span className="text-amber-600">{unmappedHeads.length} unmapped</span>}</div>
              </div>
              {unmappedHeads.length > 0 && <ul className="mt-3 flex flex-wrap gap-2 text-xs">{unmappedHeads.map((h) => <li key={h} className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-700">{h}</li>)}</ul>}
            </div>
            <div className="rounded-xl border bg-card">
              <header className="border-b px-6 py-4"><h2 className="font-display text-xl">Balances by Schedule Head</h2><p className="text-xs text-muted-foreground">Net = Closing Dr − Closing Cr.</p></header>
              <table className="w-full text-sm">
                <thead><tr className="text-xs uppercase tracking-wider text-muted-foreground"><th className="px-6 py-3 text-left">Schedule Head</th><th className="px-3 py-3 text-left">Classification</th><th className="px-3 py-3 text-left">Category</th><th className="w-20 px-3 py-3 text-right">Ledgers</th><th className="w-44 px-6 py-3 text-right">Net</th></tr></thead>
                <tbody>{bySchedule.map((g) => { const info = lookupSchedule(g.label); return (<tr key={g.key} className="border-t border-border/60"><td className="px-6 py-2.5">{g.label || "—"}</td><td className="px-3 py-2.5 text-muted-foreground">{info?.classification ?? <span className="text-amber-600">Unmapped</span>}</td><td className="px-3 py-2.5 text-muted-foreground">{info?.category2 ?? "—"}</td><td className="px-3 py-2.5 text-right tabular-nums">{g.rows.length}</td><td className="px-6 py-2.5 text-right tabular-nums">{formatNPR(g.net)}</td></tr>); })}</tbody>
              </table>
            </div>
            <details className="rounded-xl border bg-card">
              <summary className="cursor-pointer px-6 py-4 font-display text-lg">Ledger detail ({current.rows.length})</summary>
              <div className="max-h-[480px] overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-card text-muted-foreground"><tr><th className="px-4 py-2 text-left">Schedule Head</th><th className="px-4 py-2 text-left">Account Name</th><th className="px-3 py-2 text-right">Opening Dr</th><th className="px-3 py-2 text-right">Opening Cr</th><th className="px-3 py-2 text-right">Debit</th><th className="px-3 py-2 text-right">Credit</th><th className="px-3 py-2 text-right">Closing Dr</th><th className="px-3 py-2 text-right">Closing Cr</th><th className="px-3 py-2 text-right">Net</th></tr></thead>
                  <tbody>{current.rows.map((r, i) => (<tr key={i} className="border-t border-border/40"><td className="px-4 py-1.5 text-muted-foreground">{r.scheduleHead}</td><td className="px-4 py-1.5">{r.accountName}</td><td className="px-3 py-1.5 text-right tabular-nums">{formatNPR(r.openingDr)}</td><td className="px-3 py-1.5 text-right tabular-nums">{formatNPR(r.openingCr)}</td><td className="px-3 py-1.5 text-right tabular-nums">{formatNPR(r.debit)}</td><td className="px-3 py-1.5 text-right tabular-nums">{formatNPR(r.credit)}</td><td className="px-3 py-1.5 text-right tabular-nums">{formatNPR(r.closingDr)}</td><td className="px-3 py-1.5 text-right tabular-nums">{formatNPR(r.closingCr)}</td><td className="px-3 py-1.5 text-right tabular-nums">{formatNPR(rowNet(r))}</td></tr>))}</tbody>
                </table>
              </div>
            </details>
          </>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: "ok" | "warn" }) {
  const tone = accent === "warn" ? "text-amber-600" : accent === "ok" ? "text-emerald-600" : "text-foreground";
  return <div className="rounded-xl border bg-card p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div><div className={`mt-2 font-display text-2xl tabular-nums ${tone}`}>{value}</div></div>;
}

async function parseTBFile(file: File): Promise<TBRow[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: "" });
  if (!aoa.length) return [];
  let headerIdx = 0;
  for (let i = 0; i < Math.min(aoa.length, 10); i++) { const r = aoa[i].map((x: any) => String(x).toLowerCase()); if (r.some((c: string) => c.includes("schedule")) && r.some((c: string) => c.includes("account"))) { headerIdx = i; break; } }
  const headers = aoa[headerIdx].map((h: any) => String(h));
  const idxSched = pickColumn(headers, ["Schedule Head", "Schedule"]);
  const idxName = pickColumn(headers, ["Account Name", "Ledger", "Particulars", "Name"]);
  const idxOpD = pickColumn(headers, ["Opening Bal(Dr)", "Opening Dr"]);
  const idxOpC = pickColumn(headers, ["Opening Bal(Cr)", "Opening Cr"]);
  const idxDr = pickColumn(headers, ["Debit Transaction", "Debit", "Dr"]);
  const idxCr = pickColumn(headers, ["Credit Transaction", "Credit", "Cr"]);
  const idxClD = pickColumn(headers, ["Closing Bal(Dr)", "Closing Dr"]);
  const idxClC = pickColumn(headers, ["Closing Bal(Cr)", "Closing Cr"]);
  const rows: TBRow[] = [];
  for (let i = headerIdx + 1; i < aoa.length; i++) {
    const r = aoa[i]; if (!r || r.every((c: any) => c === "" || c == null)) continue;
    const accountName = String(r[idxName] ?? "").trim(); if (!accountName) continue;
    rows.push({ scheduleHead: String(r[idxSched] ?? "").trim(), accountName, openingDr: NUM(r[idxOpD]), openingCr: NUM(r[idxOpC]), debit: NUM(r[idxDr]), credit: NUM(r[idxCr]), closingDr: NUM(r[idxClD]), closingCr: NUM(r[idxClC]) });
  }
  return rows;
}

function pickColumn(headers: string[], candidates: string[]) { const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, ""); const H = headers.map(norm); for (const c of candidates) { const i = H.indexOf(norm(c)); if (i >= 0) return i; } return -1; }
const NUM = (v: unknown) => { if (v == null || v === "") return 0; if (typeof v === "number") return v; const n = Number(String(v).replace(/,/g, "").trim()); return Number.isFinite(n) ? n : 0; };

function downloadTBTemplate() {
  const TEMPLATE_HEADERS = ["Schedule Head", "Account Name", "Opening Bal(Dr)", "Opening Bal(Cr)", "Debit Transaction", "Credit Transaction", "Closing Bal(Dr)", "Closing Bal(Cr)"];
  const SAMPLE: (string | number)[][] = [["Share Capital", "Equity Share Capital", 0, 1000000, 0, 0, 0, 1000000], ["Reserves & Surplus", "Retained Earnings", 0, 250000, 0, 0, 0, 250000], ["Property, Plant & Equipment", "Office Building", 500000, 0, 0, 0, 500000, 0], ["Trade Receivables", "Customer A", 120000, 0, 300000, 250000, 170000, 0], ["Trade Payables", "Vendor X", 0, 80000, 60000, 100000, 0, 120000], ["Cash & Bank", "Bank – Current A/C", 45000, 0, 800000, 700000, 145000, 0], ["Inventories", "Stock in Trade", 200000, 0, 0, 0, 220000, 0], ["Sales", "Sales – Domestic", 0, 0, 0, 1500000, 0, 1500000], ["Cost of Goods Sold", "Purchases", 0, 0, 900000, 0, 900000, 0], ["Operating Expenses", "Salaries & Wages", 0, 0, 180000, 0, 180000, 0]];
  const aoa = [["Trial Balance Template"], [], TEMPLATE_HEADERS, ...SAMPLE];
  const ws = XLSX.utils.aoa_to_sheet(aoa); ws["!cols"] = [{ wch: 28 }, { wch: 32 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 16 }];
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");
  XLSX.writeFile(wb, "Trial-Balance-Template.xlsx");
}
