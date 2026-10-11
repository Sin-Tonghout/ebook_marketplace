"use client";

import { motion, useReducedMotion } from "motion/react";
import { BookCover } from "@/components/books/BookCover";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  formatMoney,
  formatNumber,
  formatPrice,
  formatRelativeDate,
} from "@/lib/format";
import { STATUS_LABEL } from "@/lib/seller-status";
import type { SellerBook } from "@/types/seller";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="type-caption text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

function StatusNote({ book }: { book: SellerBook }) {
  if (book.status === "rejected") {
    return (
      <p className="rounded-md bg-danger/10 px-3 py-2 type-body-sm text-danger">
        {book.rejectionReason ??
          "This book wasn't approved. Edit it and submit again."}
      </p>
    );
  }
  if (book.status === "pending") {
    return (
      <p className="type-body-sm text-muted">
        In review. We&apos;ll notify you when it&apos;s done.
      </p>
    );
  }
  if (book.status === "draft") {
    return (
      <p className="type-body-sm text-muted">
        Not submitted yet. Finish it in the editor.
      </p>
    );
  }
  return null;
}

export function SellerBookRow({
  book,
  authorName,
  index = 0,
  onEdit,
}: {
  book: SellerBook;
  authorName: string;
  index?: number;
  onEdit: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const showStats = book.status === "published" || book.status === "archived";

  return (
    <motion.li
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.01 : 0.3,
        delay: reduce ? 0 : Math.min(index, 8) * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex gap-4 rounded-xl border border-border bg-surface p-4 sm:gap-5 sm:p-5"
    >
      <div className="w-16 shrink-0 sm:w-20">
        <BookCover title={book.title} author={authorName} src={book.coverUrl} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-serif text-lg sm:text-xl">
              {book.title}
            </h3>
            {book.subtitle && (
              <p className="mt-0.5 line-clamp-1 type-body-sm text-muted">
                {book.subtitle}
              </p>
            )}
          </div>
          <Badge variant={book.status} dot>
            {STATUS_LABEL[book.status]}
          </Badge>
        </div>

        <p className="mt-2 type-body-sm">
          <span className="font-medium">
            {formatPrice(book.price, book.currency)}
          </span>
          {book.compareAtPrice ? (
            <span className="ml-2 text-muted line-through">
              {formatPrice(book.compareAtPrice, book.currency)}
            </span>
          ) : null}
          <span className="text-muted">
            {" "}
            · Updated {formatRelativeDate(book.updatedAt)}
          </span>
        </p>

        {showStats ? (
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            <Stat label="Sales" value={formatNumber(book.sales)} />
            <Stat label="Revenue" value={formatMoney(book.revenue)} />
            <Stat label="Views" value={formatNumber(book.views)} />
            <Stat
              label="Rating"
              value={book.rating > 0 ? book.rating.toFixed(1) : "—"}
            />
          </dl>
        ) : (
          <div className="mt-4">
            <StatusNote book={book} />
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(book.id)}
            aria-label={`Edit ${book.title}`}
          >
            Edit
          </Button>
        </div>
      </div>
    </motion.li>
  );
}

export function SellerBookRowSkeleton() {
  return (
    <li
      aria-hidden
      className="flex gap-4 rounded-xl border border-border bg-surface p-4 sm:gap-5 sm:p-5"
    >
      <Skeleton className="aspect-2/3 w-16 shrink-0 sm:w-20" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-16" />
      </div>
    </li>
  );
}