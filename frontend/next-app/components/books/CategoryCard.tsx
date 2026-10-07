import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "soft" | "accent" | "dark";

const tones: Record<Tone, string> = {
  soft: "bg-surface-soft text-foreground",
  accent: "bg-accent-soft text-foreground",
  dark: "bg-primary text-primary-foreground",
};

export interface CategoryCardProps {
  slug: string;
  name: string;
  bookCount: number;
  tone?: Tone;
  className?: string;
}

export function CategoryCard({
  slug,
  name,
  bookCount,
  tone = "soft",
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={`/books?category=${slug}`}
      className={cn(
        "group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-lg p-6",
        "transition duration-(--duration-normal) ease-(--ease-folio) hover:-translate-y-1 hover:shadow-card",
        tones[tone],
        className
      )}
    >
      <ArrowUpRight
        aria-hidden
        className="size-6 self-end opacity-40 transition duration-(--duration-normal) ease-(--ease-folio) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
      />
      <div>
        <h3 className="type-h3">{name}</h3>
        <p className="mt-1 type-body-sm opacity-70">
          {bookCount.toLocaleString()} books
        </p>
      </div>
    </Link>
  );
}