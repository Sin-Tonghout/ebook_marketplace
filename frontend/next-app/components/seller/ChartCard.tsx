"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();

  return (
    <section
      aria-labelledby={id}
      className={cn(
        "rounded-xl border border-border bg-surface p-5 md:p-6",
        className
      )}
    >
      <h2 id={id} className="type-h4">
        {title}
      </h2>
      {description && (
        <p className="mt-1 type-body-sm text-muted">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}