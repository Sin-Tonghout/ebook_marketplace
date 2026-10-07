"use client";
import { useEffect, useState } from "react";
import { libraryService } from "@/services/library";
import type { LibraryState } from "@/types/library";

export function useLibrary() {
  const [state, setState] = useState<LibraryState | null>(null); // null = loading

  useEffect(() => {
    const sync = () => setState(libraryService.get());
    sync();
    window.addEventListener("folio:library", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("folio:library", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { state, loading: state === null, ...libraryService };
}