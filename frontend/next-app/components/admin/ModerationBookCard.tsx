"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BookCover } from "@/components/books/BookCover";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formatPrice, formatRelativeDate } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/seller-status";
import type { ModerationAction } from "@/types/admin";
import type { SellerBook } from "@/types/seller";

type ReasonMode = "reject" | "request_changes" | "unpublish";

const REASON_COPY: Record<
  ReasonMode,
  { label: string; hint: string; confirm: string; required: boolean }
> = {
  reject: {
    label: "Reason for rejecting",
    hint: "The seller will see this message.",
    confirm: "Reject book",
    required: true,
  },
  request_changes: {
    label: "What needs to change?",
    hint: "The seller will see this and can edit and resubmit.",
    confirm: "Request changes",
    required: true,
  },
  unpublish: {
    label: "Reason for unpublishing (optional)",
    hint: "The book moves to Archived and leaves the store.",
    confirm: "Unpublish book",
    required: false,
  },
};

function fileSize(bytes: number) {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

export function ModerationBookCard({
  book,
  onModerate,
}: {
  book: SellerBook;
  onModerate: (
    book: SellerBook,
    action: ModerationAction,
    reason: string
  ) => Promise<unknown>;
}) {
  const reduce = useReducedMotion();
  const [inspect, setInspect] = useState(false);
  const [mode, setMode] = useState<ReasonMode | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: ModerationAction, text = "") {
    setBusy(true);
    setError(null);
    try {
      await onModerate(book, action, text);
      setMode(null);
      setReason("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const copy = mode ? REASON_COPY[mode] : null;
  const detailsId = `inspect-${book.id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-border bg-surface p-5"
    >
      <div className="flex gap-4">
        <div className="w-20 shrink-0 sm:w-24">
          <BookCover title={book.title} author="Folio" src={book.coverUrl} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-lg text-foreground">{book.title}</h2>
            <Badge variant={book.status} dot>
              {STATUS_LABEL[book.status]}
            </Badge>
          </div>
          {book.subtitle && <p className="mt-1 text-sm text-muted">{book.subtitle}</p>}
          <p className="mt-2 type-caption text-muted">
            {[
              book.category,
              book.language,
              book.price === 0 ? "Free" : formatPrice(book.price, book.currency),
              `Updated ${formatRelativeDate(book.updatedAt)}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {book.status === "rejected" && book.rejectionReason && (
            <p className="mt-3 rounded-lg bg-surface-soft p-3 text-sm text-foreground">
              {book.rejectionReason}
            </p>
          )}

          <button
            type="button"
            onClick={() => setInspect((v) => !v)}
            aria-expanded={inspect}
            aria-controls={detailsId}
            className="mt-3 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {inspect ? "Hide details" : "Inspect details"}
          </button>

          {inspect && (
            <dl id={detailsId} className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="type-label text-muted">Description</dt>
                <dd className="mt-1 text-foreground">
                  {book.description || "No description provided."}
                </dd>
              </div>
              <div>
                <dt className="type-label text-muted">File</dt>
                <dd className="mt-1 text-foreground">
                  {book.file
                    ? `${book.file.name} · ${fileSize(book.file.size)}`
                    : "No file uploaded"}
                </dd>
              </div>
              <div>
                <dt className="type-label text-muted">Tags</dt>
                <dd className="mt-1 text-foreground">
                  {book.tags && book.tags.length > 0 ? book.tags.join(", ") : "None"}
                </dd>
              </div>
            </dl>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {error}
            </p>
          )}

          {mode && copy ? (
            <div className="mt-4 flex flex-col gap-3">
              <Textarea
                label={copy.label}
                hint={copy.hint}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={busy || (copy.required && reason.trim().length < 10)}
                  onClick={() => run(mode, reason)}
                >
                  {busy ? "Saving…" : copy.confirm}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => {
                    setMode(null);
                    setReason("");
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {book.status === "pending" && (
                <>
                  <Button size="sm" disabled={busy} onClick={() => run("approve")}>
                    {busy ? "Saving…" : "Approve"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => setMode("request_changes")}
                  >
                    Request changes
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => setMode("reject")}
                  >
                    Reject
                  </Button>
                </>
              )}
              {book.status === "published" && (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => setMode("unpublish")}
                >
                  Unpublish
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}