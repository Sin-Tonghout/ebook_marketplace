import type { SellerBook, SellerStats } from "@/types/seller";

export function computeSellerStats(books: SellerBook[]): SellerStats {
  const active = books.filter((b) => b.status !== "archived");

  const sales = books.reduce((n, b) => n + b.sales, 0);
  const downloads = books.reduce((n, b) => n + b.downloads, 0);
  const revenue = books.reduce((n, b) => n + b.revenue, 0);

  const reviews = books.reduce((n, b) => n + b.reviewCount, 0);
  const rating =
    reviews === 0
      ? 0
      : books.reduce((n, b) => n + b.rating * b.reviewCount, 0) / reviews;

  const published = books.filter((b) => b.status === "published");
  const bestBook =
    published.length === 0
      ? null
      : published.reduce((best, b) => (b.revenue > best.revenue ? b : best));

  return {
    books: active.length,
    sales,
    downloads,
    revenue,
    rating,
    bestBook,
  };
}