import {
  getUser,
  getRepos,
  getRepoLanguages,
  getContributions,
} from "./github";
import { analyze } from "./analyze";
import type { Portfolio } from "./types";

/**
 * Fetch everything for a username and return an analyzed Portfolio.
 * Language byte-counts are fetched only for the most relevant repos to
 * stay within GitHub API rate limits.
 */
export async function buildPortfolio(username: string): Promise<Portfolio> {
  const [user, repos] = await Promise.all([
    getUser(username),
    getRepos(username),
  ]);

  const owned = repos.filter((r) => !r.fork);

  // Prioritize repos worth a per-repo language call: most stars, then recent.
  const langTargets = [...owned]
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
    )
    .slice(0, 30);

  const [perRepoLangs, contributions] = await Promise.all([
    Promise.all(langTargets.map((r) => getRepoLanguages(r.full_name))),
    getContributions(username),
  ]);

  return analyze(user, repos, perRepoLangs, contributions);
}
