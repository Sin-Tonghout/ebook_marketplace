import type { BookDetail } from "@/types/book-detail";
import type { Order, OrderStatus } from "@/types/commerce";
import { bookToOrderItem, calcTotals } from "@/lib/commerce";

const KEY = "folio.orders.v1";

function read(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function write(orders: Order[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("folio:orders"));
  } catch {
    /* storage full or blocked: fail silently */
  }
}

function update(orderId: string, patch: Partial<Order>): Order | undefined {
  const orders = read();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return undefined;
  const next = { ...orders[index], ...patch };
  orders[index] = next;
  write(orders);
  return next;
}

export const orderService = {
  list(userId: string): Order[] {
    return read()
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  get(orderId: string): Order | undefined {
    return read().find((o) => o.id === orderId);
  },

  /**
   * Reuses an unpaid order for the same book so retries never create duplicates.
   * A failed or cancelled order goes back to pending for the new attempt.
   */
  createFromBook(userId: string, book: BookDetail): Order {
    const orders = read();
    const existing = orders.find(
      (o) =>
        o.userId === userId &&
        o.status !== "completed" &&
        o.items.length === 1 &&
        o.items[0].bookId === book.id
    );
    if (existing) {
      if (existing.status === "pending") return existing;
      return (
        update(existing.id, {
          status: "pending",
          paymentStatus: "pending",
          failureReason: undefined,
        }) ?? existing
      );
    }

    const items = [bookToOrderItem(book)];
    const totals = calcTotals(items);
    const order: Order = {
      id: crypto.randomUUID(),
      number: `FO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(6, "0")}`,
      userId,
      items,
      ...totals,
      currency: book.currency,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    write([...orders, order]);
    return order;
  },

  /** Idempotent: a duplicate success callback leaves a completed order untouched. */
  markPaid(orderId: string, paymentId: string): Order | undefined {
    const order = read().find((o) => o.id === orderId);
    if (!order) return undefined;
    if (order.status === "completed") return order;
    return update(orderId, {
      status: "completed",
      paymentStatus: "success",
      paymentId,
      failureReason: undefined,
      paidAt: new Date().toISOString(),
    });
  },

  markFailed(
    orderId: string,
    paymentId: string,
    kind: Extract<OrderStatus, "failed" | "cancelled">,
    reason?: string
  ): Order | undefined {
    const order = read().find((o) => o.id === orderId);
    if (!order || order.status === "completed") return order;
    return update(orderId, {
      status: kind,
      paymentStatus: kind,
      paymentId,
      failureReason: reason,
    });
  },

  /** Puts a failed or cancelled order back to pending for a retry. */
  reopen(orderId: string): Order | undefined {
    const order = read().find((o) => o.id === orderId);
    if (!order || order.status === "completed") return order;
    return update(orderId, {
      status: "pending",
      paymentStatus: "pending",
      failureReason: undefined,
    });
  },
};