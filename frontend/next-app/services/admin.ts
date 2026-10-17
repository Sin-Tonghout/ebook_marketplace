import { assignableRoles, canManageUser, ROLE_LABEL } from "@/lib/admin-users";
import { api } from "@/lib/api";
import { addAuditEntry } from "@/services/audit";
import { authService } from "@/services/auth.service";
import { getReports } from "@/services/reports";
import type { AdminStats, AdminUser, ModerationAction } from "@/types/admin";
import type { UserRole } from "@/types/auth";
import type { SellerBook } from "@/types/seller";

export interface Actor {
  id: string;
  name: string;
}

export interface UserActor extends Actor {
  role: UserRole;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function findUser(id: string): AdminUser {
  const found = authService.listUsers().find((u) => u.id === id);
  if (!found) throw new Error("User not found.");
  return found;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const stats = await api<AdminStats>("/admin/stats");
    // Reports are still stored in the browser until the reports step.
    const openReports = getReports().filter((r) => r.status === "open").length;
    return { ...stats, openReports };
  },

  /** Every book except private drafts, newest activity first. */
  async getModerationBooks(): Promise<SellerBook[]> {
    const { books } = await api<{ books: SellerBook[] }>("/admin/books");
    return books;
  },

  /**
   * The API checks the rules, saves the decision, and writes the audit log and
   * the seller's notification. Throws with a readable message on failure.
   */
  async moderate(
    book: SellerBook,
    action: ModerationAction,
    reason: string
  ): Promise<SellerBook> {
    const { book: updated } = await api<{ book: SellerBook }>(
      `/admin/books/${encodeURIComponent(book.id)}/moderate`,
      { method: "POST", body: { action, reason: reason.trim() } }
    );
    return updated;
  },

  // ---- Users (12.4): still the local mock until the admin users API ----

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