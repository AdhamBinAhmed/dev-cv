import type { Skill } from "@/lib/types";

const CATEGORY_STYLE: Record<Skill["category"], string> = {
  language: "border-accent/40 bg-accent/10 text-foreground",
  framework: "border-accent-2/40 bg-accent-2/10 text-foreground",
  tool: "border-border bg-surface-2 text-foreground",
  domain: "border-emerald-500/40 bg-emerald-500/10 text-foreground",
};

export function SkillsCloud({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) {
    return <p className="text-sm text-muted">Not enough data to infer skills.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={`${s.category}-${s.name}`}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${CATEGORY_STYLE[s.category]}`}
          title={`${s.category} · confidence ${s.weight}/100`}
        >
          {s.name}
          <span
            className="inline-block h-1.5 rounded-full bg-current opacity-60"
            style={{ width: `${Math.max(6, s.weight / 4)}px` }}
          />
        </span>
      ))}
    </div>
  );
}
