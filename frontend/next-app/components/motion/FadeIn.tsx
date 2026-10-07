"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { distance as distances, transition, type MotionLevel } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps
  extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileInView" | "transition"> {
  direction?: Direction;
  distance?: number;
  delay?: number;
  level?: MotionLevel;
  /** Animate when scrolled into view instead of on mount */
  inView?: boolean;
}

export function FadeIn({
  direction = "up",
  distance = distances.md,
  delay = 0,
  level = "normal",
  inView = false,
  children,
  ...props
}: FadeInProps) {
  const offsets = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  } as const;

  const hidden = { opacity: 0, ...offsets[direction] };
  const shown = { opacity: 1, x: 0, y: 0 };
  const t = { ...transition[level], delay };

  return inView ? (
    <motion.div
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "-80px" }}
      transition={t}
      {...props}
    >
      {children}
    </motion.div>
  ) : (
    <motion.div initial={hidden} animate={shown} transition={t} {...props}>
      {children}
    </motion.div>
  );
}