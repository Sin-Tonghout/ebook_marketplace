"use client";

import { useAuth } from "@/components/auth/AuthProvider";

export function SuspendedBanner() {
  const { state } = useAuth();
  if (state !== "suspended") return null;

  return (
    <div role="alert" className="bg-[var(--danger)] px-4 py-2 text-center text-sm text-white">
      Your account is suspended. You can browse, but buying and publishing are disabled.
    </div>
  );
}