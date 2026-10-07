"use client";

import { motion } from "motion/react";
import { distance, transition } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance.sm }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.normal}
    >
      {children}
    </motion.div>
  );
}