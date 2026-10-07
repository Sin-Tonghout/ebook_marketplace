import { formatPrice } from "@/lib/format";
import type { Currency } from "@/types/book";
import { cn } from "@/lib/utils";

export interface BookPriceProps {
  price: number;
  compareAtPrice?: number;
  currency?: Currency;
  size?: "sm" | "lg";
  className?: string;
}

export function BookPrice({
  price,
  compareAtPrice,
  currency = "USD",
  size = "sm",
  className,
}: BookPriceProps) {
  const discounted = compareAtPrice !== undefined && compareAtPrice > price;

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-semibold",
          size === "lg" ? "text-2xl" : "text-sm",
          price === 0 && "text-success"
        )}
      >
        {formatPrice(price, currency)}
      </span>
      {discounted && (
        <>
          <span className="sr-only">, was </span>
          <span className="text-sm text-muted line-through">
            {formatPrice(compareAtPrice, currency)}
          </span>
        </>
      )}
    </span>
  );
}