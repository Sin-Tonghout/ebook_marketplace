"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { assignableRoles, canManageUser, ROLE_LABEL } from "@/lib/admin-users";
import type { AdminUser } from "@/types/admin";
import type { UserRole } from "@/types/auth";

const selectClass =
  "min-h-9 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function UserRow({
  user,
  actor,
  onStatus,
  onRole,
}: {
  user: AdminUser;
  actor: { id: string; role: UserRole };
  onStatus: (user: AdminUser, status: "active" | "suspended") => Promise<unknown>;
  onRole: (user: AdminUser, role: UserRole) => Promise<unknown>;
}) {
  const reduce = useReducedMotion();
  const [inspect, setInspect] = useState(false);
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole>(user.role);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelf = user.id === actor.id;
  const manageable = canManageUser(actor, user);
  const suspended = user.status === "suspended";
  const detailsId = `user-${user.id}`;

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setConfirmSuspend(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-border bg-surface p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start gap-4">
        <Avatar name={user.name} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-medium text-foreground">{user.name}</h2>
            {isSelf && <span className="type-caption text-muted">(you)</span>}
            <Badge variant="neutral">{ROLE_LABEL[user.role]}</Badge>
            <Badge variant={suspended ? "rejected" : "published"} dot>
              {suspended ? "Suspended" : "Active"}
            </Badge>
          </div>
          <p className="mt-1 truncate text-sm text-muted">{user.email}</p>

          <button
            type="button"
            onClick={() => setInspect((v) => !v)}
            aria-expanded={inspect}
            aria-controls={detailsId}
            className="mt-2 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {inspect ? "Hide profile" : "View profile"}
          </button>

          {inspect && (
            <dl id={detailsId} className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="type-label text-muted">User ID</dt>
                <dd className="mt-1 text-foreground">{user.id}</dd>
              </div>
              <div>
                <dt className="type-label text-muted">Account</dt>
                <dd className="mt-1 text-foreground">
                  {user.source === "demo" ? "Demo account" : "Registered account"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="type-label text-muted">Bio</dt>
                <dd className="mt-1 text-foreground">{user.bio || "No bio."}</dd>
              </div>
              <div>
                <dt className="type-label text-muted">Favorite categories</dt>
                <dd className="mt-1 text-foreground">
                  {user.favoriteCategories && user.favoriteCategories.length > 0
                    ? user.favoriteCategories.join(", ")
                    : "None"}
                </dd>
              </div>
              <div>
                <dt className="type-label text-muted">Seller name</dt>
                <dd className="mt-1 text-foreground">
                  {user.sellerProfile?.displayName || "Not a seller"}
                </dd>
              </div>
            </dl>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {error}
            </p>
          )}

          {manageable ? (
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`role-${user.id}`}>
                  Role for {user.name}
                </label>
                <select
                  id={`role-${user.id}`}
                  value={pendingRole}
                  disabled={busy}
                  onChange={(e) => setPendingRole(e.target.value as UserRole)}
                  className={selectClass}
                >
                  {assignableRoles(actor.role).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </option>
                  ))}
                </select>

                {pendingRole !== user.role && (
                  <>
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => run(() => onRole(user, pendingRole))}
                    >
                      {busy ? "Saving…" : "Save role"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => setPendingRole(user.role)}
                    >
                      Cancel
                    </Button>
                  </>
                )}

                {pendingRole === user.role && !confirmSuspend && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() =>
                      suspended
                        ? run(() => onStatus(user, "active"))
                        : setConfirmSuspend(true)
                    }
                  >
                    {suspended ? (busy ? "Saving…" : "Reactivate") : "Suspend"}
                  </Button>
                )}
              </div>

              {confirmSuspend && (
                <div className="rounded-lg bg-surface-soft p-3">
                  <p className="text-sm text-foreground">
                    Suspend {user.name}? They'll be marked as suspended the next
                    time they load the site.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => run(() => onStatus(user, "suspended"))}
                    >
                      {busy ? "Saving…" : "Suspend account"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => setConfirmSuspend(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              {isSelf
                ? "You can't change your own account."
                : "Only a super admin can manage admin accounts."}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}