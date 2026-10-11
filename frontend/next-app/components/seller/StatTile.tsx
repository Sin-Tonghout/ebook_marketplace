"use client";

import { motion, useReducedMotion } from "motion/react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  index?: number; // used to stagger the entrance
  className?: string;
}

export function StatTile({
  label,
  value,
  hint,
  icon,
  index = 0,
  className,
}: StatTileProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.01 : 0.3,
        delay: reduce ? 0 : index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "rounded-xl border border-border bg-surface p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="type-label text-muted">{label}</span>
        <span
          className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-foreground"
          aria-hidden
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 font-serif text-3xl text-foreground">{value}</p>
      {hint && <p className="mt-1 type-caption text-muted">{hint}</p>}
    </motion.div>
  );
}

export function StatTileSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-xl border border-border bg-surface p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="size-9 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-8 w-24" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}