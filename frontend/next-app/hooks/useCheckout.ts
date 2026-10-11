"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLibrary } from "@/hooks/useLibrary";
import { orderService } from "@/services/orders";
import { paymentService } from "@/services/payment";
import type { BookDetail } from "@/types/book-detail";
import type { MockScenario } from "@/types/commerce";

export type CheckoutPhase = "idle" | "processing" | "error";

export function useCheckout(book: BookDetail) {
  const router = useRouter();
  const { user } = useAuth();
  const { addOwned } = useLibrary();
  const [phase, setPhase] = useState<CheckoutPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false); // blocks double clicks

  const pay = useCallback(
    async (scenario: MockScenario) => {
      if (!user || busy.current) return;
      busy.current = true;
      setPhase("processing");
      setError(null);

      try {
        // Retries reuse the same order instead of creating duplicates.
        const order = orderService.createFromBook(user.id, book);

        const created = await paymentService.createPayment({
          orderId: order.id,
          amount: order.total,
          currency: order.currency,
          scenario,
        });

        // Never trust the first response alone: verify the payment, then update the order.
        const verified = await paymentService.verifyPayment(created.paymentId);
        const status = verified?.status ?? "failed";
        const reason = verified?.failureReason ?? created.failureReason;

        if (status === "success") {
          orderService.markPaid(order.id, created.paymentId);
          addOwned(book.id); // library delivery
          router.push(`/checkout/${book.id}/success?order=${order.id}`);
        } else {
          const kind = status === "cancelled" ? "cancelled" : "failed";
          orderService.markFailed(order.id, created.paymentId, kind, reason);
          router.push(`/checkout/${book.id}/failed?order=${order.id}`);
        }
      } catch {
        setError("Something went wrong on our side. Your order was not charged.");
        setPhase("error");
      } finally {
        busy.current = false;
      }
    },
    [user, book, addOwned, router]
  );

  const reset = useCallback(() => {
    setPhase("idle");
    setError(null);
  }, []);

  return { phase, error, pay, reset };
}