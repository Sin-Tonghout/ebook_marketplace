"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { UploadProgress, type UploadStatus } from "@/components/ui/UploadProgress";
import { ReaderLoading } from "@/components/reader/ReaderLoading";
import { BookCardSkeleton } from "@/components/books/BookCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingPlayground() {
  const [status, setStatus] = useState<UploadStatus>("uploading");
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"ok" | "fail">("ok");
  const [showReader, setShowReader] = useState(false);

  const start = (m: "ok" | "fail") => {
    setMode(m);
    setProgress(0);
    setStatus("uploading");
  };

  // Real progress ticks only while uploading
  useEffect(() => {
    if (status !== "uploading") return;
    const id = setInterval(
      () => setProgress((p) => Math.min(100, p + 4 + Math.random() * 6)),
      200
    );
    return () => clearInterval(id);
  }, [status]);

  // Decide what happens at each threshold
  useEffect(() => {
    if (status !== "uploading") return;
    if (mode === "fail" && progress >= 55) setStatus("error");
    else if (progress >= 100) setStatus("processing");
  }, [progress, status, mode]);

  // Fake server-side processing
  useEffect(() => {
    if (status !== "processing") return;
    const t = setTimeout(() => setStatus("done"), 2000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <main className="mx-auto max-w-3xl space-y-12 p-8">
      <h1 className="type-h2">Loading states</h1>
      <Link href="/playground/motion" className="underline">
        ← Back to motion playground
      </Link>

      <section className="space-y-4">
        <h2 className="type-h4">Shimmer blocks</h2>
              <div className="space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <BookCardSkeleton />
          <BookCardSkeleton />
          <BookCardSkeleton />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="type-h4">Progress bar</h2>
        <ProgressBar label="Indeterminate example" />
        <ProgressBar value={65} label="Determinate example" showValue />
        <ProgressBar value={100} label="Success example" tone="success" showValue />
        <ProgressBar value={40} label="Danger example" tone="danger" showValue />
      </section>

      <section className="space-y-4">
        <h2 className="type-h4">Upload progress</h2>
        <UploadProgress
          fileName="the-future-of-design.pdf"
          fileSize={8_400_000}
          progress={progress}
          status={status}
          onRetry={() => start("ok")}
          onRemove={() => start("ok")}
        />
        <div className="flex gap-3">
          <Button onClick={() => start("ok")}>Simulate success</Button>
          <Button variant="secondary" onClick={() => start("fail")}>
            Simulate failure
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="type-h4">Reader loading</h2>
        <Button onClick={() => setShowReader((s) => !s)}>
          {showReader ? "Hide" : "Show"} reader loading
        </Button>
        {showReader && <ReaderLoading title="The Future of Design" />}
      </section>

        
    </main>
  );
}