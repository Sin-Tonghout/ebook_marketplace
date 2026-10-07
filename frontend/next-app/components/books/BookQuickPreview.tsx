"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Book } from "@/types/book";

interface BookQuickPreviewProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Placeholder until the real preview arrives in Phase 06.
export function BookQuickPreview({ book, open, onOpenChange }: BookQuickPreviewProps) {
  const router = useRouter();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={book?.title ?? ""}
      description={book ? `by ${book.author.name}` : undefined}
      footer={
        <Button onClick={() => book && router.push(`/books/${book.id}`)}>
          View details
        </Button>
      }
    >
      {book?.description && <p className="type-body">{book.description}</p>}
    </Modal>
  );
}