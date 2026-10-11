import type { BookDetail, BookFormat } from "@/types/book-detail";
import { pricingPreview, type BookDraft } from "@/types/publish";

export const AUTHOR_BIO_PLACEHOLDER =
  "Your author bio from your seller profile will appear here.";

interface PreviewAuthor {
  name: string;
  avatarUrl?: string | null;
}

/**
 * Maps the wizard draft to the shape the book detail page expects, so the
 * preview can reuse the real components. Replace with the API response in Phase 13.
 */
export function draftToBookDetail(draft: BookDraft, author: PreviewAuthor): BookDetail {
  const price = pricingPreview(draft.pricing) ?? { price: 0, currency: "USD" as const };
  const format: BookFormat = draft.file?.format === "epub" ? "EPUB" : "PDF";

  return {
    id: "draft-preview",
    title: draft.title.trim() || "Untitled book",
    subtitle: draft.subtitle.trim() || undefined,
    author: {
      id: "preview-author",
      name: author.name,
      bio: AUTHOR_BIO_PLACEHOLDER,
      avatarUrl: author.avatarUrl ?? undefined,
      followers: 0,
      books: [],
    },
    category: draft.category || "Uncategorized",
    description: draft.description.trim(),
    coverUrl: draft.cover?.dataUrl,
    price: price.price,
    compareAtPrice: price.compareAtPrice,
    currency: price.currency,
    rating: 0,
    ratingCount: 0,
    format,
    pages: 0, // unknown until the file is processed
    language: draft.language || "—",
    publishedAt: new Date().toISOString(), // real date is set when a reviewer approves
    previewPages: [],
    reviews: [],
  };
}