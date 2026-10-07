import { BookCardSkeleton } from "@/components/books/BookCardSkeleton";

export function BooksGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading books</span>
      <ul
        aria-hidden
        className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4 lg:gap-x-6"
      >
        {Array.from({ length: count }).map((_, i) => (
          <li key={i}>
            <BookCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}