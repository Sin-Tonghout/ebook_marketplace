"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BookCover } from "@/components/books/BookCover";
import { useOrder } from "@/hooks/useOrder";
import { formatPrice } from "@/lib/format";
import type { BookDetail } from "@/types/book-detail";

const ease = [0.22, 1, 0.36, 1] as const;

const primaryBtn =
  "inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2";
const secondaryBtn =
  "inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 text-base font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function PurchaseSuccess({ book, orderId }: { book: BookDetail; orderId?: string }) {
  const reduce = useReducedMotion();
  const { user } = useAuth();
  const { order, loading } = useOrder(orderId);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease },
        };

  if (loading) {
    return (
      <div aria-busy="true" className="mx-auto max-w-2xl animate-pulse space-y-6 motion-reduce:animate-none">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted" />
        <div className="mx-auto h-10 w-2/3 rounded-lg bg-muted" />
        <div className="mx-auto h-48 w-36 rounded-lg bg-muted" />
        <div className="h-40 rounded-2xl bg-muted" />
      </div>
    );
  }

  const valid =
    order &&
    order.userId === user?.id &&
    order.status === "completed" &&
    order.items.some((i) => i.bookId === book.id);

  if (!order || !valid) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-serif text-3xl text-foreground">We couldn&apos;t find this order.</h1>
        <p className="mt-3 text-muted">It may not be finished yet, or it belongs to another account.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/library" className={primaryBtn}>
            Go to library
          </Link>
          <Link href={`/books/${book.id}`} className={secondaryBtn}>
            View book
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center text-center">
        {/* Check mark */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { scale: 0 },
                animate: { scale: 1 },
                transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
              })}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-primary-foreground"
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
            />
          </svg>
        </motion.div>

        <motion.h1 {...rise(0.2)} className="mt-8 font-serif text-4xl text-foreground md:text-5xl">
          Purchase complete
        </motion.h1>
        <motion.p {...rise(0.28)} className="mt-3 text-lg text-muted">
          Your book is ready.
        </motion.p>

        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 24, rotate: -2 },
                animate: { opacity: 1, y: 0, rotate: 0 },
                transition: { duration: 0.6, delay: 0.35, ease },
              })}
          className="mt-8 w-40"
        >
          <BookCover title={book.title} author={book.author.name} src={book.coverUrl} className="w-full shadow-xl" />
        </motion.div>

        <motion.p {...rise(0.45)} className="mt-5 text-base font-medium text-foreground">
          {book.title}
        </motion.p>
        <motion.p {...rise(0.5)} className="text-sm text-muted">
          by {book.author.name}
        </motion.p>

        <motion.div {...rise(0.6)} className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/read/${book.id}`} className={primaryBtn}>
            Read now
          </Link>
          <Link href="/library" className={secondaryBtn}>
            Go to library
          </Link>
        </motion.div>
      </div>

      {/* Receipt */}
      <motion.section {...rise(0.7)} aria-labelledby="receipt-heading" className="mt-14 rounded-2xl border border-border p-6">
        <h2 id="receipt-heading" className="font-serif text-2xl text-foreground">
          Receipt
        </h2>

        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-muted">Order</dt>
          <dd className="text-right font-medium text-foreground">{order.number}</dd>
          <dt className="text-muted">Date</dt>
          <dd className="text-right text-foreground">{formatDate(order.paidAt ?? order.createdAt)}</dd>
          <dt className="text-muted">Payment</dt>
          <dd className="text-right text-foreground">ABA PayWay (demo)</dd>
          {order.paymentId && (
            <>
              <dt className="text-muted">Reference</dt>
              <dd className="text-right text-foreground">{order.paymentId}</dd>
            </>
          )}
        </dl>

        <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
          {order.items.map((item) => (
            <li key={item.bookId} className="flex justify-between gap-4">
              <span className="text-foreground">{item.title}</span>
              <span className="text-foreground">{formatPrice(item.price, item.currency)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
          {order.discount > 0 && (
            <>
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-foreground">{formatPrice(order.subtotal, order.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Discount</dt>
                <dd className="text-foreground">−{formatPrice(order.discount, order.currency)}</dd>
              </div>
            </>
          )}
          <div className="flex justify-between text-base font-semibold">
            <dt className="text-foreground">Total paid</dt>
            <dd className="text-foreground">{formatPrice(order.total, order.currency)}</dd>
          </div>
        </dl>
      </motion.section>
    </div>
  );
}