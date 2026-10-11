import { Globe, Link2, Star } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { Avatar } from "@/components/ui/Avatar";
import { isValidUrl } from "@/lib/seller-profile";
import type { SellerBook, SellerPublicProfile } from "@/types/seller";

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ProfilePreview({
  profile,
  fallbackName,
  avatarUrl,
  books,
  rating,
}: {
  profile: SellerPublicProfile;
  fallbackName: string;
  avatarUrl?: string | null;
  books: SellerBook[];
  rating: number;
}) {
  const name = profile.displayName.trim() || fallbackName || "Your name";
  const bio = profile.bio.trim();

  const links = [
    { label: "Website", url: profile.website.trim(), icon: Globe },
    { label: "Instagram", url: profile.instagram.trim(), icon: Link2 },
    { label: "X", url: profile.x.trim(), icon: Link2 },
  ].filter((l) => l.url && isValidUrl(l.url));

  return (
    <aside
      aria-label="Profile preview"
      className="rounded-xl border border-border bg-surface p-6"
    >
      <p className="type-caption uppercase tracking-widest text-muted">
        How readers see you
      </p>

      <div className="mt-6 flex items-center gap-4">
        <Avatar name={name} src={avatarUrl} size="xl" />
        <div className="min-w-0">
          <h2 className="truncate font-serif text-2xl">{name}</h2>
          <p className="mt-1 flex items-center gap-3 type-body-sm text-muted">
            <span>
              {books.length} {books.length === 1 ? "book" : "books"}
            </span>
            {rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="size-3.5 text-accent" aria-hidden />
                {rating.toFixed(1)}
              </span>
            )}
          </p>
        </div>
      </div>

      <p className="mt-5 whitespace-pre-line type-body">
        {bio || (
          <span className="text-muted">
            Your bio will appear here. Tell readers who you are and what you
            write about.
          </span>
        )}
      </p>

      {links.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 type-body-sm underline-offset-4 hover:underline"
              >
                <l.icon className="size-4" aria-hidden />
                {l.label}
                <span className="sr-only"> ({hostname(l.url)})</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="type-label">Published books</h3>
        {books.length === 0 ? (
          <p className="mt-3 type-body-sm text-muted">
            Your published books will appear here.
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-3 gap-3">
            {books.slice(0, 6).map((b) => (
              <li key={b.id}>
                <BookCover title={b.title} author={name} src={b.coverUrl} />
                <p className="mt-2 line-clamp-2 text-xs leading-snug">
                  {b.title}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}