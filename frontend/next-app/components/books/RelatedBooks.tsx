"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { RelatedBook } from "@/types/book-detail";
import { BookCover } from "@/components/books/BookCover"; // same path/props as in the hero

function formatPrice(price: number, currency: string) {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    price,
  );
}

export function RelatedBooks({ books }: { books: RelatedBook[] }) {
  const reduce = useReducedMotion();

  if (books.length === 0) return null;

  return (
    <motion.section
      aria-labelledby="related-heading"
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-80px" },
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          })}
    >
      <div className="flex items-end justify-between gap-4">
        <h2
          id="related-heading"
          className="font-serif text-2xl text-foreground md:text-3xl"
        >
          You might also like
        </h2>
        <Link
          href="/books"
          className="text-sm font-medium text-foreground underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          See all →
        </Link>
      </div>

      <ul className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2">
        {books.map((b) => (
          <li key={b.id} className="w-36 shrink-0 snap-start sm:w-40">
            <Link
              href={`/books/${b.id}`}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <div className="transition-transform duration-200 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                <BookCover
                  title={b.title}
                  author={b.authorName}
                  src={b.coverUrl}
                  className="w-full shadow-md transition-shadow duration-200 group-hover:shadow-xl"
                />
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-medium text-foreground">
                {b.title}
              </p>
              <p className="text-sm text-muted-foreground">{b.authorName}</p>
              <p className="mt-1 text-sm text-foreground">
                {formatPrice(b.price, b.currency)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
