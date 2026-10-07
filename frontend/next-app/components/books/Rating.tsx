import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number; // 0–5
  count?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}

export function Rating({
  value,
  count,
  size = "sm",
  showValue = true,
  className,
}: RatingProps) {
  const star = size === "sm" ? "size-3.5" : "size-5";
  const pct = Math.max(0, Math.min(5, value)) / 5 * 100;

  const stars = (
    <div className="flex w-max">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn(star, "shrink-0 fill-current")} strokeWidth={0} />
      ))}
    </div>
  );

  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      role="img"
      aria-label={`Rated ${value.toFixed(1)} out of 5${
        count !== undefined ? ` from ${count} reviews` : ""
      }`}
    >
      <div className="relative" aria-hidden>
        <div className="text-border">{stars}</div>
        <div
          className="absolute inset-y-0 left-0 overflow-hidden text-accent"
          style={{ width: `${pct}%` }}
        >
          {stars}
        </div>
      </div>
      {showValue && (
        <span className="type-body-sm" aria-hidden>
          {value.toFixed(1)}
          {count !== undefined && (
            <span className="text-muted"> ({count.toLocaleString()})</span>
          )}
        </span>
      )}
    </div>
  );
}