"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { useCategories } from "@/hooks/useCategories";
import { sortOptions, type BookQuery } from "@/lib/books/query";
import { duration, ease, transition } from "@/lib/motion";
import { slugify, titleFromSlug } from "@/lib/slug";

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
  const categories = useCategories();

  const labelFor = (key: keyof BookQuery, value: unknown): string => {
    const text = String(value);
    if (key === "category") {
      const found = categories.find((c) => slugify(c.name) === text);
      return `Category: ${found?.name ?? titleFromSlug(text)}`;
    }
    if (key === "q") return `Search: ${text}`;
    if (key === "sort") {
      return `Sort: ${sortOptions.find((o) => o.value === text)?.label ?? text}`;
    }
    return `${key}: ${text}`;
  };

  const chips = (Object.entries(query) as [keyof BookQuery, unknown][])
    .filter(
      ([key, value]) =>
        key !== "page" &&
        !(key === "sort" && value === "newest") &&
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== false,
    )
    .map(([key, value]) => ({
      key,
      label: labelFor(key, value),
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