import { api } from "@/lib/api";
import { pricingPreview, type BookDraft } from "@/types/publish";

export interface SubmittedBookResult {
  id: string;
  status: string;
  submittedAt: string;
}

/**
 * Sends the finished wizard draft to the API. The book file and the cover were
 * already uploaded, so only their upload ids are sent here.
 */
export async function submitBook(draft: BookDraft): Promise<SubmittedBookResult> {
  const price = pricingPreview(draft.pricing);
  if (!price || !draft.file || !draft.rights.basis) {
    throw new Error("Some steps still need attention. Go back to the preview to fix them.");
  }
  if (!draft.file.uploadId) {
    throw new Error("Please upload your book file again. It wasn't saved on the server.");
  }
  if (draft.cover && !draft.cover.uploadId) {
    throw new Error("Please add your cover again. It wasn't saved on the server.");
  }

  const { book } = await api<{ book: SubmittedBookResult }>("/seller/books", {
    method: "POST",
    body: {
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      description: draft.description.trim(),
      category: draft.category,
      language: draft.language,
      tags: draft.tags,
      fileUploadId: draft.file.uploadId,
      ...(draft.cover?.uploadId ? { coverUploadId: draft.cover.uploadId } : {}),
      price: price.price,
      ...(price.compareAtPrice !== undefined ? { compareAtPrice: price.compareAtPrice } : {}),
      currency: price.currency,
      rights: {
        basis: draft.rights.basis,
        details: draft.rights.details.trim(),
        confirmed: draft.rights.confirmed,
      },
    },
  });
  return book;
}