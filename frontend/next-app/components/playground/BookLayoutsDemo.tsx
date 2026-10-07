"use client";

import { BookCardCompact } from "@/components/books/BookCardCompact";
import { BookMeta } from "@/components/books/BookMeta";
import { CategoryCard } from "@/components/books/CategoryCard";
import { mockBooks, mockCategories } from "@/lib/mock-data";

const tones = ["soft", "accent", "dark"] as const;

export default function BookLayoutsDemo() {
  return (
    <div className="space-y-12">
      <BookCardCompact book={mockBooks[0]} />

      <div className="space-y-4">
        <h3 className="type-label">Book metadata</h3>
        <BookMeta book={mockBooks[0]} />
      </div>

      <div className="space-y-2">
        <h3 className="type-label">Compact list</h3>
        <div className="max-w-xl">
          {mockBooks.slice(0, 4).map((b) => (
            <BookCardCompact key={b.id} book={b} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="type-label">Categories</h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {mockCategories.map((c, i) => (
            <CategoryCard key={c.slug} {...c} tone={tones[i % tones.length]} />
          ))}
        </div>
      </div>
    </div>
  );
}
