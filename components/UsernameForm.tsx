"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UsernameForm({ size = "lg" }: { size?: "lg" | "sm" }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = value.trim().replace(/^@/, "").replace(/\s/g, "");
    if (!clean) return;
    setLoading(true);
    router.push(`/${encodeURIComponent(clean)}`);
  };

  return (
    <form
      onSubmit={submit}
      className={`flex w-full gap-2 ${size === "lg" ? "max-w-md" : "max-w-sm"}`}
    >
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          @
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="GitHub username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-8 pr-3 text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Analyzing…" : "Generate"}
      </button>
    </form>
  );
}
