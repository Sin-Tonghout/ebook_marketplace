export function LibrarySkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your library" className="animate-pulse space-y-12">
      <div className="space-y-3">
        <div className="h-9 w-64 rounded-md bg-surface-soft" />
        <div className="h-4 w-80 max-w-full rounded-md bg-surface-soft" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-44 rounded-lg bg-surface-soft" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[2/3] rounded-sm bg-surface-soft" />
            <div className="h-4 w-3/4 rounded bg-surface-soft" />
            <div className="h-3 w-1/2 rounded bg-surface-soft" />
          </div>
        ))}
      </div>
    </div>
  );
}