"use client";

import { STATUS_LABEL, STATUS_ORDER } from "@/lib/seller-status";
import { cn } from "@/lib/utils";
import type { SellerBook, SellerBookStatus } from "@/types/seller";

export type StatusFilterValue = "all" | SellerBookStatus;

export function StatusFilter({
  books,
  value,
  onChange,
}: {
  books: SellerBook[];
  value: StatusFilterValue;
  onChange: (next: StatusFilterValue) => void;
}) {
  const options: { id: StatusFilterValue; label: string; count: number }[] = [
    { id: "all", label: "All", count: books.length },
    ...STATUS_ORDER.map((status) => ({
      id: status as StatusFilterValue,
      label: STATUS_LABEL[status],
      count: books.filter((b) => b.status === status).length,
    })).filter((o) => o.count > 0),
  ];

  return (
    <div role="group" aria-label="Filter books by status" className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "min-h-10 rounded-full border px-4 text-sm font-medium transition-colors duration-(--duration-fast)",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-foreground hover:bg-surface-soft"
            )}
          >
            {o.label}
            <span className={cn("ml-2", active ? "opacity-80" : "text-muted")}>
              {o.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}