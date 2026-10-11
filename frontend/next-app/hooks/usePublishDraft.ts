"use client";

import { useCallback, useEffect, useState } from "react";
import { BookDraft, emptyDraft } from "@/types/publish";

const KEY = "folio.publish.draft.v1";

export function usePublishDraft() {
  const [draft, setDraft] = useState<BookDraft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDraft({ ...emptyDraft, ...JSON.parse(raw) });
    } catch {
      /* storage empty or blocked: start fresh */
    }
    setHydrated(true);
  }, []);

  // Autosave after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(draft));
    } catch {
      /* ignore quota/private-mode errors */
    }
  }, [draft, hydrated]);

  const update = useCallback(
    (patch: Partial<BookDraft>) => setDraft((d) => ({ ...d, ...patch })),
    []
  );

  const reset = useCallback(() => {
    setDraft(emptyDraft);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, []);

  return { draft, update, reset, hydrated };
}