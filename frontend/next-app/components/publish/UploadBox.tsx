"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Check, FileText, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MAX_FILE_MB, formatBytes } from "@/types/publish";
import type { UploadStatus } from "@/hooks/useMockUpload";

interface Props {
  status: UploadStatus;
  progress: number;
  fileName?: string;
  fileSize?: number;
  error?: string | null;
  onSelect: (file: File) => void;
  onCancel: () => void;
  onRemove: () => void;
  onRetry?: () => void;
}

const INPUT_ID = "book-file";

export function UploadBox({
  status,
  progress,
  fileName,
  fileSize,
  error,
  onSelect,
  onCancel,
  onRemove,
  onRetry,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const showCard = status === "uploading" || status === "processing" || status === "done";

  function pick(file: File | undefined) {
    if (file) onSelect(file);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    pick(e.target.files?.[0]);
    e.target.value = ""; // allow choosing the same file again
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={INPUT_ID}
        type="file"
        accept=".pdf,.epub,application/pdf,application/epub+zip"
        className="sr-only"
        tabIndex={showCard ? -1 : 0}
        onChange={onInputChange}
      />

      {showCard ? (
        <div className="animate-pop-in rounded-lg border border-border bg-surface p-5 shadow-card">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent-soft text-foreground">
              <FileText className="size-5" aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <p className="type-label truncate">{fileName}</p>
              <p className="type-caption">
                {fileName?.split(".").pop()?.toUpperCase()}
                {fileSize != null && ` · ${formatBytes(fileSize)}`}
              </p>

              {status !== "done" && (
                <div
                  role="progressbar"
                  aria-label="Upload progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border"
                >
                  <div
                    className="h-full origin-left rounded-full bg-accent transition-transform duration-(--duration-fast) ease-folio"
                    style={{ transform: `scaleX(${progress / 100})` }}
                  />
                </div>
              )}

              <p
                aria-live="polite"
                className={cn(
                  "type-body-sm mt-2 flex items-center gap-1.5",
                  status === "done" ? "text-success" : "text-muted"
                )}
              >
                {status === "uploading" && `Uploading… ${progress}%`}
                {status === "processing" && (
                  <>
                    <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    Processing your file…
                  </>
                )}
                {status === "done" && (
                  <>
                    <Check className="size-3.5" aria-hidden />
                    Ready
                  </>
                )}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {status === "uploading" && (
                <Button variant="secondary" size="sm" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              {status === "done" && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                  >
                    Replace
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onRemove}>
                    Remove
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={INPUT_ID}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-14 text-center",
            "transition-colors duration-(--duration-fast) ease-folio",
            "focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30",
            dragging
              ? "border-accent bg-accent-soft/40"
              : error
              ? "border-danger/60 bg-surface hover:border-danger"
              : "border-border bg-surface hover:border-muted"
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-surface-soft">
            <Upload className="size-5" aria-hidden />
          </span>
          <span className="type-h4">
            {dragging ? "Drop to upload" : "Drag & drop your file"}
          </span>
          <span className="type-body-sm text-muted">
            or <span className="text-foreground underline underline-offset-4">browse files</span>
          </span>
          <span className="type-caption">PDF or EPUB · up to {MAX_FILE_MB} MB</span>
        </label>
      )}

      {error && !showCard && (
        <div
          role="alert"
          className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-danger/40 bg-danger/10 px-4 py-3"
        >
          <p className="type-body-sm text-danger">{error}</p>
          {onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}