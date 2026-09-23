export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="glow border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <div className="flex animate-pulse items-center gap-5">
            <div className="h-28 w-28 rounded-2xl bg-surface-2" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 rounded bg-surface-2" />
              <div className="h-4 w-32 rounded bg-surface-2" />
              <div className="h-4 w-64 rounded bg-surface-2" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl animate-pulse px-5 py-8">
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-surface-2" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-surface-2" />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          Analyzing GitHub activity…
        </p>
      </div>
    </main>
  );
}
