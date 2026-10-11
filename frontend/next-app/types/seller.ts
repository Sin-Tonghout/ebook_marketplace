import type { Currency } from "@/types/book";
import type { BookFileMeta } from "@/types/publish";
// Matches the Badge variants: draft | pending | published | rejected | archived
export type SellerBookStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "archived";

export interface SellerBook {
  id: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
  status: SellerBookStatus;
  price: number; // 0 = free
  compareAtPrice?: number; // original price when discounted
  currency: Currency;
  sales: number;
  revenue: number; // always USD (platform reporting currency)
  downloads: number;
  views: number;
  rating: number; // 0 when no reviews
  reviewCount: number;
  updatedAt: string; // ISO date
    description?: string;
  category?: string;
  language?: string;
  tags?: string[];
  file?: BookFileMeta | null;
  rejectionReason?: string;
}

export type SellerOrderStatus = "paid" | "pending" | "failed" | "refunded";

export interface SellerOrder {
  id: string;
  bookId: string;
  bookTitle: string;
  buyerName: string;
  amount: number;
  currency: Currency;
  status: SellerOrderStatus;
  createdAt: string; // ISO date
}

export interface SalesPoint {
  date: string; // YYYY-MM-DD
  sales: number;
  revenue: number;
  downloads: number;
}

export interface SellerOverview {
  books: SellerBook[];
  orders: SellerOrder[];
  series: SalesPoint[]; // last 30 days, oldest first
}

export interface SellerStats {
  books: number;
  sales: number;
  downloads: number;
  revenue: number;
  rating: number; // weighted by review count, 0 if none
  bestBook: SellerBook | null;
}

export interface SellerPublicProfile {
  displayName: string;
  bio: string;
  website: string; // empty string = not set
  instagram: string;
  x: string;
}