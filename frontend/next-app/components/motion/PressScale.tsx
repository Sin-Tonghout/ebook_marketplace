"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { transition } from "@/lib/motion";

interface PressScaleProps extends Omit<HTMLMotionProps<"div">, "whileTap" | "transition"> {
  scale?: number;
}

export function PressScale({ scale = 0.97, children, ...props }: PressScaleProps) {
  return (
    <motion.div whileTap={{ scale }} transition={transition.fast} {...props}>
      {children}
    </motion.div>
  );
}