import { adminService, type Actor } from "@/services/admin";
import { addAuditEntry } from "@/services/audit";
import { getReports, saveReports } from "@/services/reports";
import { fetchSellerOverview } from "@/services/seller";
import type { BookReport } from "@/types/report";

export const reportAdmin = {
  /** Reports plus the ids of published seller books (the ones we can unpublish). */
  async list(): Promise<{ reports: BookReport[]; unpublishable: string[] }> {
    const { books } = await fetchSellerOverview();
    return {
      reports: getReports().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      unpublishable: books.filter((b) => b.status === "published").map((b) => b.id),
    };
  },

  async resolve(
    report: BookReport,
    status: "resolved" | "dismissed",
    note: string,
    unpublish: boolean,
    actor: Actor
  ): Promise<{ report: BookReport; unpublishedBookId?: string }> {
    const all = getReports();
    const current = all.find((r) => r.id === report.id);
    if (!current || current.status !== "open") {
      throw new Error("This report was already handled. Reload the page.");
    }
    const text = note.trim();

    let unpublishedBookId: string | undefined;
    if (unpublish) {
      const { books } = await fetchSellerOverview();
      const book = books.find((b) => b.id === current.bookId && b.status === "published");
      if (!book) throw new Error("This book can't be unpublished from here.");
      await adminService.moderate(
        book,
        "unpublish",
        text || "Unpublished after a report.",
        actor
      );
      unpublishedBookId = book.id;
    }

    const updated: BookReport = {
      ...current,
      status,
      resolution: text || undefined,
      handledBy: actor.name,
      handledAt: new Date().toISOString(),
    };
    if (!saveReports(all.map((r) => (r.id === updated.id ? updated : r)))) {
      throw new Error("Couldn't save the decision. Browser storage is full.");
    }

    addAuditEntry({
      actorId: actor.id,
      actorName: actor.name,
      action: status === "resolved" ? "report.resolve" : "report.dismiss",
      targetType: "report",
      targetId: updated.id,
      targetLabel: `${updated.bookTitle} (${updated.reason})`,
      detail: text || undefined,
    });

    return { report: updated, unpublishedBookId };
  },
};