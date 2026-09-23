export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card p-4">
      <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </div>
      {hint && <div className="mt-0.5 text-xs text-muted/70">{hint}</div>}
    </div>
  );
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}
