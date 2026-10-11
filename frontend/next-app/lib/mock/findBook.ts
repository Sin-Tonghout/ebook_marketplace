import { catalog } from "@/lib/mock/catalog"; // <-- change this path if your catalog file lives elsewhere
import type { Book } from "@/types/book";

/** The single book list for the whole app. */
export const allBooks: Book[] = catalog;

/** One lookup for detail page, checkout, library and reader. */
export function findBook(id: string): Book | undefined {
  return allBooks.find((b) => b.id === id);
}