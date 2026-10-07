"use client";

import { motion, useReducedMotion } from "motion/react";
import type { BookDetail } from "@/types/book-detail";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

export function BookMetadata({ book }: { book: BookDetail }) {
  const reduce = useReducedMotion();

  const items = [
    { label: "Pages", value: String(book.pages) },
    { label: "Language", value: book.language },
    { label: "Published", value: formatDate(book.publishedAt) },
    { label: "Format", value: book.format },
    { label: "Category", value: book.category },
  ];

  return (
    <motion.section
      aria-labelledby="details-heading"
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-80px" },
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          })}
    >
      <h2 id="details-heading" className="font-serif text-2xl text-foreground md:text-3xl">
        Details
      </h2>

      <dl className="mt-4 divide-y divide-border rounded-xl border border-border">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="text-sm font-medium text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </motion.section>
  );
}