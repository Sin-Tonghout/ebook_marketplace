import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "neutral"
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "archived";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-surface-soft text-foreground",
  draft: "bg-surface-soft text-muted",
  pending: "bg-warning/15 text-warning",
  published: "bg-success/15 text-success",
  rejected: "bg-danger/15 text-danger",
  archived: "bg-border text-muted",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({
  variant = "neutral",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}