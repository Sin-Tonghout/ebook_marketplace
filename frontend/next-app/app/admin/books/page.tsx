"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ModerationBookCard } from "@/components/admin/ModerationBookCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useModerationQueue } from "@/hooks/useModerationQueue";
import { STATUS_LABEL } from "@/lib/seller-status";
import { cn } from "@/lib/utils";
import type { ModerationAction } from "@/types/admin";
import type { SellerBook, SellerBookStatus } from "@/types/seller";

const FILTERS: SellerBookStatus[] = ["pending", "published", "rejected", "archived"];

const DONE_TEXT: Record<ModerationAction, string> = {
  approve: "approved and is now published",
  reject: "rejected",
  request_changes: "sent back for changes",
  unpublish: "unpublished and moved to Archived",
};

export default function AdminBooksPage() {
  const { books, loading, error, retry, moderate } = useModerationQueue();
  const [filter, setFilter] = useState<SellerBookStatus>("pending");
  const [notice, setNotice] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const b of books) c[b.status] = (c[b.status] ?? 0) + 1;
    return c;
  }, [books]);

  const visible = books.filter((b) => b.status === filter);

  async function handleModerate(
    book: SellerBook,
    action: ModerationAction,
    reason: string
  ) {
    await moderate(book, action, reason);
    setNotice(`“${book.title}” was ${DONE_TEXT[action]}.`);
  }

  return (
    <AdminShell>
      <header>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Books</h1>
        <p className="mt-2 text-muted">Review submissions and manage what's in the store.</p>
      </header>

      {!loading && !error && (
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={filter === s}
              onClick={() => {
                setFilter(s);
                setNotice(null);
              }}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-(--duration-fast)",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                filter === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted hover:text-foreground"
              )}
            >
              {STATUS_LABEL[s]}
              <span className="tabular-nums opacity-70">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      <div role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-foreground">
        {notice}
      </div>

      <section aria-label="Books" className="mt-4">
        {error ? (
          <ErrorState
            title="We couldn't load the queue."
            description="Please try again."
            onRetry={retry}
            retryLabel="Retry"
          />
        ) : loading ? (
          <div className="flex flex-col gap-4" aria-hidden>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-border bg-surface p-5">
                <Skeleton className="h-32 w-20 shrink-0 sm:w-24" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="mt-3 h-4 w-1/2" />
                  <Skeleton className="mt-6 h-9 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Inbox className="size-5" />}
            title={
              filter === "pending"
                ? "The queue is clear."
                : `No ${STATUS_LABEL[filter].toLowerCase()} books.`
            }
            description={
              filter === "pending"
                ? "New submissions will appear here for review."
                : "Books will show up here when they reach this status."
            }
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {visible.map((book) => (
              <li key={book.id}>
                <ModerationBookCard book={book} onModerate={handleModerate} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}