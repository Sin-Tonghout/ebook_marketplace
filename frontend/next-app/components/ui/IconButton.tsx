import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  label: string; // required: used for aria-label and the tooltip
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-soft",
  ghost: "text-foreground hover:bg-surface-soft",
};

const sizes: Record<Size, string> = {
  sm: "size-9",
  md: "size-11",
  lg: "size-12",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { label, variant = "ghost", size = "md", className, children, type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center rounded-md",
          "transition duration-(--duration-fast) ease-folio",
          "active:scale-95",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";