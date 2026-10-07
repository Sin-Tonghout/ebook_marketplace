import { catalog } from "@/lib/mock/catalog";
import type { Book } from "@/types/book";

export interface AuthorHit {
  id: string;
  name: string;
  bookCount: number;
}

export interface CategoryHit {
  value: string;
  label: string;
}

export interface SearchResults {
  books: Book[];
  authors: AuthorHit[];
  categories: CategoryHit[];
}

const categoryOptions: CategoryHit[] = Array.from(
  new Set(catalog.map((book) => book.category))
).map((category) => ({ value: category, label: category }));

const authors: AuthorHit[] = Object.values(
  catalog.reduce<Record<string, AuthorHit>>((acc, b) => {
    const existing = acc[b.author.id];
    acc[b.author.id] = existing
      ? { ...existing, bookCount: existing.bookCount + 1 }
      : { id: b.author.id, name: b.author.name, bookCount: 1 };
    return acc;
  }, {})
);

export function searchAll(query: string): SearchResults {
  const needle = query.trim().toLowerCase();
  if (!needle) return { books: [], authors: [], categories: [] };

  return {
    books: catalog
      .filter((b) =>
        [b.title, b.subtitle ?? "", b.author.name, b.category]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      )
      .slice(0, 5),
    authors: authors.filter((a) => a.name.toLowerCase().includes(needle)).slice(0, 3),
    categories: categoryOptions
      .filter((c: CategoryHit) => c.label.toLowerCase().includes(needle))
      .slice(0, 3),
  };
}