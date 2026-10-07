"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import type { BookDetail } from "@/types/book-detail";
import { mockPurchase } from "@/lib/mock/purchase";
import { BookCover } from "@/components/books/BookCover";
import { Rating } from "@/components/books/Rating";
import { Badge } from "@/components/ui/Badge";

type PurchaseStatus = "idle" | "loading" | "success" | "error";

function formatPrice(price: number, currency: string) {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}

export function BookDetailHero({ book }: { book: BookDetail }) {
  const reduce = useReducedMotion();
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<PurchaseStatus>("idle");

  const isFree = book.price === 0;
  const owned = status === "success";

  async function handleBuy() {
    if (status === "loading" || owned) return;
    setStatus("loading");
    try {
      await mockPurchase(book.id);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const primaryBtn =
    "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16 md:py-20">
      {/* Cover */}
      <motion.div
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, y: 24, rotate: -1 },
              animate: { opacity: 1, y: 0, rotate: 0 },
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            })}
        className="mx-auto w-full max-w-[280px] md:max-w-none"
      >
        <BookCover
          title={book.title}
          author={book.author.name}
          src={book.coverUrl}
          className="w-full shadow-xl"
        />
      </motion.div>

      {/* Info */}
      <div className="flex flex-col justify-center">
        <motion.div {...rise(0.1)}>
          <Badge>{book.category}</Badge>
        </motion.div>

        <motion.h1
          {...rise(0.15)}
          className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-6xl"
        >
          {book.title}
        </motion.h1>

        {book.subtitle && (
          <motion.p {...rise(0.2)} className="mt-3 text-lg text-muted-foreground">
            {book.subtitle}
          </motion.p>
        )}

        <motion.p {...rise(0.25)} className="mt-4 text-base text-foreground">
          by{" "}
          <Link
            href={`/authors/${book.author.id}`}
            className="underline underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {book.author.name}
          </Link>
        </motion.p>

        <motion.div {...rise(0.3)} className="mt-4 flex items-center gap-3">
          <Rating value={book.rating} />
          <span className="text-sm text-muted-foreground">
            {book.rating.toFixed(1)} · {book.ratingCount} reviews
          </span>
        </motion.div>

        <motion.div {...rise(0.35)} className="mt-8 flex items-baseline gap-4">
          <span className="text-3xl font-semibold text-foreground">
            {formatPrice(book.price, book.currency)}
          </span>
          <span className="text-sm text-muted-foreground">{book.format} · digital</span>
        </motion.div>

        {/* Actions */}
        <motion.div {...rise(0.4)} className="mt-6 flex flex-wrap items-center gap-3">
          {owned ? (
            <Link href={`/library`} className={primaryBtn}>
              <Check className="h-5 w-5" aria-hidden="true" />
              In your library
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBuy}
              disabled={status === "loading"}
              aria-busy={status === "loading"}
              className={primaryBtn}
            >
              {status === "loading" && (
                <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              )}
              {status === "loading"
                ? "Processing…"
                : status === "error"
                  ? "Try again"
                  : isFree
                    ? "Get for free"
                    : "Buy now"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from favorites" : "Add to favorites"}
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <motion.span
              key={String(saved)}
              initial={reduce ? false : { scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.18 }}
            >
              <Heart
                className="h-5 w-5"
                fill={saved ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </motion.span>
          </button>
        </motion.div>

        {/* Purchase feedback */}
        <div aria-live="polite" className="mt-4">
          <AnimatePresence mode="wait" initial={false}>
            {status === "success" && (
              <motion.div
                key="success"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-accent/15 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    initial={reduce ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary-foreground"
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </motion.span>
                  <p className="text-sm font-medium text-foreground">
                    {isFree ? "Added to your library." : "Purchase complete."} Your book is ready.
                  </p>
                </div>
                <Link
                  href={`/read/${book.id}`}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Read now
                </Link>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                role="alert"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl border border-danger/40 px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">
                  Payment didn't complete. Your order was not charged.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use the Try again button above to retry.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}