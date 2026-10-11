"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useCategories } from "@/hooks/useCategories";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  MAX_TAGS,
  type BookDraft,
  type InfoErrors,
  type InfoField,
} from "@/types/publish";

const LANGUAGES = ["English", "Khmer", "French", "Chinese", "Japanese", "Other"];

interface Props {
  draft: BookDraft;
  errors: InfoErrors;
  /** True after the user tried to continue, so untouched fields show errors too. */
  showAllErrors: boolean;
  onChange: (patch: Partial<BookDraft>) => void;
}

export function StepInfo({ draft, errors, showAllErrors, onChange }: Props) {
  const [touched, setTouched] = useState<Partial<Record<InfoField, boolean>>>({});
  const [tagInput, setTagInput] = useState("");
  const categories = useCategories();

  // A draft saved earlier may hold a category that was renamed or deleted since.
  const legacyCategory =
    draft.category && !categories.some((c) => c.name === draft.category)
      ? draft.category
      : null;

  const touch = (k: InfoField) => setTouched((t) => ({ ...t, [k]: true }));
  const err = (k: InfoField) => (touched[k] || showAllErrors ? errors[k] : undefined);

  function addTag(raw: string) {
    const t = raw.trim().replace(/,$/, "").trim();
    if (!t || draft.tags.length >= MAX_TAGS) return;
    if (!draft.tags.some((x) => x.toLowerCase() === t.toLowerCase())) {
      onChange({ tags: [...draft.tags, t] });
    }
    setTagInput("");
  }

  function onTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && draft.tags.length) {
      onChange({ tags: draft.tags.slice(0, -1) });
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="type-h3">Tell us about your book</h2>
        <p className="type-body mt-2 text-muted">
          This is what readers see first. You can change it any time before you submit.
        </p>
      </header>

      <Input
        id="title"
        label="Title"
        placeholder="The Future of Design"
        value={draft.title}
        onChange={(e) => onChange({ title: e.target.value })}
        onBlur={() => touch("title")}
        error={err("title")}
      />

      <Input
        id="subtitle"
        label="Subtitle (optional)"
        placeholder="A short line that adds context"
        value={draft.subtitle}
        onChange={(e) => onChange({ subtitle: e.target.value })}
        onBlur={() => touch("subtitle")}
        error={err("subtitle")}
      />

      <Textarea
        id="description"
        label="Description"
        rows={6}
        placeholder="What is this book about, and who is it for?"
        value={draft.description}
        onChange={(e) => onChange({ description: e.target.value })}
        onBlur={() => touch("description")}
        hint={`${draft.description.length}/${DESCRIPTION_MAX} characters · aim for at least ${DESCRIPTION_MIN}`}
        error={err("description")}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Select
          id="category"
          label="Category"
          value={draft.category}
          onChange={(e) => onChange({ category: e.target.value })}
          onBlur={() => touch("category")}
          error={err("category")}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
          {legacyCategory && (
            <option value={legacyCategory}>{legacyCategory} (no longer offered)</option>
          )}
        </Select>

        <Select
          id="language"
          label="Language"
          value={draft.language}
          onChange={(e) => onChange({ language: e.target.value })}
          onBlur={() => touch("language")}
          error={err("language")}
        >
          <option value="">Select a language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </div>

      {/* Tags: custom control, no design-system component for it yet */}
      <div className="space-y-2">
        <label htmlFor="tags" className="type-label block">
          Tags (optional)
        </label>
        <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 transition duration-(--duration-fast) ease-folio hover:border-muted focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
          {draft.tags.map((t) => (
            <span
              key={t}
              className="type-body-sm inline-flex items-center gap-1 rounded-full bg-accent-soft py-1 pl-3 pr-1.5 text-foreground"
            >
              {t}
              <button
                type="button"
                aria-label={`Remove tag ${t}`}
                onClick={() => onChange({ tags: draft.tags.filter((x) => x !== t) })}
                className="rounded-full p-1 transition-colors hover:bg-foreground/10"
              >
                <X className="size-3" aria-hidden />
              </button>
            </span>
          ))}
          <input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={onTagKey}
            onBlur={() => addTag(tagInput)}
            disabled={draft.tags.length >= MAX_TAGS}
            aria-describedby="tags-hint"
            placeholder={draft.tags.length ? "" : "Type a tag and press Enter"}
            className="type-body min-w-32 flex-1 bg-transparent py-1 text-foreground outline-none placeholder:text-muted disabled:opacity-50"
          />
        </div>
        <p id="tags-hint" className="type-body-sm text-muted">
          Up to {MAX_TAGS} tags. Press Enter or comma to add one.
        </p>
      </div>
    </div>
  );
}