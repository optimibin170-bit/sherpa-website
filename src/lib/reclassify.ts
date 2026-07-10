import { rowNet, type TBRow } from "@/store/trialBalance";
import { lookupSchedule, registerSchedule } from "./tbAggregate";

registerSchedule("Advance from customers", { classification: "Liabilities", parent: "Current Liabilities", category: "Financial Liabilities", category2: "Trade payables" });
registerSchedule("Advance to vendor", { classification: "Assets", parent: "Current Assets", category: "Financial Assets", category2: "Trade Receivables" });

export type ReclassifiedRow = TBRow & { reclassifiedFrom?: string };

const ADVANCE_FROM_CUSTOMERS = "Advance from customers";
const ADVANCE_TO_VENDOR = "Advance to vendor";

export function reclassifyRows(rows: TBRow[]): ReclassifiedRow[] {
  const out: ReclassifiedRow[] = [];
  for (const r of rows) {
    const head = (r.scheduleHead || "").trim().toLowerCase();
    const info = lookupSchedule(r.scheduleHead);
    const closing = rowNet(r);
    if (head === "trade receivables" && info?.classification === "Assets" && closing < 0) {
      out.push({ ...r, scheduleHead: ADVANCE_FROM_CUSTOMERS, accountName: `${ADVANCE_FROM_CUSTOMERS}  ·  from ${r.accountName}`, reclassifiedFrom: "Trade Receivables" });
      continue;
    }
    if (head === "trade payables" && info?.classification === "Liabilities" && closing > 0) {
      out.push({ ...r, scheduleHead: ADVANCE_TO_VENDOR, accountName: `${ADVANCE_TO_VENDOR}  ·  from ${r.accountName}`, reclassifiedFrom: "Trade Payables" });
      continue;
    }
    out.push(r);
  }
  return out;
}
