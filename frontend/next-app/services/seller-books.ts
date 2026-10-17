import { api } from "@/lib/api";
import type { SellerBook, SellerOverview } from "@/types/seller";

function devFlag(name: string): boolean {
  return (
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get(name) === "1"
  );
}

/** Books, orders and the sales series for the signed-in seller. */
export async function fetchSellerBooksOverview(): Promise<SellerOverview> {
  // Dev switches (add to any seller page URL):
  //   ?sellerError=1  -> error state
  //   ?sellerEmpty=1  -> empty state
  if (devFlag("sellerError")) throw new Error("Simulated seller data failure");
  if (devFlag("sellerEmpty")) return { books: [], orders: [], series: [] };

  return api<SellerOverview>("/seller/overview");
}

/**
 * Saves an edit. "save" keeps the status; "submit" sends the book for review.
 * Returns the book as the server saved it.
 */
export async function saveSellerBook(
  id: string,
  book: SellerBook,
  intent: "save" | "submit"
): Promise<SellerBook> {
  const { book: saved } = await api<{ book: SellerBook }>(
    `/seller/books/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: {
        intent,
        title: book.title,
        subtitle: book.subtitle ?? "",
        description: book.description ?? "",
        category: book.category ?? "",
        language: book.language ?? "",
        tags: book.tags ?? [],
        price: book.price,
        ...(book.compareAtPrice !== undefined ? { compareAtPrice: book.compareAtPrice } : {}),
        currency: book.currency,
      },
    }
  );
  return saved;
}

export async function unpublishSellerBook(id: string): Promise<SellerBook> {
  const { book } = await api<{ book: SellerBook }>(
    `/seller/books/${encodeURIComponent(id)}/unpublish`,
    { method: "POST" }
  );
  return book;
}