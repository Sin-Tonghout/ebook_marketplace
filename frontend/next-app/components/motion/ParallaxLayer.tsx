"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

interface ParallaxLayerProps {
  /** Total travel in px each way. Keep subtle (20-48). */
  offset?: number;
  className?: string;
  children?: React.ReactNode;
}

/** Decorative only: hidden from assistive tech. Never put essential content inside. */
export function ParallaxLayer({ offset = 32, className, children }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={reduce ? undefined : { y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}