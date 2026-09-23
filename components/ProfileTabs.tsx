"use client";

import { useState } from "react";
import type { Portfolio } from "@/lib/types";
import { LanguageBar } from "./LanguageBar";
import { SkillsCloud } from "./SkillsCloud";
import { ProjectCard } from "./ProjectCard";
import { ContributionGraph } from "./ContributionGraph";

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function PortfolioView({ data }: { data: Portfolio }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Section title="Skills">
        <SkillsCloud skills={data.skills} />
      </Section>

      <Section title="Languages">
        <LanguageBar languages={data.languages} />
      </Section>

      <div className="cv-page-break lg:col-span-2">
        <Section title="Contribution activity">
          <ContributionGraph data={data.contributions} />
        </Section>
      </div>

      <div className="lg:col-span-2">
        <Section title="Top projects">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.topProjects.map((p) => (
              <ProjectCard key={p.repo.id} project={p} />
            ))}
          </div>
        </Section>
      </div>

      <div className="lg:col-span-2">
        <Section title="Most active projects">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.mostActive.map((p) => (
              <ProjectCard key={p.repo.id} project={p} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function CVView({ data }: { data: Portfolio }) {
  const { user, stats } = data;
  return (
    <div className="card mx-auto max-w-3xl p-5 sm:p-8">
      <header className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold">{user.name ?? user.login}</h2>
        <p className="text-muted">
          {user.bio ?? `Software developer — github.com/${user.login}`}
        </p>
        <p className="mt-1 text-sm text-muted">
          {[user.location, user.company, `github.com/${user.login}`]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 py-5 sm:grid-cols-4">
        {[
          ["Repositories", stats.totalRepos],
          ["Stars earned", stats.totalStars],
          ["Followers", stats.followers],
          ["Years on GitHub", stats.accountAgeYears],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="text-xl font-bold">{value}</div>
            <div className="text-xs uppercase tracking-wide text-muted">
              {label}
            </div>
          </div>
        ))}
      </div>

      <CVBlock title="Technical skills">
        <p className="text-sm leading-relaxed text-foreground/90">
          {data.skills.map((s) => s.name).join("  ·  ")}
        </p>
      </CVBlock>

      <CVBlock title="Top languages">
        <p className="text-sm leading-relaxed text-foreground/90">
          {data.languages
            .slice(0, 6)
            .map((l) => `${l.name} (${l.percent.toFixed(0)}%)`)
            .join("  ·  ")}
        </p>
      </CVBlock>

      <CVBlock title="Selected projects">
        <ul className="space-y-3">
          {data.topProjects.slice(0, 5).map((p) => (
            <li key={p.repo.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{p.repo.name}</span>
                <span className="text-xs text-muted">
                  ★ {p.repo.stargazers_count} · quality {p.quality.score}/100
                </span>
              </div>
              <p className="text-sm text-muted">
                {p.repo.description ?? "—"}
              </p>
            </li>
          ))}
        </ul>
      </CVBlock>
    </div>
  );
}

function CVBlock({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-t border-border py-4 ${className}`}>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-accent-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ProfileTabs({ data }: { data: Portfolio }) {
  const [tab, setTab] = useState<"portfolio" | "cv">("portfolio");

  return (
    <div>
      <div className="no-print mb-5 inline-flex rounded-xl border border-border bg-surface p-1">
        {(
          [
            ["portfolio", "Portfolio"],
            ["cv", "Interactive CV"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "portfolio" ? (
        <PortfolioView data={data} />
      ) : (
        <CVView data={data} />
      )}
    </div>
  );
}
