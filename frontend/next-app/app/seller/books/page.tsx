"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { SellerBookRow, SellerBookRowSkeleton } from "@/components/seller/SellerBookRow";
import { SellerShell } from "@/components/seller/SellerShell";
import {
  StatusFilter,
  type StatusFilterValue,
} from "@/components/seller/StatusFilter";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSellerData } from "@/hooks/useSellerData";
import { STATUS_LABEL } from "@/lib/seller-status";

export default function SellerBooksPage() {
  const router = useRouter();
  const { user } = useAuth();
  const result = useSellerData();
  const [filter, setFilter] = useState<StatusFilterValue>("all");

  const authorName = user?.name ?? "You";

  if (result.status === "loading") {
    return (
      <SellerShell className="space-y-8">
        <div aria-busy="true" className="space-y-8">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-80 max-w-full rounded-full" />
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SellerBookRowSkeleton key={i} />
            ))}
          </ul>
        </div>
      </SellerShell>
    );
  }

  if (result.status === "error") {
    return (
      <SellerShell>
        <ErrorState
          title="We couldn't load your books"
          description="Your books are safe. Please try again."
          onRetry={result.reload}
        />
      </SellerShell>
    );
  }

  const { books } = result.data;

  if (books.length === 0) {
    return (
      <SellerShell>
        <EmptyState
          icon={<BookOpen className="size-7" aria-hidden />}
          title="You haven't published a book yet."
          description="Create your first book and it will show up here, with its status and sales."
          action={
            <Button onClick={() => router.push("/seller/books/create")}>
              Publish your first book
            </Button>
          }
        />
      </SellerShell>
    );
  }

  const visible = [...books]
    .filter((b) => filter === "all" || b.status === filter)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <SellerShell className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="type-h2">My books</h1>
          <p className="mt-2 type-body text-muted">
            {books.length} {books.length === 1 ? "book" : "books"}
          </p>
        </div>
        <Button onClick={() => router.push("/seller/books/create")}>
          <Plus className="size-4" aria-hidden /> Publish a book
        </Button>
      </header>

      <StatusFilter books={books} value={filter} onChange={setFilter} />

      {visible.length === 0 ? (
        <EmptyState
          title={`No ${filter === "all" ? "" : STATUS_LABEL[filter].toLowerCase() + " "}books`}
          description="Try another filter to see your other books."
          action={
            <Button variant="secondary" onClick={() => setFilter("all")}>
              Show all books
            </Button>
          }
        />
      ) : (
        <ul className="space-y-4" aria-live="polite">
          {visible.map((book, i) => (
            <SellerBookRow
              key={book.id}
              book={book}
              authorName={authorName}
              index={i}
              onEdit={(id) => router.push(`/seller/books/${id}/edit`)}
            />
          ))}
        </ul>
      )}
    </SellerShell>
  );
}