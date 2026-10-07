"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { distance, duration, ease, transition } from "../../lib/motion";

type ToastTransitionProps = Omit<
  HTMLMotionProps<"li">,
  "initial" | "animate" | "exit" | "transition" | "layout"
>;

/** Render inside <AnimatePresence mode="popLayout"> so exits and re-flow animate. */
export function ToastTransition({ children, ...props }: ToastTransitionProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: distance.md, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: distance.lg,
        transition: { duration: duration.fast, ease: ease.out },
      }}
      transition={transition.normal}
      {...props}
    >
      {children}
    </motion.li>
  );
}