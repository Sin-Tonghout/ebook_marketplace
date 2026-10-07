"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

export function UserMenu() {
  const { user, state, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click and Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Reserve space while loading so the navbar doesn't jump
  if (state === "loading") {
    return <div className="h-9 w-24" aria-hidden />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Sign in
        </Link>
        <Link href="/register">
          <Button>Get started</Button>
        </Link>
      </div>
    );
  }

  const isSeller = user.role === "seller" || user.role === "admin" || user.role === "super_admin";
  const isAdmin = user.role === "admin" || user.role === "super_admin";
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const itemClass =
    "block w-full px-4 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-soft)]";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-[var(--background)] transition-transform duration-150 hover:scale-105"
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2 shadow-lg"
        >
          <div className="border-b border-[var(--border)] px-4 pb-3 pt-1">
            <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
            <p className="truncate text-xs text-[var(--text-secondary)]">{user.email}</p>
            {state === "suspended" && (
              <p className="mt-1 text-xs font-medium text-[var(--danger)]">Suspended</p>
            )}
          </div>

          <Link role="menuitem" href="/library" className={itemClass} onClick={() => setOpen(false)}>
            My library
          </Link>
          <Link role="menuitem" href="/profile" className={itemClass} onClick={() => setOpen(false)}>
            Profile
          </Link>

          {isSeller ? (
            <Link role="menuitem" href="/seller" className={itemClass} onClick={() => setOpen(false)}>
              Seller dashboard
            </Link>
          ) : (
            <Link role="menuitem" href="/become-seller" className={itemClass} onClick={() => setOpen(false)}>
              Become a seller
            </Link>
          )}

          {isAdmin && (
            <Link role="menuitem" href="/admin" className={itemClass} onClick={() => setOpen(false)}>
              Admin
            </Link>
          )}

          <button
            role="menuitem"
            type="button"
            className={`${itemClass} border-t border-[var(--border)]`}
            onClick={async () => {
              setOpen(false);
              await logout();
              router.push("/");
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}