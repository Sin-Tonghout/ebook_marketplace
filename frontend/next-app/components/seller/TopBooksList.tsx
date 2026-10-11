"use client";

import { motion, useReducedMotion } from "motion/react";
import { formatMoney, formatNumber } from "@/lib/format";
import type { SellerBook } from "@/types/seller";

export function TopBooksList({ books }: { books: SellerBook[] }) {
  const reduce = useReducedMotion();
  const max = Math.max(...books.map((b) => b.revenue), 1);

  return (
    <ol className="space-y-5">
      {books.map((book, i) => (
        <li key={book.id}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="min-w-0 truncate font-medium">
              <span className="mr-3 text-muted">{i + 1}</span>
              {book.title}
            </p>
            <p className="shrink-0 type-body-sm">
              <span className="font-medium">{formatMoney(book.revenue)}</span>
              <span className="text-muted">
                {" "}
                · {formatNumber(book.sales)} sold
              </span>
            </p>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-surface-soft"
            aria-hidden
          >
            <motion.div
              className="h-full origin-left rounded-full bg-accent"
              style={{ width: `${(book.revenue / max) * 100}%` }}
              initial={{ scaleX: reduce ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: reduce ? 0.01 : 0.6,
                delay: reduce ? 0 : i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}