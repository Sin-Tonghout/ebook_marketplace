import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="type-label block">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "h-11 w-full rounded-md border bg-surface px-4 text-base text-foreground",
            "placeholder:text-muted",
            "transition duration-(--duration-fast) ease-folio",
            "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-danger" : "border-border hover:border-muted",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="type-body-sm text-danger" aria-live="polite">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="type-body-sm text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";