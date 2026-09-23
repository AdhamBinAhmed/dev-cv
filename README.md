# DevFolio — Developer Portfolio Generator

Connect a GitHub account and instantly generate a **portfolio**, an **interactive CV**, and a **shareable developer profile**. Everything is analyzed automatically from public GitHub activity — no data entry.

## What it generates

- **Skills** — inferred from repo topics, descriptions and language mix (frameworks, tools, domains), not typed by hand.
- **Languages** — a weighted breakdown built from real byte-counts across repositories.
- **Most active projects** — ranked by a recency-weighted activity score.
- **Contribution graph** — a full year of activity (requires a token, see below).
- **Project quality indicators** — each repo scored on docs, license, live demo, traction and maintenance.
- **Interactive CV** — a résumé view you can export to PDF (browser print).
- **Shareable profile** — every profile lives at `/<username>`.

## Run it

```bash
npm install
cp .env.example .env.local   # optional but recommended (see below)
npm run dev
```

Open http://localhost:3000 and enter any GitHub username, or go straight to `/<username>`.

## GitHub token (optional)

Without a token the app uses the public GitHub API (60 requests/hour, no contribution graph). Add a token to unlock:

- **5,000 requests/hour** instead of 60
- the **contribution graph** (GitHub only exposes contribution data through the authenticated GraphQL API)

Create a token at https://github.com/settings/tokens (no scopes required for public data) and put it in `.env.local`:

```
GITHUB_TOKEN=ghp_xxx
```

## API

`GET /api/portfolio/<username>` returns the full analyzed portfolio as JSON.

## Structure

- `lib/github.ts` — GitHub REST + GraphQL client (cached 1h).
- `lib/analyze.ts` — language aggregation, skill inference, quality & activity scoring.
- `lib/build.ts` — orchestrates fetch + analysis into a `Portfolio`.
- `app/[username]/` — the profile page (server-rendered) with a loading skeleton.
- `components/` — presentational + interactive UI (tabs, share bar, charts).

Built with Next.js (App Router), TypeScript and Tailwind CSS v4.
