"use client";

import { cn } from "@/lib/utils";

export type Range = 7 | 30;

const OPTIONS: { value: Range; label: string }[] = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
];

export function RangeToggle({
  value,
  onChange,
}: {
  value: Range;
  onChange: (next: Range) => void;
}) {
  return (
    <div role="group" aria-label="Date range" className="flex gap-2">
      {OPTIONS.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-10 rounded-full border px-4 text-sm font-medium transition-colors duration-(--duration-fast)",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-foreground hover:bg-surface-soft"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}