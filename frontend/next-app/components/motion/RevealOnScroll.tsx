"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { distance, type MotionLevel } from "@/lib/motion";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  level?: MotionLevel;
}

/** Reveals once when the block enters the viewport. For section-level blocks only. */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  level = "slow",
}: RevealOnScrollProps) {
  return (
    <FadeIn
      inView
      direction="up"
      distance={distance.md}
      level={level}
      delay={delay}
      className={className}
    >
      {children}
    </FadeIn>
  );
}