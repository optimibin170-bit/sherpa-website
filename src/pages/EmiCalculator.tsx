import { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import ssaLogo from "@/assets/ssa-logo.jpg";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

function Slider({
  label, value, min, max, step, onChange, format, accent, icon, unit, inputStep,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  accent: string;
  icon: React.ReactNode;
  unit: string;
  inputStep?: number;
}) {
  const progress = ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const commit = (raw: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    onChange(Math.min(Math.max(n, min), max));
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl shrink-0" style={{ background: accent, color: "white" }}>
            {icon}
          </span>
          <span className="font-display font-semibold text-foreground truncate">{label}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-muted pl-3 pr-1.5 py-1 border border-border focus-within:ring-2 focus-within:ring-ring transition">
          <input
            type="number"
            value={focused ? draft : String(value)}
            min={min}
            max={max}
            step={inputStep ?? step}
            placeholder={`Enter ${label.toLowerCase()}`}
            onFocus={() => { setDraft(""); setFocused(true); }}
            onChange={(e) => { setDraft(e.target.value); if (e.target.value !== "") commit(e.target.value); }}
            onBlur={(e) => { setFocused(false); if (e.target.value === "") return; commit(e.target.value); }}
            className="w-20 sm:w-28 bg-transparent text-right font-display font-semibold text-foreground tabular-nums outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-muted-foreground/60 placeholder:font-normal placeholder:text-xs"
          />
          <span className="text-xs text-muted-foreground pr-2">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="brand-range"
        style={{ ["--progress" as string]: `${progress}%` }}
      />
      <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function MountainBackdrop() {
  return (
    <svg className="absolute inset-x-0 bottom-0 w-full h-48 md:h-64 pointer-events-none" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="mtn1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--emi-mountain)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--emi-mountain)" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="mtn2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--emi-forest)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--emi-forest)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path d="M0,220 L200,80 L320,180 L480,40 L640,180 L820,90 L980,200 L1200,120 L1200,300 L0,300 Z" fill="url(#mtn1)" />
      <path d="M0,260 L160,170 L300,230 L460,150 L620,240 L780,170 L940,250 L1100,180 L1200,220 L1200,300 L0,300 Z" fill="url(#mtn2)" />
      <g fill="white" opacity="0.85">
        <polygon points="200,80 175,120 225,120" />
        <polygon points="480,40 445,100 515,100" />
        <polygon points="820,90 790,140 850,140" />
      </g>
    </svg>
  );
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(1500000);
  const [rate, setRate] = useState(8.5);
  const [months, setMonths] = useState(240);

  const { emi, totalInterest, totalPayment, schedule } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = months;
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;

    let balance = principal;
    const schedule: { year: number; principal: number; interest: number; balance: number }[] = [];
    const years = Math.ceil(n / 12);
    for (let y = 1; y <= years; y++) {
      let yp = 0, yi = 0;
      const monthsThisYear = Math.min(12, n - (y - 1) * 12);
      for (let m = 0; m < monthsThisYear; m++) {
        const interest = balance * r;
        const principalPart = emi - interest;
        yp += principalPart;
        yi += interest;
        balance -= principalPart;
      }
      schedule.push({ year: y, principal: yp, interest: yi, balance: Math.max(balance, 0) });
    }
    return { emi, totalInterest, totalPayment, schedule };
  }, [principal, rate, months]);

  const pieData = [
    { name: "Principal", value: principal, color: "var(--emi-forest)" },
    { name: "Interest", value: totalInterest, color: "var(--emi-mountain)" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--emi-gradient-sky)" }}>
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-30"
           style={{ background: "radial-gradient(closest-side, var(--emi-peak), transparent 70%)" }} />
      <MountainBackdrop />

      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition hover:bg-white/70">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back
          </a>
          <div className="flex items-center gap-3">
            <img src={ssaLogo} alt="SSA" className="w-12 h-12 rounded-full ring-2 ring-white shadow-soft" />
            <div>
              <div className="font-display font-bold text-lg leading-tight text-foreground">SSA Finance</div>
              <div className="text-xs text-muted-foreground">Visual EMI Calculator</div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-foreground/70">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--emi-forest)" }} />
          Plan • Visualize • Decide
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        <section className="text-center max-w-2xl mx-auto mt-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Climb your <span style={{ color: "var(--emi-mountain)" }}>financial</span> peaks
          </h1>
          <p className="mt-3 text-muted-foreground">
            Slide, watch, and understand. Every rupee of your loan visualized.
          </p>
        </section>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-3 bg-card rounded-3xl p-6 md:p-8 shadow-elevated border border-border space-y-8">
            <Slider
              label="Loan Amount"
              value={principal}
              min={50000}
              max={20000000}
              step={10000}
              inputStep={1000}
              onChange={setPrincipal}
              format={(v) => `Rs ${inr(v)}`}
              accent="var(--emi-gradient-forest)"
              icon={<RupeeIcon />}
              unit="Rs"
            />
            <Slider
              label="Interest Rate"
              value={rate}
              min={1}
              max={20}
              step={0.05}
              inputStep={0.01}
              onChange={setRate}
              format={(v) => `${v.toFixed(2)} %`}
              accent="var(--emi-gradient-mountain)"
              icon={<PercentIcon />}
              unit="% p.a."
            />
            <Slider
              label="Loan Tenure"
              value={months}
              min={6}
              max={360}
              step={1}
              onChange={setMonths}
              format={(v) => `${v} mo • ${(v / 12).toFixed(1)} yr`}
              accent="linear-gradient(135deg, var(--emi-sun), #d4a017)"
              icon={<CalendarIcon />}
              unit="months"
            />

            {/* Quick stat strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
              <StatChip label="Monthly EMI" value={`Rs${inr(emi)}`} tone="mountain" big />
              <StatChip label="Total Interest" value={`Rs${inr(totalInterest)}`} tone="forest" />
              <StatChip label="Total Payable" value={`Rs${inr(totalPayment)}`} tone="sun" />
            </div>
          </div>

          {/* Pie + summary */}
          <div className="lg:col-span-2 bg-card rounded-3xl p-6 md:p-8 shadow-elevated border border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">Payment Breakup</h3>
              <span className="text-xs text-muted-foreground">Principal vs Interest</span>
            </div>
            <div className="relative h-64 mt-2">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={3} stroke="none">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `Rs ${inr(v)}`}
                    contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center pointer-events-none text-center">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">EMI</div>
                  <div className="font-display text-2xl font-bold text-foreground tabular-nums">Rs{inr(emi)}</div>
                  <div className="text-xs text-muted-foreground">/ month</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-2">
              <LegendBar label="Principal" amount={principal} total={totalPayment} color="var(--emi-forest)" />
              <LegendBar label="Interest" amount={totalInterest} total={totalPayment} color="var(--emi-mountain)" />
            </div>
          </div>
        </div>

        {/* Area chart - yearly */}
        <div className="mt-6 bg-card rounded-3xl p-6 md:p-8 shadow-elevated border border-border">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display font-semibold text-foreground">Year by year breakdown</h3>
              <p className="text-xs text-muted-foreground">How principal & interest stack up over your tenure</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <LegendDot color="var(--emi-forest)" label="Principal paid" />
              <LegendDot color="var(--emi-mountain)" label="Interest paid" />
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={schedule} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gP" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--emi-forest)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--emi-forest)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gI" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--emi-mountain)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--emi-mountain)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" tickFormatter={(y) => `Y${y}`} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `Rs${(v / 100000).toFixed(0)}L`} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number, n: string) => [`Rs ${inr(v)}`, n === "principal" ? "Principal" : n === "interest" ? "Interest" : "Balance"]}
                  labelFormatter={(l) => `Year ${l}`}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }}
                />
                <Area type="monotone" dataKey="principal" stroke="var(--emi-forest)" strokeWidth={2} fill="url(#gP)" stackId="1" />
                <Area type="monotone" dataKey="interest" stroke="var(--emi-mountain)" strokeWidth={2} fill="url(#gI)" stackId="1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <footer className="text-center mt-10 text-xs text-muted-foreground">
          Crafted with mountain calm • SSA Finance © {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}

function StatChip({ label, value, tone, big }: { label: string; value: string; tone: "mountain" | "forest" | "sun"; big?: boolean }) {
  const bg = tone === "mountain" ? "var(--emi-gradient-mountain)" : tone === "forest" ? "var(--emi-gradient-forest)" : "linear-gradient(135deg, var(--emi-sun), #d4a017)";
  return (
    <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-white shadow-soft overflow-hidden" style={{ background: bg }}>
      <div className="text-[8px] sm:text-[10px] uppercase tracking-wider opacity-90 truncate">{label}</div>
      <div className={`font-display font-bold tabular-nums truncate ${big ? "text-base sm:text-2xl" : "text-sm sm:text-lg"}`}>{value}</div>
    </div>
  );
}

function LegendBar({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-foreground flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
          {label}
        </span>
        <span className="text-muted-foreground tabular-nums">Rs{inr(amount)} • {pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function RupeeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h12M6 9h12M8 4c4 0 6 2 6 5s-2 5-6 5h-2l8 6"/></svg>;
}
function PercentIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
}
function CalendarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>;
}
