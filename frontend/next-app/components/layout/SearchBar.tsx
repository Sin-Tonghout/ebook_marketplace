"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  onOpen: () => void;
  className?: string;
}

export function SearchBar({ onOpen, className }: SearchBarProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpen]);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search books, authors, topics"
      className={cn(
        "flex h-10 w-full items-center gap-3 rounded-full border border-border bg-surface px-4 text-left text-sm text-muted",
        "transition duration-(--duration-fast) ease-(--ease-folio) hover:border-muted",
        className
      )}
    >
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="flex-1 truncate">Search books, authors, topics…</span>
      <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 text-[0.7rem] lg:inline">
        Ctrl K
      </kbd>
    </button>
  );
}