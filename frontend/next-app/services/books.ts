import { api, ApiError } from "@/lib/api";
import { PAGE_SIZE, type BookQuery, type BookQueryResult } from "@/lib/books/query";
import type { BookDetail, RelatedBook } from "@/types/book-detail";

/** Same result shape the books page already uses. */
export async function fetchBooks(query: BookQuery): Promise<BookQueryResult> {
  const params = new URLSearchParams({
    sort: query.sort,
    page: String(query.page),
    pageSize: String(PAGE_SIZE),
  });
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  return api<BookQueryResult>(`/books?${params.toString()}`);
}

export interface BookDetailResponse {
  book: BookDetail;
  related: RelatedBook[];
}

/** Resolves null when the book doesn't exist (so the page can show Not Found). */
export async function fetchBookDetail(id: string): Promise<BookDetailResponse | null> {
  try {
    return await api<BookDetailResponse>(`/books/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}