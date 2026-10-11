import { emptyRights, pricingPreview, type BookDraft } from "@/types/publish";
import type { SellerBook, SellerBookStatus } from "@/types/seller";

/** Turns a seller book into the same draft shape the wizard uses. */
export function bookToDraft(b: SellerBook): BookDraft {
  const paid = b.price > 0;
  const regular = b.compareAtPrice ?? b.price;

  return {
    title: b.title,
    subtitle: b.subtitle ?? "",
    description: b.description ?? "",
    category: b.category ?? "",
    language: b.language ?? "",
    tags: b.tags ?? [],
    file: b.file ?? null,
    cover: b.coverUrl
      ? { name: "Current cover", dataUrl: b.coverUrl, width: 600, height: 900 }
      : null,
    pricing: {
      mode: paid ? "paid" : "free",
      currency: b.currency,
      amount: paid ? String(regular) : "",
      promoEnabled: !!b.compareAtPrice,
      promoAmount: b.compareAtPrice ? String(b.price) : "",
    },
    rights: { ...emptyRights },
  };
}

/** Applies the edited draft to the book. Keeps the old price if the new one isn't valid yet. */
export function draftToBook(
  base: SellerBook,
  d: BookDraft,
  status: SellerBookStatus
): SellerBook {
  const price = pricingPreview(d.pricing);

  const next: SellerBook = {
    ...base,
    title: d.title.trim(),
    subtitle: d.subtitle.trim() || undefined,
    description: d.description,
    category: d.category,
    language: d.language,
    tags: d.tags,
    file: d.file,
    coverUrl: d.cover?.dataUrl,
    price: price ? price.price : base.price,
    compareAtPrice: price ? price.compareAtPrice : base.compareAtPrice,
    currency: price ? price.currency : base.currency,
    status,
    updatedAt: new Date().toISOString(),
  };

  if (status === "pending") delete next.rejectionReason;
  return next;
}