import type {
  GitHubUser,
  GitHubRepo,
  ContributionCalendar,
  ContributionDay,
} from "./types";

const API = "https://api.github.com";
const GQL = "https://api.github.com/graphql";
const REVALIDATE = 60 * 60; // 1h cache

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "dev-portfolio-generator",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export function hasToken(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: headers(),
    next: { revalidate: REVALIDATE },
  });

  if (res.status === 404) {
    throw new GitHubError("GitHub user not found.", 404);
  }
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      throw new GitHubError(
        "GitHub API rate limit reached. Add a GITHUB_TOKEN to raise the limit.",
        429,
      );
    }
    throw new GitHubError("GitHub API request was forbidden.", 403);
  }
  if (!res.ok) {
    throw new GitHubError(`GitHub API error (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

export async function getUser(username: string): Promise<GitHubUser> {
  return ghFetch<GitHubUser>(`/users/${encodeURIComponent(username)}`);
}

/** Fetch up to `maxPages` pages of the user's public repos (100 per page), newest first. */
export async function getRepos(
  username: string,
  maxPages = 3,
): Promise<GitHubRepo[]> {
  const all: GitHubRepo[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const repos = await ghFetch<GitHubRepo[]>(
      `/users/${encodeURIComponent(
        username,
      )}/repos?per_page=100&page=${page}&sort=pushed`,
    );
    all.push(...repos);
    if (repos.length < 100) break;
  }
  return all;
}

/** Byte-count breakdown of languages for a single repo. */
export async function getRepoLanguages(
  fullName: string,
): Promise<Record<string, number>> {
  try {
    return await ghFetch<Record<string, number>>(`/repos/${fullName}/languages`);
  } catch {
    return {};
  }
}

/**
 * Contribution calendar. Requires GITHUB_TOKEN (GraphQL is auth-only).
 * Returns { available: false } gracefully when no token is configured.
 */
export async function getContributions(
  username: string,
): Promise<ContributionCalendar> {
  if (!hasToken()) {
    return { totalContributions: 0, weeks: [], available: false };
  }

  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        contributionCalendar{
          totalContributions
          weeks{ contributionDays{ date contributionCount } }
        }
      }
    }
  }`;

  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return { totalContributions: 0, weeks: [], available: false };

    const json = await res.json();
    const cal =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return { totalContributions: 0, weeks: [], available: false };

    // Compute levels 0..4 from the day counts (quartile-ish thresholds).
    const counts: number[] = cal.weeks.flatMap(
      (w: { contributionDays: { contributionCount: number }[] }) =>
        w.contributionDays.map((d) => d.contributionCount),
    );
    const max = Math.max(1, ...counts);
    const level = (c: number): ContributionDay["level"] => {
      if (c === 0) return 0;
      const r = c / max;
      if (r > 0.66) return 4;
      if (r > 0.33) return 3;
      if (r > 0.12) return 2;
      return 1;
    };

    const weeks: ContributionDay[][] = cal.weeks.map(
      (w: { contributionDays: { date: string; contributionCount: number }[] }) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: level(d.contributionCount),
        })),
    );

    return {
      totalContributions: cal.totalContributions,
      weeks,
      available: true,
    };
  } catch {
    return { totalContributions: 0, weeks: [], available: false };
  }
}
