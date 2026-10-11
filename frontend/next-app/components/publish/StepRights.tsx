"use client";

import { useState } from "react";

import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import {
  RIGHTS_DETAILS_MAX,
  type BookDraft,
  type BookRights,
  type RightsBasis,
  type RightsErrors,
} from "@/types/publish";

interface Props {
  draft: BookDraft;
  errors: RightsErrors;
  /** True after the user tried to continue, so untouched fields show errors too. */
  showAllErrors: boolean;
  onChange: (patch: Partial<BookDraft>) => void;
}

const BASES: { value: RightsBasis; title: string; text: string }[] = [
  {
    value: "owner",
    title: "I own the rights",
    text: "I wrote this book, or I hold its copyright.",
  },
  {
    value: "licensed",
    title: "I have permission",
    text: "The rights holder gave me a license or written permission to distribute it.",
  },
  {
    value: "public-domain",
    title: "It's in the public domain",
    text: "Its copyright has expired or doesn't apply.",
  },
];

const DETAILS_COPY: Record<RightsBasis, { label: string; hint: string; placeholder: string }> = {
  owner: {
    label: "Notes for reviewers (optional)",
    hint: "Anything that helps a reviewer, like a publisher name or ISBN.",
    placeholder: "",
  },
  licensed: {
    label: "Describe your permission",
    hint: "Who gave you permission, and what does it cover?",
    placeholder: "Licensed by the author, Jane Doe, for digital sale worldwide.",
  },
  "public-domain": {
    label: "Where does its public-domain status come from?",
    hint: "For example, the author's death date or the source you used.",
    placeholder: "Author died in 1920. Text taken from Project Gutenberg.",
  },
};

type TouchedKey = "details";

export function StepRights({ draft, errors, showAllErrors, onChange }: Props) {
  const r = draft.rights;
  const [touched, setTouched] = useState<Partial<Record<TouchedKey, boolean>>>({});

  const set = (patch: Partial<BookRights>) => onChange({ rights: { ...r, ...patch } });
  const showDetailsError = touched.details || showAllErrors ? errors.details : undefined;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="type-h3">Publishing rights</h2>
        <p className="type-body mt-2 text-muted">
          Folio only sells books that their publisher has the right to distribute.
        </p>
      </header>

      {/* Basis */}
      <fieldset>
        <legend className="type-label mb-2">On what basis can you publish this book?</legend>
        <div className="grid gap-3">
          {BASES.map((b) => (
            <label
              key={b.value}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-lg border bg-surface p-5",
                "transition-colors duration-(--duration-fast) ease-folio",
                "has-[:checked]:border-accent has-[:checked]:bg-accent-soft/40",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/30",
                showAllErrors && errors.basis ? "border-danger/60" : "border-border hover:border-muted"
              )}
            >
              <input
                id={`rights-basis-${b.value}`}
                type="radio"
                name="rights-basis"
                value={b.value}
                checked={r.basis === b.value}
                onChange={() => {
                  // The confirmation must match the declared basis, so ask again
                  set({ basis: b.value, confirmed: false, confirmedAt: null });
                  setTouched({});
                }}
                className="sr-only"
              />
              <span className="type-h4">{b.title}</span>
              <span className="type-body-sm text-muted">{b.text}</span>
            </label>
          ))}
        </div>
        {showAllErrors && errors.basis && (
          <p role="alert" className="type-body-sm mt-2 text-danger">
            {errors.basis}
          </p>
        )}
      </fieldset>

      {/* Details */}
      {r.basis && (
        <div className="animate-pop-in">
          <Textarea
            id="rights-details"
            label={DETAILS_COPY[r.basis].label}
            rows={3}
            placeholder={DETAILS_COPY[r.basis].placeholder}
            hint={`${DETAILS_COPY[r.basis].hint} (${r.details.length}/${RIGHTS_DETAILS_MAX})`}
            value={r.details}
            onChange={(e) => set({ details: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, details: true }))}
            error={showDetailsError}
          />
        </div>
      )}

      {/* What it means */}
      <section aria-labelledby="rights-meaning" className="rounded-lg bg-surface-soft p-5">
        <h3 id="rights-meaning" className="type-label">
          What this confirmation means
        </h3>
        <ul className="type-body-sm mt-3 list-disc space-y-2 pl-5 text-muted">
          <li>You wrote the book, or the rights holder has allowed you to sell it here.</li>
          <li>A reviewer may check this before your book is published and may ask for proof.</li>
          <li>
            Books that are reported for copyright concerns can be removed, and false claims can
            lead to action on your account.
          </li>
          <li>You stay responsible for everything you publish. This is not legal advice.</li>
        </ul>
      </section>

      {/* Confirmation */}
      <div>
        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border bg-surface p-5",
            "transition-colors duration-(--duration-fast) ease-folio",
            "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/30",
            showAllErrors && errors.confirmed ? "border-danger/60" : "border-border hover:border-muted"
          )}
        >
          <input
            id="rights-confirm"
            type="checkbox"
            checked={r.confirmed}
            disabled={!r.basis}
            aria-describedby={showAllErrors && errors.confirmed ? "rights-confirm-error" : undefined}
            onChange={(e) =>
              set({
                confirmed: e.target.checked,
                confirmedAt: e.target.checked ? new Date().toISOString() : null,
              })
            }
            className="mt-1 size-4 shrink-0 accent-(--accent) disabled:cursor-not-allowed"
          />
          <span className="type-body">
            I confirm that I have the legal right to distribute this book.
            {!r.basis && (
              <span className="type-body-sm mt-1 block text-muted">
                Choose a basis above first.
              </span>
            )}
          </span>
        </label>
        {showAllErrors && errors.confirmed && (
          <p id="rights-confirm-error" role="alert" className="type-body-sm mt-2 text-danger">
            {errors.confirmed}
          </p>
        )}
      </div>
    </div>
  );
}