import type { Metadata } from "next";

import { BooksView } from "@/components/books/BooksView";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { parseQuery } from "@/lib/books/query";
import { fetchBooks } from "@/services/books";

export const metadata: Metadata = { title: "Books" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pageTitle(q?: string, category?: string) {
  if (category) return category.charAt(0).toUpperCase() + category.slice(1);
  if (q) return `Results for “${q}”`;
  return "All books";
}

export default async function BooksPage({ searchParams }: { searchParams: SearchParams }) {
  const query = parseQuery(await searchParams);
  const { books, total, page, pageCount } = await fetchBooks(query);

  return (
    <>
      <SiteHeader />
      <main>
        <BooksView
          title={pageTitle(query.q, query.category)}
          books={books}
          total={total}
          page={page}
          pageCount={pageCount}
          query={query}
        />
      </main>
      <Footer />
    </>
  );
}