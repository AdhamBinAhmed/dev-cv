import type { AnalyzedProject } from "@/lib/types";
import { langColor } from "@/lib/colors";
import { formatNumber } from "./StatCard";

function QualityRing({ score }: { score: number }) {
  const hue = score >= 80 ? "#34d399" : score >= 55 ? "#fbbf24" : "#f87171";
  return (
    <div
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xs font-bold"
      style={{
        background: `conic-gradient(${hue} ${score * 3.6}deg, var(--surface-2) 0deg)`,
      }}
      title={`Project quality score: ${score}/100`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-surface">
        {score}
      </span>
    </div>
  );
}

export function ProjectCard({ project }: { project: AnalyzedProject }) {
  const { repo, quality } = project;
  return (
    <div className="card flex flex-col gap-3 p-4 transition-colors hover:border-accent/50">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="block truncate font-semibold text-foreground hover:text-accent-2"
          >
            {repo.name}
          </a>
          <p className="mt-1 line-clamp-2 min-h-[2.5rem] break-words text-sm text-muted">
            {repo.description ?? "No description provided."}
          </p>
        </div>
        <QualityRing score={quality.score} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: langColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span title="Stars">★ {formatNumber(repo.stargazers_count)}</span>
        <span title="Forks">⑂ {formatNumber(repo.forks_count)}</span>
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noreferrer"
            className="text-accent-2 hover:underline"
          >
            Live demo ↗
          </a>
        )}
      </div>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 5).map((t) => (
            <span
              key={t}
              className="max-w-full truncate rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
