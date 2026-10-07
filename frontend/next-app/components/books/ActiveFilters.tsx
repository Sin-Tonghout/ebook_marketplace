"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import type { BookQuery } from "@/lib/books/query";
import { duration, ease, transition } from "@/lib/motion";

interface ActiveFiltersProps {
  query: BookQuery;
  onChange: (patch: Partial<BookQuery>) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  query,
  onChange,
  onClearAll,
}: ActiveFiltersProps) {
  const chips = (Object.entries(query) as [keyof BookQuery, unknown][])
    .filter(
      ([key, value]) =>
        key !== "page" &&
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== false,
    )
    .map(([key, value]) => ({
      key,
      label: `${String(key)}: ${String(value)}`,
    }));
  if (chips.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Active filters"
      className="mb-8 flex flex-wrap items-center gap-2"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {chips.map((chip) => (
          <motion.button
            key={chip.key}
            layout
            type="button"
            onClick={() => onChange({ [chip.key]: undefined, page: 1 })}
            aria-label={`Remove filter: ${chip.label}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: duration.fast, ease: ease.out },
            }}
            transition={transition.fast}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 type-body-sm transition-colors duration-200 hover:border-foreground/30 hover:bg-surface-soft"
          >
            {chip.label}
            <X className="size-3.5" aria-hidden />
          </motion.button>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={onClearAll}
        className="px-2 type-body-sm text-muted underline transition-colors hover:text-foreground"
      >
        Clear all
      </button>
    </div>
  );
}
