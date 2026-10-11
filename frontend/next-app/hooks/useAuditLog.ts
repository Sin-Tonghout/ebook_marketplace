"use client";

import { useCallback, useEffect, useState } from "react";
import { readAuditEntries } from "@/services/audit";
import type { AuditEntry } from "@/types/admin";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useAuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      await delay(300); // simulate network so the loading state is visible
      setEntries(readAuditEntries());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { entries, loading, error, retry: load };
}