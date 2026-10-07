"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion";

export type UploadStatus = "uploading" | "processing" | "done" | "error";

export interface UploadProgressProps {
  fileName: string;
  /** bytes */
  fileSize: number;
  /** 0-100, used while status is "uploading" */
  progress: number;
  status: UploadStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onRemove?: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const statusText: Record<UploadStatus, string> = {
  uploading: "Uploading",
  processing: "Processing your file",
  done: "Upload complete",
  error: "Upload failed",
};

export function UploadProgress({
  fileName,
  fileSize,
  progress,
  status,
  errorMessage = "The file could not be processed.",
  onRetry,
  onRemove,
}: UploadProgressProps) {
  const fileType = fileName.split(".").pop()?.toUpperCase() ?? "FILE";

  return (
    <div
      className={cn(
        "rounded-xl border bg-surface p-4",
        status === "error" ? "border-danger" : "border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <FileText className="mt-0.5 size-6 shrink-0 text-muted" aria-hidden />

        <div className="min-w-0 flex-1">
          <p className="truncate type-label">{fileName}</p>
          <p className="type-caption text-muted">
            {fileType} · {formatBytes(fileSize)}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status === "done" && (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={transition.fast}
            >
              <CheckCircle2 className="size-5 text-success" aria-hidden />
            </motion.span>
          )}
          {status === "error" && (
            <motion.span
              key="error"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={transition.fast}
            >
              <AlertCircle className="size-5 text-danger" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>

        {onRemove && status !== "processing" && (
          <IconButton label={`Remove ${fileName}`} size="sm" onClick={onRemove}>
            <X className="size-4" />
          </IconButton>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {status === "uploading" && (
          <ProgressBar value={progress} label="Upload progress" showValue />
        )}
        {status === "processing" && <ProgressBar label="Processing file" />}
        {status === "done" && (
          <ProgressBar value={100} label="Upload complete" tone="success" />
        )}
        {status === "error" && (
          <ProgressBar value={progress} label="Upload failed" tone="danger" />
        )}

        <div className="flex items-center justify-between gap-3">
          <p
            aria-live="polite"
            className={cn(
              "type-caption",
              status === "error" ? "text-danger" : "text-muted"
            )}
          >
            {status === "error" ? `${statusText.error}. ${errorMessage}` : statusText[status]}
          </p>

          {status === "error" && onRetry && (
            <Button size="sm" variant="secondary" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}