import type { Category } from "@/types/category";

const KEY = "folio.categories.v1";

const SEED_NAMES = [
  "Technology",
  "Design",
  "Business",
  "Fiction",
  "Non-fiction",
  "Science",
  "History",
  "Self-improvement",
  "Children",
  "Poetry",
];

export function seedCategories(): Category[] {
  return SEED_NAMES.map((name, i) => ({ id: `cat-${i + 1}`, name }));
}

export function getCategories(): Category[] {
  if (typeof window === "undefined") return seedCategories();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Category[];
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every((c) => typeof c?.id === "string" && typeof c?.name === "string")
      ) {
        return parsed;
      }
    }
  } catch {
    /* fall through to the seed list */
  }
  return seedCategories();
}

export function saveCategories(list: Category[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}