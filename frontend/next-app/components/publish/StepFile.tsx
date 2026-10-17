"use client";

import { useState } from "react";
import { UploadBox } from "@/components/publish/UploadBox";
import type { BookUpload } from "@/hooks/useBookUpload";
import { validateBookFile, type BookDraft } from "@/types/publish";

interface Props {
  draft: BookDraft;
  upload: BookUpload;
  /** True after the user tried to continue without a file. */
  showRequiredError: boolean;
  onRemove: () => void;
}

export function StepFile({ draft, upload, showRequiredError, onRemove }: Props) {
  const [validationError, setValidationError] = useState<string | null>(null);

  // After a refresh the upload hook is idle, but the draft still remembers the file.
  const status = upload.status !== "idle" ? upload.status : draft.file ? "done" : "idle";
  const fileName = upload.file?.name ?? draft.file?.name;
  const fileSize = upload.file?.size ?? draft.file?.size;

  const error =
    validationError ??
    (upload.status === "error" ? upload.error : null) ??
    (showRequiredError && !draft.file ? "Upload your book file to continue." : null);

  function handleSelect(file: File) {
    const problem = validateBookFile(file);
    if (problem) {
      setValidationError(problem);
      return;
    }
    setValidationError(null);
    upload.start(file);
  }

  function handleRemove() {
    upload.reset();
    setValidationError(null);
    onRemove();
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="type-h3">Upload your book</h2>
        <p className="type-body mt-2 text-muted">
          Add the file readers will receive after buying. You can replace it later.
        </p>
      </header>

      <UploadBox
        status={status}
        progress={upload.progress}
        fileName={fileName}
        fileSize={fileSize}
        error={error}
        onSelect={handleSelect}
        onCancel={upload.cancel}
        onRemove={handleRemove}
        onRetry={upload.file && upload.status === "error" ? () => upload.start(upload.file!) : undefined}
      />
    </div>
  );
}