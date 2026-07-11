import { useEffect, useMemo, useState } from "react";
import { AppShell, PageHeader } from "./AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COA } from "@/data/coa";
import { formatNPR } from "@/lib/format";
import { tbByScheduleHead, tbScheduleTotals, type LedgerTB } from "@/lib/tbAggregate";
import { sumByCategory2 } from "@/lib/tbAggregate";
import { useTrialBalance } from "@/store/trialBalance";
import {
  useAdjustments,
  summarizeStock,
  type StockBucket,
} from "@/store/adjustments";
import { computeNetProfit } from "@/lib/computeNetProfit";


const FIXED_ASSET_SCHEDULES = Array.from(
  new Set(
    COA.filter(
      (a) =>
        a.category === "Property, Plant and Equipment" || a.category === "Intangible assets",
    ).map((a) => a.scheduleHead),
  ),
);

const EXPENSE_LEDGERS = COA.filter((a) => a.classification === "PL").map((a) => a.name);

const RM_HEADS = ["Repair & Maintenance"];
const INTEREST_HEADS = ["Bank Interest", "Interest on Unsecured Loans"];

function PlatformPage() {
  const adj = useAdjustments();
  const stockSummary = useMemo(() => summarizeStock(adj.closingStock), [adj.closingStock]);
  const depTotal = adj.depreciation.reduce((s, d) => s + d.depreciation, 0);
  const prepaidTotal = adj.accruals
    .filter((a) => a.kind === "prepaid")
    .reduce((s, a) => s + a.amount, 0);
  const accruedTotal = adj.accruals
    .filter((a) => a.kind === "accrued")
    .reduce((s, a) => s + a.amount, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 03"
        title="Platform — Year-end adjustments"
        description="Capture period-end adjustments that flow into the Balance Sheet and P&L. Entries persist locally until the Trial Balance is wired in."
        actions={
          <Button variant="outline" size="sm" onClick={adj.reset}>
            Reset all
          </Button>
        }
      />
      <div className="px-8 py-8 space-y-10">
        <SummaryStrip
          items={[
            { label: "Closing stock — Good", value: stockSummary.good, tone: "positive" },
            { label: "Expiry written off", value: stockSummary.expiry, tone: "negative" },
            { label: "Defect written off", value: stockSummary.defect, tone: "negative" },
            { label: "Depreciation", value: depTotal, tone: "negative" },
            { label: "Prepaid", value: prepaidTotal, tone: "positive" },
            { label: "Accrued", value: accruedTotal, tone: "negative" },
          ]}
        />

        <ClosingStockSection />
        <CogsSection />
        <EquitySection />
        <DepreciationSection />
        <LedgerAdjustSection
          title="Repair & Maintenance"
          description="Ledgers booked under the Repair & Maintenance schedule head. Adjust any line — your delta flows into Administrative expenses on the P&L."
          heads={RM_HEADS}
        />
        <LedgerAdjustSection
          title="Interest (Finance costs)"
          description="Bank Interest and Interest on Unsecured Loans ledgers. Adjustments flow into Finance costs on the P&L."
          heads={INTEREST_HEADS}
        />
        <AccrualsSection />
      </div>
    </AppShell>
  );
}

