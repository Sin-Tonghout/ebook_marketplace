"use client";

import { useState } from "react";

import { BookCover } from "@/components/books/BookCover";
import { BookPrice } from "@/components/books/BookPrice";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import {
  PRICE_PRESETS,
  pricingPreview,
  type BookDraft,
  type BookPricing,
  type PricingErrors,
} from "@/types/publish";
import type { Currency } from "@/types/book";

interface Props {
  draft: BookDraft;
  errors: PricingErrors;
  authorName: string;
  /** True after the user tried to continue, so untouched fields show errors too. */
  showAllErrors: boolean;
  onChange: (patch: Partial<BookDraft>) => void;
}

const MODES = [
  { value: "free", title: "Free", text: "Anyone can read it. Good for building an audience." },
  { value: "paid", title: "Paid", text: "Set your own price and run promotions." },
] as const;

type TouchedKey = "amount" | "promoAmount";

export function StepPricing({ draft, errors, authorName, showAllErrors, onChange }: Props) {
  const p = draft.pricing;
  const [touched, setTouched] = useState<Partial<Record<TouchedKey, boolean>>>({});

  const set = (patch: Partial<BookPricing>) => onChange({ pricing: { ...p, ...patch } });
  const touch = (k: TouchedKey) => setTouched((t) => ({ ...t, [k]: true }));
  const err = (k: TouchedKey) => (touched[k] || showAllErrors ? errors[k] : undefined);

  const preview = pricingPreview(p);
  const title = draft.title.trim() || "Your book title";
  const unit = p.currency === "USD" ? "USD" : "KHR";

  return (
    <div className="space-y-8">
      <header>
        <h2 className="type-h3">Set your price</h2>
        <p className="type-body mt-2 text-muted">
          You can change the price any time after your book is published.
        </p>
      </header>

      {/* Free or paid */}
      <fieldset>
        <legend className="type-label mb-2">How do you want to price this book?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODES.map((m) => (
            <label
              key={m.value}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-lg border bg-surface p-5",
                "transition-colors duration-(--duration-fast) ease-folio",
                "has-[:checked]:border-accent has-[:checked]:bg-accent-soft/40",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/30",
                showAllErrors && errors.mode ? "border-danger/60" : "border-border hover:border-muted"
              )}
            >
              <input
                id={`pricing-mode-${m.value}`}
                type="radio"
                name="pricing-mode"
                value={m.value}
                checked={p.mode === m.value}
                onChange={() => set({ mode: m.value })}
                className="sr-only"
              />
              <span className="type-h4">{m.title}</span>
              <span className="type-body-sm text-muted">{m.text}</span>
            </label>
          ))}
        </div>
        {showAllErrors && errors.mode && (
          <p role="alert" className="type-body-sm mt-2 text-danger">
            {errors.mode}
          </p>
        )}
      </fieldset>

      {/* Paid options */}
      {p.mode === "paid" && (
        <div className="animate-pop-in space-y-6">
          <Select
            id="price-currency"
            label="Currency"
            value={p.currency}
            onChange={(e) => {
              // Presets and limits differ per currency, so start the amounts over
              set({
                currency: e.target.value as Currency,
                amount: "",
                promoAmount: "",
              });
              setTouched({});
            }}
          >
            <option value="USD">US dollar (USD)</option>
            <option value="KHR">Cambodian riel (KHR)</option>
          </Select>

          <div className="space-y-3">
            <p className="type-label">Quick picks</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_PRESETS[p.currency].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  aria-pressed={p.amount === preset}
                  onClick={() => set({ amount: preset })}
                  className={cn(
                    "type-body-sm rounded-full border px-4 py-2 font-medium",
                    "transition-colors duration-(--duration-fast) ease-folio",
                    p.amount === preset
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface hover:border-muted"
                  )}
                >
                  {Number(preset).toLocaleString("en-US")} {unit}
                </button>
              ))}
            </div>

            <Input
              id="price-amount"
              label={`Or enter your own price (${unit})`}
              inputMode="decimal"
              placeholder={p.currency === "USD" ? "4.99" : "20000"}
              value={p.amount}
              onChange={(e) => set({ amount: e.target.value })}
              onBlur={() => touch("amount")}
              error={err("amount")}
            />
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={p.promoEnabled}
                onChange={(e) => set({ promoEnabled: e.target.checked })}
                className="size-4 accent-(--accent)"
              />
              <span className="type-label">Add a promotional price</span>
            </label>

            {p.promoEnabled && (
              <div className="animate-pop-in">
                <Input
                  id="promo-amount"
                  label={`Promotional price (${unit})`}
                  inputMode="decimal"
                  hint="Readers see this price, with your regular price crossed out."
                  value={p.promoAmount}
                  onChange={(e) => set({ promoAmount: e.target.value })}
                  onBlur={() => touch("promoAmount")}
                  error={err("promoAmount")}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live preview */}
      <div className="rounded-lg bg-surface-soft p-5" aria-live="polite">
        <p className="type-caption uppercase tracking-widest">What readers will see</p>
        <div className="mt-4 flex items-end gap-5">
          <div className="w-28 shrink-0">
            <BookCover
              title={title}
              author={authorName}
              src={draft.cover?.dataUrl}
              className="shadow-cover"
            />
          </div>
          <div className="min-w-0 pb-1">
            <p className="line-clamp-2 text-base font-semibold leading-snug">{title}</p>
            <p className="mt-1 truncate text-sm text-muted">{authorName}</p>
            <div className="mt-3">
              {preview ? (
                <BookPrice
                  price={preview.price}
                  compareAtPrice={preview.compareAtPrice}
                  currency={preview.currency}
                  size="lg"
                />
              ) : (
                <span className="type-body-sm text-muted">Your price will appear here.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}