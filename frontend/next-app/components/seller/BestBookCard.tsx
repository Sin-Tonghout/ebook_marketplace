import { Star } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { formatMoney, formatNumber } from "@/lib/format";
import type { SellerBook } from "@/types/seller";

export function BestBookCard({
  book,
  authorName,
}: {
  book: SellerBook;
  authorName: string;
}) {
  return (
    <section
      aria-labelledby="best-book-heading"
      className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 md:flex-row md:items-center md:gap-8 md:p-8"
    >
      <div className="w-28 shrink-0 shadow-lg md:w-36">
        <BookCover
          title={book.title}
          author={authorName}
          src={book.coverUrl}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="type-label text-muted">Best performer</p>
        <h2 id="best-book-heading" className="mt-2 font-serif text-3xl">
          {book.title}
        </h2>
        {book.subtitle && (
          <p className="mt-1 type-body text-muted">{book.subtitle}</p>
        )}

        <dl className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <dt className="type-caption text-muted">Sales</dt>
            <dd className="mt-1 text-xl font-semibold">
              {formatNumber(book.sales)}
            </dd>
          </div>
          <div>
            <dt className="type-caption text-muted">Revenue</dt>
            <dd className="mt-1 text-xl font-semibold">
              {formatMoney(book.revenue)}
            </dd>
          </div>
          <div>
            <dt className="type-caption text-muted">Rating</dt>
            <dd className="mt-1 flex items-center gap-1 text-xl font-semibold">
              <Star className="size-4 text-accent" aria-hidden />
              {book.rating > 0 ? book.rating.toFixed(1) : "—"}
              <span className="type-caption font-normal text-muted">
                ({formatNumber(book.reviewCount)})
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}