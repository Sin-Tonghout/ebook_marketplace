import type { Actor } from "@/services/admin";
import { addAuditEntry } from "@/services/audit";
import { getCategories, saveCategories } from "@/services/categories";
import { fetchSellerOverview, updateSellerBook } from "@/services/seller";
import { allBooks } from "@/lib/mock/findBook";
import type { Category } from "@/types/category";
import type { SellerBook } from "@/types/seller";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const storefrontCount = (name: string) =>
  allBooks.filter((b) => b.category === name).length;

function cleanName(raw: string, others: Category[]): string {
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length < 2) throw new Error("Use at least 2 characters.");
  if (name.length > 30) throw new Error("Keep it under 30 characters.");
  if (others.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("That category already exists.");
  }
  return name;
}

function persist(next: Category[]): Category[] {
  if (!saveCategories(next)) {
    throw new Error("Couldn't save. Browser storage is full.");
  }
  return next;
}

function log(actor: Actor, action: string, c: Category, detail?: string) {
  addAuditEntry({
    actorId: actor.id,
    actorName: actor.name,
    action,
    targetType: "category",
    targetId: c.id,
    targetLabel: c.name,
    detail,
  });
}

/** Seller books only. Storefront books are added in list(). */
export function countUsage(books: SellerBook[]): Record<string, number> {
  const usage: Record<string, number> = {};
  for (const b of books) {
    if (b.category) usage[b.category] = (usage[b.category] ?? 0) + 1;
  }
  return usage;
}

export const categoryAdmin = {
  async list(): Promise<{ categories: Category[]; usage: Record<string, number> }> {
    const { books } = await fetchSellerOverview();
    const usage = countUsage(books);
    for (const b of allBooks) {
      usage[b.category] = (usage[b.category] ?? 0) + 1;
    }
    return { categories: getCategories(), usage };
  },

  async create(raw: string, actor: Actor): Promise<Category[]> {
    await delay(200);
    const list = getCategories();
    const name = cleanName(raw, list);
    const created: Category = { id: `cat-${Date.now()}`, name };
    const next = persist([...list, created]);
    log(actor, "category.create", created);
    return next;
  },

  async rename(id: string, raw: string, actor: Actor): Promise<Category[]> {
    const list = getCategories();
    const current = list.find((c) => c.id === id);
    if (!current) throw new Error("Category not found.");
    const name = cleanName(
      raw,
      list.filter((c) => c.id !== id)
    );
    if (name === current.name) return list;

    if (storefrontCount(current.name) > 0) {
      throw new Error(
        "Storefront books still use this category, so it can't be renamed until the real database is connected."
      );
    }

    // Fetch first so nothing changes if this fails.
    const { books } = await fetchSellerOverview();
    const next = persist(list.map((c) => (c.id === id ? { ...c, name } : c)));
    for (const b of books) {
      if (b.category === current.name) updateSellerBook({ ...b, category: name });
    }
    log(actor, "category.rename", { id, name }, `${current.name} → ${name}`);
    return next;
  },

  async remove(id: string, actor: Actor): Promise<Category[]> {
    const list = getCategories();
    const target = list.find((c) => c.id === id);
    if (!target) throw new Error("Category not found.");
    if (list.length <= 1) throw new Error("Keep at least one category.");

    const { books } = await fetchSellerOverview();
    const used =
      books.filter((b) => b.category === target.name).length +
      storefrontCount(target.name);
    if (used > 0) {
      throw new Error(
        `${used} book${used === 1 ? "" : "s"} still use this category.`
      );
    }
    const next = persist(list.filter((c) => c.id !== id));
    log(actor, "category.delete", target);
    return next;
  },

  async move(id: string, dir: -1 | 1, actor: Actor): Promise<Category[]> {
    const list = getCategories();
    const i = list.findIndex((c) => c.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return list;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    persist(next);
    log(actor, "category.reorder", list[i], dir === -1 ? "Moved up" : "Moved down");
    return next;
  },
};