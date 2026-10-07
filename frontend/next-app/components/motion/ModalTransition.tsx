"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { distance, duration, ease, transition } from "../../lib/motion";

interface ModalTransitionProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  children: React.ReactNode;
}

export function ModalTransition({ open, onClose, labelledBy, children }: ModalTransitionProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.out } }}
            transition={transition.normal}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6"
            initial={{ opacity: 0, scale: 0.96, y: distance.sm }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.98,
              transition: { duration: duration.fast, ease: ease.out },
            }}
            transition={transition.normal}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}