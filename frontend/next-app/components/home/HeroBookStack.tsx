"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { BookCover } from "@/components/books/BookCover";
import { transition } from "@/lib/motion";
import { heroBooks } from "@/lib/mock/books";

// Resting layout of each cover: [x, y, rotate, depth]
const layout = [
  { x: -150, y: 20, rotate: -8, depth: 12, delay: 0.1 },
  { x: 0, y: -20, rotate: 0, depth: 28, delay: 0.25 },
  { x: 150, y: 30, rotate: 7, depth: 18, delay: 0.4 },
];

export function HeroBookStack() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position normalised to -0.5 ... 0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20 });
  const sy = useSpring(py, { stiffness: 120, damping: 20 });

  function onMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto flex h-[420px] w-full max-w-[560px] items-center justify-center md:h-[520px]"
      aria-label="Featured book covers"
    >
      {heroBooks.map((book, i) => (
        <StackCover
          key={book.id}
          book={book}
          cfg={layout[i]}
          sx={sx}
          sy={sy}
          reduce={!!reduce}
        />
      ))}
    </div>
  );
}

function StackCover({
  book,
  cfg,
  sx,
  sy,
  reduce,
}: {
  book: (typeof heroBooks)[number];
  cfg: (typeof layout)[number];
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  reduce: boolean;
}) {
  // Parallax: larger depth = moves more with the pointer
  const dx = useTransform(sx, [-0.5, 0.5], [-cfg.depth, cfg.depth]);
  const dy = useTransform(sy, [-0.5, 0.5], [-cfg.depth, cfg.depth]);

  return (
    <motion.div
      className="absolute"
      style={{ x: reduce ? 0 : dx, y: reduce ? 0 : dy }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40, rotate: cfg.rotate - 6 }}
        animate={{ opacity: 1, y: cfg.y, x: cfg.x, rotate: cfg.rotate }}
        transition={{ ...transition.slow, delay: reduce ? 0 : cfg.delay }}
        className="relative h-[300px] w-[200px] overflow-hidden rounded-md shadow-[0_24px_50px_-12px_rgba(27,29,27,0.35)] md:h-[360px] md:w-[240px]"
      >
        <BookCover
          title={book.title}
          author={book.author}
          src={book.cover}
          className="h-full rounded-none"
        />
      </motion.div>
    </motion.div>
  );
}