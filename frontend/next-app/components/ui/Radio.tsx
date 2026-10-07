import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;

    return (
      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 size-5 shrink-0">
          <input
            ref={ref}
            id={fieldId}
            type="radio"
            className={cn(
              "peer size-5 cursor-pointer appearance-none rounded-full border border-border bg-surface",
              "transition duration-(--duration-fast) ease-(--ease-folio)",
              "hover:border-muted",
              "checked:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          <span
            className="pointer-events-none absolute inset-0 m-auto size-2.5 scale-50 rounded-full bg-primary opacity-0 transition duration-(--duration-fast) ease-(--ease-folio) peer-checked:scale-100 peer-checked:opacity-100"
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
Radio.displayName = "Radio";