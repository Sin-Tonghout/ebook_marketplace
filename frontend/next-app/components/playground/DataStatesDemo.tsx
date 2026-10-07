"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/Toast";

export default function DataStatesDemo() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="type-caption">Page {page} of 12</p>
        <Pagination page={page} pageCount={12} onPageChange={setPage} />
      </div>

      <EmptyState
        icon={<BookOpen className="size-7" aria-hidden />}
        title="Your library is empty."
        description="Start discovering your next book."
        action={<Button>Explore Books</Button>}
      />

      <ErrorState
        title="We couldn't load this book."
        description="Please try again."
        onRetry={() => toast({ title: "Retrying…" })}
        retryLabel="Retry"
      />
    </div>
  );
}