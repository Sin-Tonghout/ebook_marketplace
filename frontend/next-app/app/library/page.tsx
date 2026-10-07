"use client";

import { useMemo, useState } from "react";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/AuthProvider";
import { ContinueReadingCard } from "@/components/library/ContinueReadingCard";
import { LibraryEmpty } from "@/components/library/LibraryEmpty";
import { LibrarySkeleton } from "@/components/library/LibrarySkeleton";
import { LibraryTile } from "@/components/library/LibraryTile";
import { useLibrary } from "@/hooks/useLibrary";
import { cn } from "@/lib/utils";
import { mockBooks } from "@/lib/mock-data"; // adjust if your mock-data.ts lives elsewhere

type Tab = "all" | "favorites" | "completed";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All books" },
  { id: "favorites", label: "Favorites" },
  { id: "completed", label: "Completed" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function LibraryPage() {
  const { user } = useAuth();
  const { state, loading, toggleFavorite } = useLibrary();
  const [tab, setTab] = useState<Tab>("all");

  const owned = useMemo(() => {
    if (!state) return [];
    return state.owned
      .map((id) => mockBooks.find((b) => b.id === id))
      .filter((b): b is NonNullable<typeof b> => Boolean(b));
  }, [state]);

  const continueReading = useMemo(() => {
    if (!state) return [];
    return owned
      .map((book) => ({ book, progress: state.progress[book.id] }))
      .filter((x) => x.progress && x.progress.percent > 0 && x.progress.percent < 100)
      .sort((a, b) => b.progress!.lastReadAt.localeCompare(a.progress!.lastReadAt))
      .slice(0, 2);
  }, [owned, state]);

  const visible = useMemo(() => {
    if (!state) return [];
    if (tab === "favorites") return owned.filter((b) => state.favorites.includes(b.id));
    if (tab === "completed") return owned.filter((b) => (state.progress[b.id]?.percent ?? 0) >= 100);
    return owned;
  }, [owned, state, tab]);

  const firstName = user?.name?.split(" ")[0] ?? "reader";

  return (
    <RequireAuth>
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {loading || !state ? (
          <LibrarySkeleton />
        ) : (
          <div className="space-y-14">
            <header>
              <h1 className="type-h1 font-serif">My Library</h1>
              <p className="mt-2 text-muted">
                {greeting()}, {firstName}.{" "}
                {owned.length > 0
                  ? `You have ${owned.length} ${owned.length === 1 ? "book" : "books"} in your collection.`
                  : "Your collection starts here."}
              </p>
            </header>

            {owned.length === 0 ? (
              <LibraryEmpty
                title="Your library is empty."
                body="Start discovering your next book."
              />
            ) : (
              <>
                {continueReading.length > 0 && (
                  <section aria-labelledby="continue-heading">
                    <h2 id="continue-heading" className="type-h3 font-serif">
                      Continue reading
                    </h2>
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      {continueReading.map(({ book, progress }) => (
                        <ContinueReadingCard key={book.id} book={book} progress={progress!} />
                      ))}
                    </div>
                  </section>
                )}

                <section aria-labelledby="books-heading">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 id="books-heading" className="type-h3 font-serif">
                      My books
                    </h2>

                    <div role="group" aria-label="Filter library" className="flex gap-2">
                      {TABS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          aria-pressed={tab === t.id}
                          onClick={() => setTab(t.id)}
                          className={cn(
                            "rounded-full px-4 py-1.5 text-sm transition-colors duration-200",
                            tab === t.id
                              ? "bg-primary text-background"
                              : "bg-surface-soft text-muted hover:text-foreground",
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    {visible.length === 0 ? (
                      <LibraryEmpty
                        title={tab === "favorites" ? "No favorites yet." : "Nothing completed yet."}
                        body={
                          tab === "favorites"
                            ? "Tap the heart on any book to keep it close."
                            : "Finish a book and it will appear here."
                        }
                        cta="Explore Books"
                      />
                    ) : (
                      <div
                        key={tab}
                        className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
                      >
                        {visible.map((book) => (
                          <LibraryTile
                            key={book.id}
                            book={book}
                            progress={state.progress[book.id]}
                            favorite={state.favorites.includes(book.id)}
                            onToggleFavorite={toggleFavorite}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </main>
    </RequireAuth>
  );
}