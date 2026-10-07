"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Star } from "lucide-react";
import type { BookReview } from "@/types/book-detail";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= Math.round(value) ? "text-accent" : "text-border"}`}
          fill={n <= Math.round(value) ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

export function BookReviews({ initialReviews }: { initialReviews: BookReview[] }) {
  const reduce = useReducedMotion();
  const uid = useId();

  const [reviews, setReviews] = useState<BookReview[]>(initialReviews);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ rating?: string; title?: string; body?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const stats = useMemo(() => {
    const total = reviews.length;
    const counts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));
    const average = total
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;
    return { total, counts, average };
  }, [reviews]);

  function validate() {
    const next: typeof errors = {};
    if (rating === 0) next.rating = "Please choose a star rating.";
    if (title.trim().length < 3) next.title = "Add a short title (at least 3 characters).";
    if (body.trim().length < 20) next.body = "Tell us a little more (at least 20 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const review: BookReview = {
      id: `local-${Date.now()}`,
      name: "You",
      rating,
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [review, ...prev]);
    setRating(0);
    setTitle("");
    setBody("");
    setErrors({});
    setFormOpen(false);
    setSubmitted(true);
  }

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };

  const inputClass =
    "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <motion.section aria-labelledby="reviews-heading" {...fade}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="reviews-heading" className="font-serif text-2xl text-foreground md:text-3xl">
          Reviews
        </h2>
        {!formOpen && (
          <button
            type="button"
            onClick={() => {
              setFormOpen(true);
              setSubmitted(false);
            }}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Write a review
          </button>
        )}
      </div>

      {/* Summary */}
      {stats.total > 0 ? (
        <div className="mt-6 grid gap-8 sm:grid-cols-[160px_1fr] sm:items-center">
          <div>
            <p className="font-serif text-5xl text-foreground">{stats.average.toFixed(1)}</p>
            <div className="mt-2">
              <Stars value={stats.average} size="h-5 w-5" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.total} {stats.total === 1 ? "review" : "reviews"}
            </p>
          </div>

          <ul className="space-y-2" aria-label="Rating distribution">
            {stats.counts.map(({ star, count }) => {
              const pct = (count / stats.total) * 100;
              return (
                <li key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-12 shrink-0 text-muted-foreground">{star} star</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full origin-left rounded-full bg-accent"
                      initial={reduce ? false : { width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      animate={reduce ? { width: `${pct}%` } : undefined}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-muted-foreground">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-serif text-xl text-foreground">No reviews yet.</p>
          <p className="mt-1 text-muted-foreground">Be the first to share what you thought.</p>
        </div>
      )}

      {/* Success message */}
      <div aria-live="polite">
        {submitted && (
          <p className="mt-6 rounded-xl bg-accent/15 px-4 py-3 text-sm text-foreground">
            Thanks. Your review has been added.
          </p>
        )}
      </div>

      {/* Form */}
      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 overflow-hidden"
          >
            <div className="space-y-5 rounded-2xl border border-border bg-surface p-6">
              <fieldset>
                <legend className="text-sm font-medium text-foreground">Your rating</legend>
                <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                      onClick={() => setRating(n)}
                      className="rounded p-1 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors duration-150 ${
                          n <= rating ? "text-accent" : "text-border hover:text-accent/60"
                        }`}
                        fill={n <= rating ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p role="alert" className="mt-1 text-sm text-danger">
                    {errors.rating}
                  </p>
                )}
              </fieldset>

              <div>
                <label htmlFor={`${uid}-title`} className="text-sm font-medium text-foreground">
                  Title
                </label>
                <input
                  id={`${uid}-title`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? `${uid}-title-err` : undefined}
                  className={inputClass}
                  maxLength={80}
                />
                {errors.title && (
                  <p id={`${uid}-title-err`} role="alert" className="mt-1 text-sm text-danger">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={`${uid}-body`} className="text-sm font-medium text-foreground">
                  Your review
                </label>
                <textarea
                  id={`${uid}-body`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  aria-invalid={!!errors.body}
                  aria-describedby={errors.body ? `${uid}-body-err` : undefined}
                  className={inputClass}
                  maxLength={1000}
                />
                {errors.body && (
                  <p id={`${uid}-body-err`} role="alert" className="mt-1 text-sm text-danger">
                    {errors.body}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Submit review
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setErrors({});
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* List */}
      {reviews.length > 0 && (
        <ul className="mt-8 divide-y divide-border">
          <AnimatePresence initial={false}>
            {reviews.map((r) => (
              <motion.li
                key={r.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="py-6"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Stars value={r.rating} />
                  <span className="sr-only">Rated {r.rating} out of 5</span>
                  <h3 className="font-medium text-foreground">{r.title}</h3>
                </div>
                <p className="mt-2 max-w-prose leading-relaxed text-foreground/90">{r.body}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {r.name} · {formatDate(r.createdAt)}
                </p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.section>
  );
}