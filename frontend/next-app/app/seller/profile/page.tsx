"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { useAuth } from "@/components/auth/AuthProvider";
import { ProfilePreview } from "@/components/seller/ProfilePreview";
import { SellerShell } from "@/components/seller/SellerShell";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { useSellerData } from "@/hooks/useSellerData";
import {
  BIO_MAX,
  cleanProfile,
  defaultProfile,
  validateProfile,
} from "@/lib/seller-profile";
import { computeSellerStats } from "@/lib/seller-stats";
import { readSellerProfile, saveSellerProfile } from "@/services/seller";
import type { SessionUser } from "@/types/auth";
import type { SellerBook, SellerPublicProfile } from "@/types/seller";

type Field = keyof SellerPublicProfile;
const FIELD_ORDER: Field[] = ["displayName", "bio", "website", "instagram", "x"];

function ProfileEditor({
  user,
  books,
  rating,
}: {
  user: SessionUser | null;
  books: SellerBook[];
  rating: number;
}) {
  const { toast } = useToast();
  const userId = user?.id ?? "anon";

  const [saved, setSaved] = useState<SellerPublicProfile>(
    () => readSellerProfile(userId) ?? defaultProfile(user)
  );
  const [form, setForm] = useState<SellerPublicProfile>(saved);
  const [tried, setTried] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errors = validateProfile(form);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = (patch: Partial<SellerPublicProfile>) =>
    setForm((f) => ({ ...f, ...patch }));
  const touch = (k: Field) => setTouched((t) => ({ ...t, [k]: true }));
  const err = (k: Field) => (touched[k] || tried ? errors[k] : undefined);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (saving) return;

    const firstError = FIELD_ORDER.find((k) => errors[k]);
    if (firstError) {
      setTried(true);
      document.getElementById(firstError)?.focus();
      return;
    }

    setSaving(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 500));

    const clean = cleanProfile(form);
    const ok = saveSellerProfile(userId, clean);
    setSaving(false);

    if (!ok) {
      setError("We couldn't save your profile. Please try again.");
      return;
    }
    setSaved(clean);
    setForm(clean);
    toast({ title: "Profile saved" });
  }

  function onDiscard() {
    setForm(saved);
    setTried(false);
    setTouched({});
    setError(null);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <header>
          <h1 className="type-h2">Seller profile</h1>
          <p className="mt-2 type-body text-muted">
            This is the public face of your books. Changes show in the preview
            as you type.
          </p>
        </header>

        <Input
          id="displayName"
          label="Display name"
          placeholder="How your name appears on your books"
          value={form.displayName}
          onChange={(e) => set({ displayName: e.target.value })}
          onBlur={() => touch("displayName")}
          error={err("displayName")}
        />

        <Textarea
          id="bio"
          label="Bio"
          rows={5}
          placeholder="Who are you, and what do you write about?"
          value={form.bio}
          onChange={(e) => set({ bio: e.target.value })}
          onBlur={() => touch("bio")}
          hint={`${form.bio.length}/${BIO_MAX} characters`}
          error={err("bio")}
        />

        <div className="space-y-6">
          <h2 className="type-h4">Links</h2>
          <Input
            id="website"
            label="Website (optional)"
            inputMode="url"
            placeholder="https://yourname.com"
            value={form.website}
            onChange={(e) => set({ website: e.target.value })}
            onBlur={() => touch("website")}
            error={err("website")}
          />
          <Input
            id="instagram"
            label="Instagram (optional)"
            inputMode="url"
            placeholder="https://instagram.com/yourname"
            value={form.instagram}
            onChange={(e) => set({ instagram: e.target.value })}
            onBlur={() => touch("instagram")}
            error={err("instagram")}
          />
          <Input
            id="x"
            label="X (optional)"
            inputMode="url"
            placeholder="https://x.com/yourname"
            value={form.x}
            onChange={(e) => set({ x: e.target.value })}
            onBlur={() => touch("x")}
            error={err("x")}
          />
        </div>

        <p className="type-body-sm text-muted">
          Your photo comes from your account.{" "}
          <Link href="/profile" className="underline underline-offset-4">
            Change it in profile settings
          </Link>
          .
        </p>

        {error && (
          <p role="alert" className="type-body-sm text-danger">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button type="submit" disabled={saving || !dirty}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onDiscard}
            disabled={saving || !dirty}
          >
            Discard changes
          </Button>
          <span className="type-body-sm text-muted" aria-live="polite">
            {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
        </div>
      </form>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ProfilePreview
          profile={form}
          fallbackName={user?.name ?? ""}
          avatarUrl={user?.avatarUrl}
          books={books}
          rating={rating}
        />
      </div>
    </div>
  );
}

export default function SellerProfilePage() {
  const { user } = useAuth();
  const result = useSellerData();

  if (result.status === "loading") {
    return (
      <SellerShell>
        <div aria-busy="true" className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </SellerShell>
    );
  }

  if (result.status === "error") {
    return (
      <SellerShell>
        <ErrorState
          title="We couldn't load your profile"
          description="Your profile is safe. Please try again."
          onRetry={result.reload}
        />
      </SellerShell>
    );
  }

  const { books } = result.data;
  const published = books.filter((b) => b.status === "published");
  const { rating } = computeSellerStats(books);

  return (
    <SellerShell>
      <ProfileEditor
        key={user?.id}
        user={user}
        books={published}
        rating={rating}
      />
    </SellerShell>
  );
}