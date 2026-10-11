"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { WizardStepper } from "@/components/publish/WizardStepper";
import { StepInfo } from "@/components/publish/StepInfo";
import { StepFile } from "@/components/publish/StepFile";
import { StepCover } from "@/components/publish/StepCover";
import { StepPricing } from "@/components/publish/StepPricing";
import { StepRights } from "@/components/publish/StepRights";
import { StepPreview } from "@/components/publish/StepPreview";
import { StepSubmit } from "@/components/publish/StepSubmit";
import { usePublishDraft } from "@/hooks/usePublishDraft";
import { useMockUpload } from "@/hooks/useMockUpload";
import { mockSubmitBook } from "@/lib/mock/submitBook";
import {
  PUBLISH_STEPS,
  getIncompleteSteps,
  toFileMeta,
  validateInfo,
  validatePricing,
  validateRights,
  type PublishStepId,
  type SubmittedBook,
} from "@/types/publish";

// Error key -> element id to focus when Continue is blocked
const PRICING_FOCUS_ID = {
  mode: "pricing-mode-free",
  amount: "price-amount",
  promoAmount: "promo-amount",
} as const;

const RIGHTS_FOCUS_ID = {
  basis: "rights-basis-owner",
  details: "rights-details",
  confirmed: "rights-confirm",
} as const;

