"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { passwordStrength } from "@/lib/password";

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = passwordStrength(password);

  // Missing or expired link: explain recovery instead of showing a dead form
  if (!token || token === "expired" || formError === "This reset link has expired.") {
    return (
      <div role="alert" className="space-y-6">
        <p className="rounded-lg bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
          This reset link has expired or is invalid.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full">Request a new link</Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div role="status" className="space-y-6">
        <p className="rounded-lg bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">
          Your password has been updated.
        </p>
        <Button className="w-full" onClick={() => router.push("/login")}>
          Continue to sign in
        </Button>
      </div>
    );
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setFormError(null);

    const e: typeof errors = {};
    if (password.length < 8) e.password = "Use at least 8 characters.";
    if (confirm !== password) e.confirm = "Passwords don't match.";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        {password && (
          <div className="mt-2" aria-live="polite">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                    i <= strength.score ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">{strength.label}</p>
          </div>
        )}
      </div>

      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
      />

      {formError && formError !== "This reset link has expired." && (
        <p role="alert" className="rounded-lg bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
          {formError}
        </p>
      )}

      <Button type="submit" className="w-full" loading={loading}>
        Update password
      </Button>
    </form>
  );
}