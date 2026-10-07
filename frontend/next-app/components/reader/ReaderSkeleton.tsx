export function ReaderSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Opening your book"
      className="mx-auto max-w-[65ch] animate-pulse space-y-4 px-6 pt-32"
    >
      <div className="mx-auto h-3 w-24 rounded bg-surface-soft" />
      <div className="mx-auto h-8 w-2/3 rounded bg-surface-soft" />
      <div className="space-y-3 pt-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`h-4 rounded bg-surface-soft ${i % 4 === 3 ? "w-3/5" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}