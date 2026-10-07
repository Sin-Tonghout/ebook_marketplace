export type ReadingProgress = {
  bookId: string;
  percent: number;        // 0–100
  chapter: string;        // e.g. "Chapter 4"
  position: number;       // page / scroll position
  lastReadAt: string;     // ISO date
};

export type Bookmark = {
  id: string;
  bookId: string;
  label: string;
  position: number;
  createdAt: string;
};

export type LibraryState = {
  owned: string[];        // book ids
  favorites: string[];
  progress: Record<string, ReadingProgress>;
  bookmarks: Bookmark[];
};