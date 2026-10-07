"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/types/auth";

interface Props {
  children: ReactNode;
  /** If set, the user must have one of these roles. */
  roles?: UserRole[];
}

export function RequireAuth({ children, roles }: Props) {
  const { user, state } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state === "guest") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [state, router, pathname]);

  // Avoid flashing protected content while the session loads or redirects
  if (state === "loading" || state === "guest") return null;

  if (state === "suspended") {
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <h1 className="font-serif text-4xl">Your account is suspended</h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          You can't access this page right now. Contact support if you think this is a mistake.
        </p>
        <Link href="/" className="mt-6 inline-block underline underline-offset-4">
          Back to home
        </Link>
      </main>
    );
  }

  if (roles && user && !roles.includes(user.role)) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <h1 className="font-serif text-4xl">This area isn't available to your account</h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          You're signed in as {user.email}, but this page needs a different role.
        </p>
        <Link href="/" className="mt-6 inline-block underline underline-offset-4">
          Back to home
        </Link>
      </main>
    );
  }

  return <>{children}</>;
}