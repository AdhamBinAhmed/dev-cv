import type { ContributionCalendar } from "@/lib/types";

const LEVEL_COLORS = [
  "var(--surface-2)",
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
];

export function ContributionGraph({ data }: { data: ContributionCalendar }) {
  if (!data.available) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
        The contribution graph needs a{" "}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">
          GITHUB_TOKEN
        </code>{" "}
        (GitHub&apos;s contribution data is only available through the
        authenticated API). Add one to <code>.env.local</code> to enable it.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 text-sm text-muted">
        <span className="font-semibold text-foreground">
          {data.totalContributions.toLocaleString()}
        </span>{" "}
        contributions in the last year
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px]">
          {data.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className="h-[11px] w-[11px] rounded-[2px]"
                  style={{ background: LEVEL_COLORS[day.level] }}
                  title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted">
        <span>Less</span>
        {LEVEL_COLORS.map((c, i) => (
          <span
            key={i}
            className="h-[11px] w-[11px] rounded-[2px]"
            style={{ background: c }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
