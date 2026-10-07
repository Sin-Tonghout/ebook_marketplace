import Link from "next/link";
import { BookCover } from "@/components/books/BookCover";
import { BookPrice } from "@/components/books/BookPrice";
import { Rating } from "@/components/books/Rating";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

export function BookCardCompact({
  book,
  className,
}: {
  book: Book;
  className?: string;
}) {
  return (
    <Link
      href={`/books/${book.id}`}
      className={cn(
        "group flex items-center gap-4 rounded-lg p-3 transition-colors duration-(--duration-fast)",
        "hover:bg-surface-soft",
        className
      )}
    >
      <BookCover
        title={book.title}
        author={book.author.name}
        src={book.coverUrl}
        className="w-14 shrink-0 shadow-card"
      />
      <div className="min-w-0 flex-1 space-y-0.5">
        <h3 className="line-clamp-1 type-body font-medium group-hover:underline">
          {book.title}
        </h3>
        <p className="line-clamp-1 type-body-sm text-muted">{book.author.name}</p>
        <Rating value={book.rating} count={book.ratingCount} />
      </div>
      <BookPrice
        price={book.price}
        compareAtPrice={book.compareAtPrice}
        currency={book.currency}
        className="shrink-0"
      />
    </Link>
  );
}