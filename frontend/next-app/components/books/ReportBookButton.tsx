"use client";

import { useState } from "react";
import Link from "next/link";
import { Flag } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { REPORT_REASONS } from "@/lib/reports";
import { reportService } from "@/services/reports";
import type { ReportReason } from "@/types/report";

export function ReportBookButton({
  bookId,
  bookTitle,
}: {
  bookId: string;
  bookTitle: string;
}) {
  const { user, state } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<{ reason?: string; details?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  if (state === "loading") return null;

  if (!user) {
    return (
      <p className="type-body-sm text-muted">
        <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </Link>{" "}
        to report this book.
      </p>
    );
  }

  if (sent) {
    return (
      <p role="status" className="type-body-sm text-foreground">
        Thanks. Our team will review your report.
      </p>
    );
  }

  async function submit() {
    const next: { reason?: string; details?: string } = {};
    if (!reason) next.reason = "Choose a reason.";
    if (details.trim().length < 10) next.details = "Tell us a bit more (at least 10 characters).";
    setErrors(next);
    setFormError(null);
    if (next.reason || next.details || !reason || !user) return;

    setBusy(true);
    try {
      await reportService.submit({
        bookId,
        bookTitle,
        reason,
        details,
        reporterName: user.name,
      });
      setSent(true);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Flag className="mr-2 size-4" aria-hidden />
        Report this book
      </Button>
    );
  }

  return (
    <div className="max-w-md space-y-4 rounded-xl border border-border bg-surface p-5">
      <h3 className="type-h4">Report “{bookTitle}”</h3>

      <Select
        id="report-reason"
        label="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value as ReportReason | "")}
        error={errors.reason}
      >
        <option value="">Select a reason</option>
        {REPORT_REASONS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </Select>

      <Textarea
        id="report-details"
        label="Details"
        rows={4}
        placeholder="What should we look at?"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        hint={`${details.length}/500 characters`}
        error={errors.details}
      />

      {formError && (
        <p role="alert" className="text-sm text-danger">
          {formError}
        </p>
      )}

      <div className="flex gap-2">
        <Button size="sm" disabled={busy} onClick={submit}>
          {busy ? "Sending…" : "Send report"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={() => {
            setOpen(false);
            setErrors({});
            setFormError(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}