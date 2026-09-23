import type { LanguageStat } from "@/lib/types";

export function LanguageBar({ languages }: { languages: LanguageStat[] }) {
  const top = languages.slice(0, 8);
  if (top.length === 0) {
    return <p className="text-sm text-muted">No language data available.</p>;
  }

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2">
        {top.map((l) => (
          <div
            key={l.name}
            title={`${l.name} — ${l.percent.toFixed(1)}%`}
            style={{ width: `${l.percent}%`, background: l.color }}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        {top.map((l) => (
          <li key={l.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: l.color }}
            />
            <span className="text-foreground">{l.name}</span>
            <span className="ml-auto tabular-nums text-muted">
              {l.percent.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
