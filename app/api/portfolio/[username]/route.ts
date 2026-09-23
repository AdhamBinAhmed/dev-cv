import { NextResponse } from "next/server";
import { buildPortfolio } from "@/lib/build";
import { GitHubError } from "@/lib/github";

// JSON API: GET /api/portfolio/<username> — the same analyzed data the UI uses.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  try {
    const portfolio = await buildPortfolio(username);
    return NextResponse.json(portfolio, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch (err) {
    if (err instanceof GitHubError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: "Unexpected error while building portfolio." },
      { status: 500 },
    );
  }
}
