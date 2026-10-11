import { BookCover } from "@/components/books/BookCover";
import { calcTotals } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import type { OrderItem } from "@/types/commerce";

export function OrderSummary({ items }: { items: OrderItem[] }) {
  const { subtotal, discount, total } = calcTotals(items);
  const currency = items[0]?.currency ?? "USD";

  return (
    <section aria-labelledby="order-summary-heading" className="rounded-2xl border border-border p-6">
      <h2 id="order-summary-heading" className="font-serif text-2xl text-foreground">
        Order summary
      </h2>

      <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item.bookId} className="flex gap-4">
            <div className="w-20 shrink-0">
              <BookCover title={item.title} author={item.authorName} src={item.coverUrl} className="w-full shadow-md" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="mt-1 text-sm text-muted">by {item.authorName}</p>
              <p className="mt-1 text-sm text-muted">Digital e-book</p>
            </div>
            <p className="text-sm font-medium text-foreground">{formatPrice(item.price, item.currency)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="text-foreground">{formatPrice(subtotal, currency)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted">Discount</dt>
            <dd className="text-foreground">−{formatPrice(discount, currency)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
          <dt className="text-foreground">Total</dt>
          <dd className="text-foreground">{formatPrice(total, currency)}</dd>
        </div>
      </dl>
    </section>
  );
}