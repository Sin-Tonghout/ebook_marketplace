const KEY = "ebook-recent-searches";
const MAX = 5;

// localStorage can be unavailable (private mode, blocked storage), so every call is guarded.
export function getRecent(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string").slice(0, MAX)
      : [];
  } catch {
    return [];
  }
}

export function saveRecent(term: string) {
  const clean = term.trim();
  if (!clean) return;
  try {
    const next = [
      clean,
      ...getRecent().filter((t) => t.toLowerCase() !== clean.toLowerCase()),
    ].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function clearRecent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}