import { api } from "@/lib/api";
import type { Category } from "@/types/category";

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

/** Fallback list: first render (so server and client match) and offline use. */
export function seedCategories(): Category[] {
  return SEED_NAMES.map((name, i) => ({ id: `cat-${i + 1}`, name }));
}

let cache: Category[] | null = null;
let inflight: Promise<Category[]> | null = null;

/** Sync read for code that can't await. Falls back to the seed list. */
export function getCategories(): Category[] {
  return cache ?? seedCategories();
}

/** Call after the admin changes categories so the next read is fresh. */
export function invalidateCategories() {
  cache = null;
  inflight = null;
}

/** Loads the real list from the API once and shares it between components. */
export async function fetchCategories(): Promise<Category[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = api<{ categories: Category[] }>("/categories")
      .then(({ categories }) => {
        cache = categories.map(({ id, name }) => ({ id, name }));
        return cache;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}