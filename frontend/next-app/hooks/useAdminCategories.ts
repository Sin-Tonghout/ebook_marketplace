"use client";

import { useCallback, useEffect, useState } from "react";
import { categoryAdmin } from "@/services/admin-categories";
import type { Category } from "@/types/category";

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await categoryAdmin.list();
      setCategories(data.categories);
      setUsage(data.usage);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // All actions throw on failure so the row or form can show the message.
  const create = useCallback(async (name: string) => {
    setCategories(await categoryAdmin.create(name));
  }, []);

  const rename = useCallback(
    async (id: string, name: string) => {
      const before = categories.find((c) => c.id === id);
      const next = await categoryAdmin.rename(id, name);
      setCategories(next);
      const after = next.find((c) => c.id === id);
      if (before && after && before.name !== after.name) {
        setUsage((u) => {
          const rest = { ...u };
          const count = rest[before.name] ?? 0;
          delete rest[before.name];
          if (count > 0) rest[after.name] = count;
          return rest;
        });
      }
    },
    [categories]
  );

  const remove = useCallback(async (id: string) => {
    setCategories(await categoryAdmin.remove(id));
  }, []);

  const move = useCallback(async (id: string, dir: -1 | 1) => {
    setCategories(await categoryAdmin.move(id, dir));
  }, []);

  return { categories, usage, loading, error, retry: load, create, rename, remove, move };
}