"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formatRelativeDate } from "@/lib/format";
import { REASON_LABEL } from "@/lib/reports";
import type { BookReport, ReportStatus } from "@/types/report";

type Mode = "dismiss" | "resolve" | "unpublish";

const STATUS_LABEL: Record<ReportStatus, string> = {
  open: "Open",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const STATUS_BADGE = {
  open: "pending",
  resolved: "published",
  dismissed: "archived",
} as const;

const MODE_COPY: Record<Mode, { label: string; hint: string; confirm: string }> = {
  dismiss: {
    label: "Why is this being dismissed? (optional)",
    hint: "Saved in the audit log.",
    confirm: "Dismiss report",
  },
  resolve: {
    label: "What did you do? (optional)",
    hint: "Saved in the audit log.",
    confirm: "Resolve report",
  },
  unpublish: {
    label: "Note (optional)",
    hint: "The book moves to Archived and the seller sees this note.",
    confirm: "Resolve and unpublish",
  },
};

export function ReportCard({
  report,
  canUnpublish,
  onHandle,
}: {
  report: BookReport;
  canUnpublish: boolean;
  onHandle: (
    report: BookReport,
    status: "resolved" | "dismissed",
    note: string,
    unpublish: boolean
  ) => Promise<unknown>;
}) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!mode) return;
    setBusy(true);
    setError(null);
    try {
      await onHandle(
        report,
        mode === "dismiss" ? "dismissed" : "resolved",
        note,
        mode === "unpublish"
      );
      setMode(null);
      setNote("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const copy = mode ? MODE_COPY[mode] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-serif text-lg text-foreground">{report.bookTitle}</h2>
        <Badge variant="neutral">{REASON_LABEL[report.reason]}</Badge>
        <Badge variant={STATUS_BADGE[report.status]} dot>
          {STATUS_LABEL[report.status]}
        </Badge>
      </div>
      <p className="mt-1 type-caption text-muted">
        Reported by {report.reporterName} · {formatRelativeDate(report.createdAt)}
      </p>

      <p className="mt-3 text-sm text-foreground">{report.details}</p>

      {report.status !== "open" && (
        <p className="mt-3 rounded-lg bg-surface-soft p-3 text-sm text-foreground">
          {report.resolution ?? "No note added."}
          {report.handledBy && (
            <span className="mt-1 block type-caption text-muted">
              {STATUS_LABEL[report.status]} by {report.handledBy}
              {report.handledAt ? ` · ${formatRelativeDate(report.handledAt)}` : ""}
            </span>
          )}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      {report.status === "open" &&
        (mode && copy ? (
          <div className="mt-4 flex flex-col gap-3">
            <Textarea
              label={copy.label}
              hint={copy.hint}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" disabled={busy} onClick={confirm}>
                {busy ? "Saving…" : copy.confirm}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={busy}
                onClick={() => {
                  setMode(null);
                  setNote("");
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setMode("dismiss")}>
              Dismiss
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setMode("resolve")}>
              Resolve
            </Button>
            {canUnpublish && (
              <Button size="sm" onClick={() => setMode("unpublish")}>
                Resolve and unpublish
              </Button>
            )}
          </div>
        ))}
    </motion.article>
  );
}