"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { transition, type MotionLevel } from "@/lib/motion";

interface ScaleInProps
  extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  from?: number;
  delay?: number;
  level?: MotionLevel;
}

export function ScaleIn({
  from = 0.96,
  delay = 0,
  level = "normal",
  children,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: from }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...transition[level], delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}