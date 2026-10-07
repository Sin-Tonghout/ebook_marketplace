import type { Metadata } from "next";

import { BooksView } from "@/components/books/BooksView";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { parseQuery, queryBooks } from "@/lib/books/query";

export const metadata: Metadata = { title: "Books" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pageTitle(q?: string, category?: string) {
  if (category) return category.charAt(0).toUpperCase() + category.slice(1);
  if (q) return `Results for “${q}”`;
  return "All books";
}

export default async function BooksPage({ searchParams }: { searchParams: SearchParams }) {
   const query = parseQuery(await searchParams);
  await new Promise((r) => setTimeout(r, 1200)); // TEMP: remove after testing
  const { books, total, page, pageCount } = queryBooks(query);

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