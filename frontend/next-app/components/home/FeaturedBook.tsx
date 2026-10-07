"use client";

import { BookCardFeatured } from "@/components/books/BookCard";
import { ParallaxLayer } from "@/components/motion";
import { useToast } from "@/components/ui/Toast";
import type { Book } from "@/types/book";

export function FeaturedBook({ book }: { book: Book }) {
  const { toast } = useToast();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
      <BookCardFeatured
        book={book}
        onBuy={(b) =>
          toast({ title: `Checkout for "${b.title}" arrives in Phase 11` })
        }
        background={
          <ParallaxLayer
            offset={40}
            className="absolute -right-20 -top-20 size-80 rounded-full bg-accent/15"
          />
        }
      />
    </div>
  );
}