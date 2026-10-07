"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const CATEGORIES = [
  "Fiction",
  "Non-fiction",
  "Technology",
  "Design",
  "Business",
  "Science",
  "History",
  "Poetry",
  "Self-growth",
  "Children",
];

// Placeholder numbers. Phase 8 replaces these with real reading data.
const MOCK_STATS = [
  { label: "Books owned", value: "0" },
  { label: "Books finished", value: "0" },
  { label: "Hours read", value: "0" },
  { label: "Day streak", value: "0" },
];

export function ProfileView() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [cats, setCats] = useState<string[]>(user?.favoriteCategories ?? []);
  const [nameError, setNameError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  if (!user) return null;

  const dirty =
    name !== user.name ||
    bio !== (user.bio ?? "") ||
    cats.join("|") !== (user.favoriteCategories ?? []).join("|");

  function toggle(cat: string) {
    setStatus("idle");
    setCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setNameError(undefined);
    if (!name.trim()) {
      setNameError("Name can't be empty.");
      return;
    }
    setStatus("saving");
    try {
      await updateProfile({ name, bio, favoriteCategories: cats });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="flex items-center gap-6">
        <UserAvatar name={user.name} src={user.avatarUrl} />
        <div>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">{user.name}</h1>
          <p className="text-[var(--text-secondary)]">{user.email}</p>
        </div>
      </div>

      {/* Reading stats */}
      <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {MOCK_STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <dd className="font-serif text-3xl text-[var(--text-primary)]">{s.value}</dd>
            <dt className="mt-1 text-xs text-[var(--text-secondary)]">{s.label}</dt>
          </div>
        ))}
      </dl>

      {/* Edit form */}
      <form onSubmit={onSubmit} noValidate className="mt-12 space-y-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">Your details</h2>

        <Input
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setStatus("idle");
          }}
          error={nameError}
        />

        <Input label="Email" value={user.email} disabled readOnly />

        <div>
          <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            maxLength={280}
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              setStatus("idle");
            }}
            placeholder="A line or two about what you love to read."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-colors duration-150 focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
          />
          <p className="mt-1 text-right text-xs text-[var(--text-secondary)]">{bio.length}/280</p>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-[var(--text-primary)]">
            Favorite categories
          </legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = cats.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(cat)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-150 ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--background)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex items-center gap-4">
          <Button type="submit" loading={status === "saving"} disabled={!dirty || status === "saving"}>
            Save changes
          </Button>
          <span role="status" aria-live="polite" className="text-sm">
            {status === "saved" && <span className="text-[var(--success)]">Saved</span>}
            {status === "error" && (
              <span className="text-[var(--danger)]">Couldn't save. Please try again.</span>
            )}
          </span>
        </div>
      </form>
    </div>
  );
}