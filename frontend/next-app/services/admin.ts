import { mockAdminStats } from "@/lib/mock/admin";
import { assignableRoles, canManageUser, ROLE_LABEL } from "@/lib/admin-users";
import { addAuditEntry } from "@/services/audit";
import { authService } from "@/services/auth.service";
import { fetchSellerOverview, updateSellerBook } from "@/services/seller";
import type { AdminStats, AdminUser, ModerationAction } from "@/types/admin";
import type { UserRole } from "@/types/auth";
import type { SellerBook } from "@/types/seller";
import { getReports } from "@/services/reports";

export interface Actor {
  id: string;
  name: string;
}

export interface UserActor extends Actor {
  role: UserRole;
}

const ALLOWED_FROM: Record<ModerationAction, SellerBook["status"]> = {
  approve: "pending",
  reject: "pending",
  request_changes: "pending",
  unpublish: "published",
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function findUser(id: string): AdminUser {
  const found = authService.listUsers().find((u) => u.id === id);
  if (!found) throw new Error("User not found.");
  return found;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const openReports = getReports().filter((r) => r.status === "open").length;
    try {
      const { books } = await fetchSellerOverview();
      return {
        ...mockAdminStats,
        openReports,
        pendingReviews: books.filter((b) => b.status === "pending").length,
      };
    } catch {
      return { ...mockAdminStats, openReports };
    }
  },

  /** Every book except private drafts, newest activity first. */
  async getModerationBooks(): Promise<SellerBook[]> {
    const { books } = await fetchSellerOverview();
    return books
      .filter((b) => b.status !== "draft")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async moderate(
    book: SellerBook,
    action: ModerationAction,
    reason: string,
    actor: Actor
  ): Promise<SellerBook> {
    if (book.status !== ALLOWED_FROM[action]) {
      throw new Error("This book was already changed. Reload the queue.");
    }
    const note = reason.trim();
    if ((action === "reject" || action === "request_changes") && note.length < 10) {
      throw new Error("Please write a reason of at least 10 characters.");
    }

    let next: SellerBook;
    switch (action) {
      case "approve":
        next = { ...book, status: "published", rejectionReason: undefined };
        break;
      case "reject":
        next = { ...book, status: "rejected", rejectionReason: note };
        break;
      case "request_changes":
        next = {
          ...book,
          status: "rejected",
          rejectionReason: `Changes requested: ${note}`,
        };
        break;
      case "unpublish":
        next = { ...book, status: "archived", rejectionReason: undefined };
        break;
    }
    next = { ...next, updatedAt: new Date().toISOString() };

    if (!updateSellerBook(next)) {
      throw new Error("Couldn't save the decision. Browser storage is full.");
    }

    addAuditEntry({
      actorId: actor.id,
      actorName: actor.name,
      action: `book.${action}`,
      targetType: "book",
      targetId: book.id,
      targetLabel: book.title,
      detail: note || undefined,
    });

    return next;
  },

  // ---- Users (12.4) ----

  async getUsers(): Promise<AdminUser[]> {
    await delay(400);
    return authService.listUsers();
  },

  async setUserStatus(
    target: AdminUser,
    status: "active" | "suspended",
    actor: UserActor
  ): Promise<AdminUser> {
    if (!canManageUser(actor, target)) {
      throw new Error("You don't have permission to manage this account.");
    }
    await authService.updateUserAccess(target.id, { status });
    addAuditEntry({
      actorId: actor.id,
      actorName: actor.name,
      action: status === "suspended" ? "user.suspend" : "user.reactivate",
      targetType: "user",
      targetId: target.id,
      targetLabel: target.name,
    });
    return findUser(target.id);
  },

  async setUserRole(
    target: AdminUser,
    role: UserRole,
    actor: UserActor
  ): Promise<AdminUser> {
    if (!canManageUser(actor, target)) {
      throw new Error("You don't have permission to manage this account.");
    }
    if (!assignableRoles(actor.role).includes(role)) {
      throw new Error("You can't assign that role.");
    }
    await authService.updateUserAccess(target.id, { role });
    addAuditEntry({
      actorId: actor.id,
      actorName: actor.name,
      action: "user.role",
      targetType: "user",
      targetId: target.id,
      targetLabel: target.name,
      detail: `${ROLE_LABEL[target.role]} → ${ROLE_LABEL[role]}`,
    });
    return findUser(target.id);
  },
};