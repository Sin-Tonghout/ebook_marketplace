"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { distance, duration, ease, transition } from "../../lib/motion";

type Side = "right" | "left" | "bottom";

interface DrawerTransitionProps {
  open: boolean;
  onClose: () => void;
  side?: Side;
  labelledBy?: string;
  children: React.ReactNode;
}

const hidden = {
  right: { x: "100%" },
  left: { x: "-100%" },
  bottom: { y: "100%" },
} as const;

const position = {
  right: "right-0 top-0 h-full w-full max-w-sm border-l",
  left: "left-0 top-0 h-full w-full max-w-sm border-r",
  bottom: "bottom-0 left-0 w-full max-h-[85vh] rounded-t-2xl border-t",
} as const;

export function DrawerTransition({
  open,
  onClose,
  side = "right",
  labelledBy,
  children,
}: DrawerTransitionProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.out } }}
            transition={transition.normal}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className={`absolute overflow-y-auto border-border bg-surface p-6 ${position[side]}`}
            initial={hidden[side]}
            animate={{ x: 0, y: 0 }}
            exit={{ ...hidden[side], transition: { duration: duration.normal, ease: ease.inOut } }}
            transition={transition.normal}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}