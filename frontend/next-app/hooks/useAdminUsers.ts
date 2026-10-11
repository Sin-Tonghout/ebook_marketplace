"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { adminService, type UserActor } from "@/services/admin";
import type { AdminUser } from "@/types/admin";
import type { UserRole } from "@/types/auth";

export function useAdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const actor: UserActor | null = useMemo(
    () => (user ? { id: user.id, name: user.name, role: user.role } : null),
    [user]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setUsers(await adminService.getUsers());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const replace = (updated: AdminUser) =>
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

  /** Both throw on failure so the row can show the message inline. */
  const setStatus = useCallback(
    async (target: AdminUser, status: "active" | "suspended") => {
      if (!actor) throw new Error("Please sign in again.");
      const updated = await adminService.setUserStatus(target, status, actor);
      replace(updated);
      return updated;
    },
    [actor]
  );

  const setRole = useCallback(
    async (target: AdminUser, role: UserRole) => {
      if (!actor) throw new Error("Please sign in again.");
      const updated = await adminService.setUserRole(target, role, actor);
      replace(updated);
      return updated;
    },
    [actor]
  );

  return { users, loading, error, retry: load, actor, setStatus, setRole };
}