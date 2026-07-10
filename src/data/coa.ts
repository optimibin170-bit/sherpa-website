import raw from "./coa.json";

export type COAAccount = {
  classification: "Assets" | "Liabilities" | "PL";
  parent: string;
  category: string;
  category2: string;
  scheduleHead: string;
  name: string;
};

export const COA: COAAccount[] = raw as COAAccount[];

export type COANode = {
  key: string;
  label: string;
  count: number;
  children?: COANode[];
  accounts?: COAAccount[];
};

export function buildCOATree(accounts: COAAccount[] = COA): COANode[] {
  const root: Record<string, any> = {};
  for (const a of accounts) {
    const path = [a.classification, a.parent, a.category, a.category2, a.scheduleHead];
    let level = root;
    for (const seg of path) {
      level[seg] ??= { __accounts: [] as COAAccount[] };
      level = level[seg];
      (level as any).__accounts ??= [];
    }
    (level as any).__accounts.push(a);
  }
  const walk = (obj: any, depth: number): COANode[] =>
    Object.entries(obj)
      .filter(([k]) => !k.startsWith("__"))
      .map(([label, val]: [string, any]) => {
        const accounts: COAAccount[] = val.__accounts ?? [];
        const childKeys = Object.keys(val).filter((k) => !k.startsWith("__"));
        const children = childKeys.length && depth < 4 ? walk(val, depth + 1) : undefined;
        return {
          key: `${depth}:${label}`,
          label,
          count:
            depth === 4 ? accounts.length : (children?.reduce((s, c) => s + c.count, 0) ?? 0),
          children,
          accounts: depth === 4 ? accounts : undefined,
        };
      });
  return walk(root, 0);
}

export const CLASSIFICATION_LABEL: Record<string, string> = {
  Assets: "Assets",
  Liabilities: "Equity & Liabilities",
  PL: "Profit & Loss",
};
