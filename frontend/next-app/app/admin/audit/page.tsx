"use client";

import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuditLog } from "@/hooks/useAuditLog";
import { actionLabel, TARGET_LABEL } from "@/lib/audit-labels";
import { formatRelativeDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AuditEntry } from "@/types/admin";

const PAGE_SIZE = 25;
const TYPES = Object.keys(TARGET_LABEL) as AuditEntry["targetType"][];

export default function AdminAuditPage() {
  const { entries, loading, error, retry } = useAuditLog();
  const [type, setType] = useState<AuditEntry["targetType"] | "all">("all");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of entries) c[e.targetType] = (c[e.targetType] ?? 0) + 1;
    return c;
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (type === "all" || e.targetType === type) &&
        (!q ||
          e.actorName.toLowerCase().includes(q) ||
          e.targetLabel.toLowerCase().includes(q) ||
          (e.detail ?? "").toLowerCase().includes(q) ||
          actionLabel(e.action).toLowerCase().includes(q))
    );
  }, [entries, type, query]);

  const visible = filtered.slice(0, shown);
  const filtersActive = type !== "all" || query.trim() !== "";

  function chooseType(next: AuditEntry["targetType"] | "all") {
    setType(next);
    setShown(PAGE_SIZE);
  }

  const chipClass = (active: boolean) =>
    cn(
      "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-(--duration-fast)",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border text-muted hover:text-foreground"
    );

  return (
    <AdminShell>
      <header>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Audit log</h1>
        <p className="mt-2 text-muted">
          A record of every admin decision: who did what, and when.
        </p>
      </header>

      {!loading && !error && entries.length > 0 && (
        <>
          <div className="mt-6 max-w-md">
            <Input
              label="Search activity"
              type="search"
              placeholder="Admin, book, user or note"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShown(PAGE_SIZE);
              }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
            <button
              type="button"
              aria-pressed={type === "all"}
              onClick={() => chooseType("all")}
              className={chipClass(type === "all")}
            >
              All
              <span className="tabular-nums opacity-70">{entries.length}</span>
            </button>
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => chooseType(t)}
                className={chipClass(type === t)}
              >
                {TARGET_LABEL[t]}
                <span className="tabular-nums opacity-70">{counts[t] ?? 0}</span>
              </button>
            ))}
          </div>

          <p role="status" aria-live="polite" className="mt-4 text-sm text-muted">
            Showing {visible.length} of {filtered.length} entries
          </p>
        </>
      )}

      <section aria-label="Audit entries" className="mt-4">
        {error ? (
          <ErrorState
            title="We couldn't load the audit log."
            description="Please try again."
            onRetry={retry}
            retryLabel="Retry"
          />
        ) : loading ? (
          <div className="divide-y divide-border rounded-xl border border-border bg-surface" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="mt-3 h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={<ScrollText className="size-5" />}
            title="No activity yet."
            description="Decisions made in Books, Users, Categories and Reports will be recorded here."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ScrollText className="size-5" />}
            title="No entries match."
            description="Try a different search or filter."
            action={
              filtersActive ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    chooseType("all");
                  }}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
              {visible.map((e) => (
                <li key={e.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{e.actorName}</span>{" "}
                      {actionLabel(e.action)}
                    </p>
                    <time
                      dateTime={e.createdAt}
                      title={new Date(e.createdAt).toLocaleString()}
                      className="type-caption text-muted"
                    >
                      {formatRelativeDate(e.createdAt)}
                    </time>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="neutral">{TARGET_LABEL[e.targetType]}</Badge>
                    <span className="text-sm text-foreground">{e.targetLabel}</span>
                  </div>
                  {e.detail && <p className="mt-2 text-sm text-muted">{e.detail}</p>}
                </li>
              ))}
            </ul>

            {filtered.length > visible.length && (
              <div className="mt-4">
                <Button variant="secondary" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                  Show more
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </AdminShell>
  );
}