"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/library/ProgressBar";
import { distance, transition } from "@/lib/motion";

import type { Book } from "@/types/book";
import type { ReadingProgress } from "@/types/library";

export function ContinueReadingCard({
  book,
  progress,
}: {
  book: Book;
  progress: ReadingProgress;
}) {
  const router = useRouter();

  return (
    <motion.article
      initial={{ opacity: 0, y: distance.md }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.normal}
      className="flex gap-5 rounded-lg bg-surface-soft p-5"
    >
      <div className="w-24 shrink-0 sm:w-28">
        <BookCover
          title={book.title}
          author={book.author.name}
          src={book.coverUrl}
          className="shadow-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="line-clamp-2 font-serif text-xl leading-snug">{book.title}</h3>
          <p className="mt-1 truncate text-sm text-muted">{book.author.name}</p>
          <p className="mt-3 text-sm">{progress.chapter}</p>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <ProgressBar value={progress.percent} label={`${book.title} reading progress`} />
            <span className="w-10 shrink-0 text-right text-sm tabular-nums text-muted">
              {Math.round(progress.percent)}%
            </span>
          </div>
          <Button size="sm" onClick={() => router.push(`/read/${book.id}`)}>
            Continue
          </Button>
        </div>
      </div>
    </motion.article>
  );
}