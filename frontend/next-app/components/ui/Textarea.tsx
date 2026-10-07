import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, rows = 5, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const hintId = `${fieldId}-hint`;
    const errorId = `${fieldId}-error`;

    return (
      <div className="space-y-2">
        <label htmlFor={fieldId} className="type-label block">
          {label}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "w-full resize-y rounded-md border bg-surface px-4 py-3 text-base text-foreground",
            "placeholder:text-muted",
            "transition duration-(--duration-fast) ease-(--ease-folio)",
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
Textarea.displayName = "Textarea";