"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "motion/react";
import { Heart } from "lucide-react";

import { BookCover } from "@/components/books/BookCover";
import { BookPrice } from "@/components/books/BookPrice";
import { Rating } from "@/components/books/Rating";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { distance, stagger, transition } from "@/lib/motion";

import type { Book } from "@/types/book";

// const ease = [0.22, 1, 0.36, 1] as const; // still used by BookCardFeatured below

/* -------------------------------------------------------------------------- */
/*                                BookCard                                    */
/* -------------------------------------------------------------------------- */

// Parent lifts, child cover scales. Variants propagate from the lift wrapper.
const coverLift: Variants = {
  rest: { y: 0 },
  hover: { y: -6, transition: transition.fast },
};

const coverScale: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: transition.fast },
};

// CSS-driven reveal: shows on hover, on keyboard focus, and always on touch devices
const reveal =
  "opacity-0 translate-y-1 transition duration-200 " +
  "group-hover/cover:opacity-100 group-hover/cover:translate-y-0 " +
  "group-focus-within/cover:opacity-100 group-focus-within/cover:translate-y-0 " +
  "[@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0";

export interface BookCardProps {
  book: Book;
  onQuickPreview?: (book: Book) => void;
  onToggleFavorite?: (id: Book["id"], favorite: boolean) => void;
}

export function BookCard({
  book,
  onQuickPreview,
  onToggleFavorite,
}: BookCardProps) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);

  const handleToggleFavorite = () => {
    const nextFavorite = !favorite;
    setFavorite(nextFavorite);
    onToggleFavorite?.(book.id, nextFavorite);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: distance.md }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={transition.normal}
      className="group relative flex flex-col"
    >
      {/* Cover + quick actions (lift together) */}
      <motion.div
        variants={coverLift}
        initial="rest"
        animate="rest"
        whileHover="hover"
        className="group/cover relative"
      >
        {/* Deeper shadow fades in on hover (opacity only, GPU friendly) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-sm opacity-0 shadow-[0_20px_36px_-12px_rgba(0,0,0,0.38)] transition-opacity duration-200 group-hover/cover:opacity-100"
        />

        <button
          type="button"
          onClick={() => router.push(`/books/${book.id}`)}
          className="relative block w-full cursor-pointer text-left"
          aria-label={`View ${book.title}`}
        >
          <motion.div variants={coverScale}>
            <BookCover
              title={book.title}
              author={book.author.name}
              src={book.coverUrl}
              className="shadow-cover"
            />
          </motion.div>
        </button>

        {/* Favorite: stays visible once selected */}
        <motion.button
          type="button"
          onClick={handleToggleFavorite}
          whileTap={{ scale: 0.88 }}
          transition={transition.fast}
          aria-label={
            favorite
              ? `Remove ${book.title} from favorites`
              : `Add ${book.title} to favorites`
          }
          aria-pressed={favorite}
          className={cn(
            "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur",
            reveal,
            favorite && "opacity-100! translate-y-0!",
          )}
        >
          <Heart
            className={cn("size-5", favorite && "fill-current text-danger")}
            aria-hidden
          />
        </motion.button>

        {/* Quick preview */}
        <div className={cn("absolute inset-x-3 bottom-3", reveal)}>
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => onQuickPreview?.(book)}
          >
            Quick preview
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="mt-4 flex flex-1 flex-col">
        <button
          type="button"
          onClick={() => router.push(`/books/${book.id}`)}
          className="text-left"
        >
          <h3 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
            {book.title}
          </h3>
        </button>

        <p className="mt-1 truncate text-sm text-muted">{book.author.name}</p>

        <div className="mt-3">
          <Rating value={book.rating} count={book.ratingCount} />
        </div>

        <div className="mt-3">
          <BookPrice
            price={book.price}
            compareAtPrice={book.compareAtPrice}
            currency={book.currency}
          />
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*                           BookCardFeatured                                 */
/* -------------------------------------------------------------------------- */

const textContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.25,
    },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: distance.md },
  show: { opacity: 1, y: 0, transition: transition.slow },
};

export interface BookCardFeaturedProps {
  book: Book;
  onBuy?: (book: Book) => void;
  /** Decorative layer rendered behind the content (e.g. a parallax shape) */
  background?: React.ReactNode;
}

export function BookCardFeatured({ book, onBuy, background }: BookCardFeaturedProps) {
  const router = useRouter();

  return (
    <section
      aria-label="Featured book"
      className="relative overflow-hidden rounded-xl bg-surface-soft p-8 md:p-14"
    >
      {background}

      <div className="relative grid items-center gap-10 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, y: distance.lg, rotate: -1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={transition.slow}
          className="mx-auto w-full max-w-60 md:max-w-none"
        >
          <BookCover
            title={book.title}
            author={book.author.name}
            src={book.coverUrl}
            className="shadow-cover"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          variants={textContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="space-y-5"
        >
          <motion.p
            variants={textItem}
            className="type-caption uppercase tracking-widest"
          >
            Featured this week
          </motion.p>

          <motion.h2 variants={textItem} className="type-h1">
            {book.title}
          </motion.h2>

          <motion.p variants={textItem} className="type-body-lg text-muted">
            by {book.author.name}
          </motion.p>

          {book.description && (
            <motion.p variants={textItem} className="max-w-xl type-body-lg">
              {book.description}
            </motion.p>
          )}

          <motion.div variants={textItem}>
            <Rating value={book.rating} count={book.ratingCount} size="md" />
          </motion.div>

          <motion.div variants={textItem}>
            <BookPrice
              price={book.price}
              compareAtPrice={book.compareAtPrice}
              currency={book.currency}
              size="lg"
            />
          </motion.div>

          <motion.div variants={textItem} className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" onClick={() => onBuy?.(book)}>
              Buy now
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push(`/books/${book.id}`)}
            >
              View details
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}