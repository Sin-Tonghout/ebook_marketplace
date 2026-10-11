"use client";

import { useEffect, useState } from "react";
import { getCategories, seedCategories } from "@/services/categories";
import type { Category } from "@/types/category";

/** Shared category list. Starts from the seed list so server and client markup match. */
export function useCategories(): Category[] {
  const [categories, setCategories] = useState<Category[]>(seedCategories);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  return categories;
}