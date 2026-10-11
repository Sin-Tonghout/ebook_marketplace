"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Loader2, X } from "lucide-react";
import type { BookDetail } from "@/types/book-detail";
import type { MockScenario } from "@/types/commerce";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLibrary } from "@/hooks/useLibrary";
import { useCheckout } from "@/hooks/useCheckout";
import { bookToOrderItem } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { MockScenarioPicker } from "@/components/checkout/MockScenarioPicker";

const isDev = process.env.NODE_ENV !== "production";

export function CheckoutView({ book }: { book: BookDetail }) {
  const reduce = useReducedMotion();
  const { user } = useAuth();
  const { state: library } = useLibrary();
  const { phase, error, pay, reset } = useCheckout(book);
  const [scenario, setScenario] = useState<MockScenario>("success");

  const owned = library?.owned.includes(book.id) ?? false;
  const processing = phase === "processing";
  const hasError = phase === "error";

  const panel = {
    ...(reduce
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
        }),
  };

  const primaryBtn =
    "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70";
  const secondaryLink =
    "rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <motion.div
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
          })}
      className="grid gap-10 md:grid-cols-[1fr_380px] md:gap-14"
    >
      <div>
        <h1 className="font-serif text-4xl text-foreground md:text-5xl">Checkout</h1>

        <section aria-labelledby="account-heading" className="mt-8 rounded-2xl border border-border p-6">
          <h2 id="account-heading" className="text-sm font-medium text-muted">
            Account
          </h2>
          <p className="mt-2 text-base font-medium text-foreground">{user?.name}</p>
          <p className="text-sm text-muted">{user?.email}</p>
          <p className="mt-3 text-sm text-muted">Your book will be added to this account&apos;s library.</p>
        </section>

        {!owned && (
          <section aria-labelledby="method-heading" className="mt-6 rounded-2xl border border-border p-6">
            <h2 id="method-heading" className="text-sm font-medium text-muted">
              Payment method
            </h2>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-foreground/30 px-4 py-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">ABA PayWay</p>
                <p className="text-xs text-muted">Demo mode. No real money is charged.</p>
              </div>
            </div>
            {isDev && <MockScenarioPicker value={scenario} onChange={setScenario} disabled={processing} />}
          </section>
        )}

        <div aria-live="polite" className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            {hasError ? (
              <motion.div
                key="error"
                role="alert"
                {...panel}
                className="rounded-xl border border-danger/40 px-4 py-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger text-primary-foreground">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-foreground">{error}</p>
                </div>
                <button type="button" onClick={reset} className={`${primaryBtn} mt-4`}>
                  Try again
                </button>
              </motion.div>
            ) : owned && !processing ? (
              <motion.div
                key="owned"
                {...panel}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-accent/15 px-4 py-3"
              >
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  You already own this book.
                </p>
                <Link href={`/read/${book.id}`} className={secondaryLink}>
                  Read now
                </Link>
              </motion.div>
            ) : (
              <motion.div key="pay" {...panel}>
                <button
                  type="button"
                  onClick={() => pay(scenario)}
                  disabled={processing || !user}
                  aria-busy={processing}
                  className={primaryBtn}
                >
                  {processing && (
                    <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  )}
                  {processing ? "Processing payment…" : `Pay ${formatPrice(book.price, book.currency)}`}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <OrderSummary items={[bookToOrderItem(book)]} />
    </motion.div>
  );
}