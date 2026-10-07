"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const COLLAPSE_AT = 420; // characters

export function BookDescription({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const paragraphs = text.split("\n\n");
  const isLong = text.length > COLLAPSE_AT;

  return (
    <motion.section
      aria-labelledby="about-heading"
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-80px" },
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          })}
    >
      <h2 id="about-heading" className="font-serif text-2xl text-foreground md:text-3xl">
        About this book
      </h2>

      <div
        className={`mt-4 max-w-prose space-y-4 text-lg leading-relaxed text-foreground/90 ${
          isLong && !open ? "line-clamp-6" : ""
        }`}
      >
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-3 text-sm font-medium text-foreground underline underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </motion.section>
  );
}