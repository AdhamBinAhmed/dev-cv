/* eslint-disable @next/next/no-img-element */
import type { GitHubUser } from "@/lib/types";

export function ProfileHeader({ user }: { user: GitHubUser }) {
  const links: { label: string; href: string }[] = [
    { label: "GitHub", href: user.html_url },
  ];
  if (user.blog) {
    links.push({
      label: "Website",
      href: user.blog.startsWith("http") ? user.blog : `https://${user.blog}`,
    });
  }
  if (user.twitter_username) {
    links.push({
      label: `@${user.twitter_username}`,
      href: `https://twitter.com/${user.twitter_username}`,
    });
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
      <img
        src={user.avatar_url}
        alt={user.name ?? user.login}
        width={112}
        height={112}
        className="h-28 w-28 rounded-2xl border border-border object-cover"
      />
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {user.name ?? user.login}
        </h1>
        <p className="text-muted">@{user.login}</p>
        {user.bio && <p className="mt-2 max-w-2xl text-foreground/90">{user.bio}</p>}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted sm:justify-start">
          {user.company && <span>🏢 {user.company}</span>}
          {user.location && <span>📍 {user.location}</span>}
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-accent-2 hover:underline"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
