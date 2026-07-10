import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "./AppShell";
import { COA, CLASSIFICATION_LABEL, buildCOATree, type COANode } from "@/data/coa";
import { Input } from "@/components/ui/input";
import { definitionFor, exampleDescriptor } from "./coaDefinitions";

export default function COAPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return COA;
    const needle = q.toLowerCase();
    return COA.filter((a) => a.scheduleHead.toLowerCase().includes(needle) || a.category.toLowerCase().includes(needle) || a.category2.toLowerCase().includes(needle) || a.parent.toLowerCase().includes(needle));
  }, [q]);
  const tree = useMemo(() => buildCOATree(filtered), [filtered]);
  return (
    <AppShell>
      <PageHeader
        eyebrow="Learning view"
        title="Chart of Accounts"
        description={`A teaching view of the NFRS-aligned chart of accounts — ${COA.length.toLocaleString()} ledgers grouped into Classification → Parent → Category → Schedule Head.`}
        actions={<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search schedule heads, categories, parents…" className="w-80" />}
      />
      <div className="px-4 py-6 md:px-8 md:py-8">
        <WorkflowStrip />
        <div className="grid gap-6 lg:grid-cols-3">
          {tree.map((node) => (
            <section key={node.key} className="rounded-lg border bg-card">
              <header className="flex items-baseline justify-between border-b px-5 py-4">
                <h2 className="font-display text-lg">{CLASSIFICATION_LABEL[node.label] ?? node.label}</h2>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{node.count.toLocaleString()} ledgers · {node.children?.length ?? 0} groups</span>
              </header>
              <NodeDefinition depth={0} label={node.label} />
              <div className="max-h-[640px] overflow-y-auto px-2 py-2">
                {node.children?.map((parent) => <TreeBranch key={parent.key} node={parent} depth={1} />)}
              </div>
            </section>
          ))}
        </div>
        {filtered.length === 0 && <div className="mt-10 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No groups match "{q}".</div>}
      </div>
    </AppShell>
  );
}

function WorkflowStrip() {
  const steps = [
    { k: "COA", title: "Chart of Accounts", body: "The taxonomy. Every ledger is tagged with a Classification, Parent, Category and Schedule Head so downstream reports can group correctly." },
    { k: "TB", title: "Trial Balance", body: "Period-end balances for every ledger. Debits must equal credits before anything else can be trusted." },
    { k: "Platform", title: "Adjustments", body: "Book NFRS-required adjustments (accruals, reclassifications, deferred tax) on top of the TB." },
    { k: "BS / P&L", title: "Financial Statements", body: "TB + adjustments are rolled up through the COA hierarchy into the Balance Sheet and Profit & Loss." },
  ];
  return (
    <section className="mb-8 rounded-lg border bg-muted/40 p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-base">How this fits together</h2>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Data flow for a new accountant</span>
      </div>
      <ol className="grid gap-3 md:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.k} className="relative rounded-md border bg-card p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.k}</span>
            </div>
            <div className="mt-1 font-medium">{s.title}</div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function NodeDefinition({ depth, label }: { depth: number; label: string }) {
  const def = definitionFor(depth, label);
  if (!def) return null;
  return (
    <div className="border-b bg-muted/30 px-5 py-3 text-xs leading-relaxed text-muted-foreground">
      <p className="text-foreground">{def.what}</p>
      <p className="mt-1"><span className="font-medium text-foreground/80">Typically contains: </span>{def.contains}</p>
      {def.nfrs && <p className="mt-1"><span className="font-medium text-foreground/80">NFRS: </span>{def.nfrs}</p>}
    </div>
  );
}

function TreeBranch({ node, depth }: { node: COANode; depth: number }) {
  const [open, setOpen] = useState(depth <= 1);
  const hasChildren = !!node.children?.length;
  const def = definitionFor(depth, node.label);
  const isLeafScheduleHead = depth === 4;
  const exampleCount = node.accounts?.length ?? 0;
  const expandable = hasChildren || !!def || isLeafScheduleHead;
  return (
    <div className="select-none">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-baseline justify-between rounded-md px-3 py-1.5 text-left text-sm hover:bg-muted" style={{ paddingLeft: `${depth * 12 + 8}px` }}>
        <span className="flex items-center gap-2">
          {expandable && <span className="font-mono text-xs text-muted-foreground">{open ? "−" : "+"}</span>}
          <span className={depth === 1 ? "font-medium" : ""}>{node.label}</span>
        </span>
        <span className="text-[11px] tabular-nums text-muted-foreground">{isLeafScheduleHead ? `${exampleCount} ledgers` : node.count}</span>
      </button>
      {open && def && <div className="mb-1 rounded-md bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground" style={{ marginLeft: `${depth * 12 + 20}px` }}>
        <p className="text-foreground/90">{def.what}</p>
        <p className="mt-1"><span className="font-medium text-foreground/80">Typically contains: </span>{def.contains}</p>
        {def.nfrs && <p className="mt-1"><span className="font-medium text-foreground/80">NFRS: </span>{def.nfrs}</p>}
      </div>}
      {open && hasChildren && <div>{node.children!.map((c) => <TreeBranch key={c.key} node={c} depth={depth + 1} />)}</div>}
      {open && isLeafScheduleHead && <div className="mb-2 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground" style={{ marginLeft: `${(depth + 1) * 12 + 16}px` }}>
        <div className="flex items-baseline justify-between"><span className="font-medium text-foreground/80">Example contents</span><span className="tabular-nums">{exampleCount} ledger{exampleCount === 1 ? "" : "s"} hidden</span></div>
        <p className="mt-1 leading-relaxed">{exampleDescriptor(node.label)}</p>
      </div>}
    </div>
  );
}
