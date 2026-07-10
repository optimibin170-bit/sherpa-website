# Finstate — Financial Analysis Platform Integration

**Date:** 11 July 2026
**Project:** Sherpa Strategic Advisors Website
**URL:** https://sherpastrategicadvisor.com/know-yourself
**Status:** Live (deployed via Vercel)

---

## Overview

Finstate is an NFRS-aligned (Nepal Financial Reporting Standards) financial analysis platform that was originally a standalone TanStack Start application located at `/Users/navingiri/Desktop/ssa-finstst-main (1)/ssa-finstst-main/`. It was fully ported into the Sherpa Strategic Advisors website as a React + React Router SPA, integrated under the `/know-yourself/*` routes, and linked from the "Know Yourself" dropdown in the main navigation.

---

## What Was Built

### 1. Landing Page — `/know-yourself`

A workflow overview page that:
- Displays key stats (total ledgers, asset/liability/PL counts from the COA)
- Shows a 4-step workflow: COA → Trial Balance → Platform (Adjustments) → Financial Statements
- Provides quick links to all sub-pages: Balance Sheet, P&L, Cash Flow, Ratios, Report

### 2. Chart of Accounts — `/know-yourself/coa`

A teaching view of the NFRS-aligned chart of accounts with:
- **2,089 ledgers** loaded from `src/data/coa.json`
- Grouped into Classification → Parent → Category → Schedule Head
- Searchable (filters by schedule head, category, parent)
- Expandable tree with NFRS definitions at each level (via `src/pages/know-yourself/coaDefinitions.ts`)
- Workflow strip explaining how the COA connects to downstream reports

### 3. Trial Balance — `/know-yourself/trial-balance`

The data entry point:
- Company & period master (company name, fiscal year or custom date range)
- Auto-derives current year and prior year periods from FY notation (e.g. 2082-83)
- Excel upload (`.xlsx` / `.xls`) with auto-detection of header rows and column mapping
- Columns: Schedule Head, Account Name, Opening Bal(Dr/Cr), Debit/Credit Transaction, Closing Bal(Dr/Cr)
- Balance check (Dr − Cr must equal zero)
- Mapping diagnostics (unmapped schedule heads flagged)
- Balances-by-schedule-head summary table
- Drill-down ledger detail (expandable)
- Downloadable template with sample data

### 4. Platform (Adjustments) — `/know-yourself/platform`

A tabbed interface for year-end adjustments:
- **Closing Stock**: Add items by bucket (good / expired / defective), auto-calculated totals
- **Depreciation**: Add asset entries with rate%, opening WDV, additions — auto-calculated using WDV method
- **Prepaid / Accrued Expenses**: Add prepaid (asset) or accrued (liability) entries
- **COGS Overrides**: Override opening inventory, purchases, direct expenses if needed

### 5. Balance Sheet — `/know-yourself/balance-sheet`

Comparative NFRS Statement of Financial Position:
- Non-Current Assets, Current Assets, Equity, Non-Current Liabilities, Current Liabilities
- Drill-down hierarchy with expand/collapse controls (depth 0–5)
- Opening, Current Year, and Prior Year columns
- Platform adjustments (closing stock, prepaid, accrued) automatically included
- Balance check indicator (Assets vs Equity + Liabilities)
- Vertical & Horizontal Analysis panel (% of total, YoY change)

### 6. Profit & Loss — `/know-yourself/profit-loss`

Comparative NFRS Statement of Profit or Loss:
- Revenue, Other Income, COGS, Employee Benefits, Finance Costs, Depreciation, Selling & Distribution, Administrative, Other Expenses, Tax
- Drill-down from section → category → schedule head → ledger
- Opening, Current Year, Prior Year columns
- Platform adjustments integrated (closing stock reduces COGS, depreciation, prepaid/accrued)
- Net Profit computation with full adjustment chain
- Vertical & Horizontal Analysis panel

### 7. Cash Flow — `/know-yourself/cash-flow`

Cash Flow Statement (indirect method):
- Operating Activities: profit before tax, depreciation, working capital changes (receivables, inventory, prepaid, payables, accrued)
- Investing Activities: PPE purchases, intangible acquisitions, financial asset changes
- Financing Activities: net borrowings changes, interest paid
- Net increase/decrease in cash
- Warning banner noting this is simplified (not a full NAS 7 statement)

### 8. Ratio Analysis — `/know-yourself/ratios`

21 financial ratios across 5 categories:

| Category | Ratios |
|----------|--------|
| **Profitability** | Gross Profit Margin, Operating Profit Margin, Net Profit Margin, ROA, ROE, ROCE |
| **Liquidity** | Current Ratio, Quick Ratio, Cash Ratio, NWC/Revenue |
| **Leverage** | Debt-to-Equity, Debt-to-Assets, Equity Multiplier, Financial Leverage |
| **Solvency** | Interest Coverage, Equity Ratio, Long-Term Debt to Capital, Debt to EBITDA |
| **Efficiency** | DSO, DIO, DPO, Operating Cycle, Cash Conversion Cycle |

Each ratio includes:
- Formula text
- Plain-English definition
- Interpretation guidance
- Numerator/denominator breakdown tables
- Current year vs prior year with YoY % change

