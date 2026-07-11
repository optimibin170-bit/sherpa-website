// Plain-language definitions for Chart of Accounts nodes.
// Keys match the labels used in coa.json at each hierarchy level.

export type COADefinition = {
  what: string;
  contains: string;
  nfrs?: string;
};

export const CLASSIFICATION_DEFS: Record<string, COADefinition> = {
  Assets: {
    what: "Resources the entity controls that are expected to yield future economic benefits.",
    contains: "Cash, receivables, inventory, PPE, intangibles, tax assets.",
    nfrs: "Presented on the Statement of Financial Position, split between Current and Non-Current per NAS 1.",
  },
  Liabilities: {
    what: "Present obligations arising from past events plus the residual interest of owners (equity).",
    contains: "Borrowings, trade payables, tax and statutory dues, share capital and reserves.",
    nfrs: "NAS 1 requires separate presentation of equity and liabilities, and current vs non-current liabilities.",
  },
  PL: {
    what: "Income earned and expenses incurred during the reporting period.",
    contains: "Revenue, cost of sales, operating and administrative expenses, finance costs, tax expense.",
    nfrs: "Feeds the Statement of Profit or Loss and Other Comprehensive Income (NAS 1).",
  },
};

export const PARENT_DEFS: Record<string, COADefinition> = {
  "Non-Current Assets": {
    what: "Assets not expected to be realised within 12 months of the reporting date.",
    contains: "PPE, intangible assets, long-term investments, deferred tax assets.",
    nfrs: "NAS 16 (PPE), NAS 38 (Intangibles), NAS 12 (Deferred tax).",
  },
  "Current Assets": {
    what: "Assets expected to be converted to cash, sold, or consumed within the operating cycle or 12 months.",
    contains: "Inventories, trade receivables, cash & equivalents, prepayments, current tax assets.",
    nfrs: "NAS 1.66 defines current classification.",
  },
  "Current Liabilities": {
    what: "Obligations due to be settled within 12 months of the reporting date.",
    contains: "Short-term borrowings, trade payables, tax payable, accrued expenses.",
    nfrs: "NAS 1.69 current liability criteria.",
  },
  "Non-Current Liabilities": {
    what: "Obligations not due within 12 months.",
    contains: "Long-term borrowings, lease liabilities, deferred tax, long-term provisions.",
    nfrs: "NAS 1, NFRS 16 for lease liabilities.",
  },
  Equity: {
    what: "Residual interest of owners in the assets after deducting liabilities.",
    contains: "Share capital, share premium, retained earnings, reserves.",
    nfrs: "Statement of Changes in Equity (NAS 1) tracks movements.",
  },
  Revenue: {
    what: "Income from the entity's ordinary activities.",
    contains: "Sales of goods, rendering of services, other operating income.",
    nfrs: "Recognised under NFRS 15 using the 5-step model.",
  },
  "Other Income": {
    what: "Gains and income outside the entity's principal revenue streams.",
    contains: "Interest income, gain on disposal, foreign exchange gains, misc. recoveries.",
  },
  "Operating Expenses": {
    what: "Costs incurred to run the business day to day.",
    contains: "Cost of purchases, employee benefits, administrative and selling expenses, depreciation.",
    nfrs: "May be presented by nature or by function (NAS 1.99).",
  },
  "Finance Costs": {
    what: "Costs of borrowing and financing the entity.",
    contains: "Interest on loans, bank charges on borrowings, unwinding of discounts.",
    nfrs: "NAS 23 governs capitalisation to qualifying assets.",
  },
  "Tax Expense": {
    what: "Current and deferred tax charged to profit or loss.",
    contains: "Current income tax, deferred tax movements.",
    nfrs: "NAS 12 Income Taxes.",
  },
};

export const CATEGORY_DEFS: Record<string, COADefinition> = {
  "Property, Plant and Equipment": {
    what: "Tangible assets held for use in operations, expected to be used for more than one period.",
    contains: "Land, buildings, vehicles, computers, furniture, plant & machinery, related accumulated depreciation.",
    nfrs: "NAS 16 — recognised at cost, depreciated systematically over useful life.",
  },
  "Intangible assets": {
    what: "Identifiable non-monetary assets without physical substance.",
    contains: "Software licences, trademarks, goodwill separately identified, related accumulated amortisation.",
    nfrs: "NAS 38 — amortised over useful life if finite.",
  },
  "Financial Assets": {
    what: "Cash, equity instruments of other entities, and contractual rights to receive cash.",
    contains: "Cash & equivalents, trade receivables, investments, other financial assets (deposits, margins).",
    nfrs: "NFRS 9 classification: amortised cost, FVOCI, or FVTPL.",
  },
  "Current Tax Assets": {
    what: "Amounts recoverable from tax authorities for the current period.",
    contains: "Advance income tax, TDS receivable, ATR balances.",
    nfrs: "NAS 12.",
  },
  "Financial Liabilities": {
    what: "Contractual obligations to deliver cash or another financial asset.",
    contains: "Borrowings (overdrafts, term loans), trade payables, other financial payables.",
    nfrs: "NFRS 9 — usually measured at amortised cost.",
  },
  "Other current liabilities": {
    what: "Short-term obligations that are not financial or tax liabilities.",
    contains: "Statutory dues (TDS, VAT, SSF), accrued expenses, director accounts, advances from customers.",
  },
  "Share Capital": {
    what: "Nominal value of equity instruments issued to owners.",
    contains: "Ordinary share capital, promoter capital contributions.",
  },
  "Reserves and Surplus": {
    what: "Accumulated earnings and other components of equity.",
    contains: "Retained earnings, general reserve, revaluation surplus.",
  },
  "Administrative Expenses": {
    what: "General running costs not tied to production or selling.",
    contains: "Audit fees, legal & professional, office rent, subscriptions, utilities.",
  },
  "Selling and Distribution Expenses": {
    what: "Costs incurred to market, sell and deliver goods and services.",
    contains: "Advertising, business promotion, cargo & couriers, sales commissions.",
  },
  Purchase: {
    what: "Direct cost of goods bought for resale or consumption.",
    contains: "Cost of imports, freight-in, direct duties, direct expenses.",
  },
  "Employee Benefits Expense": {
    what: "All forms of consideration given to employees for services rendered.",
    contains: "Salaries & wages, allowances, bonuses, SSF & PF contributions, gratuity.",
    nfrs: "NAS 19 Employee Benefits.",
  },
  "Finance Costs": {
    what: "Cost of using borrowed funds.",
    contains: "Interest on overdrafts, term loans, TR, WCL; loan processing fees.",
  },
  "Depreciation and Amortization": {
    what: "Systematic allocation of the depreciable amount of an asset over its useful life.",
    contains: "Depreciation on PPE, amortisation of intangibles.",
  },
};