export default function CreateBookPage() {
  const reduce = useReducedMotion();
  const { user } = useAuth();
  const { toast } = useToast();
  const { draft, update, reset, hydrated } = usePublishDraft();
  const upload = useMockUpload((file) => update({ file: toFileMeta(file) }));

  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [infoTried, setInfoTried] = useState(false);
  const [fileTried, setFileTried] = useState(false);
  const [coverTried, setCoverTried] = useState(false);
  const [pricingTried, setPricingTried] = useState(false);
  const [rightsTried, setRightsTried] = useState(false);
  const [previewTried, setPreviewTried] = useState(false);
  const [direction, setDirection] = useState(1);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedBook | null>(null);

  const step = PUBLISH_STEPS[index];
  const infoErrors = validateInfo(draft);
  const pricingErrors = validatePricing(draft.pricing);
  const rightsErrors = validateRights(draft.rights);
  const incomplete = getIncompleteSteps(draft);
  const isLast = index === PUBLISH_STEPS.length - 1;
  const uploadBusy = upload.status === "uploading" || upload.status === "processing";
  const authorName = user?.name ?? "Author";

  function next() {
    if (step.id === "info") {
      setInfoTried(true);
      const keys = Object.keys(infoErrors);
      if (keys.length) {
        // Move focus to the first invalid field (ids match draft keys)
        document.getElementById(keys[0])?.focus();
        return;
      }
    }

    if (step.id === "file") {
      if (!draft.file || upload.status === "error") {
        setFileTried(true);
        return;
      }
    }

    if (step.id === "cover" && !draft.cover) {
      setCoverTried(true);
      return;
    }

    if (step.id === "pricing") {
      const keys = Object.keys(pricingErrors) as (keyof typeof PRICING_FOCUS_ID)[];
      if (keys.length) {
        setPricingTried(true);
        document.getElementById(PRICING_FOCUS_ID[keys[0]])?.focus();
        return;
      }
    }

    if (step.id === "rights") {
      const keys = Object.keys(rightsErrors) as (keyof typeof RIGHTS_FOCUS_ID)[];
      if (keys.length) {
        setRightsTried(true);
        // The checkbox is disabled until a basis is chosen, so focus can't land there yet
        document.getElementById(RIGHTS_FOCUS_ID[keys[0]])?.focus();
        return;
      }
    }

    if (step.id === "preview" && incomplete.length) {
      setPreviewTried(true);
      return;
    }

    setDirection(1);
    setCompleted((c) => Math.max(c, index + 1));
    setIndex((i) => Math.min(i + 1, PUBLISH_STEPS.length - 1));
  }

  function back() {
    setDirection(-1);
    setIndex((i) => Math.max(i - 1, 0));
  }

  /** Jump to an earlier step, e.g. from the preview checklist. */
  function goTo(id: PublishStepId) {
    const target = PUBLISH_STEPS.findIndex((s) => s.id === id);
    if (target === -1) return;
    setDirection(target < index ? -1 : 1);
    setIndex(target);
  }

  // The draft already autosaves as you type, so this confirms it for the user
  function handleSaveDraft() {
    setSavedAt(Date.now());
    toast({ title: "Draft saved" });
  }

  async function handleSubmit() {
    if (submitting) return;
    if (incomplete.length) {
      setSubmitError("Some steps still need attention. Go back to the preview to fix them.");
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await mockSubmitBook(draft);
      setSubmitted({
        id: result.id,
        title: draft.title.trim(),
        coverUrl: draft.cover?.dataUrl,
        submittedAt: result.submittedAt,
      });
      setCompleted(PUBLISH_STEPS.length);
      // Clear the draft so the same book can't be submitted twice
      reset();
      upload.reset();
      toast({ title: "Submitted for review" });
    } catch {
      setSubmitError("We couldn't submit your book. Your draft is safe, so you can try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function startNew() {
    setSubmitted(null);
    setSubmitError(null);
    setIndex(0);
    setCompleted(0);
    setInfoTried(false);
    setFileTried(false);
    setCoverTried(false);
    setPricingTried(false);
    setRightsTried(false);
    setPreviewTried(false);
    setSavedAt(null);
    setDirection(-1);
  }

  const offset = reduce ? 0 : 24;

  return (
    <RequireAuth roles={["seller"]}>
      {/* overflow-x-clip lives here (full width), so the wide preview frame isn't cut off */}
      <div className="flex min-h-screen flex-col overflow-x-clip">
        <SiteHeader />

        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 md:py-16">
          <Link
            href="/seller"
            className="type-body-sm mb-8 inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden /> Back to dashboard
          </Link>

          <WizardStepper currentIndex={index} completed={completed} />

          <section className="mt-10 min-h-105" aria-live="polite">
            {!hydrated ? (
              <div className="space-y-4" aria-busy="true">
                <div className="h-8 w-2/3 animate-pulse rounded-md bg-border" />
                <div className="h-12 w-full animate-pulse rounded-md bg-border" />
                <div className="h-32 w-full animate-pulse rounded-md bg-border" />
              </div>
            ) : (
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: offset * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -offset * direction }}
                  transition={{ duration: reduce ? 0.01 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step.id === "info" ? (
                    <StepInfo
                      draft={draft}
                      errors={infoErrors}
                      showAllErrors={infoTried}
                      onChange={update}
                    />
                  ) : step.id === "file" ? (
                    <StepFile
                      draft={draft}
                      upload={upload}
                      showRequiredError={fileTried}
                      onRemove={() => update({ file: null })}
                    />
                  ) : step.id === "cover" ? (
                    <StepCover
                      draft={draft}
                      authorName={authorName}
                      showRequiredError={coverTried}
                      onChange={update}
                    />
                  ) : step.id === "pricing" ? (
                    <StepPricing
                      draft={draft}
                      errors={pricingErrors}
                      authorName={authorName}
                      showAllErrors={pricingTried}
                      onChange={update}
                    />
                  ) : step.id === "rights" ? (
                    <StepRights
                      draft={draft}
                      errors={rightsErrors}
                      showAllErrors={rightsTried}
                      onChange={update}
                    />
                  ) : step.id === "preview" ? (
                    <StepPreview
                      draft={draft}
                      author={{ name: authorName, avatarUrl: user?.avatarUrl }}
                      incomplete={incomplete}
                      showErrors={previewTried}
                      onEdit={goTo}
                    />
                  ) : (
                    <StepSubmit
                      draft={draft}
                      authorName={authorName}
                      incomplete={incomplete}
                      submitting={submitting}
                      error={submitError}
                      submitted={submitted}
                      draftSaved={savedAt !== null}
                      onSubmit={handleSubmit}
                      onSaveDraft={handleSaveDraft}
                      onStartNew={startNew}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </section>

          {/* Navigation. The submit step has its own buttons, and a submitted book can't be edited. */}
          {!submitted && (
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <Button variant="ghost" onClick={back} disabled={index === 0 || submitting}>
                <ArrowLeft className="size-4" aria-hidden /> Back
              </Button>

              {!isLast && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSaveDraft}>
                    {savedAt ? "Draft saved" : "Save draft"}
                  </Button>
                  <Button onClick={next} disabled={uploadBusy}>
                    Continue <ArrowRight className="size-4" aria-hidden />
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
}