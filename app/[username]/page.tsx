import Link from "next/link";
import type { Metadata } from "next";
import { buildPortfolio } from "@/lib/build";
import { GitHubError } from "@/lib/github";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileTabs } from "@/components/ProfileTabs";
import { ShareBar } from "@/components/ShareBar";
import { StatCard, formatNumber } from "@/components/StatCard";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} — Developer Portfolio`,
    description: `Auto-generated developer portfolio and CV for @${username}, built from their GitHub activity.`,
  };
}

function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <main className="glow grid min-h-screen place-items-center px-5">
      <div className="card max-w-md p-8 text-center">
        <div className="text-4xl">🔍</div>
        <h1 className="mt-3 text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          ← Try another username
        </Link>
      </div>
    </main>
  );
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  let data;
  try {
    data = await buildPortfolio(username);
  } catch (err) {
    if (err instanceof GitHubError) {
      if (err.status === 404) {
        return (
          <ErrorState
            title="User not found"
            message={`No public GitHub account exists for “${username}”. Check the spelling and try again.`}
          />
        );
      }
      return (
        <ErrorState title="Couldn’t load this profile" message={err.message} />
      );
    }
    return (
      <ErrorState
        title="Something went wrong"
        message="An unexpected error occurred while analyzing this account. Please try again."
      />
    );
  }

  const { stats } = data;

  return (
    <main className="min-h-screen">
      <div className="glow border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-sm text-muted hover:text-foreground">
              ← DevFolio
            </Link>
            <ShareBar username={data.user.login} />
          </div>
          <ProfileHeader user={data.user} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Repositories" value={stats.totalRepos} />
          <StatCard label="Total stars" value={formatNumber(stats.totalStars)} />
          <StatCard label="Total forks" value={formatNumber(stats.totalForks)} />
          <StatCard label="Followers" value={formatNumber(stats.followers)} />
          <StatCard
            label="Top language"
            value={stats.topLanguage ?? "—"}
          />
          <StatCard
            label="On GitHub"
            value={`${stats.accountAgeYears}y`}
          />
        </div>

        <ProfileTabs data={data} />

        <p className="no-print mt-10 text-center text-xs text-muted">
          Generated {new Date(data.generatedAt).toLocaleString()} · data cached
          for 1 hour
        </p>
      </div>
    </main>
  );
}
