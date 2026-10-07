import { forwardRef, useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;

    return (
      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 size-5 shrink-0">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            className={cn(
              "peer size-5 cursor-pointer appearance-none rounded-sm border border-border bg-surface",
              "transition duration-(--duration-fast) ease-(--ease-folio)",
              "hover:border-muted",
              "checked:border-primary checked:bg-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          <Check
            className="pointer-events-none absolute inset-0 m-auto size-3.5 text-primary-foreground opacity-0 transition-opacity duration-(--duration-fast) peer-checked:opacity-100"
            strokeWidth={3}
            aria-hidden
          />
        </div>
        <label htmlFor={fieldId} className="cursor-pointer">
          <span className="type-body block">{label}</span>
          {description && (
            <span className="type-body-sm block text-muted">{description}</span>
          )}
        </label>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";