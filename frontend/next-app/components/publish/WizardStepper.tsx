"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PUBLISH_STEPS } from "@/types/publish";

interface Props {
  currentIndex: number;
  /** Number of steps completed, e.g. 1 means step 1 is done. */
  completed: number;
}

export function WizardStepper({ currentIndex, completed }: Props) {
  const reduce = useReducedMotion();
  const total = PUBLISH_STEPS.length;
  const percent = ((currentIndex + 1) / total) * 100;

  return (
    <nav aria-label="Publishing progress">
      {/* Mobile: compact label + bar */}
      <div className="md:hidden">
        <p className="type-caption">
          Step {currentIndex + 1} of {total}
        </p>
        <p className="type-label mt-1">{PUBLISH_STEPS[currentIndex].label}</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Desktop: full stepper */}
      <ol className="hidden items-center md:flex">
        {PUBLISH_STEPS.map((step, i) => {
          const done = i < completed;
          const active = i === currentIndex;
          return (
            <li
              key={step.id}
              className="flex flex-1 items-center last:flex-none"
              aria-current={active ? "step" : undefined}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border text-xs font-medium",
                    "transition-colors duration-(--duration-fast)",
                    done && "border-primary bg-primary text-primary-foreground",
                    !done && active && "border-accent text-accent",
                    !done && !active && "border-border text-muted"
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    "type-body-sm transition-colors duration-(--duration-fast)",
                    active ? "font-medium text-foreground" : "text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < total - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "mx-3 h-px flex-1 transition-colors duration-(--duration-normal)",
                    done ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}