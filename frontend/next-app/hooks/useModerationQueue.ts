"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { adminService } from "@/services/admin";
import type { ModerationAction } from "@/types/admin";
import type { SellerBook } from "@/types/seller";

export function useModerationQueue() {
  const { user } = useAuth();
  const [books, setBooks] = useState<SellerBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setBooks(await adminService.getModerationBooks());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /** Throws on failure so the card can show the message inline. */
  const moderate = useCallback(
    async (book: SellerBook, action: ModerationAction, reason: string) => {
      const updated = await adminService.moderate(book, action, reason, {
        id: user?.id ?? "unknown",
        name: user?.name ?? "Admin",
      });
      setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      return updated;
    },
    [user]
  );

  return { books, loading, error, retry: load, moderate };
}