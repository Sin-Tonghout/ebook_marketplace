"use client";

import { motion } from "motion/react";

import { BookCover } from "@/components/books/BookCover";

export function ReaderSkeleton({ title, author }: { title?: string; author?: string }) {
  return (
    <div aria-busy="true" aria-label="Opening your book" className="min-h-screen">
      {/* Slim indeterminate progress line */}
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-accent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-[65ch] px-6 pt-24">
        {/* Cover placeholder + title */}
        <div className="mx-auto w-28">
          <BookCover title={title ?? "Opening…"} author={author ?? ""} className="shadow-cover" />
        </div>
        {title ? (
          <div className="mt-6 text-center">
            <p className="font-serif text-xl">{title}</p>
            {author ? <p className="mt-1 text-sm text-muted">{author}</p> : null}
          </div>
        ) : null}

        {/* Text skeleton */}
        <div className="mt-12 animate-pulse space-y-3 motion-reduce:animate-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 rounded bg-surface-soft ${i % 4 === 3 ? "w-3/5" : "w-full"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}