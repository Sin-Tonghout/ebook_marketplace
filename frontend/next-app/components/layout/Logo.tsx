import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Folio home"
      className={cn(
        "rounded-sm font-serif text-2xl font-medium tracking-tight",
        className
      )}
    >
      Folio
    </Link>
  );
}