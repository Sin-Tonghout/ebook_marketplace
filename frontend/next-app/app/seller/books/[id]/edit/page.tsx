"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { StepInfo } from "@/components/publish/StepInfo";
import { StepPricing } from "@/components/publish/StepPricing";
import { SellerShell } from "@/components/seller/SellerShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useSellerData } from "@/hooks/useSellerData";
import { bookToDraft, draftToBook } from "@/lib/seller-editor";
import { STATUS_LABEL } from "@/lib/seller-status";
import { saveSellerBook, unpublishSellerBook } from "@/services/seller-books";
import { validateInfo, validatePricing, type BookDraft } from "@/types/publish";
import type { SellerBook } from "@/types/seller";

const PRICING_FOCUS_ID = {
  mode: "pricing-mode-free",
  amount: "price-amount",
  promoAmount: "promo-amount",
} as const;

type Action = "save" | "submit" | "unpublish";

function EditorForm({ book }: { book: SellerBook }) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [base, setBase] = useState(book);
  const [draft, setDraft] = useState<BookDraft>(() => bookToDraft(book));
  const [savedJson, setSavedJson] = useState(() =>
    JSON.stringify(bookToDraft(book))
  );

  const [infoTried, setInfoTried] = useState(false);
  const [pricingTried, setPricingTried] = useState(false);
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    (patch: Partial<BookDraft>) => setDraft((d) => ({ ...d, ...patch })),
    []
  );

  const dirty = useMemo(
    () => JSON.stringify(draft) !== savedJson,
    [draft, savedJson]
  );

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const authorName = user?.name ?? "You";
  const infoErrors = validateInfo(draft);
  const pricingErrors = validatePricing(draft.pricing);

  const status = base.status;
  const readOnly = status === "pending";
  const isPublished = status === "published";

  function checkInfoAndPricing(): boolean {
    const infoKeys = Object.keys(infoErrors);
    if (infoKeys.length) {
      setInfoTried(true);
      document.getElementById(infoKeys[0])?.focus();
      return false;
    }
    const priceKeys = Object.keys(
      pricingErrors
    ) as (keyof typeof PRICING_FOCUS_ID)[];
    if (priceKeys.length) {
      setPricingTried(true);
      document.getElementById(PRICING_FOCUS_ID[priceKeys[0]])?.focus();
      return false;
    }
    return true;
  }

  async function persist(action: Action, message: string, leave: boolean) {
    setSaving(true);
    setError(null);
    try {
      const saved =
        action === "unpublish"
          ? await unpublishSellerBook(base.id)
          : await saveSellerBook(base.id, draftToBook(base, draft, base.status), action);

      // Show the book exactly as the server saved it
      const fresh = bookToDraft(saved);
      setBase(saved);
      setDraft(fresh);
      setSavedJson(JSON.stringify(fresh));
      setConfirmUnpublish(false);
      toast({ title: message });
      if (leave) router.push("/seller/books");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "We couldn't save your changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function onSave() {
    if (!draft.title.trim()) {
      setInfoTried(true);
      document.getElementById("title")?.focus();
      return;
    }
    if (isPublished && !checkInfoAndPricing()) return;
    persist("save", isPublished ? "Changes saved" : "Draft saved", false);
  }

  function onSubmit() {
    if (!checkInfoAndPricing()) return;
    persist("submit", "Submitted for review", true);
  }

  function onUnpublish() {
    persist("unpublish", "Book unpublished", true);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <Link
          href="/seller/books"
          className="type-body-sm mb-6 inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> My books
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="type-h2">Edit book</h1>
          <Badge variant={status} dot>
            {STATUS_LABEL[status]}
          </Badge>
        </div>

        {status === "rejected" && (
          <p className="mt-4 rounded-md bg-danger/10 px-4 py-3 type-body-sm text-danger">
            {base.rejectionReason ??
              "This book wasn't approved. Update it and submit again."}
          </p>
        )}
        {readOnly && (
          <p className="mt-4 rounded-md bg-surface-soft px-4 py-3 type-body-sm text-muted">
            This book is in review, so it can&apos;t be edited right now.
            We&apos;ll notify you when the review is complete.
          </p>
        )}
        {isPublished && (
          <p className="mt-4 type-body-sm text-muted">
            Changes to a published book go live as soon as you save.
          </p>
        )}
      </div>

      <fieldset disabled={readOnly || saving} className="min-w-0 space-y-12">
        <StepInfo
          draft={draft}
          errors={infoErrors}
          showAllErrors={infoTried}
          onChange={update}
        />

        <div className="border-t border-border pt-10">
          <h2 className="type-h3">Cover and book file</h2>
          <p className="type-body mt-2 text-muted">
            Changing the cover or the book file isn&apos;t available here yet.
            It&apos;s coming in the next update. You can edit everything else
            now.
          </p>
        </div>

        <div className="border-t border-border pt-10">
          <StepPricing
            draft={draft}
            errors={pricingErrors}
            authorName={authorName}
            showAllErrors={pricingTried}
            onChange={update}
          />
        </div>
      </fieldset>

      {/* Action bar */}
      <div className="sticky bottom-0 z-30 -mx-4 border-t border-border bg-background/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        {error && (
          <p role="alert" className="mb-3 type-body-sm text-danger">
            {error}
          </p>
        )}

        {confirmUnpublish && (
          <div
            role="alertdialog"
            aria-label="Confirm unpublish"
            className="mb-4 rounded-lg border border-border bg-surface p-4"
          >
            <p className="type-body font-medium">Unpublish this book?</p>
            <p className="mt-1 type-body-sm text-muted">
              It will disappear from the store. Readers who already bought it
              keep access. You can submit it for review again later.
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={onUnpublish} disabled={saving}>
                {saving ? "Unpublishing…" : "Unpublish"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirmUnpublish(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="type-body-sm text-muted" aria-live="polite">
            {readOnly ? "" : dirty ? "Unsaved changes" : "All changes saved"}
          </p>

          {readOnly ? (
            <Button
              variant="secondary"
              onClick={() => router.push("/seller/books")}
            >
              Back to my books
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {isPublished ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setConfirmUnpublish(true)}
                    disabled={saving}
                  >
                    Unpublish
                  </Button>
                  <Button onClick={onSave} disabled={saving || !dirty}>
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={onSave}
                    disabled={saving || !dirty}
                  >
                    {saving ? "Saving…" : "Save draft"}
                  </Button>
                  <Button onClick={onSubmit} disabled={saving}>
                    {status === "rejected"
                      ? "Resubmit for review"
                      : "Submit for review"}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const result = useSellerData();

  if (result.status === "loading") {
    return (
      <SellerShell>
        <div aria-busy="true" className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </SellerShell>
    );
  }

  if (result.status === "error") {
    return (
      <SellerShell>
        <ErrorState
          title="We couldn't load this book"
          description="Your book is safe. Please try again."
          onRetry={result.reload}
        />
      </SellerShell>
    );
  }

  const book = result.data.books.find((b) => b.id === id);

  if (!book) {
    return (
      <SellerShell>
        <EmptyState
          title="We couldn't find that book."
          description="It may have been removed, or the link is wrong."
          action={
            <Button onClick={() => router.push("/seller/books")}>
              Back to my books
            </Button>
          }
        />
      </SellerShell>
    );
  }

  // key resets the form if you open a different book
  return (
    <SellerShell>
      <EditorForm key={book.id} book={book} />
    </SellerShell>
  );
}