"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BookCard } from "@/components/books/BookCard";
import { BookQuickPreview } from "@/components/books/BookQuickPreview";
import { RevealOnScroll } from "@/components/motion";
import type { Book } from "@/types/book";

export function NewReleases({ books }: { books: Book[] }) {
  const headingId = useId();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto max-w-7xl px-6 py-12 md:px-10"
    >
      <RevealOnScroll className="mb-8 flex items-end justify-between gap-4">
        <h2 id={headingId} className="type-h3">
          New releases
        </h2>
        <Link
          href="/books?sort=newest"
          className="inline-flex items-center gap-1 type-label hover:underline"
        >
          See all
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </RevealOnScroll>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {books.map((book) => (
          <li key={book.id}>
            <BookCard
              book={book}
              onQuickPreview={(b) => {
                setPreviewBook(b);
                setPreviewOpen(true);
              }}
            />
          </li>
        ))}
      </ul>

      <BookQuickPreview
        book={previewBook}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </section>
  );
}