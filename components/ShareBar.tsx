"use client";

import { useState } from "react";

export function ShareBar({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button
        onClick={copyLink}
        className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent/50"
      >
        {copied ? "✓ Link copied" : "🔗 Copy profile link"}
      </button>
      <button
        onClick={() => window.print()}
        className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent/50"
      >
        ⬇ Save CV as PDF
      </button>
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent/50"
      >
        View on GitHub ↗
      </a>
    </div>
  );
}
