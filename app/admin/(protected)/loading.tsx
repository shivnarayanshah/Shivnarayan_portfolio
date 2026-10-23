export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <div className="h-3 w-20 rounded-full bg-surface-muted" />
        <div className="h-10 w-56 rounded-xl bg-surface-muted" />
        <div className="h-4 w-full max-w-md rounded-full bg-surface-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[7.5rem] rounded-[1.3rem] border border-line bg-surface/50"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="h-72 rounded-[1.4rem] border border-line bg-surface/50" />
        <div className="h-72 rounded-[1.4rem] border border-line bg-surface/50" />
      </div>

      <span className="sr-only">Loading dashboard</span>
    </div>
  );
}
