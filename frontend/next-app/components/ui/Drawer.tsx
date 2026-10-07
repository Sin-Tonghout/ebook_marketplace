"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";
import { duration, ease, transition } from "@/lib/motion";

type Side = "right" | "left" | "bottom";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: Side;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const positions: Record<Side, string> = {
  right: "right-0 top-0 h-full w-full max-w-sm border-l",
  left: "left-0 top-0 h-full w-full max-w-sm border-r",
  bottom: "bottom-0 left-0 max-h-[85vh] w-full rounded-t-xl border-t",
};

const offscreen: Record<Side, { x?: string; y?: string }> = {
  right: { x: "100%" },
  left: { x: "-100%" },
  bottom: { y: "100%" },
};

// Panels leave with a symmetrical curve; the backdrop fades out faster
const panelExit = { duration: duration.normal, ease: ease.inOut };
const overlayExit = { duration: duration.fast, ease: ease.out };

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  children,
  footer,
}: DrawerProps) {
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
                exit={{ opacity: 0, transition: overlayExit }}
                transition={transition.normal}
              />
            </Dialog.Overlay>

            <Dialog.Content
              asChild
              forceMount
              aria-describedby={description ? undefined : undefined}
            >
              <motion.div
                className={cn(
                  "fixed z-50 flex flex-col border-border bg-surface shadow-card focus:outline-none",
                  positions[side]
                )}
                initial={offscreen[side]}
                animate={{ x: 0, y: 0 }}
                exit={{ ...offscreen[side], transition: panelExit }}
                transition={transition.normal}
              >
                <div className="flex items-start justify-between gap-4 border-b border-border p-6">
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

                <div className="flex-1 overflow-y-auto p-6">{children}</div>

                {footer && (
                  <div className="flex gap-3 border-t border-border p-6">
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