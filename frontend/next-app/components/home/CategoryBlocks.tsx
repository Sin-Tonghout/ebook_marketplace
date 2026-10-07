import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import {
  RevealOnScroll,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import { homeCategories } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";

export function CategoryBlocks() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="mx-auto max-w-7xl px-6 py-12 md:px-10"
    >
      <RevealOnScroll className="mb-8 flex items-end justify-between gap-4">
        <h2 id="categories-heading" className="type-h3">
          Browse by category
        </h2>
        <Link
                    href="/books"
          className="inline-flex items-center gap-1 type-label hover:underline"
        >
          All categories
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </RevealOnScroll>

      <StaggerChildren className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
        {homeCategories.map((c) => (
          <StaggerItem
            key={c.slug}
            className={cn(c.featured ? "col-span-2 md:row-span-2" : "col-span-1")}
          >
            <Link
              href={`/books?category=${c.slug}`}
              style={{ background: c.bg, color: c.fg }}
              className={cn(
                "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-cover",
                c.featured ? "min-h-64 p-8 md:min-h-[26rem]" : "min-h-40 md:min-h-0"
              )}
            >
              {/* Decorative initial, hidden from assistive tech */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -bottom-6 -right-2 select-none font-serif leading-none opacity-10",
                  c.featured ? "text-[14rem]" : "text-[8rem]"
                )}
              >
                {c.name[0]}
              </span>

              <ArrowUpRight
                aria-hidden
                className="relative size-6 self-end opacity-60 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />

              <div className="relative">
                <h3
                  className={cn(
                    "font-serif font-medium leading-tight",
                    c.featured ? "text-4xl md:text-5xl" : "text-2xl"
                  )}
                >
                  {c.name}
                </h3>
                <p className="mt-1 text-sm opacity-75">{c.bookCount} books</p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}