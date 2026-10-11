"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { UserRow } from "@/components/admin/UserRow";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { ROLE_LABEL } from "@/lib/admin-users";
import type { AdminUser } from "@/types/admin";
import type { UserRole } from "@/types/auth";

const selectClass =
  "min-h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function AdminUsersPage() {
  const { users, loading, error, retry, actor, setStatus, setRole } = useAdminUsers();
  const [query, setQuery] = useState("");
  const [role, setRoleFilter] = useState<UserRole | "all">("all");
  const [status, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [notice, setNotice] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (role === "all" || u.role === role) &&
        (status === "all" || u.status === status) &&
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  }, [users, query, role, status]);

  const filtersActive = query.trim() !== "" || role !== "all" || status !== "all";

  function clearFilters() {
    setQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  }

  async function handleStatus(user: AdminUser, next: "active" | "suspended") {
    await setStatus(user, next);
    setNotice(
      next === "suspended"
        ? `${user.name} was suspended.`
        : `${user.name} was reactivated.`
    );
  }

  async function handleRole(user: AdminUser, next: UserRole) {
    await setRole(user, next);
    setNotice(`${user.name} is now ${ROLE_LABEL[next]}.`);
  }

  return (
    <AdminShell>
      <header>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Users</h1>
        <p className="mt-2 text-muted">Search accounts, change roles and suspend users.</p>
      </header>

      {!loading && !error && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Search users"
              type="search"
              placeholder="Name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filter-role" className="sr-only">
              Filter by role
            </label>
            <select
              id="filter-role"
              value={role}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
              className={selectClass}
            >
              <option value="all">All roles</option>
              {(Object.keys(ROLE_LABEL) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-status" className="sr-only">
              Filter by status
            </label>
            <select
              id="filter-status"
              value={status}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "suspended")
              }
              className={selectClass}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      )}

      <div role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-foreground">
        {notice ??
          (!loading && !error
            ? `Showing ${visible.length} of ${users.length} users`
            : null)}
      </div>

      <section aria-label="Users" className="mt-4">
        {error ? (
          <ErrorState
            title="We couldn't load users."
            description="Please try again."
            onRetry={retry}
            retryLabel="Retry"
          />
        ) : loading || !actor ? (
          <div className="flex flex-col gap-4" aria-hidden>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-border bg-surface p-5">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="mt-3 h-4 w-1/2" />
                  <Skeleton className="mt-5 h-9 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            title="No users match."
            description="Try a different search or clear the filters."
            action={
              filtersActive ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {visible.map((u) => (
              <li key={u.id}>
                <UserRow user={u} actor={actor} onStatus={handleStatus} onRole={handleRole} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}