function SummaryStrip({
  items,
}: {
  items: { label: string; value: number; tone: "positive" | "negative" }[];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      {items.map((i) => (
        <div key={i.label} className="rounded-lg border bg-card px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {i.label}
          </div>
          <div
            className={`mt-1 tabular font-display text-lg ${
              i.tone === "negative" ? "text-negative" : "text-foreground"
            }`}
          >
            {formatNPR(i.value)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card">
      <header className="border-b px-6 py-5">
        <h2 className="font-display text-xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

function ClosingStockSection() {
  const adj = useAdjustments();
  const [item, setItem] = useState("");
  const [bucket, setBucket] = useState<StockBucket>("good");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    const v = Number(value);
    if (!item || !isFinite(v) || v <= 0) return;
    adj.addStock({ item, bucket, value: v, notes });
    setItem("");
    setValue("");
    setNotes("");
  };

  return (
    <Section
      title="Closing stock"
      description="Bifurcate inventory into Good stock, Expiry and Defect. Expiry and Defect are written off to the Profit & Loss; Good stock sits on the Balance Sheet as Inventory."
    >
      <div className="grid gap-3 md:grid-cols-12">
        <Field label="Item / SKU" className="md:col-span-3">
          <Input value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g. Surgical gloves Lot 2024-A" />
        </Field>
        <Field label="Bucket" className="md:col-span-2">
          <Select value={bucket} onValueChange={(v) => setBucket(v as StockBucket)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="good">Good stock</SelectItem>
              <SelectItem value="expiry">Expiry</SelectItem>
              <SelectItem value="defect">Defect</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Value (NPR)" className="md:col-span-2">
          <Input value={value} onChange={(e) => setValue(e.target.value)} inputMode="numeric" />
        </Field>
        <Field label="Notes" className="md:col-span-3">
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
        </Field>
        <div className="md:col-span-2 flex items-end">
          <Button onClick={submit} className="w-full">Add entry</Button>
        </div>
      </div>

      <EntriesTable
        empty="No closing-stock entries yet."
        head={["Item", "Bucket", "Value", "Notes", ""]}
        rows={adj.closingStock.map((s) => ({
          id: s.id,
          cells: [
            s.item,
            <BucketBadge key="b" bucket={s.bucket} />,
            <span key="v" className="tabular">{formatNPR(s.value, { showZero: true })}</span>,
            <span key="n" className="text-muted-foreground">{s.notes ?? "—"}</span>,
          ],
          onRemove: () => adj.removeStock(s.id),
        }))}
      />
    </Section>
  );
}

function BucketBadge({ bucket }: { bucket: StockBucket }) {
  const map = {
    good: { label: "Good", cls: "bg-positive/10 text-positive" },
    expiry: { label: "Expiry", cls: "bg-negative/10 text-negative" },
    defect: { label: "Defect", cls: "bg-accent/15 text-accent-foreground" },
  } as const;
  const s = map[bucket];
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

function DepreciationSection() {
  const adj = useAdjustments();
  const tb = useTrialBalance();
  const [asset, setAsset] = useState("");
  const [scheduleHead, setScheduleHead] = useState(FIXED_ASSET_SCHEDULES[0] ?? "");
  const [rate, setRate] = useState("15");
  const [opening, setOpening] = useState("");
  const [additions, setAdditions] = useState("0");

  // Pull TB totals for the selected schedule head from CY (and PY closing as opening fallback).
  const tbForHead = useMemo(() => {
    if (!scheduleHead) return { opening: 0, additions: 0, closing: 0, credits: 0 };
    const cy = tbScheduleTotals(tb.cy.rows, [scheduleHead]);
    const py = tbScheduleTotals(tb.py.rows, [scheduleHead]);
    return {
      opening: cy.opening || py.closing || 0,
      additions: cy.additions,
      credits: cy.credits,
      closing: cy.closing,
    };
  }, [scheduleHead, tb.cy.rows, tb.py.rows]);

  // Auto-prefill when schedule head changes (only if user hasn't entered values yet).
  useEffect(() => {
    setOpening(String(Math.round(tbForHead.opening)));
    setAdditions(String(Math.round(tbForHead.additions)));
  }, [scheduleHead, tbForHead.opening, tbForHead.additions]);

  const computed = useMemo(() => {
    const base = Number(opening) + Number(additions) / 2;
    const r = Number(rate);
    if (!isFinite(base) || !isFinite(r)) return 0;
    return Math.round((base * r) / 100);
  }, [opening, additions, rate]);

  const submit = () => {
    if (!scheduleHead) return;
    adj.addDep({
      asset: asset.trim() || scheduleHead,
      scheduleHead,
      rate: Number(rate),
      opening: Number(opening) || 0,
      additions: Number(additions) || 0,
      depreciation: computed,
    });
    setAsset("");
  };

  return (
    <Section
      title="Depreciation"
      description="Depreciation by fixed-asset schedule head. Opening WDV and Additions auto-populate from the Trial Balance for the selected schedule head — override either value if needed. Charge = (Opening + Additions/2) × Rate."
    >
      {scheduleHead && (
        <div className="mb-4 rounded-md border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          TB for <span className="font-medium text-foreground">{scheduleHead}</span> ·
          opening {formatNPR(tbForHead.opening, { showZero: true })} · additions{" "}
          {formatNPR(tbForHead.additions, { showZero: true })} · disposals/credits{" "}
          {formatNPR(tbForHead.credits, { showZero: true })} · closing{" "}
          {formatNPR(tbForHead.closing, { showZero: true })}
          <button
            type="button"
            onClick={() => {
              setOpening(String(Math.round(tbForHead.opening)));
              setAdditions(String(Math.round(tbForHead.additions)));
            }}
            className="ml-3 underline hover:text-foreground"
          >
            Refill from TB
          </button>
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-12">
        <Field label="Asset" className="md:col-span-3">
          <Input value={asset} onChange={(e) => setAsset(e.target.value)} placeholder="e.g. Toyota Hilux" />
        </Field>
        <Field label="Schedule head" className="md:col-span-3">
          <Select value={scheduleHead} onValueChange={setScheduleHead}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {FIXED_ASSET_SCHEDULES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Opening WDV" className="md:col-span-2">
          <Input value={opening} onChange={(e) => setOpening(e.target.value)} inputMode="numeric" />
        </Field>
        <Field label="Additions" className="md:col-span-1">
          <Input value={additions} onChange={(e) => setAdditions(e.target.value)} inputMode="numeric" />
        </Field>
        <Field label="Rate %" className="md:col-span-1">
          <Input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="numeric" />
        </Field>
        <div className="md:col-span-2 flex flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Charge</div>
          <div className="mt-1 font-display tabular text-lg">{formatNPR(computed)}</div>
          <Button size="sm" onClick={submit} className="mt-2">Add</Button>
        </div>
      </div>

      <EntriesTable
        empty="No depreciation entries yet."
        head={["Asset", "Schedule", "Opening", "Additions", "Rate", "Charge", ""]}
        rows={adj.depreciation.map((d) => ({
          id: d.id,
          cells: [
            d.asset,
            <span key="s" className="text-muted-foreground">{d.scheduleHead}</span>,
            <span key="o" className="tabular">{formatNPR(d.opening, { showZero: true })}</span>,
            <span key="a" className="tabular">{formatNPR(d.additions, { showZero: true })}</span>,
            <span key="r" className="tabular">{d.rate.toFixed(1)}%</span>,
            <span key="c" className="tabular text-negative">{formatNPR(d.depreciation, { showZero: true })}</span>,
          ],
          onRemove: () => adj.removeDep(d.id),
        }))}
      />
    </Section>
  );
}

function LedgerAdjustSection({
  title,
  description,
  heads,
}: {
  title: string;
  description: string;
  heads: string[];
}) {
  const adj = useAdjustments();
  const tb = useTrialBalance();
  const ledgers: LedgerTB[] = useMemo(
    () => tbByScheduleHead(tb.cy.rows, heads),
    [tb.cy.rows, heads],
  );
  const adjMap = useMemo(() => {
    const m = new Map<string, { amount: number; notes?: string }>();
    for (const a of adj.ledgerAdj) m.set(a.id, { amount: a.amount, notes: a.notes });
    return m;
  }, [adj.ledgerAdj]);

  const tbTotal = ledgers.reduce((s, l) => s + l.closing, 0);
  const adjTotal = ledgers.reduce(
    (s, l) => s + (adjMap.get(`${l.scheduleHead}::${l.accountName}`)?.amount ?? 0),
    0,
  );

  return (
    <Section title={title} description={description}>
      {ledgers.length === 0 ? (
        <div className="rounded-md border border-dashed bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
          No Trial Balance ledgers found under {heads.join(", ")} yet. Upload the TB to manage these lines.
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Ledger</th>
                <th className="px-4 py-2 text-left">Schedule</th>
                <th className="px-4 py-2 text-right">TB amount</th>
                <th className="px-4 py-2 text-right">Adjustment</th>
                <th className="px-4 py-2 text-right">Final</th>
                <th className="px-4 py-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {ledgers.map((l) => {
                const id = `${l.scheduleHead}::${l.accountName}`;
                const cur = adjMap.get(id) ?? { amount: 0, notes: "" };
                const final = l.closing + cur.amount;
                return (
                  <tr key={id} className="border-t">
                    <td className="px-4 py-2 align-top">{l.accountName}</td>
                    <td className="px-4 py-2 align-top text-muted-foreground">{l.scheduleHead}</td>
                    <td className="px-4 py-2 align-top text-right tabular">
                      {formatNPR(l.closing, { showZero: true })}
                    </td>
                    <td className="px-2 py-1.5 align-top text-right">
                      <Input
                        className="h-8 text-right tabular"
                        inputMode="numeric"
                        value={cur.amount === 0 ? "" : String(cur.amount)}
                        placeholder="0"
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          adj.setLedgerAdj({
                            id,
                            scheduleHead: l.scheduleHead,
                            accountName: l.accountName,
                            amount: isFinite(v) ? v : 0,
                            notes: cur.notes,
                          });
                        }}
                      />
                    </td>
                    <td className="px-4 py-2 align-top text-right tabular font-medium">
                      {formatNPR(final, { showZero: true })}
                    </td>
                    <td className="px-2 py-1.5 align-top">
                      <Input
                        className="h-8"
                        value={cur.notes ?? ""}
                        placeholder="Optional note"
                        onChange={(e) =>
                          adj.setLedgerAdj({
                            id,
                            scheduleHead: l.scheduleHead,
                            accountName: l.accountName,
                            amount: cur.amount,
                            notes: e.target.value,
                          })
                        }
                      />
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t bg-muted/40 font-medium">
                <td className="px-4 py-2" colSpan={2}>Total</td>
                <td className="px-4 py-2 text-right tabular">{formatNPR(tbTotal, { showZero: true })}</td>
                <td className="px-4 py-2 text-right tabular">{formatNPR(adjTotal, { showZero: true })}</td>
                <td className="px-4 py-2 text-right tabular">{formatNPR(tbTotal + adjTotal, { showZero: true })}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

function CogsSection() {
  const adj = useAdjustments();
  const tb = useTrialBalance();
  const stock = useMemo(() => summarizeStock(adj.closingStock), [adj.closingStock]);

  // Opening Inventory = TB Inventories opening balance (CY) — fallback to PY closing.
  const invCY = useMemo(() => tbScheduleTotals(tb.cy.rows, ["Inventories"]), [tb.cy.rows]);
  const invPY = useMemo(() => tbScheduleTotals(tb.py.rows, ["Inventories"]), [tb.py.rows]);
  const tbOpening = invCY.opening || invPY.closing || 0;

  // Purchases = TB Purchase of Goods (net of returns) for CY.
  const purchCY = useMemo(
    () => tbScheduleTotals(tb.cy.rows, ["Purchase of Goods"]),
    [tb.cy.rows],
  );
  const tbPurchases = purchCY.additions - purchCY.credits || purchCY.closing;

  // Direct Expenses = anything in the "Purchase" category2 (per COA) beyond
  // "Purchase of Goods" schedule head — e.g. freight inward, octroi, clearing.
  const tbPurchaseCategory = useMemo(() => {
    const byCat = sumByCategory2(tb.cy.rows);
    return byCat["Purchase"] ?? 0;
  }, [tb.cy.rows]);
  const tbDirectExpenses = Math.max(0, Math.round(tbPurchaseCategory - tbPurchases));

  const opening = adj.cogs.openingInventory ?? Math.round(tbOpening);
  const purchases = adj.cogs.purchases ?? Math.round(tbPurchases);
  const directExpenses = adj.cogs.directExpenses ?? tbDirectExpenses;
  const closingGood = stock.good;
  const writtenOff = stock.expiry + stock.defect;
  const cogs = opening + purchases + directExpenses - closingGood;

  return (
    <Section
      title="Cost of Goods Sold (COGS)"
      description="Opening Inventory, Purchases and Direct Expenses auto-populate from the Trial Balance — override any value if needed. Closing Inventory comes from the Closing Stock section above. COGS = Opening + Purchases + Direct Expenses − Closing (Good). Expiry & Defect are written off separately."
    >
      <div className="mb-4 rounded-md border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        TB Inventories opening {formatNPR(invCY.opening, { showZero: true })} · PY closing{" "}
        {formatNPR(invPY.closing, { showZero: true })} · TB Purchases (net){" "}
        {formatNPR(tbPurchases, { showZero: true })} · TB Direct Expenses{" "}
        {formatNPR(tbDirectExpenses, { showZero: true })}
        <button
          type="button"
          onClick={() => adj.resetCogs()}
          className="ml-3 underline hover:text-foreground"
        >
          Refill from TB
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-12">
        <Field label="Opening Inventory" className="md:col-span-2">
          <Input
            value={String(opening)}
            inputMode="numeric"
            onChange={(e) => {
              const v = Number(e.target.value);
              adj.setCogs({ openingInventory: isFinite(v) ? v : 0 });
            }}
          />
        </Field>
        <Field label="Add: Purchases" className="md:col-span-2">
          <Input
            value={String(purchases)}
            inputMode="numeric"
            onChange={(e) => {
              const v = Number(e.target.value);
              adj.setCogs({ purchases: isFinite(v) ? v : 0 });
            }}
          />
        </Field>
        <Field label="Add: Direct Expenses" className="md:col-span-2">
          <Input
            value={String(directExpenses)}
            inputMode="numeric"
            onChange={(e) => {
              const v = Number(e.target.value);
              adj.setCogs({ directExpenses: isFinite(v) ? v : 0 });
            }}
          />
        </Field>
        <Field label="Less: Closing Inventory (Good)" className="md:col-span-3">
          <Input value={String(closingGood)} disabled className="bg-muted" />
        </Field>
        <div className="md:col-span-3 flex flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">COGS</div>
          <div className="mt-1 font-display tabular text-2xl">{formatNPR(cogs)}</div>
          {writtenOff > 0 && (
            <div className="text-xs text-muted-foreground">
              + {formatNPR(writtenOff)} written off (Expiry/Defect)
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function AccrualsSection() {
  const adj = useAdjustments();
  const [accountName, setAccountName] = useState("");
  const [kind, setKind] = useState<"prepaid" | "accrued">("prepaid");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    const a = Number(amount);
    if (!accountName || !isFinite(a) || a <= 0) return;
    adj.addAccrual({ accountName, kind, amount: a, notes });
    setAccountName("");
    setAmount("");
    setNotes("");
  };

  return (
    <Section
      title="Prepaid & Accrued expenses"
      description="Defer prepaid expenses to the Balance Sheet, or recognise accrued expenses not yet booked. Pick the underlying P&L ledger from the COA."
    >
      <div className="grid gap-3 md:grid-cols-12">
        <Field label="P&L ledger" className="md:col-span-4">
          <Select value={accountName} onValueChange={setAccountName}>
            <SelectTrigger>
              <SelectValue placeholder="Select expense ledger…" />
            </SelectTrigger>
            <SelectContent className="max-h-[320px]">
              {EXPENSE_LEDGERS.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Type" className="md:col-span-2">
          <Select value={kind} onValueChange={(v) => setKind(v as "prepaid" | "accrued")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="prepaid">Prepaid</SelectItem>
              <SelectItem value="accrued">Accrued</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Amount" className="md:col-span-2">
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
        </Field>
        <Field label="Notes" className="md:col-span-3">
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
        </Field>
        <div className="md:col-span-1 flex items-end">
          <Button onClick={submit} className="w-full">Add</Button>
        </div>
      </div>

      <EntriesTable
        empty="No accrual entries yet."
        head={["Ledger", "Type", "Amount", "Notes", ""]}
        rows={adj.accruals.map((a) => ({
          id: a.id,
          cells: [
            a.accountName,
            <span key="k" className={a.kind === "prepaid" ? "text-positive" : "text-negative"}>
              {a.kind === "prepaid" ? "Prepaid" : "Accrued"}
            </span>,
            <span key="a" className="tabular">{formatNPR(a.amount, { showZero: true })}</span>,
            <span key="n" className="text-muted-foreground">{a.notes ?? "—"}</span>,
          ],
          onRemove: () => adj.removeAccrual(a.id),
        }))}
      />
    </Section>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function EntriesTable({
  head,
  rows,
  empty,
}: {
  head: string[];
  rows: { id: string; cells: React.ReactNode[]; onRemove: () => void }[];
  empty: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="mt-6 rounded-md border border-dashed bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }
  return (
    <div className="mt-6 overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            {head.map((h, i) => (
              <th key={i} className={`px-4 py-2 text-left ${i >= 2 && i < head.length - 1 ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              {r.cells.map((c, i) => (
                <td
                  key={i}
                  className={`px-4 py-2.5 align-top ${i >= 2 && i < r.cells.length - 1 ? "text-right" : ""}`}
                >
                  {c}
                </td>
              ))}
              <td className="px-2 py-2 text-right">
                <button
                  type="button"
                  onClick={r.onRemove}
                  className="text-xs text-muted-foreground hover:text-negative"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EquitySection() {
  const adj = useAdjustments();
  const tb = useTrialBalance();

  const np = useMemo(
    () =>
      computeNetProfit({
        cyRows: tb.cy.rows,
        pyRows: tb.py.rows,
        closingStock: adj.closingStock,
        depreciation: adj.depreciation,
        accruals: adj.accruals,
        ledgerAdj: adj.ledgerAdj,
        cogs: adj.cogs,
      }),
    [tb.cy.rows, tb.py.rows, adj.closingStock, adj.depreciation, adj.accruals, adj.ledgerAdj, adj.cogs],
  );

  // TB-derived seeds (Cr balances → flip sign). Share Capital opening = PY closing,
  // closing = CY closing. Retained Earnings opening seeds from PY "Other Equity" closing.
  const scOpenTB = useMemo(
    () => -tbScheduleTotals(tb.py.rows, ["Share Capital"]).closing,
    [tb.py.rows],
  );
  const scCloseTB = useMemo(
    () => -tbScheduleTotals(tb.cy.rows, ["Share Capital"]).closing,
    [tb.cy.rows],
  );
  const reOpenTB = useMemo(
    () => -tbScheduleTotals(tb.py.rows, ["Other Equity"]).closing,
    [tb.py.rows],
  );

  const sc = adj.equity.shareCapital;
  const re = adj.equity.retainedEarnings;

  const scOpening = sc.opening ?? Math.round(scOpenTB);
  const scClosing = sc.closing ?? Math.round(scCloseTB);
  const scMovement = scClosing - scOpening;

  const reOpening = re.opening ?? Math.round(reOpenTB);
  const reClosing = reOpening + np.profitCy + (re.adjustments ?? 0);

  return (
    <Section
      title="Equity"
      description="Share Capital opening and closing; Other Equity opens from prior year, the year's net profit (after closing stock and all P&L adjustments) is added automatically, and you can post a final adjustment such as dividends."
    >
      <div className="mb-4 rounded-md border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        TB seeds · Share capital {formatNPR(scOpenTB, { showZero: true })} →{" "}
        {formatNPR(scCloseTB, { showZero: true })} · Other equity opening{" "}
        {formatNPR(reOpenTB, { showZero: true })}
        <button
          type="button"
          onClick={() => {
            adj.setShareCapital({ opening: null, closing: null });
            adj.setRetainedEarnings({ opening: null, adjustments: 0, note: "" });
          }}
          className="ml-3 underline hover:text-foreground"
        >
          Reset to TB
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Share capital
          </div>
          <div className="grid gap-3 md:grid-cols-12">
            <Field label="Opening" className="md:col-span-3">
              <Input
                value={String(scOpening)}
                inputMode="numeric"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  adj.setShareCapital({ opening: isFinite(v) ? v : 0 });
                }}
              />
            </Field>
            <Field label="Closing" className="md:col-span-3">
              <Input
                value={String(scClosing)}
                inputMode="numeric"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  adj.setShareCapital({ closing: isFinite(v) ? v : 0 });
                }}
              />
            </Field>
            <div className="md:col-span-3 flex flex-col">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Movement
              </div>
              <div
                className={`mt-1 font-display tabular text-lg ${
                  scMovement < 0 ? "text-negative" : ""
                }`}
              >
                {formatNPR(scMovement, { showZero: true })}
              </div>
              <div className="text-[11px] text-muted-foreground">Issue (+) / Buyback (−)</div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Other equity
          </div>
          <div className="grid gap-3 md:grid-cols-12">
            <Field label="Opening" className="md:col-span-3">
              <Input
                value={String(reOpening)}
                inputMode="numeric"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  adj.setRetainedEarnings({ opening: isFinite(v) ? v : 0 });
                }}
              />
            </Field>
            <div className="md:col-span-3 flex flex-col">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Net profit (auto)
              </div>
              <div
                className={`mt-1 font-display tabular text-lg ${
                  np.profitCy < 0 ? "text-negative" : "text-positive"
                }`}
              >
                {formatNPR(np.profitCy, { showZero: true })}
              </div>
              <div className="text-[11px] text-muted-foreground">
                After closing stock & all P&L adjustments
              </div>
            </div>
            <Field label="Adjustments (e.g. Dividend −)" className="md:col-span-3">
              <Input
                value={re.adjustments === 0 ? "" : String(re.adjustments)}
                placeholder="0"
                inputMode="numeric"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  adj.setRetainedEarnings({ adjustments: isFinite(v) ? v : 0 });
                }}
              />
            </Field>
            <div className="md:col-span-3 flex flex-col">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Closing</div>
              <div className="mt-1 font-display tabular text-lg">
                {formatNPR(reClosing, { showZero: true })}
              </div>
              <div className="text-[11px] text-muted-foreground">
                = Opening + Net profit + Adjustments
              </div>
            </div>
            <Field label="Adjustment note" className="md:col-span-12">
              <Input
                value={re.note ?? ""}
                placeholder="e.g. Dividend declared FY 2083-84"
                onChange={(e) => adj.setRetainedEarnings({ note: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default PlatformPage;
