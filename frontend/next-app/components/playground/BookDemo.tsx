"use client";

import { useState } from "react";
import { AuthorCard } from "@/components/books/AuthorCard";
import { BookCard } from "@/components/books/BookCard";
import { BookCardSkeleton } from "@/components/books/BookCardSkeleton";
import { BookPrice } from "@/components/books/BookPrice";
import { Rating } from "@/components/books/Rating";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { mockAuthors, mockBooks } from "@/lib/mock-data";

export default function BookDemo() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center gap-6">
        <Rating value={4.8} count={214} />
        <Rating value={3.5} count={19} />
        <Rating value={0} />
        <Rating value={4.2} size="md" />
        <BookPrice price={12} />
        <BookPrice price={0} />
        <BookPrice price={8.99} compareAtPrice={11.99} />
        <BookPrice price={14.99} size="lg" />
      </div>

      <div className="space-y-4">
        <Button variant="secondary" onClick={() => setLoading((l) => !l)}>
          {loading ? "Show books" : "Show loading skeletons"}
        </Button>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))
            : mockBooks.slice(0, 8).map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onQuickPreview={(b: (typeof mockBooks)[number]) =>
                    toast({ title: `Preview: ${b.title}` })
                  }
                  onToggleFavorite={(
                    _id: (typeof mockBooks)[number]["id"],
                    fav: boolean,
                  ) =>
                    toast({
                      title: fav
                        ? "Added to favorites"
                        : "Removed from favorites",
                    })
                  }
                />
              ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockAuthors.map((a) => (
          <AuthorCard key={a.id} author={a} />
        ))}
      </div>
    </div>
  );
}
