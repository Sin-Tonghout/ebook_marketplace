"use client";

import { motion } from "motion/react";
import { transition } from "@/lib/motion";

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-border"
    >
      {/* scaleX keeps the animation on the GPU */}
      <motion.div
        className="h-full origin-left rounded-full bg-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: pct / 100 }}
        transition={transition.slow}
      />
    </div>
  );
}