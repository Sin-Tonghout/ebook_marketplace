"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Heart } from "lucide-react";

import { BookCover } from "@/components/books/BookCover";
import { ProgressBar } from "@/components/library/ProgressBar";
import { distance, transition } from "@/lib/motion";

import type { Book } from "@/types/book";
import type { ReadingProgress } from "@/types/library";

export function LibraryTile({
  book,
  progress,
  favorite,
  onToggleFavorite,
}: {
  book: Book;
  progress?: ReadingProgress;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const router = useRouter();
  const percent = progress?.percent ?? 0;
  const completed = percent >= 100;

  return (
    <motion.article
      initial={{ opacity: 0, y: distance.md }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.normal}
      className="group relative flex flex-col"
    >
      <motion.div whileHover={{ y: -6 }} transition={transition.fast} className="relative">
        <button
          type="button"
          onClick={() => router.push(`/read/${book.id}`)}
          aria-label={`Read ${book.title}`}
          className="block w-full cursor-pointer text-left"
        >
          <BookCover
            title={book.title}
            author={book.author.name}
            src={book.coverUrl}
            className="shadow-cover"
          />
        </button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          transition={transition.fast}
          onClick={() => onToggleFavorite(book.id)}
          aria-pressed={favorite}
          aria-label={
            favorite ? `Remove ${book.title} from favorites` : `Add ${book.title} to favorites`
          }
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur"
        >
          <Heart className={favorite ? "size-5 fill-current text-danger" : "size-5"} aria-hidden />
        </motion.button>
      </motion.div>

      <div className="mt-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug">{book.title}</h3>
        <p className="mt-1 truncate text-sm text-muted">{book.author.name}</p>

        <div className="mt-3 space-y-1.5">
          {percent > 0 ? (
            <ProgressBar value={percent} label={`${book.title} reading progress`} />
          ) : null}
          <p className="text-xs text-muted">
            {completed ? "Completed" : percent > 0 ? `${Math.round(percent)}% read` : "Not started"}
          </p>
        </div>
      </div>
    </motion.article>
  );
}