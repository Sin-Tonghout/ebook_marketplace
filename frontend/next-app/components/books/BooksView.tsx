"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SearchX, SlidersHorizontal } from "lucide-react";

import { ActiveFilters } from "@/components/books/ActiveFilters";
import { BookCard } from "@/components/books/BookCard";
import { BookQuickPreview } from "@/components/books/BookQuickPreview";
import { BooksGridSkeleton } from "@/components/books/BooksGridSkeleton";
import { FilterPanel } from "@/components/books/FilterPanel";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { sortOptions, type BookQuery, type SortValue } from "@/lib/books/query";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

function buildBooksHref(query: BookQuery, patch: Partial<BookQuery> = {}) {
  const params = new URLSearchParams();
  const values = { ...query, ...patch };

  for (const [key, value] of Object.entries(values)) {
    if (value == null || value === "" || (key === "page" && value === 1))
      continue;
    params.set(key, String(value));
  }

  const search = params.toString();
  return search ? `/books?${search}` : "/books";
}

interface BooksViewProps {
  title: string;
  books: Book[];
  total: number;
  page: number;
  pageCount: number;
  query: BookQuery;
}

export function BooksView({
  title,
  books,
  total,
  page,
  pageCount,
  query,
}: BooksViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Every navigation runs in a transition so isPending can drive the skeleton
  const go = (href: string, scroll = true) =>
    startTransition(() => router.push(href, { scroll }));

  // Filter changes keep the scroll position and always return to page 1
  const apply = (patch: Partial<BookQuery>) =>
    go(buildBooksHref(query, { ...patch, page: patch.page ?? 1 }), false);

  const activeEntries = Object.entries(query).filter(
    ([key, value]) =>
      key !== "sort" && key !== "page" && value != null && value !== "",
  );
  const filterCount = activeEntries.filter(([key]) => key !== "q").length;
  const hasActive = activeEntries.length > 0;
  const clearedFilters = Object.fromEntries(
    Object.keys(query)
      .filter((key) => key !== "sort" && key !== "page")
      .map((key) => [key, undefined]),
  ) as Partial<BookQuery>;
  const countLabel = `${total} ${total === 1 ? "book" : "books"}`;

  // Re-keying the grid replays the card reveal whenever the result set changes
  const gridKey = buildBooksHref(query, { page });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
      <FadeIn className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="type-h2">{title}</h1>
          <p
            aria-live="polite"
            className={cn(
              "mt-2 type-body text-muted transition-opacity duration-200",
              isPending && "opacity-50",
            )}
          >
            {countLabel}
          </p>
        </div>

        <div className="flex w-full items-end gap-3 sm:w-auto">
          <div className="flex-1 sm:w-56 sm:flex-none">
            <Select
              label="Sort by"
              value={query.sort}
              onChange={(e) => apply({ sort: e.target.value as SortValue })}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>

          <Button
            variant="secondary"
            className="lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters{filterCount > 0 ? ` (${filterCount})` : ""}
          </Button>
        </div>
      </FadeIn>

      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel query={query} onChange={apply} idPrefix="side" />
          </div>
        </aside>

        <div aria-busy={isPending}>
          <ActiveFilters
            query={query}
            onChange={apply}
            onClearAll={() => apply(clearedFilters)}
          />

          {isPending ? (
            <BooksGridSkeleton />
          ) : books.length === 0 ? (
            <EmptyState
              icon={<SearchX className="size-6" aria-hidden />}
              title="We couldn't find that book."
              description="Try another title, author, or topic, or loosen a filter."
              action={
                hasActive ? (
                  <Button onClick={() => apply(clearedFilters)}>
                    Clear all filters
                  </Button>
                ) : (
                  <Button onClick={() => go("/books?sort=popular")}>
                    Browse popular books
                  </Button>
                )
              }
            />
          ) : (
            <>
              <ul
                key={gridKey}
                className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4 lg:gap-x-6"
              >
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

              <Pagination
                className="mt-14 justify-center"
                page={page}
                pageCount={pageCount}
                onPageChange={(p) => go(buildBooksHref(query, { page: p }))}
              />
            </>
          )}
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        side="bottom"
        title="Filters"
        footer={
          <Button className="w-full" onClick={() => setFiltersOpen(false)}>
            Show {countLabel}
          </Button>
        }
      >
        <FilterPanel query={query} onChange={apply} idPrefix="drawer" />
      </Drawer>

      <BookQuickPreview
        book={previewBook}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}
