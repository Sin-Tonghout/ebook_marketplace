import { api } from "@/lib/api";
import { invalidateCategories } from "@/services/categories";
import type { Category } from "@/types/category";

interface ApiCategory {
  id: string;
  name: string;
  bookCount: number; // every book, any status
}

const toCategory = ({ id, name }: ApiCategory): Category => ({ id, name });

function cleanName(raw: string): string {
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length < 2) throw new Error("Use at least 2 characters.");
  if (name.length > 30) throw new Error("Keep it under 30 characters.");
  return name;
}

async function fetchAll(): Promise<{
  categories: Category[];
  usage: Record<string, number>;
}> {
  const { categories } = await api<{ categories: ApiCategory[] }>("/categories/admin");
  const usage: Record<string, number> = {};
  for (const c of categories) usage[c.name] = c.bookCount;
  return { categories: categories.map(toCategory), usage };
}

// The API knows who is signed in from the session cookie and writes the audit
// log itself, so no actor is passed any more.
export const categoryAdmin = {
  list: fetchAll,

  async create(raw: string): Promise<Category[]> {
    await api("/categories", { method: "POST", body: { name: cleanName(raw) } });
    invalidateCategories();
    return (await fetchAll()).categories;
  },

  async rename(id: string, raw: string): Promise<Category[]> {
    await api(`/categories/${id}`, { method: "PATCH", body: { name: cleanName(raw) } });
    invalidateCategories();
    return (await fetchAll()).categories;
  },

  async remove(id: string): Promise<Category[]> {
    await api(`/categories/${id}`, { method: "DELETE" });
    invalidateCategories();
    return (await fetchAll()).categories;
  },

  // Moves one step, then sends the whole new order to the API.
  async move(id: string, dir: -1 | 1): Promise<Category[]> {
    const { categories } = await fetchAll();
    const i = categories.findIndex((c) => c.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= categories.length) return categories;

    const next = [...categories];
    [next[i], next[j]] = [next[j], next[i]];
    await api("/categories/order", {
      method: "PUT",
      body: { ids: next.map((c) => c.id) },
    });
    invalidateCategories();
    return next;
  },
};