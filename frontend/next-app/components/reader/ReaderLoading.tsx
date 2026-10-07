"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FadeIn } from "@/components/motion";

const lines = ["w-full", "w-full", "w-11/12", "w-full", "w-4/5", "w-2/3"];

export function ReaderLoading({ title }: { title?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-8 px-6"
    >
      <span className="sr-only">Opening {title ?? "your book"}</span>

      <FadeIn level="slow" className="w-28">
        <Skeleton className="aspect-2/3 w-full rounded-sm" />
      </FadeIn>

      <FadeIn delay={0.1} className="w-full space-y-3" aria-hidden>
        {lines.map((width, i) => (
          <Skeleton key={i} className={`h-3 ${width}`} />
        ))}
      </FadeIn>

      <FadeIn delay={0.2} className="w-full max-w-xs space-y-2 text-center" aria-hidden>
        <ProgressBar label="Opening book" />
        <p className="type-caption text-muted">
          {title ? `Opening ${title}` : "Opening your book"}
        </p>
      </FadeIn>
    </div>
  );
}