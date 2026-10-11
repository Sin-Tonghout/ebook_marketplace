import type { SessionUser } from "@/types/auth";

export interface AdminStats {
  users: number;
  books: number;
  pendingReviews: number;
  orders: number;
  revenue: number; // USD
  openReports: number;
}

export type ModerationAction =
  | "approve"
  | "reject"
  | "request_changes"
  | "unpublish";

export interface AuditEntry {
  id: string;
  actorId: string;
  actorName: string;
  action: string; // e.g. "book.approve", "user.suspend"
  targetType: "book" | "user" | "category" | "report";
  targetId: string;
  targetLabel: string;
  detail?: string;
  createdAt: string; // ISO date
}

export type AdminUser = SessionUser & { source: "demo" | "registered" };