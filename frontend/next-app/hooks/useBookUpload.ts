"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { uploadFile, type UploadHandle } from "@/lib/upload";

export type UploadStatus = "idle" | "uploading" | "processing" | "done" | "error";

export interface UploadedBookFile {
  id: string;
  kind: string;
  name: string;
  size: number;
  format: string;
}

type Handle = UploadHandle<{ upload: UploadedBookFile }>;

/** Uploads the book file to the API with real progress. */
export function useBookUpload(onDone: (file: File, uploaded: UploadedBookFile) => void) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handle = useRef<Handle | null>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  // Stop an upload that is still running when the page closes.
  useEffect(() => () => handle.current?.abort(), []);

  const start = useCallback((f: File) => {
    handle.current?.abort();
    setFile(f);
    setError(null);
    setProgress(0);
    setStatus("uploading");

    const h: Handle = uploadFile<{ upload: UploadedBookFile }>("/uploads/book", f, f.name, {
      onProgress: (p) => setProgress(p),
      onSent: () => {
        setProgress(100);
        setStatus("processing");
      },
    });
    handle.current = h;

    h.promise
      .then(({ upload }) => {
        if (handle.current !== h) return; // cancelled or replaced
        setStatus("done");
        doneRef.current(f, upload);
      })
      .catch((err) => {
        if (handle.current !== h) return;
        if (err instanceof ApiError && err.code === "ABORTED") return;
        setError(err instanceof Error ? err.message : "The upload failed. Try again.");
        setStatus("error");
      });
  }, []);

  /** Stop an in-flight upload and go back to idle. */
  const cancel = useCallback(() => {
    handle.current?.abort();
    handle.current = null;
    setStatus("idle");
    setProgress(0);
    setError(null);
    setFile(null);
  }, []);

  const reset = cancel;

  return { status, progress, error, file, start, cancel, reset };
}

export type BookUpload = ReturnType<typeof useBookUpload>;