"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOrder } from "@/hooks/useOrder";
import type { BookDetail } from "@/types/book-detail";

const ease = [0.22, 1, 0.36, 1] as const;

const primaryBtn =
  "inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2";
const secondaryBtn =
  "inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 text-base font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2";

export function PurchaseFailure({ book, orderId }: { book: BookDetail; orderId?: string }) {
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
      <div aria-busy="true" className="mx-auto max-w-md animate-pulse space-y-6 py-16 motion-reduce:animate-none">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted" />
        <div className="mx-auto h-10 w-2/3 rounded-lg bg-muted" />
        <div className="mx-auto h-12 w-full rounded-xl bg-muted" />
      </div>
    );
  }

  const ownOrder = order && order.userId === user?.id && order.items.some((i) => i.bookId === book.id);

  if (!order || !ownOrder) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-serif text-3xl text-foreground">We couldn&apos;t find this order.</h1>
        <p className="mt-3 text-muted">Nothing was charged. You can start a new checkout.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={`/checkout/${book.id}`} className={primaryBtn}>
            Back to checkout
          </Link>
          <Link href={`/books/${book.id}`} className={secondaryBtn}>
            View book
          </Link>
        </div>
      </div>
    );
  }

  // The user came back to this page after the order was paid.
  if (order.status === "completed") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-serif text-3xl text-foreground">This order is already paid.</h1>
        <p className="mt-3 text-muted">Your book is in your library.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={`/read/${book.id}`} className={primaryBtn}>
            Read now
          </Link>
          <Link href="/library" className={secondaryBtn}>
            Go to library
          </Link>
        </div>
      </div>
    );
  }

  const cancelled = order.status === "cancelled";

  return (
    <div className="mx-auto max-w-md py-12 text-center md:py-20">
      <motion.div
        {...(reduce
          ? {}
          : {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
            })}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-danger text-primary-foreground"
      >
        <X className="h-10 w-10" aria-hidden="true" />
      </motion.div>

      <motion.h1 {...rise(0.15)} role="alert" className="mt-8 font-serif text-4xl text-foreground">
        {cancelled ? "Payment cancelled" : "Payment didn't complete"}
      </motion.h1>
      <motion.p {...rise(0.22)} className="mt-3 text-lg text-muted">
        Your order was not charged.
      </motion.p>
      {order.failureReason && (
        <motion.p {...rise(0.28)} className="mt-2 text-sm text-muted">
          {order.failureReason}
        </motion.p>
      )}

      <motion.div {...rise(0.38)} className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/checkout/${book.id}`} className={primaryBtn}>
          Try again
        </Link>
        <Link href={`/books/${book.id}`} className={secondaryBtn}>
          Back to book
        </Link>
      </motion.div>

      <motion.p {...rise(0.45)} className="mt-8 text-xs text-muted">
        Order {order.number}
      </motion.p>
    </div>
  );
}