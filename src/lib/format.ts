export function formatNPR(amount: number, opts: { showZero?: boolean } = {}) {
  if (!isFinite(amount)) return "—";
  if (amount === 0 && !opts.showZero) return "—";
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  return amount < 0 ? `(${formatted})` : formatted;
}
