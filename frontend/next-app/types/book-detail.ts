export type BookFormat = "PDF" | "EPUB";

export interface BookPreviewPage {
  chapter?: string;
  text: string;

}

export interface BookAuthor {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  followers: number;
  books: { id: string; title: string; coverUrl?: string; price: number; currency: "USD" | "KHR" }[];
}
export interface BookReview {
  id: string;
  name: string;
  rating: number; // 1-5
  title: string;
  body: string;
  createdAt: string; // ISO date
}

export interface RelatedBook {
  id: string;
  title: string;
  authorName: string;
  coverUrl?: string;
  price: number;
  currency: "USD" | "KHR";
  rating: number;
}

export interface BookDetail {
  id: string;
  title: string;
  subtitle?: string;
//   author: { id: string; name: string };
 author: BookAuthor;
  category: string;
  description: string;
  coverUrl?: string;
  price: number; // 0 = free
  currency: "USD" | "KHR";
  rating: number;
  ratingCount: number;
  format: BookFormat;
  pages: number;
  language: string;
  publishedAt: string; // ISO date
  previewPages: BookPreviewPage[];
  reviews: BookReview[];
}



