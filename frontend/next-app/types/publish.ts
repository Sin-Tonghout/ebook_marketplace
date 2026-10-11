import type { Currency } from "@/types/book";

export type PublishStepId =
  | "info"
  | "file"
  | "cover"
  | "pricing"
  | "rights"
  | "preview"
  | "submit";

export const PUBLISH_STEPS: { id: PublishStepId; label: string }[] = [
  { id: "info", label: "Information" },
  { id: "file", label: "File" },
  { id: "cover", label: "Cover" },
  { id: "pricing", label: "Pricing" },
  { id: "rights", label: "Rights" },
  { id: "preview", label: "Preview" },
  { id: "submit", label: "Submit" },
];

/* ---------- Book file ---------- */

export type BookFileFormat = "pdf" | "epub";

export interface BookFileMeta {
  name: string;
  size: number;
  format: BookFileFormat;
}

export const MAX_FILE_MB = 50;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

// Browsers report these MIME types inconsistently, so accept the common variants.
const ALLOWED_MIME: Record<BookFileFormat, string[]> = {
  pdf: ["application/pdf", "application/x-pdf"],
  epub: ["application/epub+zip", "application/epub"],
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileFormat(name: string): BookFileFormat | null {
  const ext = name.split(".").pop()?.toLowerCase();
  return ext === "pdf" || ext === "epub" ? ext : null;
}

/**
 * Client-side check for a friendly error message only.
 * Real validation (extension, MIME, size, filename, storage path) must be
 * repeated on the server in Phase 13/14.
 */
export function validateBookFile(file: File): string | null {
  const format = getFileFormat(file.name);
  if (!format) return "That file type isn't supported. Upload a PDF or EPUB.";
  // Some browsers leave type empty for .epub, so only reject a non-empty mismatch
  if (file.type && !ALLOWED_MIME[format].includes(file.type))
    return `This file doesn't look like a real ${format.toUpperCase()}. Check the file and try again.`;
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_FILE_BYTES)
    return `This file is ${formatBytes(file.size)}. The maximum is ${MAX_FILE_MB} MB.`;
  return null;
}

export function toFileMeta(file: File): BookFileMeta {
  return {
    name: file.name,
    size: file.size,
    format: getFileFormat(file.name) ?? "pdf",
  };
}

/* ---------- Cover ---------- */

export interface BookCoverMeta {
  name: string;
  /** Downscaled JPEG preview (max 600px wide) kept in the draft. */
  dataUrl: string;
  /** Original image size, used for the aspect-ratio warning. */
  width: number;
  height: number;
}

export const COVER_MAX_MB = 5;
export const COVER_MAX_BYTES = COVER_MAX_MB * 1024 * 1024;
export const COVER_MIN_W = 400;
export const COVER_MIN_H = 600;
export const COVER_RATIO = 2 / 3;

const COVER_EXT = ["jpg", "jpeg", "png", "webp"];
const COVER_MIME = ["image/jpeg", "image/png", "image/webp"];

/** Friendly client-side check only. Repeat on the server in Phase 13/14. */
export function validateCoverFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!COVER_EXT.includes(ext)) return "Use a JPG, PNG or WebP image.";
  if (file.type && !COVER_MIME.includes(file.type))
    return "This file doesn't look like a JPG, PNG or WebP image.";
  if (file.size === 0) return "That file is empty.";
  if (file.size > COVER_MAX_BYTES)
    return `This image is ${formatBytes(file.size)}. The maximum is ${COVER_MAX_MB} MB.`;
  return null;
}

/** True when the image is far enough from 2:3 that the store will crop it noticeably. */
export function coverWillCrop(width: number, height: number): boolean {
  const ratio = width / height;
  return Math.abs(ratio - COVER_RATIO) / COVER_RATIO > 0.08;
}

/* ---------- Pricing ---------- */

export interface BookPricing {
  mode: "free" | "paid" | null;
  currency: Currency;
  /** Regular price as typed, e.g. "4.99". */
  amount: string;
  promoEnabled: boolean;
  /** Promotional price as typed. Must be lower than the regular price. */
  promoAmount: string;
}

export const emptyPricing: BookPricing = {
  mode: null,
  currency: "USD",
  amount: "",
  promoEnabled: false,
  promoAmount: "",
};

export const PRICE_PRESETS: Record<Currency, string[]> = {
  USD: ["2.99", "4.99", "9.99"],
  KHR: ["10000", "20000", "40000"],
};

const PRICE_LIMITS: Record<Currency, { min: number; max: number }> = {
  USD: { min: 0.99, max: 999.99 },
  KHR: { min: 4000, max: 4_000_000 },
};

export type PricingErrors = Partial<Record<"mode" | "amount" | "promoAmount", string>>;

function cleanAmount(raw: string): string {
  return raw.trim().replace(/,/g, "");
}

function checkAmount(raw: string, currency: Currency, emptyMessage: string): string | null {
  const s = cleanAmount(raw);
  if (!s) return emptyMessage;
  if (!/^\d+(\.\d+)?$/.test(s)) return "Use numbers only, like 4.99.";
  if (currency === "KHR" && s.includes(".")) return "Riel prices must be whole numbers.";
  if (currency === "USD" && (s.split(".")[1]?.length ?? 0) > 2)
    return "Use at most 2 decimal places.";
  const n = Number(s);
  const { min, max } = PRICE_LIMITS[currency];
  if (n < min) return `The minimum price is ${min.toLocaleString("en-US")} ${currency}.`;
  if (n > max) return `The maximum price is ${max.toLocaleString("en-US")} ${currency}.`;
  return null;
}

