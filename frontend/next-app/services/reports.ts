import type { BookReport, ReportReason } from "@/types/report";

const KEY = "folio.reports.v1";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function daysAgo(n: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export function seedReports(): BookReport[] {
  return [
    {
      id: "rp-1",
      bookId: "sb-2",
      bookTitle: "Letters from Tonlé Sap",
      reason: "copyright",
      details: "One of the essays looks copied from a published collection I own.",
      reporterName: "Maya L.",
      status: "open",
      createdAt: daysAgo(1, 9),
    },
    {
      id: "rp-2",
      bookId: "sb-1",
      bookTitle: "The Quiet Architecture of Habits",
      reason: "misleading",
      details: "The description promises a 21-day plan, but the book has no plan.",
      reporterName: "Ben W.",
      status: "open",
      createdAt: daysAgo(2, 15),
    },
    {
      id: "rp-3",
      bookId: "sb-3",
      bookTitle: "Typography for Storytellers",
      reason: "spam",
      details: "The author keeps posting the same promotional links in reviews.",
      reporterName: "Linh T.",
      status: "open",
      createdAt: daysAgo(3, 12),
    },
    {
      id: "rp-4",
      bookId: "sb-1",
      bookTitle: "The Quiet Architecture of Habits",
      reason: "inappropriate",
      details: "Chapter 4 contains language that doesn't match the age rating.",
      reporterName: "Tom R.",
      status: "resolved",
      createdAt: daysAgo(9, 11),
      resolution: "Author edited the chapter and re-uploaded the file.",
      handledBy: "Admin Demo",
      handledAt: daysAgo(8, 10),
    },
    {
      id: "rp-5",
      bookId: "sb-2",
      bookTitle: "Letters from Tonlé Sap",
      reason: "other",
      details: "The cover looks a bit blurry on my phone.",
      reporterName: "Alex M.",
      status: "dismissed",
      createdAt: daysAgo(12, 14),
      resolution: "Not a policy issue. Passed on to the seller as feedback.",
      handledBy: "Admin Demo",
      handledAt: daysAgo(11, 9),
    },
  ];
}

export function getReports(): BookReport[] {
  if (typeof window === "undefined") return seedReports();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BookReport[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* fall through to the seed list */
  }
  return seedReports();
}

export function saveReports(list: BookReport[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export const reportService = {
  async submit(input: {
    bookId: string;
    bookTitle: string;
    reason: ReportReason;
    details: string;
    reporterName: string;
  }): Promise<BookReport> {
    await delay(600);
    const details = input.details.trim();
    if (details.length < 10) {
      throw new Error("Tell us a bit more (at least 10 characters).");
    }
    if (details.length > 500) {
      throw new Error("Please keep it under 500 characters.");
    }
    const report: BookReport = {
      id: `rp-${Date.now()}`,
      bookId: input.bookId,
      bookTitle: input.bookTitle,
      reason: input.reason,
      details,
      reporterName: input.reporterName,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    if (!saveReports([report, ...getReports()])) {
      throw new Error("We couldn't send your report. Please try again.");
    }
    return report;
  },
};