"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { BecomeSellerFlow } from "@/components/auth/BecomeSellerFlow";

export default function BecomeSellerPage() {
  return (
    <RequireAuth>
      <main className="mx-auto max-w-xl px-6 py-16">
        <BecomeSellerFlow />
      </main>
    </RequireAuth>
  );
}