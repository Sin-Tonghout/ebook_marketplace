"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UploadStatus = "idle" | "uploading" | "processing" | "done" | "error";

/**
 * Simulates an upload with progress. Replace the internals with a real
 * request (XHR/fetch to Express) in Phase 13 and keep this same return shape.
 * Files with "fail" in the name simulate an interrupted upload.
 */
export function useMockUpload(onDone: (file: File) => void) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  const clearTimers = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    if (timeout.current) clearTimeout(timeout.current);
    interval.current = null;
    timeout.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const start = useCallback(
    (f: File) => {
      clearTimers();
      setFile(f);
      setError(null);
      setProgress(0);
      setStatus("uploading");

      const willFail = /fail/i.test(f.name);
      let p = 0;

      interval.current = setInterval(() => {
        p += 4 + Math.random() * 6;

        if (willFail && p >= 60) {
          clearTimers();
          setError("The upload was interrupted. Check your connection and try again.");
          setStatus("error");
          return;
        }

        if (p >= 100) {
          clearTimers();
          setProgress(100);
          setStatus("processing");
          timeout.current = setTimeout(() => {
            setStatus("done");
            doneRef.current(f);
          }, 1200);
          return;
        }

        setProgress(Math.round(p));
      }, 120);
    },
    [clearTimers]
  );

  /** Stop an in-flight upload and go back to idle. */
  const cancel = useCallback(() => {
    clearTimers();
    setStatus("idle");
    setProgress(0);
    setError(null);
    setFile(null);
  }, [clearTimers]);

  const reset = cancel;

  return { status, progress, error, file, start, cancel, reset };
}

export type MockUpload = ReturnType<typeof useMockUpload>;