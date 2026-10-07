"use client";

import { useState } from "react";
import Link from "next/link";
import { BookCard } from "@/components/books/BookCard";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import type { Book } from "@/types/book";

const titles = [
  ["The Future of Design", "Maya Chen"],
  ["Quiet Machines", "Daniel Okafor"],
  ["Letters to a Young Maker", "Sophea Lim"],
  ["The Slow Library", "Arjun Rao"],
  ["Paper & Light", "Elena Ruiz"],
  ["A Field Guide to Typography", "Tom Haverly"],
  ["Notes on Calm Software", "Mina Park"],
  ["The Cartographer's Daughter", "Isla Moreno"],
];

// Cast: adjust or replace with your real mock data
const books = titles.map(([title, name], i) => ({
  id: String(i + 1),
  title,
  author: { id: String(i + 1), name },
  coverUrl: null,
  price: 4.99 + i,
  compareAtPrice: i % 3 === 0 ? 12.99 : undefined,
  currency: "USD",
  rating: 4 + (i % 10) / 10,
  ratingCount: 120 + i * 37,
  description: "A short description.",
})) as unknown as Book[];

export default function BookHoverPlayground() {
  const [preview, setPreview] = useState<Book | null>(null);
  const { toast } = useToast();

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-8">
      <h1 className="type-h2">Book card hover</h1>
      <Link href="/playground/motion" className="underline">
        ← Back to motion playground
      </Link>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onQuickPreview={setPreview}
            onToggleFavorite={(_, fav) =>
              toast({
                title: fav ? "Added to favorites" : "Removed from favorites",
                variant: "success",
              })
            }
          />
        ))}
      </div>

      <Modal
        open={!!preview}
        onOpenChange={(o) => !o && setPreview(null)}
        title={preview?.title ?? ""}
        description="Quick preview placeholder"
      />
    </main>
  );
}