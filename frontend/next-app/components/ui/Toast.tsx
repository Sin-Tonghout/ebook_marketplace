"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";
import { distance, duration, ease, transition } from "@/lib/motion";

type ToastVariant = "success" | "error" | "info";

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

const ToastContext = createContext<{ toast: (t: ToastInput) => void } | null>(
  null
);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const icons = {
  success: { Icon: CheckCircle2, color: "text-success" },
  error: { Icon: AlertCircle, color: "text-danger" },
  info: { Icon: Info, color: "text-accent" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "info", duration = 4000 }: ToastInput) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { id, title, description, variant }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

            <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-60 flex flex-col items-end gap-3 sm:left-auto sm:right-6 sm:bottom-6"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((t) => {
            const { Icon, color } = icons[t.variant];
            return (
              <motion.div
                key={t.id}
                layout
                role={t.variant === "error" ? "alert" : "status"}
                initial={{ opacity: 0, y: distance.md, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: distance.lg,
                  transition: { duration: duration.fast, ease: ease.out },
                }}
                transition={transition.normal}
                className="pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-border bg-surface p-4 shadow-card sm:w-96"
              >
                <Icon className={cn("mt-0.5 size-5 shrink-0", color)} aria-hidden />
                <div className="flex-1 space-y-0.5">
                  <p className="type-label">{t.title}</p>
                  {t.description && (
                    <p className="type-body-sm text-muted">{t.description}</p>
                  )}
                </div>
                <IconButton label="Dismiss" size="sm" onClick={() => dismiss(t.id)}>
                  <X className="size-4" />
                </IconButton>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}