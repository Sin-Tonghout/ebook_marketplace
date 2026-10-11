import type { UserRole } from "@/types/auth";

export const ROLE_LABEL: Record<UserRole, string> = {
  user: "Reader",
  seller: "Seller",
  admin: "Admin",
  super_admin: "Super admin",
};

type Who = { id: string; role: UserRole };

/** Nobody manages themselves; admins manage readers and sellers only. */
export function canManageUser(actor: Who, target: Who): boolean {
  if (actor.id === target.id) return false;
  if (actor.role === "super_admin") return true;
  return target.role === "user" || target.role === "seller";
}

export function assignableRoles(actorRole: UserRole): UserRole[] {
  return actorRole === "super_admin"
    ? ["user", "seller", "admin", "super_admin"]
    : ["user", "seller"];
}