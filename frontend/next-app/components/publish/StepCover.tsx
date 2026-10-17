"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { ImagePlus, Loader2, TriangleAlert } from "lucide-react";

import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/Button";
import { processCoverImage } from "@/lib/processCover";
import { discardUpload, uploadFile } from "@/lib/upload";
import { cn } from "@/lib/utils";
import {
  COVER_MAX_MB,
  COVER_MIN_H,
  COVER_MIN_W,
  coverWillCrop,
  validateCoverFile,
  type BookDraft,
} from "@/types/publish";

interface Props {
  draft: BookDraft;
  authorName: string;
  /** True after the user tried to continue without a cover. */
  showRequiredError: boolean;
  onChange: (patch: Partial<BookDraft>) => void;
}

const INPUT_ID = "cover-file";

export function StepCover({ draft, authorName, showRequiredError, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cover = draft.cover;
  const title = draft.title.trim() || "Your book title";
  const shownError = error ?? (showRequiredError && !cover ? "Add a cover to continue." : null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const problem = validateCoverFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const result = await processCoverImage(file);
      // Send the prepared image (max 600px wide) to the server and keep its id
      const blob = await (await fetch(result.dataUrl)).blob();
      const sent = await uploadFile<{ upload: { id: string } }>(
        "/uploads/cover",
        blob,
        "cover.jpg"
      ).promise;
      if (cover?.uploadId) discardUpload(cover.uploadId); // the old cover is replaced
      onChange({ cover: { name: file.name, ...result, uploadId: sent.upload.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    void handleFile(e.target.files?.[0]);
    e.target.value = ""; // allow choosing the same file again
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    void handleFile(e.dataTransfer.files?.[0]);
  }

  function remove() {
    setError(null);
    if (cover?.uploadId) discardUpload(cover.uploadId);
    onChange({ cover: null });
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="type-h3">Add your cover</h2>
        <p className="type-body mt-2 text-muted">
          The cover is the first thing readers see. A portrait image works best.
        </p>
      </header>

      <input
        id={INPUT_ID}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={cover || busy ? -1 : 0}
        onChange={onInputChange}
      />

      {cover ? (
        <div className="animate-pop-in grid gap-8 md:grid-cols-[minmax(0,240px)_1fr]">
          {/* Large preview */}
          <div className="mx-auto w-full max-w-60">
            <BookCover
              title={title}
              author={authorName}
              src={cover.dataUrl}
              priority
              className="shadow-cover"
            />
          </div>

          <div className="space-y-5">
            {/* Marketplace card preview */}
            <div className="rounded-lg bg-surface-soft p-5">
              <p className="type-caption uppercase tracking-widest">In the store</p>
              <div className="mt-4 w-36">
                <BookCover
                  title={title}
                  author={authorName}
                  src={cover.dataUrl}
                  className="shadow-cover"
                />
                <p className="mt-3 line-clamp-2 text-base font-semibold leading-snug">
                  {title}
                </p>
                <p className="mt-1 truncate text-sm text-muted">{authorName}</p>
              </div>
            </div>

            <div>
              <p className="type-label truncate">{cover.name}</p>
              <p className="type-caption">
                {cover.width}×{cover.height}px
              </p>
            </div>

            {coverWillCrop(cover.width, cover.height) && (
              <p className="type-body-sm flex items-start gap-2 text-warning">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  The store shows covers at a 2:3 ratio, so the edges of this image will be
                  cropped. Check the preview above.
                </span>
              </p>
            )}

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                loading={busy}
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </Button>
              <Button variant="ghost" size="sm" onClick={remove} disabled={busy}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : busy ? (
        <div
          aria-live="polite"
          className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-surface px-6 py-14 text-center"
        >
          <Loader2 className="size-6 animate-spin text-muted" aria-hidden />
          <p className="type-body-sm text-muted">Preparing your cover…</p>
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
              : shownError
              ? "border-danger/60 bg-surface hover:border-danger"
              : "border-border bg-surface hover:border-muted"
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-surface-soft">
            <ImagePlus className="size-5" aria-hidden />
          </span>
          <span className="type-h4">{dragging ? "Drop to add" : "Drag & drop your cover"}</span>
          <span className="type-body-sm text-muted">
            or <span className="text-foreground underline underline-offset-4">browse images</span>
          </span>
          <span className="type-caption">
            JPG, PNG or WebP · at least {COVER_MIN_W}×{COVER_MIN_H}px · up to {COVER_MAX_MB} MB
          </span>
        </label>
      )}

      {shownError && (
        <div
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3"
        >
          <p className="type-body-sm text-danger">{shownError}</p>
        </div>
      )}
    </div>
  );
}