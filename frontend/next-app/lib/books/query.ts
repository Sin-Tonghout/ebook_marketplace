import { catalog } from "@/lib/mock/catalog";
import type { Book } from "@/types/book";

// Small on purpose so pagination is visible with 8 mock books.
// Raise to 12 or 24 when real data arrives.
export const PAGE_SIZE = 6;

export const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export interface BookQuery {
  q?: string;
  category?: string; // slug, lowercase
  sort: SortValue;
  page: number;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseQuery(raw: RawParams): BookQuery {
  const sortRaw = first(raw.sort);
  const sort = sortOptions.find((o) => o.value === sortRaw)?.value ?? "newest";
  const page = Math.max(1, parseInt(first(raw.page) ?? "1", 10) || 1);

  return {
    q: first(raw.q)?.trim() || undefined,
    category: first(raw.category)?.trim().toLowerCase() || undefined,
    sort,
    page,
  };
}

const time = (b: Book) => new Date(b.publishedAt ?? 0).getTime();

const sorters: Record<SortValue, (a: Book, b: Book) => number> = {
  newest: (a, b) => time(b) - time(a),
  popular: (a, b) => b.ratingCount - a.ratingCount,
  rating: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

export interface BookQueryResult {
  books: Book[];
  total: number;
  page: number;
  pageCount: number;
}

export function queryBooks(query: BookQuery): BookQueryResult {
  let list = [...catalog];

  if (query.category) {
    list = list.filter((b) => b.category.toLowerCase() === query.category);
  }

  if (query.q) {
    const needle = query.q.toLowerCase();
    list = list.filter((b) =>
      [b.title, b.subtitle ?? "", b.author.name, b.category]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }

  list.sort(sorters[query.sort]);

  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  const start = (page - 1) * PAGE_SIZE;

  return { books: list.slice(start, start + PAGE_SIZE), total, page, pageCount };
}