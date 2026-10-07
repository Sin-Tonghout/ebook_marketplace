"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { BookCard } from "@/components/books/BookCard";
import { BookQuickPreview } from "@/components/books/BookQuickPreview";
import { RevealOnScroll } from "@/components/motion";
import { IconButton } from "@/components/ui/IconButton";
import type { Book } from "@/types/book";

export interface BookShelfProps {
  title: string;
  books: Book[];
  /** "See all" destination */
  href: string;
}

export function BookShelf({ title, books, href }: BookShelfProps) {
  const headingId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  const updateArrows = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    updateArrows();
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateArrows, books.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.85,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto max-w-7xl px-6 py-12 md:px-10"
    >
      <RevealOnScroll className="mb-6 flex items-end justify-between gap-4">
        <h2 id={headingId} className="type-h3">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <IconButton
              label={`Scroll ${title} back`}
              size="sm"
              disabled={!canPrev}
              onClick={() => scrollByPage(-1)}
            >
              <ChevronLeft className="size-5" />
            </IconButton>
            <IconButton
              label={`Scroll ${title} forward`}
              size="sm"
              disabled={!canNext}
              onClick={() => scrollByPage(1)}
            >
              <ChevronRight className="size-5" />
            </IconButton>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-1 type-label hover:underline"
          >
            See all
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </RevealOnScroll>

      {/* Extra vertical padding stops the hover lift and shadow being clipped */}
      <ul
        ref={listRef}
        onScroll={updateArrows}
        className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-8 pt-3 [scrollbar-width:none] md:-mx-10 md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {books.map((book) => (
          <li key={book.id} className="w-40 shrink-0 snap-start sm:w-44 md:w-52">
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