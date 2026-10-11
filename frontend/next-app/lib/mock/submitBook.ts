import { pricingPreview, type BookDraft } from "@/types/publish";
import { addSubmittedBook } from "@/services/seller";

export interface SubmitResult {
  id: string;
  status: "submitted";
  submittedAt: string;
}

/**
 * Fake submission. A title containing "fail" simulates an error.
 * In Phase 13 the server creates the book, sets the id and timestamps,
 * and moves its status from draft to submitted.
 */
export async function mockSubmitBook(draft: BookDraft): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (/fail/i.test(draft.title)) throw new Error("Mock submit failed");

  const result: SubmitResult = {
    id: `bk_${Date.now().toString(36)}`,
    status: "submitted",
    submittedAt: new Date().toISOString(),
  };

  const price = pricingPreview(draft.pricing);

  // Show the new book in the seller dashboard as "pending review"
  addSubmittedBook({
    id: result.id,
    title: draft.title.trim(),
    subtitle: draft.subtitle.trim() || undefined,
    coverUrl: draft.cover?.dataUrl,
    status: "pending",
    price: price?.price ?? 0,
    compareAtPrice: price?.compareAtPrice,
    currency: price?.currency ?? "USD",
    sales: 0,
    revenue: 0,
    downloads: 0,
    views: 0,
    rating: 0,
    reviewCount: 0,
    updatedAt: result.submittedAt,
        description: draft.description.trim(),
    category: draft.category,
    language: draft.language,
    tags: draft.tags,
    file: draft.file,
  });

  return result;
}