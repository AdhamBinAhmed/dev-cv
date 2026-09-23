import { langColor } from "./colors";
import type {
  GitHubUser,
  GitHubRepo,
  ContributionCalendar,
  LanguageStat,
  Skill,
  AnalyzedProject,
  ProjectQuality,
  ProfileStats,
  Portfolio,
} from "./types";

/* Map GitHub topics / keywords to a normalized skill with a category. */
const SKILL_MAP: Record<string, { name: string; category: Skill["category"] }> =
  {
    react: { name: "React", category: "framework" },
    nextjs: { name: "Next.js", category: "framework" },
    "next-js": { name: "Next.js", category: "framework" },
    vue: { name: "Vue", category: "framework" },
    angular: { name: "Angular", category: "framework" },
    svelte: { name: "Svelte", category: "framework" },
    nodejs: { name: "Node.js", category: "framework" },
    "node-js": { name: "Node.js", category: "framework" },
    express: { name: "Express", category: "framework" },
    nestjs: { name: "NestJS", category: "framework" },
    django: { name: "Django", category: "framework" },
    flask: { name: "Flask", category: "framework" },
    fastapi: { name: "FastAPI", category: "framework" },
    rails: { name: "Ruby on Rails", category: "framework" },
    laravel: { name: "Laravel", category: "framework" },
    spring: { name: "Spring", category: "framework" },
    flutter: { name: "Flutter", category: "framework" },
    tailwindcss: { name: "Tailwind CSS", category: "framework" },
    tailwind: { name: "Tailwind CSS", category: "framework" },
    graphql: { name: "GraphQL", category: "tool" },
    docker: { name: "Docker", category: "tool" },
    kubernetes: { name: "Kubernetes", category: "tool" },
    k8s: { name: "Kubernetes", category: "tool" },
    terraform: { name: "Terraform", category: "tool" },
    aws: { name: "AWS", category: "tool" },
    gcp: { name: "Google Cloud", category: "tool" },
    azure: { name: "Azure", category: "tool" },
    postgresql: { name: "PostgreSQL", category: "tool" },
    postgres: { name: "PostgreSQL", category: "tool" },
    mongodb: { name: "MongoDB", category: "tool" },
    redis: { name: "Redis", category: "tool" },
    mysql: { name: "MySQL", category: "tool" },
    prisma: { name: "Prisma", category: "tool" },
    supabase: { name: "Supabase", category: "tool" },
    firebase: { name: "Firebase", category: "tool" },
    vite: { name: "Vite", category: "tool" },
    webpack: { name: "Webpack", category: "tool" },
    "machine-learning": { name: "Machine Learning", category: "domain" },
    ml: { name: "Machine Learning", category: "domain" },
    "deep-learning": { name: "Deep Learning", category: "domain" },
    ai: { name: "AI", category: "domain" },
    "data-science": { name: "Data Science", category: "domain" },
    tensorflow: { name: "TensorFlow", category: "tool" },
    pytorch: { name: "PyTorch", category: "tool" },
    blockchain: { name: "Blockchain", category: "domain" },
    web3: { name: "Web3", category: "domain" },
    devops: { name: "DevOps", category: "domain" },
    "cli": { name: "CLI Tools", category: "domain" },
    api: { name: "API Design", category: "domain" },
    testing: { name: "Testing", category: "domain" },
  };

export function buildLanguageStats(
  perRepoLangs: Record<string, number>[],
): LanguageStat[] {
  const totals: Record<string, number> = {};
  for (const langs of perRepoLangs) {
    for (const [name, bytes] of Object.entries(langs)) {
      totals[name] = (totals[name] ?? 0) + bytes;
    }
  }
  const grand = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(totals)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: (bytes / grand) * 100,
      color: langColor(name),
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export function buildSkills(
  repos: GitHubRepo[],
  languages: LanguageStat[],
): Skill[] {
  const weights: Record<string, Skill> = {};

  const add = (
    name: string,
    category: Skill["category"],
    amount: number,
  ) => {
    if (!weights[name]) weights[name] = { name, category, weight: 0 };
    weights[name].weight += amount;
  };

  // Languages contribute proportionally to their byte share.
  for (const lang of languages.slice(0, 12)) {
    add(lang.name, "language", lang.percent);
  }

  // Topics + repo text keywords contribute per matching repo.
  for (const repo of repos) {
    if (repo.fork) continue;
    const text = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
    const tokens = new Set<string>([
      ...repo.topics.map((t) => t.toLowerCase()),
      ...text.split(/[^a-z0-9+#-]+/).filter(Boolean),
    ]);
    for (const token of tokens) {
      const hit = SKILL_MAP[token];
      if (hit) add(hit.name, hit.category, 8);
    }
  }

  // Normalize weights to 0..100 for display.
  const values = Object.values(weights);
  const max = Math.max(1, ...values.map((s) => s.weight));
  return values
    .map((s) => ({ ...s, weight: Math.round((s.weight / max) * 100) }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 24);
}

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

export function scoreQuality(repo: GitHubRepo): ProjectQuality {
  const signals = [
    { label: "Has description", met: Boolean(repo.description?.trim()) },
    { label: "Documented topics", met: repo.topics.length >= 2 },
    { label: "Open-source license", met: Boolean(repo.license?.spdx_id) },
    { label: "Live demo / homepage", met: Boolean(repo.homepage?.trim()) },
    { label: "Community traction", met: repo.stargazers_count >= 5 },
    { label: "Actively maintained", met: !repo.archived && daysSince(repo.pushed_at) < 365 },
  ];
  const met = signals.filter((s) => s.met).length;
  return { score: Math.round((met / signals.length) * 100), signals };
}

/** Recency-weighted activity: recent pushes dominate, stars/forks add a boost. */
export function activityScore(repo: GitHubRepo): number {
  const recency = Math.max(0, 365 - daysSince(repo.pushed_at)) / 365; // 0..1
  const traction = Math.log10(1 + repo.stargazers_count * 2 + repo.forks_count);
  return recency * 100 + traction * 15;
}

export function analyze(
  user: GitHubUser,
  repos: GitHubRepo[],
  perRepoLangs: Record<string, number>[],
  contributions: ContributionCalendar,
): Portfolio {
  const owned = repos.filter((r) => !r.fork);

  const languages = buildLanguageStats(perRepoLangs);
  const skills = buildSkills(repos, languages);

  const analyzed: AnalyzedProject[] = owned.map((repo) => ({
    repo,
    activityScore: activityScore(repo),
    quality: scoreQuality(repo),
  }));

  const topProjects = [...analyzed]
    .sort(
      (a, b) =>
        b.repo.stargazers_count - a.repo.stargazers_count ||
        b.quality.score - a.quality.score,
    )
    .slice(0, 6);

  const mostActive = [...analyzed]
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 6);

  const stats: ProfileStats = {
    totalStars: owned.reduce((s, r) => s + r.stargazers_count, 0),
    totalForks: owned.reduce((s, r) => s + r.forks_count, 0),
    totalRepos: owned.length,
    followers: user.followers,
    topLanguage: languages[0]?.name ?? null,
    accountAgeYears: Math.max(
      0,
      Math.round((daysSince(user.created_at) / 365) * 10) / 10,
    ),
    contributionsLastYear: contributions.totalContributions,
  };

  return {
    user,
    stats,
    languages,
    skills,
    topProjects,
    mostActive,
    contributions,
    generatedAt: new Date().toISOString(),
  };
}
