import type { Bookmark, LibraryState, ReadingProgress } from "@/types/library";

const KEY = "folio.library.v2";

// Seed so the library is not empty on first run. Ids match the main catalog.
const SEED: LibraryState = {
  owned: ["1", "2", "3", "5", "8"],
  favorites: ["1", "5"],
  progress: {
    "1": { bookId: "1", percent: 67, chapter: "Chapter 6", position: 160, lastReadAt: "2026-10-05T20:10:00.000Z" },
    "2": { bookId: "2", percent: 31, chapter: "Chapter 3", position: 40, lastReadAt: "2026-10-03T09:30:00.000Z" },
    "5": { bookId: "5", percent: 100, chapter: "Epilogue", position: 164, lastReadAt: "2026-09-20T18:00:00.000Z" },
  },
  bookmarks: [],
};

function read(): LibraryState {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...SEED, ...JSON.parse(raw) } : SEED;
  } catch {
    return SEED;
  }
}

function write(state: LibraryState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("folio:library"));
  } catch {
    /* storage full or blocked: fail silently */
  }
}

export const libraryService = {
  get: read,

  addOwned(bookId: string) {
    const s = read();
    if (!s.owned.includes(bookId)) write({ ...s, owned: [...s.owned, bookId] });
  },

  toggleFavorite(bookId: string) {
    const s = read();
    const favorites = s.favorites.includes(bookId)
      ? s.favorites.filter((id) => id !== bookId)
      : [...s.favorites, bookId];
    write({ ...s, favorites });
  },

  saveProgress(p: Omit<ReadingProgress, "lastReadAt">) {
    const s = read();
    write({
      ...s,
      progress: {
        ...s.progress,
        [p.bookId]: { ...p, lastReadAt: new Date().toISOString() },
      },
    });
  },

  addBookmark(b: Omit<Bookmark, "id" | "createdAt">) {
    const s = read();
    const bookmark: Bookmark = {
      ...b,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    write({ ...s, bookmarks: [...s.bookmarks, bookmark] });
  },

  removeBookmark(id: string) {
    const s = read();
    write({ ...s, bookmarks: s.bookmarks.filter((b) => b.id !== id) });
  },
};