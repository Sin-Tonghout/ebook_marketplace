"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BookPreviewPage } from "@/types/book-detail";

export function BookPreview({ pages }: { pages: BookPreviewPage[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const regionRef = useRef<HTMLDivElement>(null);

  const total = pages.length;
  const atStart = index === 0;
  const atEnd = index === total - 1;

  const go = useCallback(
    (delta: 1 | -1) => {
      const next = index + delta;
      if (next < 0 || next >= total) return;
      setDirection(delta);
      setIndex(next);
    },
    [index, total]
  );

  // Arrow keys work while the preview region has focus
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  if (total === 0) return null;

  const page = pages[index];

  // Interface-level timing (250-400ms)
  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -32 }),
  };

  return (
    <section aria-labelledby="preview-heading">
      <h2 id="preview-heading" className="font-serif text-2xl text-foreground md:text-3xl">
        Preview
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Read a few pages before you decide.
      </p>

      <div
        ref={regionRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Book preview. Use left and right arrow keys to change page."
        className="mt-6 rounded-2xl border border-border bg-surface p-6 focus-visible:outline-2 focus-visible:outline-offset-2 md:p-10"
      >
        <div className="relative min-h-[320px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.article
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-prose"
            >
              {page.chapter && (
                <h3 className="mb-6 font-serif text-xl text-foreground">{page.chapter}</h3>
              )}
              <div className="space-y-4 font-serif text-lg leading-relaxed text-foreground/90">
                {page.text.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Screen readers hear the page change */}
        <p className="sr-only" aria-live="polite">
          Page {index + 1} of {total}
        </p>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={atStart}
            aria-label="Previous page"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </button>

          <div className="flex flex-1 flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {index + 1} / {total}
            </span>
            <div className="h-1 w-full max-w-[160px] overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full origin-left bg-accent"
                initial={false}
                animate={{ width: `${((index + 1) / total) * 100}%` }}
                transition={{ duration: reduce ? 0 : 0.28 }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            disabled={atEnd}
            aria-label="Next page"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}