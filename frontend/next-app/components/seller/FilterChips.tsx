"use client";

import { cn } from "@/lib/utils";

export interface FilterOption<T extends string> {
  id: T;
  label: string;
  count: number;
}

export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "min-h-10 rounded-full border px-4 text-sm font-medium transition-colors duration-(--duration-fast)",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-foreground hover:bg-surface-soft"
            )}
          >
            {o.label}
            <span className={cn("ml-2", active ? "opacity-80" : "text-muted")}>
              {o.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}