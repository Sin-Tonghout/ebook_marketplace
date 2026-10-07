"use client";

import { useReducedMotion } from "motion/react";

/** Dev-only helper for playgrounds. Do not ship in real pages. */
export function ReducedMotionBadge() {
  const reduce = useReducedMotion();

  return (
    <span
      role="status"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 type-caption"
    >
      <span
        aria-hidden
        className={`size-2 rounded-full ${reduce ? "bg-success" : "bg-muted"}`}
      />
      Reduced motion: {reduce ? "ON" : "OFF"}
    </span>
  );
}