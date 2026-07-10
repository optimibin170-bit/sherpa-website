import { useState } from "react";
import { AppShell, PageHeader } from "./AppShell";
import { useTrialBalance } from "@/store/trialBalance";
import { useAdjustments, type ClosingStockEntry, type DepreciationEntry, type AccrualEntry, summarizeStock } from "@/store/adjustments";
import { formatNPR } from "@/lib/format";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function PlatformPage() {
  const master = useTrialBalance((s) => s.master);
  return (
    <AppShell>
      <PageHeader eyebrow="Step 03" title="Platform · Adjustments" description="Post year-end adjustments — closing stock, depreciation, prepaid and accrued expenses — before finalising the financial statements." />
      <div className="px-4 py-6 space-y-6 md:px-8 md:py-8 md:space-y-8">
        {!master.companyName && (
          <div className="rounded-lg border border-dashed bg-card p-10 text-center">
            <div className="font-display text-xl">Set up your company first</div>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Go to <a href="/know-yourself/trial-balance" className="text-primary underline">Trial Balance</a> and save your company name and reporting period before making adjustments.</p>
          </div>
        )}
        {master.companyName && (
          <Tabs defaultValue="stock" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stock">Closing Stock</TabsTrigger>
              <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
              <TabsTrigger value="accruals">Prepaid / Accrued</TabsTrigger>
              <TabsTrigger value="cogs">COGS Overrides</TabsTrigger>
            </TabsList>
            <TabsContent value="stock"><StockSection /></TabsContent>
            <TabsContent value="depreciation"><DepreciationSection /></TabsContent>
            <TabsContent value="accruals"><AccrualsSection /></TabsContent>
            <TabsContent value="cogs"><CogsSection /></TabsContent>
          </Tabs>
        )}
      </div>
    </AppShell>
  );
}

