"use client";

import { useEffect, useState } from "react";
import { fetchCategories, seedCategories } from "@/services/categories";
import type { Category } from "@/types/category";

/** Shared category list. Starts from the seed list so server and client markup match. */
export function useCategories(): Category[] {
  const [categories, setCategories] = useState<Category[]>(seedCategories);

  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((list) => {
        if (!cancelled && list.length > 0) setCategories(list);
      })
      .catch(() => {
        /* API unreachable: keep the seed list */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}