### 9. Report Generator — `/know-yourself/report`

One-click financial report that opens in a new window (printable / save as PDF):
- Executive summary with key highlights
- P&L summary table
- Balance Sheet summary table
- Full ratio analysis table (21 ratios)
- Auto-generated recommendations (liquidity, margin, leverage, unmapped heads, inventory)
- Notes section with platform adjustments applied

---

## Architecture

### Data Flow

```
Excel Upload (Trial Balance)
        ↓
    Trial Balance Store (Zustand + persist)
        ↓
    Chart of Accounts (2,089 ledgers)
        ↓
    Platform Adjustments (Zustand + persist)
        ↓
    ┌────────────┬──────────────┬─────────────┬──────────┐
    ↓            ↓              ↓             ↓          ↓
Balance Sheet  P&L     Cash Flow      Ratios     Report
```

### File Structure

```
src/
├── data/
│   ├── coa.ts              # COA type definitions + tree builder
│   └── coa.json            # 2,089 ledger definitions (394KB)
├── store/
│   ├── trialBalance.ts     # Zustand store: TB data, master company/period
│   └── adjustments.ts      # Zustand store: closing stock, depreciation, accruals
├── lib/
│   ├── format.ts           # formatNPR() — Nepali Rupee formatting
│   ├── tbAggregate.ts      # Schedule head lookup, classification, grouping
│   ├── hierarchy.ts        # Balance Sheet / P&L hierarchy builder
│   ├── computeNetProfit.ts # Net profit computation with all adjustments
│   ├── reclassify.ts       # Trade receivables/payables reclassification
│   ├── depreciationAllocation.ts  # Accumulated depreciation allocation
│   ├── unmapped.ts         # Unmapped schedule head detection
│   └── ratios.ts           # 21 ratio calculators, 5 categories
└── pages/know-yourself/
    ├── AppShell.tsx         # Layout wrapper with sidebar navigation
    ├── KnowYourselfLanding.tsx  # Landing page
    ├── COAPage.tsx          # Chart of Accounts browser
    ├── TrialBalancePage.tsx # Trial Balance upload & diagnostics
    ├── PlatformPage.tsx     # Adjustments (4 tabs)
    ├── BalanceSheetPage.tsx # Comparative Balance Sheet
    ├── ProfitLossPage.tsx   # Comparative P&L
    ├── CashFlowPage.tsx     # Cash Flow Statement
    ├── RatiosPage.tsx       # Ratio Analysis
    ├── ReportPage.tsx       # Report Generator
    ├── HierarchyStatement.tsx   # Drill-down statement component
    ├── StatementShell.tsx       # Cash flow statement table
    ├── AnalysisPanel.tsx        # Vertical/horizontal analysis
    ├── UnmappedLedgers.tsx      # Unmapped ledger display
    └── coaDefinitions.ts        # NFRS definitions for COA nodes
```

### Dependencies Added

| Package | Purpose |
|---------|---------|
| `xlsx` | Excel file parsing (Trial Balance upload) |
| `zustand` | State management with localStorage persistence |

### Routes Added

| Route | Page |
|-------|------|
| `/know-yourself` | Landing page |
| `/know-yourself/coa` | Chart of Accounts |
| `/know-yourself/trial-balance` | Trial Balance |
| `/know-yourself/platform` | Platform (Adjustments) |
| `/know-yourself/balance-sheet` | Balance Sheet |
| `/know-yourself/profit-loss` | Profit & Loss |
| `/know-yourself/cash-flow` | Cash Flow |
| `/know-yourself/ratios` | Ratio Analysis |
| `/know-yourself/report` | Report Generator |

### Navigation

A "Finstate · Financial Analysis" link was added to the "Know Yourself" dropdown in both the desktop navbar and mobile hamburger menu.

### Sitemap

All 9 new routes were added to `public/sitemap.xml` with appropriate priority levels.

---

## Bug Fixes Applied

1. **Blank P&L page**: `closingStock` was destructured as `closingStock` but referenced as `stock` in JSX, causing a runtime crash. Fixed by aliasing in destructuring: `const { closingStock: stock, ... } = useAdjustments()`.

2. **Rolldown build error**: Nested template literals in JSX (ternary inside template literal inside JSX expression) caused a Vite 8 / Rolldown parse error. Fixed by extracting the complex expression into a separate variable.

---

## How to Use

1. Navigate to **Know Yourself → Finstate · Financial Analysis** in the navbar
2. Start at **Chart of Accounts** to understand the ledger structure
3. Go to **Trial Balance** → set company name and fiscal year → upload Excel file
4. Go to **Platform** → enter closing stock, depreciation, prepaid/accrued adjustments
5. View **Balance Sheet**, **P&L**, **Cash Flow** — all auto-populated
6. Check **Ratio Analysis** for 21 financial ratios
7. Click **Generate Report** to open a printable PDF-ready financial report

---

## Notes

- All data is stored in the browser's localStorage (Zustand persist) — no server-side storage
- Prior year data can be uploaded separately for comparative statements
- The Trial Balance template can be downloaded from the upload page
- Unmapped schedule heads are flagged in diagnostics — these should be reviewed before generating reports
- The Cash Flow statement is simplified; for a complete NAS 7 statement, reconcile with bank statements
