"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { transition } from "@/lib/motion";

interface HoverLiftProps extends Omit<HTMLMotionProps<"div">, "whileHover" | "transition"> {
  lift?: number; // px, keep between 4 and 8
}

export function HoverLift({ lift = 6, children, ...props }: HoverLiftProps) {
  return (
    <motion.div whileHover={{ y: -lift }} transition={transition.fast} {...props}>
      {children}
    </motion.div>
  );
}