"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import { distance, stagger, transition } from "@/lib/motion";

const container = (gap: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

const item: Variants = {
  hidden: { opacity: 0, y: distance.md },
  show: { opacity: 1, y: 0, transition: transition.normal },
};

interface StaggerChildrenProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "whileInView"> {
  gap?: number;
  delay?: number;
  inView?: boolean;
}

export function StaggerChildren({
  gap = stagger.normal,
  delay = 0,
  inView = true,
  children,
  ...props
}: StaggerChildrenProps) {
  return (
    <motion.div
      variants={container(gap, delay)}
      initial="hidden"
      {...(inView
        ? { whileInView: "show", viewport: { once: true, margin: "-80px" } }
        : { animate: "show" })}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  ...props
}: Omit<HTMLMotionProps<"div">, "variants">) {
  return (
    <motion.div variants={item} {...props}>
      {children}
    </motion.div>
  );
}