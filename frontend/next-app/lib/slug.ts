/** "Design & Craft" -> "design-and-craft". Used for category URLs and matching. */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "design-and-craft" -> "Design and craft". Fallback label for an unknown slug. */
export function titleFromSlug(slug: string): string {
  const s = slug.replace(/-/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}