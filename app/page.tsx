import { UsernameForm } from "@/components/UsernameForm";

const FEATURES: { title: string; body: string }[] = [
  {
 
    title: "Skills, inferred",
    body: "Detects frameworks, tools and domains from your repo topics, descriptions and language mix — not a list you type by hand.",
  },
  {

    title: "Language breakdown",
    body: "Aggregates real byte-counts across your repositories into a weighted language profile.",
  },
  {

    title: "Most active projects",
    body: "Ranks what you actually work on using a recency-weighted activity score, not just star counts.",
  },
  {

    title: "Contribution graph",
    body: "Your full year of contribution activity, rendered right into the profile.",
  },
  {

    title: "Project quality signals",
    body: "Scores each project on docs, license, demo, traction and maintenance — a health check per repo.",
  },
  {

    title: "Shareable profile",
    body: "Every profile lives at its own URL. Switch to the interactive CV and export it as a PDF.",
  },
];

const EXAMPLES = ["torvalds", "gaearon", "sindresorhus", "yyx990803"];

export default function Home() {
  return (
    <main className="glow min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
        <header className="text-center">
          <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            Developer Portfolio Generator
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Turn a GitHub account into a{" "}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              living portfolio
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Connect a GitHub username and instantly get an analyzed portfolio,
            an interactive CV, and a shareable developer profile — skills,
            languages, top projects, contributions and quality signals, all
            derived automatically.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <UsernameForm />
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
              <span>Try:</span>
              {EXAMPLES.map((u) => (
                <a
                  key={u}
                  href={`/${u}`}
                  className="rounded-md border border-border bg-surface px-2 py-0.5 hover:border-accent/50 hover:text-foreground"
                >
                  {u}
                </a>
              ))}
            </div>
          </div>
        </header>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
