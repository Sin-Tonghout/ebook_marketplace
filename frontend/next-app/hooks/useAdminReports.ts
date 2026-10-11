"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { reportAdmin } from "@/services/admin-reports";
import type { BookReport } from "@/types/report";

export function useAdminReports() {
  const { user } = useAuth();
  const actor = useMemo(
    () => ({ id: user?.id ?? "unknown", name: user?.name ?? "Admin" }),
    [user]
  );

  const [reports, setReports] = useState<BookReport[]>([]);
  const [unpublishable, setUnpublishable] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await reportAdmin.list();
      setReports(data.reports);
      setUnpublishable(data.unpublishable);
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
  const handle = useCallback(
    async (
      report: BookReport,
      status: "resolved" | "dismissed",
      note: string,
      unpublish: boolean
    ) => {
      const res = await reportAdmin.resolve(report, status, note, unpublish, actor);
      setReports((prev) => prev.map((r) => (r.id === res.report.id ? res.report : r)));
      if (res.unpublishedBookId) {
        setUnpublishable((prev) => prev.filter((id) => id !== res.unpublishedBookId));
      }
      return res;
    },
    [actor]
  );

  return { reports, unpublishable, loading, error, retry: load, handle };
}