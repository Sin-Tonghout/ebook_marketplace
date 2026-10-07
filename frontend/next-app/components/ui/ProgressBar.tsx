"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ease, transition } from "@/lib/motion";

export interface ProgressBarProps {
  /** 0-100. Omit for an indeterminate bar. */
  value?: number;
  label: string;
  showValue?: boolean;
  tone?: "default" | "success" | "danger";
  className?: string;
}

const fills = {
  default: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
} as const;

export function ProgressBar({
  value,
  label,
  showValue = false,
  tone = "default",
  className,
}: ProgressBarProps) {
  const reduce = useReducedMotion();
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-soft"
      >
        {indeterminate ? (
          <motion.div
            className={cn("h-full w-1/3 rounded-full", fills[tone])}
            animate={reduce ? undefined : { x: ["-100%", "300%"] }}
            transition={{ duration: 1.4, ease: ease.inOut, repeat: Infinity }}
          />
        ) : (
          <motion.div
            className={cn("h-full w-full origin-left rounded-full", fills[tone])}
            initial={false}
            animate={{ scaleX: clamped / 100 }}
            transition={transition.normal}
          />
        )}
      </div>

      {showValue && !indeterminate && (
        <span className="w-10 text-right type-caption tabular-nums">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}