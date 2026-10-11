export type ReportReason =
  | "copyright"
  | "inappropriate"
  | "spam"
  | "misleading"
  | "other";

export type ReportStatus = "open" | "resolved" | "dismissed";

export interface BookReport {
  id: string;
  bookId: string;
  bookTitle: string;
  reason: ReportReason;
  details: string;
  reporterName: string;
  status: ReportStatus;
  createdAt: string; // ISO date
  resolution?: string; // admin note
  handledBy?: string;
  handledAt?: string; // ISO date
}