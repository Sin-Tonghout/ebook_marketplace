import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, className, id, children, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const hintId = `${fieldId}-hint`;
    const errorId = `${fieldId}-error`;

    return (
      <div className="space-y-2">
        <label htmlFor={fieldId} className="type-label block">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              "h-11 w-full appearance-none rounded-md border bg-surface pl-4 pr-10 text-base text-foreground",
              "transition duration-(--duration-fast) ease-(--ease-folio)",
              "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-danger" : "border-border hover:border-muted",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
        </div>
        {error ? (
          <p
            id={errorId}
            className="type-body-sm text-danger"
            aria-live="polite"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="type-body-sm text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = "Select";
