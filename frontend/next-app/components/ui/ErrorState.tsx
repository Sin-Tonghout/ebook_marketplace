import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-danger/15 text-danger">
        <AlertCircle className="size-7" aria-hidden />
      </div>
      <h3 className="type-h3">{title}</h3>
      <p className="mt-2 max-w-sm type-body text-muted">{description}</p>
      {onRetry && (
        <Button className="mt-8" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}