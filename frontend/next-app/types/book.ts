export type Currency = "USD" | "KHR";

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string | null;
  bookCount: number;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: Pick<Author, "id" | "name">;
  coverUrl?: string | null;
  price: number; // 0 = free
  compareAtPrice?: number; // original price when discounted
  currency: Currency;
  rating: number; // 0–5
  ratingCount: number;
  category: string;
  language: "English" | "Khmer";
  format: "PDF" | "EPUB";
  description?: string;
  pages?: number;
  publishedAt?: string; // ISO date, e.g. "2026-03-14"
}