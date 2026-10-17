"use client";

import { useCallback, useEffect, useState } from "react";
import type { SellerOverview } from "@/types/seller";
import { fetchSellerBooksOverview } from "@/services/seller-books";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: SellerOverview };

export function useSellerData() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetchSellerBooksOverview()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}