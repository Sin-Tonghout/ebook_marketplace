"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Check, FileText, ShieldCheck, TriangleAlert } from "lucide-react";

import { BookCover } from "@/components/books/BookCover";
import { BookPrice } from "@/components/books/BookPrice";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  RIGHTS_BASIS_LABEL,
  formatBytes,
  pricingPreview,
  type BookDraft,
  type PublishStepId,
  type SubmittedBook,
} from "@/types/publish";

interface Props {
  draft: BookDraft;
  authorName: string;
  incomplete: PublishStepId[];
  submitting: boolean;
  error: string | null;
  submitted: SubmittedBook | null;
  draftSaved: boolean;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onStartNew: () => void;
}

export function StepSubmit(props: Props) {
  if (props.submitted) {
    return (
      <Submitted
        book={props.submitted}
        authorName={props.authorName}
        onStartNew={props.onStartNew}
      />
    );
  }
  return <Ready {...props} />;
}

/* -------------------------------------------------------------------------- */
/*                                 Ready                                      */
/* -------------------------------------------------------------------------- */

function Ready({
  draft,
  authorName,
  incomplete,
  submitting,
  error,
  draftSaved,
  onSubmit,
  onSaveDraft,
}: Props) {
  const price = pricingPreview(draft.pricing);
  const title = draft.title.trim() || "Untitled book";

  return (
    <div className="space-y-8">
      <header>
        <h2 className="type-h3">Your book is ready.</h2>
        <p className="type-body mt-2 text-muted">
          Take one last look, then submit it for review. We&apos;ll check your file and rights
          details before it goes live, and we&apos;ll notify you when the review is complete.
        </p>
      </header>

      <section
        aria-label="Book summary"
        className="grid gap-6 rounded-lg border border-border bg-surface p-5 sm:grid-cols-[112px_1fr] sm:p-6"
      >
        <div className="w-28">
          <BookCover
            title={title}
            author={authorName}
            src={draft.cover?.dataUrl}
            className="shadow-cover"
          />
        </div>

        <div className="min-w-0 space-y-3">
          <div>
            <p className="text-lg font-semibold leading-snug">{title}</p>
            {draft.subtitle.trim() && <p className="type-body-sm text-muted">{draft.subtitle}</p>}
            <p className="type-body-sm mt-1 text-muted">by {authorName}</p>
          </div>

          {price && (
            <BookPrice
              price={price.price}
              compareAtPrice={price.compareAtPrice}
              currency={price.currency}
            />
          )}

          <p className="type-body-sm text-muted">
            {draft.category} · {draft.language}
          </p>

          <ul className="type-body-sm space-y-2">
            {draft.file && (
              <li className="flex items-center gap-2 text-muted">
                <FileText className="size-4 shrink-0" aria-hidden />
                <span className="truncate">
                  {draft.file.name} · {draft.file.format.toUpperCase()} ·{" "}
                  {formatBytes(draft.file.size)}
                </span>
              </li>
            )}
            {draft.rights.basis && (
              <li className="flex items-center gap-2 text-muted">
                <ShieldCheck className="size-4 shrink-0" aria-hidden />
                Rights confirmed · {RIGHTS_BASIS_LABEL[draft.rights.basis]}
              </li>
            )}
          </ul>
        </div>
      </section>

      {(error || incomplete.length > 0) && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-danger/40 bg-danger/10 px-4 py-3"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
          <p className="type-body-sm text-danger">
            {error ?? "Some steps still need attention. Go back to the preview to fix them."}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="lg" onClick={onSaveDraft} disabled={submitting}>
          {draftSaved ? "Draft saved" : "Save draft"}
        </Button>
        <Button size="lg" loading={submitting} onClick={onSubmit} disabled={incomplete.length > 0}>
          {submitting ? "Submitting…" : error ? "Try again" : "Submit for review"}
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Submitted                                    */
/* -------------------------------------------------------------------------- */

const TIMELINE = [
  { label: "Submitted", text: "We've received your book." },
  { label: "Under review", text: "We check your file and rights details." },
  { label: "Approved", text: "You'll be notified when the review is complete." },
  { label: "Published", text: "Your book appears in the store." },
];

function Submitted({
  book,
  authorName,
  onStartNew,
}: {
  book: SubmittedBook;
  authorName: string;
  onStartNew: () => void;
}) {
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the confirmation so screen-reader users hear it
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const draw = (duration: number, delay = 0) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: reduce ? { duration: 0 } : { duration, delay, ease: "easeOut" as const },
  });

  const when = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(book.submittedAt));

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center text-center">
        <svg viewBox="0 0 52 52" className="size-16 text-success" aria-hidden>
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            {...draw(0.5)}
          />
          <motion.path
            d="M15 27l8 8 14-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...draw(0.35, 0.4)}
          />
        </svg>

        <motion.h2
          ref={headingRef}
          tabIndex={-1}
          {...rise(0.5)}
          className="type-h3 mt-5 focus:outline-none"
        >
          Submitted for review
        </motion.h2>
        <motion.p {...rise(0.6)} className="type-body mt-2 max-w-md text-muted">
          We&apos;ll notify you when the review is complete. If anything needs fixing, we&apos;ll
          tell you what, and you can edit and resubmit.
        </motion.p>
      </div>

      <motion.div
        {...rise(0.7)}
        className="flex items-center gap-5 rounded-lg border border-border bg-surface p-5"
      >
        <div className="w-20 shrink-0">
          <BookCover
            title={book.title}
            author={authorName}
            src={book.coverUrl}
            className="shadow-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{book.title}</p>
          <p className="type-body-sm text-muted">Submitted {when}</p>
        </div>
      </motion.div>

      <motion.section {...rise(0.8)} aria-labelledby="what-next">
        <h3 id="what-next" className="type-label">
          What happens next
        </h3>
        <ol className="mt-4 space-y-4">
          {TIMELINE.map((item, i) => (
            <li key={item.label} className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  i === 0
                    ? "border-success bg-success text-primary-foreground"
                    : "border-border text-muted"
                )}
              >
                {i === 0 ? <Check className="size-3.5" /> : i + 1}
              </span>
              <div>
                <p className="type-label">
                  {item.label}
                  {i === 0 && <span className="sr-only"> (done)</span>}
                </p>
                <p className="type-body-sm text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.div {...rise(0.9)} className="flex flex-wrap items-center gap-3">
        <Link
          href="/seller/books"
          className="inline-flex h-12 select-none items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition duration-(--duration-fast) ease-folio hover:bg-primary/80 hover:shadow-card active:scale-[0.98]"
        >
          Go to my books
        </Link>
        <Button variant="secondary" size="lg" onClick={onStartNew}>
          Publish another book
        </Button>
      </motion.div>
    </div>
  );
}