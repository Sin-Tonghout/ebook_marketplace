import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

export function BookMeta({
  book,
  className,
}: {
  book: Book;
  className?: string;
}) {
  const items = [
    book.pages ? { label: "Pages", value: String(book.pages) } : null,
    { label: "Language", value: book.language },
    book.publishedAt
      ? {
          label: "Published",
          value: new Date(book.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            timeZone: "UTC",
          }),
        }
      : null,
    { label: "Format", value: book.format },
    { label: "Category", value: book.category },
  ].filter((i): i is { label: string; value: string } => i !== null);

  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-5",
        className
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <dt className="type-caption">{item.label}</dt>
          <dd className="type-body font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}