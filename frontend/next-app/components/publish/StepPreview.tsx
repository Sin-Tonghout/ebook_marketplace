"use client";

import { Check, TriangleAlert } from "lucide-react";

import { BookAuthorSection } from "@/components/books/BookAuthorSection";
import { BookDescription } from "@/components/books/BookDescription";
import { BookDetailHero } from "@/components/books/BookDetailHero";
import { BookMetadata } from "@/components/books/BookMetadata";
import { BookPrice } from "@/components/books/BookPrice";
import { Button } from "@/components/ui/Button";
import { draftToBookDetail } from "@/lib/draftToBookDetail";
import { cn } from "@/lib/utils";
import {
  RIGHTS_BASIS_LABEL,
  pricingPreview, 
  type BookDraft,
  type PublishStepId,
} from "@/types/publish";

interface Props {
  draft: BookDraft;
  author: { name: string; avatarUrl?: string | null };
  incomplete: PublishStepId[];
  /** True after the user tried to continue with incomplete steps. */
  showErrors: boolean;
  onEdit: (step: PublishStepId) => void;
}

// const RIGHTS_LABEL: Record<RightsBasis, string> = {
//   owner: "Rights holder",
//   licensed: "Licensed",
//   "public-domain": "Public domain",
// };

export function StepPreview({ draft, author, incomplete, showErrors, onEdit }: Props) {
  const book = draftToBookDetail(draft, author);
  const price = pricingPreview(draft.pricing);

  const rows: { id: PublishStepId; label: string; summary: React.ReactNode }[] = [
    { id: "info", label: "Information", summary: draft.title.trim() || "Missing" },
    { id: "file", label: "Book file", summary: draft.file?.name ?? "Missing" },
    { id: "cover", label: "Cover", summary: draft.cover?.name ?? "Missing" },
    {
      id: "pricing",
      label: "Pricing",
      summary: price ? (
        <BookPrice
          price={price.price}
          compareAtPrice={price.compareAtPrice}
          currency={price.currency}
        />
      ) : (
        "Missing"
      ),
    },
    {
      id: "rights",
      label: "Rights",
      summary: draft.rights.basis ? RIGHTS_BASIS_LABEL[draft.rights.basis] : "Missing",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="type-h3">Preview your book</h2>
        <p className="type-body mt-2 text-muted">
          This is how readers will see your book. Check everything, then continue to submit.
        </p>
      </header>

      {showErrors && incomplete.length > 0 && (
        <div
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3"
        >
          <p className="type-body-sm text-danger">
            Finish the highlighted steps below before you continue.
          </p>
        </div>
      )}

      {/* Checklist */}
      <section aria-labelledby="preview-checklist" className="rounded-lg border border-border bg-surface">
        <h3 id="preview-checklist" className="type-label px-5 pt-5">
          Before you continue
        </h3>
        <ul className="mt-2 divide-y divide-border">
          {rows.map((row) => {
            const done = !incomplete.includes(row.id);
            return (
              <li key={row.id} className="flex items-center gap-3 px-5 py-3">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full",
                    done ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                  )}
                >
                  {done ? <Check className="size-3.5" /> : <TriangleAlert className="size-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="type-label">
                    {row.label}
                    <span className="sr-only">{done ? ", complete" : ", needs attention"}</span>
                  </p>
                  <p
                    className={cn(
                      "type-body-sm truncate",
                      done ? "text-muted" : "text-danger"
                    )}
                  >
                    {row.summary}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onEdit(row.id)}>
                  Edit
                </Button>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="type-body-sm text-muted">
        Buttons are switched off in this preview. Sample pages and your author bio fill in after
        review, and ratings start at zero for a new book.
      </p>

      {/* Reader view: breaks out of the narrow wizard column so the real layout fits */}
      <div className="relative left-1/2 w-[min(72rem,calc(100vw-2.5rem))] -translate-x-1/2">
        <div
          inert
          className="overflow-hidden rounded-lg border border-border bg-background shadow-card"
        >
          <BookDetailHero book={book} />

          <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 md:grid-cols-[1fr_320px] md:gap-16">
            <BookDescription text={book.description} />
            <BookMetadata book={book} />
          </div>

          {/* Stands in for BookPreview until the file is processed */}
          <div className="mx-auto max-w-4xl px-6 pb-16">
            <section aria-labelledby="sample-pages-heading">
              <h2
                id="sample-pages-heading"
                className="font-serif text-2xl text-foreground md:text-3xl"
              >
                Preview
              </h2>
              <p className="mt-2 text-sm text-muted">Read a few pages before you decide.</p>
              <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
                Sample pages appear here once your file has been processed.
              </div>
            </section>
          </div>

          <div className="mx-auto max-w-4xl px-6 pb-16">
            <BookAuthorSection author={book.author} currentBookId={book.id} />
          </div>
        </div>
      </div>
    </div>
  );
}