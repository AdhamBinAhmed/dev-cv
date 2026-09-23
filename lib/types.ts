// Shared domain types for the Developer Portfolio Generator.

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  twitter_username: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  size: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  license: { spdx_id: string | null; name: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionDay[][]; // each week is an array of 7 days
  available: boolean; // false when no token / GraphQL unavailable
}

/* ---- Analyzed / derived shapes ---- */

export interface LanguageStat {
  name: string;
  bytes: number;
  percent: number;
  color: string;
}

export interface Skill {
  name: string;
  weight: number; // relative confidence 0..100
  category: "language" | "framework" | "tool" | "domain";
}

export interface ProjectQuality {
  score: number; // 0..100
  signals: { label: string; met: boolean }[];
}

export interface AnalyzedProject {
  repo: GitHubRepo;
  activityScore: number;
  quality: ProjectQuality;
}

export interface ProfileStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  followers: number;
  topLanguage: string | null;
  accountAgeYears: number;
  contributionsLastYear: number;
}

export interface Portfolio {
  user: GitHubUser;
  stats: ProfileStats;
  languages: LanguageStat[];
  skills: Skill[];
  topProjects: AnalyzedProject[];
  mostActive: AnalyzedProject[];
  contributions: ContributionCalendar;
  generatedAt: string;
}

export interface ApiError {
  error: string;
  status: number;
}
