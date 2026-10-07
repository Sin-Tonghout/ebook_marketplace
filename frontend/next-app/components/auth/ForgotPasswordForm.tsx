"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="space-y-6">
        <p className="rounded-lg bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          Check your inbox and spam folder. The link expires in 1 hour.
        </p>
        {/* Dev shortcut, remove in Phase 13 when real emails exist */}
        <Link href="/reset-password?token=demo" className="block text-sm underline underline-offset-4">
          (Demo) Open the reset link
        </Link>
        <Button variant="secondary" className="w-full" onClick={() => setSent(false)}>
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error ?? undefined}
      />

      <Button type="submit" className="w-full" loading={loading}>
        Send reset link
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        <Link href="/login" className="font-medium text-[var(--text-primary)] underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}