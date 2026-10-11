"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/orders";
import type { Order } from "@/types/commerce";

/** Reads one order from storage after mount. `loading` is true until then. */
export function useOrder(orderId?: string) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    const sync = () => setOrder(orderId ? (orderService.get(orderId) ?? null) : null);
    sync();
    window.addEventListener("folio:orders", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("folio:orders", sync);
      window.removeEventListener("storage", sync);
    };
  }, [orderId]);

  return { order: order ?? null, loading: order === undefined };
}