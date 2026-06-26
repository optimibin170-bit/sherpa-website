import { useMemo, useState } from "react";
import ssaLogo from "@/assets/ssa-logo.jpg";
import {
  calculateTax,
  formatNPR,
  SLABS,
  type CalcInput,
  type FiscalYear,
  type Status,
} from "@/lib/tax";

const NUMBER_FIELD =
  "w-full rounded-xl border border-input bg-white px-3.5 py-2.5 text-sm text-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_2px_8px_-4px_rgba(20,60,110,0.12)] transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15";

const LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/75";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={LABEL}>{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function TaxCalculator() {
  const [fiscalYear, setFiscalYear] = useState<FiscalYear>("2082/83");
  const [status, setStatus] = useState<Status>("individual");
  const [monthlySalary, setMonthlySalary] = useState<number | "">("");
  const [monthsWorked, setMonthsWorked] = useState<number>(12);
  const [bonus, setBonus] = useState<number | "">("");
  const [ssf, setSsf] = useState<number | "">("");
  const [epf, setEpf] = useState<number | "">("");
  const [cit, setCit] = useState<number | "">("");
  const [lifeInsurance, setLifeInsurance] = useState<number | "">("");
  const [healthInsurance, setHealthInsurance] = useState<number | "">("");
  const [ssfContributor, setSsfContributor] = useState<boolean>(false);
  const [calculated, setCalculated] = useState(false);

  const num = (v: number | "") => (v === "" ? 0 : Number(v) || 0);
  const totalAnnual = num(monthlySalary) * monthsWorked + num(bonus);

  const input: CalcInput = {
    fiscalYear, status,
    monthlySalary: num(monthlySalary),
    monthsWorked,
    bonus: num(bonus),
    ssf: num(ssf), epf: num(epf), cit: num(cit),
    lifeInsurance: num(lifeInsurance),
    healthInsurance: num(healthInsurance),
    ssfContributor,
  };

  const result = useMemo(() => calculateTax(input), [
    fiscalYear, status, monthlySalary, monthsWorked, bonus,
    ssf, epf, cit, lifeInsurance, healthInsurance, ssfContributor,
  ]);

  const otherFY: FiscalYear = fiscalYear === "2082/83" ? "2083/84" : "2082/83";
  const altResult = useMemo(
    () => calculateTax({ ...input, fiscalYear: otherFY }),
    [input, otherFY],
  );

  const reset = () => {
    setMonthlySalary(""); setMonthsWorked(12); setBonus("");
    setSsf(""); setEpf(""); setCit("");
    setLifeInsurance(""); setHealthInsurance("");
    setSsfContributor(false); setCalculated(false);
  };

  return (
    <div className="min-h-screen surface-hero">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-border/60 backdrop-blur-md bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 rounded-full border border-border/60 bg-white/60 px-4 py-2 text-sm font-medium text-deep backdrop-blur-sm transition hover:bg-white/80">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
              Back
            </a>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mint to-teal blur-md opacity-50" />
              <img src={ssaLogo} alt="SSA logo" className="relative h-11 w-11 rounded-full ring-2 ring-white shadow-md" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold text-deep">SSA Tax Calculator</div>
              <div className="text-xs text-muted-foreground">Nepal salary income tax · FY 2082/83 & 2083/84</div>
            </div>
          </div>
          <span className="chip-3d hidden rounded-full px-4 py-1.5 text-xs font-semibold text-deep sm:inline-block">
            Nepal Progressive slab calculator
          </span>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <FloatingShapes />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-20 sm:pb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Salary Tax Calculator</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-deep sm:text-4xl md:text-5xl lg:text-6xl">
            Your take-home, <span className="bg-gradient-to-r from-teal to-mint bg-clip-text text-transparent">visualised.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground">
            A 3D, infographic-first salary tax calculator for Nepal. Progressive slab maths
            for FY 2082/83 and the FY 2083/84 budget — with SSF/EPF/CIT and insurance allowances baked in.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* FORM CARD */}
        <div className="surface-3d rounded-3xl border border-white/60 p-5 sm:p-8">
          <div className="flex items-start gap-3 border-b border-border/70 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-mint to-teal text-white shadow-md">
              Rs
            </div>
            <div>
              <h2 className="text-lg font-semibold text-deep">Salary & deductions</h2>
              <p className="text-sm text-muted-foreground">Income tax based on Nepal Government slabs</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Nature of employee *">
              <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={NUMBER_FIELD}>
                <option value="individual">Individual</option>
                <option value="married">Married</option>
              </select>
            </Field>
            <Field label="Fiscal year *">
              <select value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value as FiscalYear)} className={NUMBER_FIELD}>
                <option value="2082/83">2082/2083 (current)</option>
                <option value="2083/84">2083/2084 (budget proposal)</option>
              </select>
            </Field>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Income */}
            <div className="space-y-5 rounded-2xl bg-gradient-to-br from-white to-sky/50 p-5 ring-1 ring-border/60">
              <div className="flex items-center gap-2">
                <span className="text-lg">Income</span>
                <h3 className="text-base font-semibold text-deep">Annual income</h3>
              </div>
              <Field label="Monthly salary (Rs.)">
                <input type="number" min={0} placeholder="e.g. 50000" value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value === "" ? "" : Number(e.target.value))}
                  className={NUMBER_FIELD} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Months worked">
                  <input type="number" min={1} max={12} value={monthsWorked}
                    onChange={(e) => setMonthsWorked(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                    className={NUMBER_FIELD} />
                </Field>
                <Field label="Dashain bonus">
                  <input type="number" min={0} placeholder="0" value={bonus}
                    onChange={(e) => setBonus(e.target.value === "" ? "" : Number(e.target.value))}
                    className={NUMBER_FIELD} />
                </Field>
              </div>
              <Field label="Total annual income (Rs.)" hint="Auto: (salary x months) + bonus">
                <input readOnly value={formatNPR(totalAnnual)}
                  className={NUMBER_FIELD + " bg-secondary font-semibold text-deep"} />
              </Field>
            </div>

            {/* Deductions */}
            <div className="space-y-5 rounded-2xl bg-gradient-to-br from-white to-secondary/60 p-5 ring-1 ring-border/60">
              <div className="flex items-center gap-2">
                <span className="text-lg">Deductions</span>
                <h3 className="text-base font-semibold text-deep">Annual deductions</h3>
              </div>
              <Field label="Social Security Fund — SSF (Rs.)" hint="Contributors get the 1% first-slab tax waived">
                <input type="number" min={0} placeholder="0" value={ssf}
                  onChange={(e) => {
                    const v = e.target.value === "" ? "" : Number(e.target.value);
                    setSsf(v); setSsfContributor(Number(v) > 0);
                  }}
                  className={NUMBER_FIELD} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Provident fund — EPF">
                  <input type="number" min={0} placeholder="0" value={epf}
                    onChange={(e) => setEpf(e.target.value === "" ? "" : Number(e.target.value))}
                    className={NUMBER_FIELD} />
                </Field>
                <Field label="CIT (Rs.)">
                  <input type="number" min={0} placeholder="0" value={cit}
                    onChange={(e) => setCit(e.target.value === "" ? "" : Number(e.target.value))}
                    className={NUMBER_FIELD} />
                </Field>
              </div>
              <div className="rounded-xl border-l-4 border-primary bg-sky/60 px-4 py-3 text-sm text-deep">
                <span className="font-semibold">Info:</span> SSF + EPF + CIT combined cap:{" "}
                <strong>Rs. 5,00,000</strong> or 1/3 of income (whichever is lower).
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Life insurance" hint="Max Rs. 40,000">
                  <input type="number" min={0} placeholder="0" value={lifeInsurance}
                    onChange={(e) => setLifeInsurance(e.target.value === "" ? "" : Number(e.target.value))}
                    className={NUMBER_FIELD} />
                </Field>
                <Field label="Health insurance" hint="Max Rs. 20,000">
                  <input type="number" min={0} placeholder="0" value={healthInsurance}
                    onChange={(e) => setHealthInsurance(e.target.value === "" ? "" : Number(e.target.value))}
                    className={NUMBER_FIELD} />
                </Field>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_2fr]">
            <button type="button" onClick={reset}
              className="rounded-xl border border-input bg-white px-4 py-3 text-sm font-semibold text-deep transition hover:bg-muted">
              Reset
            </button>
            <button type="button" onClick={() => setCalculated(true)}
              className="btn-3d-primary hover:btn-3d-primary-hover rounded-xl px-4 py-3 text-sm font-semibold transition">
              Calculate & visualise
            </button>
          </div>
        </div>

        {/* RESULTS — INFOGRAPHIC */}
        {calculated && totalAnnual > 0 && (
          <section className="mt-12 space-y-8">
            {/* Hero infographic card */}
            <div className="surface-3d relative overflow-hidden rounded-3xl border border-white/60 p-6 sm:p-10">
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
                {/* Donut */}
                <div className="flex flex-col items-center">
                  <Donut3D
                    takeHome={result.takeHomeAnnual}
                    tax={result.totalTax}
                    deductions={result.totalDeductions}
                  />
                  <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs">
                    <Legend color="var(--mint)" label="Take-home" value={formatNPR(result.takeHomeAnnual)} />
                    <Legend color="var(--teal)" label="Deductions" value={formatNPR(result.totalDeductions)} />
                    <Legend color="var(--deep)" label="Tax" value={formatNPR(result.totalTax)} />
                  </div>
                </div>
                {/* Big numbers */}
                <div className="space-y-4">
                  <div className="chip-3d inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-deep">
                    FY {fiscalYear} · {status === "individual" ? "Individual" : "Married"}
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">You will pay</div>
                    <div className="font-display text-5xl font-semibold text-deep sm:text-6xl">
                      Rs. {formatNPR(result.totalTax)}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      approx Rs. {formatNPR(result.monthlyTax)} / month · effective rate{" "}
                      <span className="font-semibold text-primary">{(result.effectiveRate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                    <Stat3D icon="Money" tone="mint" label="Take-home / yr" value={`Rs. ${formatNPR(result.takeHomeAnnual)}`} />
                    <Stat3D icon="Calendar" tone="teal" label="Take-home / mo" value={`Rs. ${formatNPR(result.takeHomeMonthly)}`} />
                    <Stat3D icon="Chart" tone="sand" label="Deductions used" value={`Rs. ${formatNPR(result.totalDeductions)}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Slab bar chart */}
            <div className="surface-3d rounded-3xl border border-white/60 p-6 sm:p-8">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-deep">Slab-wise tax flow</h3>
                  <p className="text-sm text-muted-foreground">How each rupee of your income gets taxed.</p>
                </div>
                <div className="hidden text-right text-xs text-muted-foreground sm:block">
                  Taxable: <span className="font-semibold text-deep">Rs. {formatNPR(result.taxableIncome)}</span>
                </div>
              </div>
              <SlabBars breakdown={result.breakdown} />
            </div>

            {/* Money flow pictorial */}
            <div className="surface-3d rounded-3xl border border-white/60 p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold text-deep">Where your money goes</h3>
              <p className="text-sm text-muted-foreground">Gross income flows through deductions and tax into your pocket.</p>
              <MoneyFlow
                gross={result.grossIncome}
                deductions={result.totalDeductions}
                tax={result.totalTax}
                takeHome={result.takeHomeAnnual}
              />
            </div>

            {/* FY comparison */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FYCompareCard
                title={`FY ${fiscalYear}`}
                subtitle="Selected"
                highlighted
                tax={result.totalTax}
                takeHome={result.takeHomeAnnual}
                effective={result.effectiveRate}
              />
              <FYCompareCard
                title={`FY ${otherFY}`}
                subtitle={otherFY === "2083/84" ? "Budget proposal" : "Current law"}
                tax={altResult.totalTax}
                takeHome={altResult.takeHomeAnnual}
                effective={altResult.effectiveRate}
                delta={altResult.totalTax - result.totalTax}
              />
            </div>
          </section>
        )}

        {/* SLAB REFERENCE */}
        <section id="slabs" className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-deep sm:text-3xl">Nepal income tax slabs</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Each bracket applies only to the portion of income inside it. A higher rate never hits your entire salary.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <SlabCard
              title="FY 2082/83 (current)"
              tone="teal"
              note="In force until Shrawan 1, 2083 BS (mid-July 2026)."
              individual={SLABS["2082/83"].individual}
              married={SLABS["2082/83"].married}
            />
            <SlabCard
              title="FY 2083/84 (budget proposal)"
              tone="mint"
              note="Threshold doubled · top rate cut 39% to 29%. Same slabs for individual & married."
              individual={SLABS["2083/84"].individual}
              married={SLABS["2083/84"].married}
            />
          </div>
          <div className="mt-6 rounded-2xl border-l-4 border-primary bg-sky/50 px-5 py-4 text-sm text-deep">
            <strong>Social Security Tax:</strong> 1% on the first slab is waived for SSF contributors.{" "}
            <strong>Deduction caps:</strong> SSF + EPF + CIT up to Rs. 5,00,000 or 1/3 of income · Life insurance up to Rs. 40,000 · Health insurance up to Rs. 20,000.
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <img src={ssaLogo} alt="" className="h-6 w-6 rounded-full" />
            <span>© {new Date().getFullYear()} SSA · For informational use only.</span>
          </div>
          <span>Figures rounded to nearest rupee. Not a substitute for professional advice.</span>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------- Floating shapes ------------------------- */
function FloatingShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-gradient-to-br from-mint/60 to-teal/20 blur-3xl" />
      <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-sky to-teal/30 blur-3xl" />
      <svg className="absolute right-6 top-8 hidden h-32 w-32 sm:block" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="coin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="55" rx="34" ry="10" fill="rgba(20,60,110,0.12)" />
        <circle cx="50" cy="45" r="30" fill="url(#coin)" stroke="#0d9488" strokeWidth="2" />
        <text x="50" y="52" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f766e">Rs</text>
      </svg>
    </div>
  );
}

/* ------------------------- Donut 3D ------------------------- */
function Donut3D({ takeHome, tax, deductions }: { takeHome: number; tax: number; deductions: number }) {
  const total = Math.max(1, takeHome + tax + deductions);
  const segs = [
    { value: takeHome, color: "var(--mint, #a7f3d0)" },
    { value: deductions, color: "var(--teal, #14b8a6)" },
    { value: tax, color: "var(--deep, #1e3a5f)" },
  ];
  const r = 80;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const takeHomePct = (takeHome / total) * 100;

  return (
    <div className="relative">
      <svg viewBox="0 0 220 220" className="h-56 w-56 sm:h-64 sm:w-64 drop-shadow-[0_20px_30px_rgba(20,60,110,0.25)]">
        <defs>
          <radialGradient id="bg3d" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>
          <filter id="innerShadow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feOffset dx="0" dy="2" />
            <feComposite in2="SourceGraphic" operator="arithmetic" k2="-1" k3="1" />
          </filter>
        </defs>
        <ellipse cx="110" cy="200" rx="80" ry="10" fill="rgba(20,60,110,0.18)" />
        <circle cx="110" cy="110" r="100" fill="url(#bg3d)" />
        <g transform="translate(110 110) rotate(-90)">
          {segs.map((s, i) => {
            const len = (s.value / total) * c;
            const el = (
              <circle key={i} r={r} cx="0" cy="0" fill="none"
                stroke={s.color} strokeWidth="28"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
        </g>
        <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <circle cx="110" cy="110" r={r - 14} fill="white" />
        <text x="110" y="105" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="30" fontWeight="700" fill="#1e3a5f">
          {takeHomePct.toFixed(0)}%
        </text>
        <text x="110" y="128" textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b" letterSpacing="1">
          TAKE HOME
        </text>
      </svg>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-deep">Rs. {value}</span>
    </div>
  );
}

/* ------------------------- Stat 3D card ------------------------- */
function Stat3D({ icon, label, value, tone }: { icon: string; label: string; value: string; tone: "mint" | "teal" | "sand" }) {
  const bg =
    tone === "mint"
      ? "bg-gradient-to-br from-mint/30 to-mint/10"
      : tone === "teal"
        ? "bg-gradient-to-br from-sky to-teal/15"
        : "bg-gradient-to-br from-sand to-sand/40";
  return (
    <div className={`relative overflow-hidden rounded-2xl ${bg} p-4 ring-1 ring-white/70 shadow-[0_10px_25px_-15px_rgba(20,60,110,0.35)]`}>
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-base font-semibold text-deep">{value}</div>
    </div>
  );
}

/* ------------------------- Slab bars ------------------------- */
function SlabBars({ breakdown }: { breakdown: { from: number; to: number | null; rate: number; taxable: number; tax: number }[] }) {
  const max = Math.max(1, ...breakdown.map((b) => b.taxable));
  return (
    <div className="space-y-3">
      {breakdown.map((b, i) => {
        const pct = (b.taxable / max) * 100;
        return (
          <div key={i} className="grid grid-cols-[80px_1fr_80px] items-center gap-2 sm:grid-cols-[110px_1fr_120px] md:grid-cols-[160px_1fr_140px] sm:gap-3">
            <div className="text-xs text-muted-foreground">
              <div className="font-semibold text-deep">{(b.rate * 100).toFixed(0)}% band</div>
              <div className="truncate">
                {formatNPR(b.from + (i === 0 ? 0 : 1))} – {b.to === null ? "above" : formatNPR(b.to)}
              </div>
            </div>
            <div className="relative h-7 rounded-full bg-sky/60 shadow-inner overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${Math.max(pct, b.taxable > 0 ? 3 : 0)}%`,
                  background: "linear-gradient(180deg, #5eead4, #0d9488)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(0,30,80,0.18), 0 8px 14px -8px rgba(20,60,110,0.4)",
                }}
              />
              <span className="absolute inset-0 flex items-center px-3 text-[11px] font-semibold text-white mix-blend-luminosity">
                Rs. {formatNPR(b.taxable)}
              </span>
            </div>
            <div className="text-right text-sm font-semibold text-deep">Rs. {formatNPR(b.tax)}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------- Money flow pictorial ------------------------- */
function MoneyFlow({ gross, deductions, tax, takeHome }: { gross: number; deductions: number; tax: number; takeHome: number }) {
  const items = [
    { label: "Gross income", value: gross, bg: "#b8d8e8", dark: false },
    { label: "− Deductions", value: deductions, bg: "#a8d8c8", dark: false },
    { label: "− Tax", value: tax, bg: "#2a5068", dark: true },
    { label: "= Take-home", value: takeHome, bg: "#90c8a8", dark: false },
  ];
  const icons = ["💰", "🛡️", "🏛️", "🪙"];
  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-0">
      {items.map((it, i) => (
        <div key={i} className={i < items.length - 1 ? "contents" : "contents"}>
          <div className="flex-1 rounded-xl p-3 sm:p-4 md:p-5" style={{ backgroundColor: it.bg }}>
            <div className="text-lg sm:text-xl md:text-2xl mb-1">{icons[i]}</div>
            <div className={`text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-wider uppercase mb-1 ${it.dark ? "text-[#90c8b8]" : "text-[#2a5068]"}`}>
              {it.label}
            </div>
            <div className={`text-xs sm:text-sm md:text-base font-semibold ${it.dark ? "text-[#e0f5ec]" : "text-[#1a3a50]"}`}>
              Rs. {formatNPR(it.value)}
            </div>
          </div>
          {i < items.length - 1 && (
            <div className="hidden sm:flex items-center px-1 sm:px-1.5 shrink-0">
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                <path d="M2 10 H22 M16 4 L22 10 L16 16" stroke="#2a7a50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------- FY compare card ------------------------- */
function FYCompareCard({
  title, subtitle, tax, takeHome, effective, delta, highlighted,
}: {
  title: string; subtitle: string; tax: number; takeHome: number; effective: number;
  delta?: number; highlighted?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 ring-1 ring-white/60 shadow-[0_20px_40px_-20px_rgba(20,60,110,0.3)] ${
      highlighted ? "bg-gradient-to-br from-teal to-deep text-white" : "surface-3d text-deep"
    }`}>
      <div className={`text-[11px] font-semibold uppercase tracking-wider ${highlighted ? "text-white/80" : "text-muted-foreground"}`}>
        {subtitle}
      </div>
      <div className={`font-display text-2xl font-semibold ${highlighted ? "text-white" : "text-deep"}`}>{title}</div>
      <div className="mt-4 space-y-2 text-sm">
        <Row label="Total tax" value={`Rs. ${formatNPR(tax)}`} highlighted={highlighted} />
        <Row label="Take-home / yr" value={`Rs. ${formatNPR(takeHome)}`} highlighted={highlighted} />
        <Row label="Effective rate" value={`${(effective * 100).toFixed(2)}%`} highlighted={highlighted} />
      </div>
      {typeof delta === "number" && (
        <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
          delta < 0 ? "bg-mint/30 text-deep" : "bg-white/20 text-white"
        }`}>
          {delta < 0 ? "▼" : "▲"} Rs. {formatNPR(Math.abs(delta))} {delta < 0 ? "less tax" : "more tax"} vs selected FY
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlighted }: { label: string; value: string; highlighted?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-b last:border-0 py-1 ${highlighted ? "border-white/15" : "border-border/60"}`}>
      <span className={highlighted ? "text-white/75" : "text-muted-foreground"}>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

/* ------------------------- Slab reference card ------------------------- */
function SlabCard({
  title, note, individual, married, tone,
}: {
  title: string; note: string;
  individual: { upTo: number | null; rate: number }[];
  married: { upTo: number | null; rate: number }[];
  tone: "teal" | "mint";
}) {
  const head =
    tone === "teal"
      ? "bg-gradient-to-r from-teal to-deep text-white"
      : "bg-gradient-to-r from-mint to-teal text-white";
  return (
    <div className="surface-3d overflow-hidden rounded-3xl border border-white/60">
      <div className={`px-5 py-3 ${head}`}>
        <h3 className="font-display text-base font-semibold">{title}</h3>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-xs text-muted-foreground">{note}</p>
        <SlabMiniTable title="Individual" slabs={individual} />
        <SlabMiniTable title="Married" slabs={married} />
      </div>
    </div>
  );
}

function SlabMiniTable({ title, slabs }: { title: string; slabs: { upTo: number | null; rate: number }[] }) {
  let prev = 0;
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold text-deep">{title}</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-sky/70 text-left text-[11px] font-semibold uppercase tracking-wider text-deep">
            <th className="rounded-l-md px-3 py-2">Income band (Rs.)</th>
            <th className="rounded-r-md px-3 py-2 text-right">Rate</th>
          </tr>
        </thead>
        <tbody>
          {slabs.map((s, i) => {
            const from = prev;
            const label =
              s.upTo === null
                ? `Above ${formatNPR(from)}`
                : `${i === 0 ? "Up to" : formatNPR(from + 1) + " —"} ${s.upTo === null ? "" : formatNPR(s.upTo)}`;
            prev = s.upTo ?? prev;
            return (
              <tr key={i} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-2 text-deep">{label}</td>
                <td className="px-3 py-2 text-right font-semibold text-deep">
                  {(s.rate * 100).toFixed(0)}%{i === 0 && <span className="text-primary">*</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