export const SCHEDULE_DEFS: Record<string, COADefinition> = {
  "Cash & Cash Equivalents": {
    what: "Cash on hand plus short-term, highly liquid deposits readily convertible to known amounts of cash.",
    contains: "Cash in hand, current & savings bank accounts, deposits ≤ 3 months.",
    nfrs: "NAS 7 defines cash equivalents (≤3 months, insignificant risk of value change).",
  },
  "Trade Receivables": {
    what: "Amounts due from customers for goods sold or services rendered in the ordinary course of business.",
    contains: "Individual debtor ledgers (hospitals, distributors, retail customers).",
    nfrs: "Impaired under NFRS 9 expected credit loss model.",
  },
  "Trade payables": {
    what: "Amounts owed to suppliers for goods or services received but not yet paid.",
    contains: "Vendor / supplier ledgers, import creditors.",
  },
  "Other Creditors": {
    what: "Payables that are not core trade suppliers.",
    contains: "Service providers, one-off vendors, expense creditors.",
  },
  Borrowings: {
    what: "Funds raised from banks or financial institutions carrying interest.",
    contains: "Overdraft, working capital loans, term loans, trust receipts.",
  },
  Overdraft: {
    what: "Short-term borrowing facility drawn against a bank account.",
    contains: "OD balances by bank.",
  },
  "Bank Interest": {
    what: "Interest charged by banks on borrowing facilities.",
    contains: "Interest on CC, TR, WCL, force loans.",
  },
  "Bank Margins": {
    what: "Cash margins held with banks against guarantees or letters of credit.",
    contains: "LC margin, guarantee margin, NRB margin.",
  },
  Software: {
    what: "Intangible software assets acquired for internal use.",
    contains: "Accounting software, ERP licences, related amortisation.",
  },
  "Computer & Peripherals": {
    what: "IT hardware used in operations.",
    contains: "Laptops, desktops, printers, network equipment.",
  },
  "Furniture & Fixtures": {
    what: "Office furniture and fittings used in operations.",
    contains: "Desks, chairs, cabinets, partitions.",
  },
  Vehicles: {
    what: "Motor vehicles owned and used by the entity.",
    contains: "Cars, bikes, delivery vans.",
  },
  "Other Assets": {
    what: "PPE items not fitting other schedule heads.",
    contains: "Miscellaneous fixed assets and their accumulated depreciation.",
  },
  "Advance Income tax": {
    what: "Income tax paid in advance recoverable against the year's assessed liability.",
    contains: "Instalment tax payments to IRD.",
  },
  ATR: {
    what: "Advance Tax Return / receivable balances with the tax authority.",
    contains: "ATR (IRD), ATR receivable.",
  },
  "Audit Fees": {
    what: "Fees for statutory and other audits.",
    contains: "External audit, internal audit, tax audit fees.",
  },
  "Audit Fee Payable": {
    what: "Accrued audit fees not yet paid.",
    contains: "Accrual for audit engagement.",
  },
  "Bank Charges": {
    what: "Non-interest charges levied by banks.",
    contains: "Cheque, remittance, SMS, service charges.",
  },
  "Business Promotion Expenses": {
    what: "Costs to promote the entity's products or brand.",
    contains: "Sponsorships, gifts to customers, promotional events.",
  },
  "Cargo & Couriers Expenses": {
    what: "Outbound logistics and courier costs.",
    contains: "Freight-out, courier bills, transporter charges.",
  },
  Subscriptions: {
    what: "Recurring fees for software, memberships or services.",
    contains: "Software AMCs, professional body memberships.",
  },
  "Share Capital": {
    what: "Owner capital contributions.",
    contains: "Individual promoter capital ledgers.",
  },
  "Director Accounts": {
    what: "Balances with directors that are not share capital.",
    contains: "Director loans, current accounts with directors.",
  },
  "Direct Expenses": {
    what: "Expenses directly attributable to acquiring goods for resale.",
    contains: "Import bank charges, clearing charges, freight-in.",
  },
};

export function definitionFor(
  depth: number,
  label: string,
): COADefinition | undefined {
  if (depth === 0) return CLASSIFICATION_DEFS[label];
  if (depth === 1) return PARENT_DEFS[label];
  if (depth === 2 || depth === 3) return CATEGORY_DEFS[label];
  if (depth === 4) return SCHEDULE_DEFS[label];
  return undefined;
}

// Short descriptor of the kinds of ledgers a schedule head typically contains,
// so we can show examples without exposing individual ledger names.
export function exampleDescriptor(scheduleHead: string): string {
  const s = SCHEDULE_DEFS[scheduleHead];
  if (s) return s.contains;
  return "Individual ledger accounts posted under this schedule head.";
}