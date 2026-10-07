"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { duration, ease, transition } from "@/lib/motion";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

// Leaving is quicker than arriving
const exitTransition = { duration: duration.fast, ease: ease.out };

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-foreground/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: exitTransition }}
                transition={transition.normal}
              />
            </Dialog.Overlay>

            <Dialog.Content
              asChild
              forceMount
              aria-describedby={description ? undefined : undefined}
            >
              <motion.div
                className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-card focus:outline-none"
                initial={{ opacity: 0, x: "-50%", y: "-48%", scale: 0.96 }}
                animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
                exit={{
                  opacity: 0,
                  x: "-50%",
                  y: "-49%",
                  scale: 0.98,
                  transition: exitTransition,
                }}
                transition={transition.normal}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Dialog.Title className="type-h4">{title}</Dialog.Title>
                    {description && (
                      <Dialog.Description className="type-body-sm text-muted">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                  <Dialog.Close asChild>
                    <IconButton label="Close" size="sm">
                      <X className="size-5" />
                    </IconButton>
                  </Dialog.Close>
                </div>

                {children && <div className="mt-6">{children}</div>}

                {footer && (
                  <div className="mt-8 flex flex-wrap justify-end gap-3">
                    {footer}
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}