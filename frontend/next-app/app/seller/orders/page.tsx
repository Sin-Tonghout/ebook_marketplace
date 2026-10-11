"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Receipt } from "lucide-react";

import { FilterChips, type FilterOption } from "@/components/seller/FilterChips";
import { SellerShell } from "@/components/seller/SellerShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSellerData } from "@/hooks/useSellerData";
import { formatDate, formatMoney } from "@/lib/format";
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABEL } from "@/lib/seller-status";
import { cn } from "@/lib/utils";
import type { SellerOrder, SellerOrderStatus } from "@/types/seller";

type OrderFilter = "all" | SellerOrderStatus;

const STATUS_ORDER: SellerOrderStatus[] = [
  "paid",
  "pending",
  "failed",
  "refunded",
];

function StatusBadge({ status }: { status: SellerOrderStatus }) {
  return (
    <Badge variant={ORDER_STATUS_BADGE[status]} dot>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}

// Failed and refunded orders didn't earn anything, so mute the amount
function amountClass(status: SellerOrderStatus) {
  return cn(
    "font-medium",
    (status === "failed" || status === "refunded") && "text-muted line-through"
  );
}

function OrdersTable({ orders }: { orders: SellerOrder[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-border bg-surface px-5 md:block">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Your orders, newest first</caption>
        <thead>
          <tr className="type-caption text-muted">
            <th scope="col" className="py-3 pr-4 font-medium">Order</th>
            <th scope="col" className="py-3 pr-4 font-medium">Book</th>
            <th scope="col" className="py-3 pr-4 font-medium">Buyer</th>
            <th scope="col" className="py-3 pr-4 font-medium">Date</th>
            <th scope="col" className="py-3 pr-4 text-right font-medium">Amount</th>
            <th scope="col" className="py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-border">
              <td className="py-4 pr-4 font-mono text-xs">{o.id}</td>
              <td className="max-w-64 py-4 pr-4">
                <span className="line-clamp-2">{o.bookTitle}</span>
              </td>
              <td className="py-4 pr-4">{o.buyerName}</td>
              <td className="whitespace-nowrap py-4 pr-4 text-muted">
                {formatDate(o.createdAt)}
              </td>
              <td className={cn("py-4 pr-4 text-right", amountClass(o.status))}>
                {formatMoney(o.amount, o.currency)}
              </td>
              <td className="py-4">
                <StatusBadge status={o.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersCards({ orders }: { orders: SellerOrder[] }) {
  return (
    <ul className="space-y-3 md:hidden">
      {orders.map((o) => (
        <li
          key={o.id}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-muted">{o.id}</span>
            <StatusBadge status={o.status} />
          </div>
          <p className="mt-3 line-clamp-2 font-serif text-lg">{o.bookTitle}</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="type-body-sm text-muted">
              {o.buyerName} · {formatDate(o.createdAt)}
            </p>
            <p className={amountClass(o.status)}>
              {formatMoney(o.amount, o.currency)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function SellerOrdersPage() {
  const router = useRouter();
  const result = useSellerData();
  const [filter, setFilter] = useState<OrderFilter>("all");

  if (result.status === "loading") {
    return (
      <SellerShell>
        <div aria-busy="true" className="space-y-8">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-10 w-96 max-w-full rounded-full" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </SellerShell>
    );
  }

  if (result.status === "error") {
    return (
      <SellerShell>
        <ErrorState
          title="We couldn't load your orders"
          description="Your orders are safe. Please try again."
          onRetry={result.reload}
        />
      </SellerShell>
    );
  }

  const { orders } = result.data;

  if (orders.length === 0) {
    return (
      <SellerShell>
        <EmptyState
          icon={<Receipt className="size-7" aria-hidden />}
          title="No orders yet."
          description="When someone buys one of your books, the order will show up here."
          action={
            <Button
              variant="secondary"
              onClick={() => router.push("/seller/books")}
            >
              Go to my books
            </Button>
          }
        />
      </SellerShell>
    );
  }

  const options: FilterOption<OrderFilter>[] = [
    { id: "all", label: "All", count: orders.length },
    ...STATUS_ORDER.map((status) => ({
      id: status as OrderFilter,
      label: ORDER_STATUS_LABEL[status],
      count: orders.filter((o) => o.status === status).length,
    })).filter((o) => o.count > 0),
  ];

  const visible = [...orders]
    .filter((o) => filter === "all" || o.status === filter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const paid = orders.filter((o) => o.status === "paid" && o.currency === "USD");
  const earned = paid.reduce((n, o) => n + o.amount, 0);

  return (
    <SellerShell className="space-y-8">
      <header>
        <h1 className="type-h2">Orders</h1>
        <p className="mt-2 type-body text-muted">
          {orders.length} {orders.length === 1 ? "order" : "orders"} ·{" "}
          {paid.length} paid · {formatMoney(earned)} earned
        </p>
      </header>

      <FilterChips
        label="Filter orders by status"
        options={options}
        value={filter}
        onChange={setFilter}
      />

      {visible.length === 0 ? (
        <EmptyState
          title="No orders with this status."
          description="Try another filter to see your other orders."
          action={
            <Button variant="secondary" onClick={() => setFilter("all")}>
              Show all orders
            </Button>
          }
        />
      ) : (
        <div aria-live="polite">
          <OrdersTable orders={visible} />
          <OrdersCards orders={visible} />
        </div>
      )}
    </SellerShell>
  );
}