"use client";

import { useMemo, useState } from "react";
import { Flag } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReportCard } from "@/components/admin/ReportCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminReports } from "@/hooks/useAdminReports";
import { cn } from "@/lib/utils";
import type { BookReport, ReportStatus } from "@/types/report";

const FILTERS: { value: ReportStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
];

export default function AdminReportsPage() {
  const { reports, unpublishable, loading, error, retry, handle } = useAdminReports();
  const [filter, setFilter] = useState<ReportStatus>("open");
  const [notice, setNotice] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of reports) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [reports]);

  const visible = reports.filter((r) => r.status === filter);

  async function onHandle(
    report: BookReport,
    status: "resolved" | "dismissed",
    note: string,
    unpublish: boolean
  ) {
    await handle(report, status, note, unpublish);
    setNotice(
      status === "dismissed"
        ? `Report on “${report.bookTitle}” was dismissed.`
        : unpublish
          ? `Report on “${report.bookTitle}” was resolved and the book was unpublished.`
          : `Report on “${report.bookTitle}” was resolved.`
    );
  }

  return (
    <AdminShell>
      <header>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Reports</h1>
        <p className="mt-2 text-muted">What readers have flagged about books in the store.</p>
      </header>

      {!loading && !error && (
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => {
                setFilter(f.value);
                setNotice(null);
              }}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-(--duration-fast)",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted hover:text-foreground"
              )}
            >
              {f.label}
              <span className="tabular-nums opacity-70">{counts[f.value] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      <div role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-foreground">
        {notice}
      </div>

      <section aria-label="Reports" className="mt-4">
        {error ? (
          <ErrorState
            title="We couldn't load reports."
            description="Please try again."
            onRetry={retry}
            retryLabel="Retry"
          />
        ) : loading ? (
          <div className="flex flex-col gap-4" aria-hidden>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-5">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="mt-3 h-4 w-1/3" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-6 h-9 w-48" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Flag className="size-5" />}
            title={filter === "open" ? "No open reports." : `No ${filter} reports.`}
            description={
              filter === "open"
                ? "When a reader flags a book, it will show up here."
                : "Reports will appear here once they have been handled."
            }
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {visible.map((r) => (
              <li key={r.id}>
                <ReportCard
                  report={r}
                  canUnpublish={unpublishable.includes(r.bookId)}
                  onHandle={onHandle}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}