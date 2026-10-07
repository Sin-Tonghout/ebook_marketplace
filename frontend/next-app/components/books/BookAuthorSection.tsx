"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Check, Plus } from "lucide-react";
import type { BookAuthor } from "@/types/book-detail";
import { BookCover } from "@/components/books/BookCover"; // same path/props as in the hero

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatPrice(price: number, currency: string) {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}

export function BookAuthorSection({
  author,
  currentBookId,
}: {
  author: BookAuthor;
  currentBookId: string;
}) {
  const reduce = useReducedMotion();
  const [following, setFollowing] = useState(false);

  const otherBooks = author.books.filter((b) => b.id !== currentBookId);
  const followerCount = author.followers + (following ? 1 : 0);

  return (
    <motion.section
      aria-labelledby="author-heading"
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-80px" },
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          })}
    >
      <h2 id="author-heading" className="font-serif text-2xl text-foreground md:text-3xl">
        About the author
      </h2>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar: image if available, initials otherwise */}
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={`Portrait of ${author.name}`}
            className="h-20 w-20 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent/20 font-serif text-2xl text-foreground"
          >
            {initials(author.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href={`/authors/${author.id}`}
              className="font-serif text-xl text-foreground underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {author.name}
            </Link>
            <span className="text-sm text-muted-foreground">
              {followerCount.toLocaleString("en-US")} followers
            </span>
          </div>

          <p className="mt-3 max-w-prose text-base leading-relaxed text-foreground/90">
            {author.bio}
          </p>

          <button
            type="button"
            onClick={() => setFollowing((f) => !f)}
            aria-pressed={following}
            className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              following
                ? "border-accent bg-accent/15 text-foreground"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            {following ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Plus className="h-4 w-4" aria-hidden="true" />
            )}
            {following ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      {otherBooks.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            More by {author.name}
          </h3>
          <ul className="mt-4 flex gap-5 overflow-x-auto pb-2">
            {otherBooks.map((b) => (
              <li key={b.id} className="w-28 shrink-0">
                <Link
                  href={`/books/${b.id}`}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <div className="transition-transform duration-200 group-hover:-translate-y-1">
                    <BookCover
                      title={b.title}
                      author={author.name}
                      src={b.coverUrl}
                      className="w-full shadow-md"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
                    {b.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(b.price, b.currency)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.section>
  );
}