export function validatePricing(p: BookPricing): PricingErrors {
  const e: PricingErrors = {};
  if (!p.mode) {
    e.mode = "Choose whether this book is free or paid.";
    return e;
  }
  if (p.mode === "free") return e;

  const amountError = checkAmount(p.amount, p.currency, "Enter a price.");
  if (amountError) e.amount = amountError;

  if (p.promoEnabled) {
    const promoError = checkAmount(p.promoAmount, p.currency, "Enter the promotional price.");
    if (promoError) e.promoAmount = promoError;
    else if (!amountError && Number(cleanAmount(p.promoAmount)) >= Number(cleanAmount(p.amount)))
      e.promoAmount = "The promotional price must be lower than the regular price.";
  }
  return e;
}

export interface PricingPreview {
  price: number;
  compareAtPrice?: number;
  currency: Currency;
}

/**
 * Maps the wizard's pricing to the store's Book fields (price 0 = free,
 * compareAtPrice = original price when discounted). Returns null until valid.
 */
export function pricingPreview(p: BookPricing): PricingPreview | null {
  if (!p.mode) return null;
  if (p.mode === "free") return { price: 0, currency: p.currency };
  if (checkAmount(p.amount, p.currency, "x")) return null;

  const regular = Number(cleanAmount(p.amount));
  if (
    p.promoEnabled &&
    !checkAmount(p.promoAmount, p.currency, "x") &&
    Number(cleanAmount(p.promoAmount)) < regular
  ) {
    return {
      price: Number(cleanAmount(p.promoAmount)),
      compareAtPrice: regular,
      currency: p.currency,
    };
  }
  return { price: regular, currency: p.currency };
}

/* ---------- Rights ---------- */

export type RightsBasis = "owner" | "licensed" | "public-domain";

export interface BookRights {
  basis: RightsBasis | null;
  /** Notes for reviewers: license/permission details or public-domain source. */
  details: string;
  confirmed: boolean;
  /** Client time only. The server must stamp the real value in Phase 13. */
  confirmedAt: string | null;
}

export const emptyRights: BookRights = {
  basis: null,
  details: "",
  confirmed: false,
  confirmedAt: null,
};

export const RIGHTS_BASIS_LABEL: Record<RightsBasis, string> = {
  owner: "Rights holder",
  licensed: "Licensed",
  "public-domain": "Public domain",
};

export const RIGHTS_DETAILS_MIN = 10;
export const RIGHTS_DETAILS_MAX = 500;

export type RightsErrors = Partial<Record<"basis" | "details" | "confirmed", string>>;

export function validateRights(r: BookRights): RightsErrors {
  const e: RightsErrors = {};

  if (!r.basis) {
    e.basis = "Tell us on what basis you can publish this book.";
  } else if (r.basis !== "owner" && r.details.trim().length < RIGHTS_DETAILS_MIN) {
    e.details =
      r.basis === "licensed"
        ? "Describe who gave you permission and what it covers."
        : "Say where this book's public-domain status comes from.";
  }
  if (r.details.length > RIGHTS_DETAILS_MAX)
    e.details = `Keep this under ${RIGHTS_DETAILS_MAX} characters.`;

  if (!r.confirmed) e.confirmed = "Confirm that you have the legal right to distribute this book.";
  return e;
}

/* ---------- Draft ---------- */

export interface BookDraft {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  language: string;
  tags: string[];
  /** Metadata only. The File object itself can't be stored in localStorage. */
  file: BookFileMeta | null;
  cover: BookCoverMeta | null;
  pricing: BookPricing;
  rights: BookRights;

}

export const emptyDraft: BookDraft = {
  title: "",
  subtitle: "",
  description: "",
  category: "",
  language: "",
  tags: [],
  file: null,
  cover: null,
  pricing: emptyPricing,
  rights: emptyRights,
};

export type InfoField = Exclude<keyof BookDraft, "file" | "cover" | "pricing" | "rights">;
export type InfoErrors = Partial<Record<InfoField, string>>;

export const DESCRIPTION_MIN = 50;
export const DESCRIPTION_MAX = 2000;
export const MAX_TAGS = 8;

export function validateInfo(d: BookDraft): InfoErrors {
  const e: InfoErrors = {};
  if (!d.title.trim()) e.title = "Give your book a title.";
  else if (d.title.trim().length > 120) e.title = "Keep the title under 120 characters.";
  if (d.subtitle.length > 160) e.subtitle = "Keep the subtitle under 160 characters.";
  if (d.description.trim().length < DESCRIPTION_MIN)
    e.description = `Write at least ${DESCRIPTION_MIN} characters so readers know what to expect.`;
  else if (d.description.length > DESCRIPTION_MAX)
    e.description = `Keep the description under ${DESCRIPTION_MAX} characters.`;
  if (!d.category) e.category = "Choose a category.";
  if (!d.language) e.language = "Choose the language of the book.";
  return e;
}

/* ---------- Completeness ---------- */

/** Steps whose required data is missing or invalid. Used by the preview and submit steps. */
export function getIncompleteSteps(d: BookDraft): PublishStepId[] {
  const out: PublishStepId[] = [];
  if (Object.keys(validateInfo(d)).length) out.push("info");
  if (!d.file) out.push("file");
  if (!d.cover) out.push("cover");
  if (Object.keys(validatePricing(d.pricing)).length) out.push("pricing");
  if (Object.keys(validateRights(d.rights)).length) out.push("rights");
  return out;
}

/* ---------- Submission ---------- */

/** Snapshot kept on screen after a successful submit, once the draft is cleared. */
export interface SubmittedBook {
  id: string;
  title: string;
  coverUrl?: string;
  submittedAt: string;
}