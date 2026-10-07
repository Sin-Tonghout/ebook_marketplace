"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Step = 0 | 1 | 2 | 3;
const STEP_LABELS = ["Why publish", "Your profile", "Rights", "Done"];

const BENEFITS = [
  { title: "Keep what you earn", body: "Set your own price and see every sale in your dashboard." },
  { title: "Reach readers directly", body: "Your book sits next to the ones readers already love." },
  { title: "Publish at your pace", body: "Save drafts, preview exactly what readers see, then submit when ready." },
];

export function BecomeSellerFlow() {
  const { user, becomeSeller } = useAuth();

  const [step, setStep] = useState<Step>(0);
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [rights, setRights] = useState(false);
  const [errors, setErrors] = useState<{ displayName?: string; bio?: string; website?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  // Already a seller (or admin): don't show the conversion flow again
  if (step !== 3 && (user.role === "seller" || user.role === "admin" || user.role === "super_admin")) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-4xl text-[var(--text-primary)]">You're already set up to publish</h1>
        <p className="text-[var(--text-secondary)]">Your seller tools are ready whenever you are.</p>
        <Link href="/seller" className="inline-block underline underline-offset-4">
          Go to seller dashboard
        </Link>
      </div>
    );
  }

  function validateProfile(): boolean {
    const e: typeof errors = {};
    if (!displayName.trim()) e.displayName = "Add the name readers will see.";
    if (bio.trim().length < 20) e.bio = "Write at least 20 characters about yourself.";
    if (website.trim() && !/^https?:\/\/\S+\.\S+/.test(website.trim())) {
      e.website = "Start with http:// or https://";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    setFormError(null);
    setLoading(true);
    try {
      await becomeSeller(
        { displayName: displayName.trim(), bio: bio.trim(), websiteUrl: website.trim() || undefined },
        rights
      );
      setStep(3);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Progress */}
      <ol className="mb-10 flex items-center gap-2" aria-label="Progress">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-2" aria-current={i === step ? "step" : undefined}>
            <span
              className={`h-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-[var(--accent)]" : "bg-[var(--border)]"
              }`}
            />
            <span className={`text-xs ${i === step ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* STEP 0: Why publish */}
          {step === 0 && (
            <div className="space-y-8">
              <div>
                <h1 className="font-serif text-4xl text-[var(--text-primary)] sm:text-5xl">
                  Have a story to share?
                </h1>
                <p className="mt-3 text-lg text-[var(--text-secondary)]">
                  Publish your book on Folio in a few simple steps.
                </p>
              </div>
              <ul className="space-y-5">
                {BENEFITS.map((b) => (
                  <li key={b.title} className="border-l-2 border-[var(--accent)] pl-4">
                    <p className="font-medium text-[var(--text-primary)]">{b.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{b.body}</p>
                  </li>
                ))}
              </ul>
              <Button onClick={() => setStep(1)}>Get started</Button>
            </div>
          )}

          {/* STEP 1: Seller info */}
          {step === 1 && (
            <form
              noValidate
              className="space-y-5"
              onSubmit={(ev) => {
                ev.preventDefault();
                if (validateProfile()) setStep(2);
              }}
            >
              <h1 className="font-serif text-4xl text-[var(--text-primary)]">Your author profile</h1>
              <p className="text-[var(--text-secondary)]">This is what readers see on your book pages.</p>

              <Input
                label="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                error={errors.displayName}
              />

              <div>
                <label htmlFor="seller-bio" className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                  Short bio
                </label>
                <textarea
                  id="seller-bio"
                  rows={4}
                  maxLength={500}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  aria-invalid={!!errors.bio}
                  aria-describedby={errors.bio ? "seller-bio-error" : undefined}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-colors duration-150 focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
                />
                {errors.bio && (
                  <p id="seller-bio-error" className="mt-1 text-sm text-[var(--danger)]">
                    {errors.bio}
                  </p>
                )}
              </div>

              <Input
                label="Website (optional)"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                error={errors.website}
              />

              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}

          {/* STEP 2: Rights */}
          {step === 2 && (
            <div className="space-y-6">
              <h1 className="font-serif text-4xl text-[var(--text-primary)]">Publishing rights</h1>
              <p className="text-[var(--text-secondary)]">
                Folio is for books you're allowed to sell. You can publish a book if you:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-[var(--text-secondary)]">
                <li>own the copyright, or</li>
                <li>have explicit permission or a license to distribute it, or</li>
                <li>are otherwise legally allowed to publish it.</li>
              </ul>
              <p className="text-sm text-[var(--text-secondary)]">
                Books that break this rule are removed after review, and repeated violations can end your seller access.
              </p>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <input
                  type="checkbox"
                  checked={rights}
                  onChange={(e) => setRights(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--accent)]"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  I confirm that I will only publish books I have the legal right to distribute.
                </span>
              </label>

              {formError && (
                <p role="alert" className="rounded-lg bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
                  {formError}
                </p>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(1)} disabled={loading}>
                  Back
                </Button>
                <Button onClick={submit} loading={loading} disabled={!rights || loading}>
                  Create seller profile
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <div className="space-y-6" role="status">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/15 text-3xl text-[var(--success)]"
                aria-hidden
              >
                ✓
              </motion.div>
              <h1 className="font-serif text-4xl text-[var(--text-primary)]">You're a Folio author</h1>
              <p className="text-[var(--text-secondary)]">
                Your seller profile is live. You can publish your first book whenever you're ready.
              </p>
              <div className="flex gap-3">
                <Link href="/seller/books/create">
                  <Button>Publish your first book</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="secondary">Back to profile</Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}