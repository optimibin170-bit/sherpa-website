// Nepal income tax slab definitions and calculator
// Amounts in NPR. Rates apply progressively to portions falling in each band.

export type FiscalYear = "2082/83" | "2083/84";
export type Status = "individual" | "married";

export interface Slab {
  upTo: number | null; // null = infinity
  rate: number; // 0.01, 0.10, ...
}

export const SLABS: Record<FiscalYear, Record<Status, Slab[]>> = {
  "2082/83": {
    individual: [
      { upTo: 500_000, rate: 0.01 },
      { upTo: 700_000, rate: 0.10 },
      { upTo: 1_000_000, rate: 0.20 },
      { upTo: 2_000_000, rate: 0.30 },
      { upTo: 5_000_000, rate: 0.36 },
      { upTo: null, rate: 0.39 },
    ],
    married: [
      { upTo: 600_000, rate: 0.01 },
      { upTo: 800_000, rate: 0.10 },
      { upTo: 1_100_000, rate: 0.20 },
      { upTo: 2_000_000, rate: 0.30 },
      { upTo: 5_000_000, rate: 0.36 },
      { upTo: null, rate: 0.39 },
    ],
  },
  "2083/84": {
    individual: [
      { upTo: 1_000_000, rate: 0.01 },
      { upTo: 1_500_000, rate: 0.10 },
      { upTo: 2_500_000, rate: 0.20 },
      { upTo: 4_000_000, rate: 0.27 },
      { upTo: null, rate: 0.29 },
    ],
    married: [
      { upTo: 1_000_000, rate: 0.01 },
      { upTo: 1_500_000, rate: 0.10 },
      { upTo: 2_500_000, rate: 0.20 },
      { upTo: 4_000_000, rate: 0.27 },
      { upTo: null, rate: 0.29 },
    ],
  },
};

export interface CalcInput {
  fiscalYear: FiscalYear;
  status: Status;
  monthlySalary: number;
  monthsWorked: number;
  bonus: number;
  ssf: number;
  epf: number;
  cit: number;
  lifeInsurance: number;
  healthInsurance: number;
  ssfContributor: boolean;
}

export interface SlabBreakdown {
  from: number;
  to: number | null;
  rate: number;
  taxable: number;
  tax: number;
}

export interface CalcResult {
  grossIncome: number;
  retirementDeduction: number; // capped SSF+EPF+CIT
  retirementCap: number;
  lifeDeduction: number;
  healthDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  breakdown: SlabBreakdown[];
  totalTax: number;
  effectiveRate: number;
  monthlyTax: number;
  takeHomeAnnual: number;
  takeHomeMonthly: number;
}

export function calculateTax(input: CalcInput): CalcResult {
  const gross = Math.max(0, input.monthlySalary * input.monthsWorked + input.bonus);

  const retirementCap = Math.min(500_000, gross / 3);
  const retirementDeduction = Math.min(
    retirementCap,
    Math.max(0, input.ssf + input.epf + input.cit),
  );
  const lifeDeduction = Math.min(40_000, Math.max(0, input.lifeInsurance));
  const healthDeduction = Math.min(20_000, Math.max(0, input.healthInsurance));
  const totalDeductions = retirementDeduction + lifeDeduction + healthDeduction;

  const taxable = Math.max(0, gross - totalDeductions);

  const slabs = SLABS[input.fiscalYear][input.status];
  const breakdown: SlabBreakdown[] = [];
  let remaining = taxable;
  let prev = 0;
  let totalTax = 0;

  for (const slab of slabs) {
    if (remaining <= 0) break;
    const top = slab.upTo ?? Infinity;
    const bandSize = top - prev;
    const taxedHere = Math.min(remaining, bandSize);

    let effectiveRate = slab.rate;
    // First slab 1% waived for SSF contributors
    if (breakdown.length === 0 && input.ssfContributor) {
      effectiveRate = 0;
    }
    const tax = taxedHere * effectiveRate;
    breakdown.push({
      from: prev,
      to: slab.upTo,
      rate: effectiveRate,
      taxable: taxedHere,
      tax,
    });
    totalTax += tax;
    remaining -= taxedHere;
    prev = top;
  }

  const effectiveRate = taxable > 0 ? totalTax / taxable : 0;
  const monthlyTax = totalTax / Math.max(1, input.monthsWorked);
  const takeHomeAnnual = gross - totalTax;
  const takeHomeMonthly = takeHomeAnnual / Math.max(1, input.monthsWorked);

  return {
    grossIncome: gross,
    retirementDeduction,
    retirementCap,
    lifeDeduction,
    healthDeduction,
    totalDeductions,
    taxableIncome: taxable,
    breakdown,
    totalTax,
    effectiveRate,
    monthlyTax,
    takeHomeAnnual,
    takeHomeMonthly,
  };
}

// Nepali-style grouping: 1,00,000 (lakh) formatting
export function formatNPR(value: number): string {
  const sign = value < 0 ? "-" : "";
  const v = Math.abs(Math.round(value));
  const s = v.toString();
  if (s.length <= 3) return sign + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const withCommas = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return sign + withCommas + "," + last3;
}