function StockSection() {
  const { closingStock, addStock, removeStock } = useAdjustments();
  const [item, setItem] = useState("");
  const [bucket, setBucket] = useState<"good" | "expiry" | "defect">("good");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const totals = summarizeStock(closingStock);
  function handleAdd() {
    if (!item.trim() || !value) return;
    addStock({ item: item.trim(), bucket, value: Number(value), notes: notes.trim() || undefined });
    setItem(""); setValue(""); setNotes("");
  }
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-display text-lg">Add closing stock item</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          <Input value={item} onChange={(e) => setItem(e.target.value)} placeholder="Item name" className="md:col-span-2" />
          <select value={bucket} onChange={(e) => setBucket(e.target.value as any)} className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="good">Good (sellable)</option><option value="expiry">Expired / obsolete</option><option value="defect">Damaged / defective</option>
          </select>
          <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value (NPR)" />
          <button onClick={handleAdd} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Add</button>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-3 text-center"><div className="text-xs text-emerald-700">Good stock</div><div className="font-display text-lg tabular-nums">{formatNPR(totals.good, { showZero: true })}</div></div>
          <div className="rounded-lg bg-amber-500/10 p-3 text-center"><div className="text-xs text-amber-700">Expired</div><div className="font-display text-lg tabular-nums">{formatNPR(totals.expiry, { showZero: true })}</div></div>
          <div className="rounded-lg bg-rose-500/10 p-3 text-center"><div className="text-xs text-rose-700">Defective</div><div className="font-display text-lg tabular-nums">{formatNPR(totals.defect, { showZero: true })}</div></div>
          <div className="rounded-lg bg-primary/10 p-3 text-center"><div className="text-xs text-primary">Total</div><div className="font-display text-lg tabular-nums">{formatNPR(totals.total, { showZero: true })}</div></div>
        </div>
      </div>
      {closingStock.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead><tr className="text-xs uppercase tracking-wider text-muted-foreground"><th className="px-6 py-3 text-left">Item</th><th className="px-3 py-3 text-left">Bucket</th><th className="px-6 py-3 text-right">Value</th><th className="px-6 py-3 text-left">Notes</th><th className="w-12 px-3 py-3"></th></tr></thead>
            <tbody>{closingStock.map((e) => (
              <tr key={e.id} className="border-t border-border/60"><td className="px-6 py-2">{e.item}</td>
                <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs ${e.bucket === "good" ? "bg-emerald-500/10 text-emerald-700" : e.bucket === "expiry" ? "bg-amber-500/10 text-amber-700" : "bg-rose-500/10 text-rose-700"}`}>{e.bucket}</span></td>
                <td className="px-6 py-2 text-right tabular-nums">{formatNPR(e.value, { showZero: true })}</td><td className="px-6 py-2 text-muted-foreground">{e.notes ?? ""}</td>
                <td className="px-3 py-2 text-right"><button onClick={() => removeStock(e.id)} className="text-xs text-muted-foreground hover:text-foreground">Remove</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DepreciationSection() {
  const { depreciation, addDep, removeDep } = useAdjustments();
  const [asset, setAsset] = useState("");
  const [scheduleHead, setScheduleHead] = useState("Property, Plant and Equipment");
  const [rate, setRate] = useState("");
  const [opening, setOpening] = useState("");
  const [additions, setAdditions] = useState("");
  function handleAdd() {
    if (!asset.trim() || !rate) return;
    addDep({ asset: asset.trim(), scheduleHead, rate: Number(rate), opening: Number(opening), additions: Number(additions), depreciation: 0 });
    setAsset(""); setRate(""); setOpening(""); setAdditions("");
  }
  const totalDep = depreciation.reduce((s, d) => s + d.depreciation, 0);
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-display text-lg">Add depreciation entry</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input value={asset} onChange={(e) => setAsset(e.target.value)} placeholder="Asset name" className="md:col-span-2" />
          <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Rate %" />
          <Input type="number" value={opening} onChange={(e) => setOpening(e.target.value)} placeholder="Opening WDV" />
          <Input type="number" value={additions} onChange={(e) => setAdditions(e.target.value)} placeholder="Additions" />
          <button onClick={handleAdd} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Add</button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Depreciation is auto-calculated as (Opening WDV + Additions) × Rate% using WDV method.</p>
      </div>
      {depreciation.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead><tr className="text-xs uppercase tracking-wider text-muted-foreground"><th className="px-6 py-3 text-left">Asset</th><th className="px-3 py-3 text-left">Schedule</th><th className="px-3 py-3 text-right">Rate</th><th className="px-3 py-3 text-right">Opening</th><th className="px-3 py-3 text-right">Additions</th><th className="px-3 py-3 text-right">Depreciation</th><th className="w-12 px-3 py-3"></th></tr></thead>
            <tbody>{depreciation.map((e) => (
              <tr key={e.id} className="border-t border-border/60"><td className="px-6 py-2">{e.asset}</td><td className="px-3 py-2 text-muted-foreground">{e.scheduleHead}</td><td className="px-3 py-3 text-right tabular-nums">{e.rate}%</td><td className="px-3 py-3 text-right tabular-nums">{formatNPR(e.opening, { showZero: true })}</td><td className="px-3 py-3 text-right tabular-nums">{formatNPR(e.additions, { showZero: true })}</td><td className="px-3 py-3 text-right tabular-nums font-medium">{formatNPR(e.depreciation, { showZero: true })}</td><td className="px-3 py-2 text-right"><button onClick={() => removeDep(e.id)} className="text-xs text-muted-foreground hover:text-foreground">Remove</button></td></tr>
            ))}</tbody>
            <tfoot><tr className="border-t-2 border-foreground font-display"><td className="px-6 py-2" colSpan={5}>Total depreciation</td><td className="px-3 py-2 text-right tabular-nums">{formatNPR(totalDep, { showZero: true })}</td><td></td></tr></tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

function AccrualsSection() {
  const { accruals, addAccrual, removeAccrual } = useAdjustments();
  const [accountName, setAccountName] = useState("");
  const [kind, setKind] = useState<"prepaid" | "accrued">("prepaid");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  function handleAdd() {
    if (!accountName.trim() || !amount) return;
    addAccrual({ accountName: accountName.trim(), kind, amount: Number(amount), notes: notes.trim() || undefined });
    setAccountName(""); setAmount(""); setNotes("");
  }
  const prepaid = accruals.filter((a) => a.kind === "prepaid").reduce((s, a) => s + a.amount, 0);
  const accrued = accruals.filter((a) => a.kind === "accrued").reduce((s, a) => s + a.amount, 0);
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-display text-lg">Add prepaid / accrued expense</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Account name" className="md:col-span-2" />
          <select value={kind} onChange={(e) => setKind(e.target.value as any)} className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="prepaid">Prepaid (asset)</option><option value="accrued">Accrued (liability)</option>
          </select>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (NPR)" />
          <button onClick={handleAdd} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Add</button>
        </div>
        <div className="mt-4 flex gap-4">
          <div className="rounded-lg bg-primary/10 p-3 text-center flex-1"><div className="text-xs text-primary">Prepaid</div><div className="font-display text-lg tabular-nums">{formatNPR(prepaid, { showZero: true })}</div></div>
          <div className="rounded-lg bg-primary/10 p-3 text-center flex-1"><div className="text-xs text-primary">Accrued</div><div className="font-display text-lg tabular-nums">{formatNPR(accrued, { showZero: true })}</div></div>
        </div>
      </div>
      {accruals.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead><tr className="text-xs uppercase tracking-wider text-muted-foreground"><th className="px-6 py-3 text-left">Account</th><th className="px-3 py-3 text-left">Kind</th><th className="px-6 py-3 text-right">Amount</th><th className="px-6 py-3 text-left">Notes</th><th className="w-12 px-3 py-3"></th></tr></thead>
            <tbody>{accruals.map((e) => (
              <tr key={e.id} className="border-t border-border/60"><td className="px-6 py-2">{e.accountName}</td><td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs ${e.kind === "prepaid" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}>{e.kind}</span></td><td className="px-6 py-2 text-right tabular-nums">{formatNPR(e.amount, { showZero: true })}</td><td className="px-6 py-2 text-muted-foreground">{e.notes ?? ""}</td><td className="px-3 py-2 text-right"><button onClick={() => removeAccrual(e.id)} className="text-xs text-muted-foreground hover:text-foreground">Remove</button></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CogsSection() {
  const { cogs, setCogs, resetCogs } = useAdjustments();
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-display text-lg">COGS overrides <span className="ml-2 text-xs font-normal text-muted-foreground">(optional)</span></h3>
      <p className="mt-1 text-xs text-muted-foreground">Override auto-computed COGS components if needed. Leave blank to use TB-derived values.</p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="text-sm"><span className="text-xs uppercase tracking-wider text-muted-foreground">Opening inventory</span><Input type="number" value={cogs.openingInventory ?? ""} onChange={(e) => setCogs({ openingInventory: e.target.value ? Number(e.target.value) : null })} className="mt-1" /></label>
        <label className="text-sm"><span className="text-xs uppercase tracking-wider text-muted-foreground">Purchases</span><Input type="number" value={cogs.purchases ?? ""} onChange={(e) => setCogs({ purchases: e.target.value ? Number(e.target.value) : null })} className="mt-1" /></label>
        <label className="text-sm"><span className="text-xs uppercase tracking-wider text-muted-foreground">Direct expenses</span><Input type="number" value={cogs.directExpenses ?? ""} onChange={(e) => setCogs({ directExpenses: e.target.value ? Number(e.target.value) : null })} className="mt-1" /></label>
      </div>
      <div className="mt-4"><button onClick={resetCogs} className="text-xs text-muted-foreground hover:text-foreground">Reset overrides</button></div>
    </div>
  );
}
