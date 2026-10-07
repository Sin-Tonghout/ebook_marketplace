import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode; // usually a <Button>
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-accent-soft text-foreground">
          {icon}
        </div>
      )}
      <h3 className="type-h3">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm type-body text-muted">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}