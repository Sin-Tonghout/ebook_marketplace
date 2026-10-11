import type { BookDetail } from "@/types/book-detail";
import type { OrderItem } from "@/types/commerce";

const round = (n: number) => Math.round(n * 100) / 100;

export function bookToOrderItem(book: BookDetail): OrderItem {
  return {
    bookId: book.id,
    title: book.title,
    authorName: book.author.name,
    coverUrl: book.coverUrl,
    price: book.price,
    compareAtPrice: book.compareAtPrice,
    currency: book.currency,
  };
}

export function calcTotals(items: OrderItem[]) {
  const subtotal = round(
    items.reduce(
      (sum, i) =>
        sum + (i.compareAtPrice !== undefined && i.compareAtPrice > i.price ? i.compareAtPrice : i.price),
      0
    )
  );
  const total = round(items.reduce((sum, i) => sum + i.price, 0));
  return { subtotal, discount: round(subtotal - total), total };
}