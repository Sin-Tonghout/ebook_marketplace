"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { distance, transition } from "@/lib/motion";
import type { Bookmark } from "@/types/library";

export interface BookmarksPanelProps {
  open: boolean;
  bookmarks: Bookmark[]; // already filtered to this book
  onJump: (bookmark: Bookmark) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function BookmarksPanel({ open, bookmarks, onJump, onRemove, onClose }: BookmarksPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Click-away layer (below the toolbar so its buttons still toggle) */}
          <div className="fixed inset-0 z-30" onClick={onClose} aria-hidden />

          <motion.div
            role="dialog"
            aria-label="Bookmarks"
            initial={{ opacity: 0, y: -distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -distance.sm }}
            transition={transition.fast}
            className="fixed right-4 top-16 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-[color:var(--reader-border)] bg-[var(--reader-surface)] p-3 text-[color:var(--reader-fg)] shadow-lg"
          >
            <p className="px-2 pb-2 pt-1 text-xs uppercase tracking-widest text-[color:var(--reader-muted)]">
              Bookmarks
            </p>

            {bookmarks.length === 0 ? (
              <p className="px-2 pb-3 pt-1 text-sm text-[color:var(--reader-muted)]">
                No bookmarks yet. Tap the bookmark icon to save your place.
              </p>
            ) : (
              <ul className="max-h-72 space-y-1 overflow-y-auto">
                {bookmarks.map((b) => (
                  <li key={b.id} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onJump(b)}
                      className="min-w-0 flex-1 rounded-md px-2 py-2 text-left transition-colors duration-200 hover:bg-[var(--reader-soft)]"
                    >
                      <span className="block truncate text-sm">{b.label}</span>
                      <span className="block text-xs text-[color:var(--reader-muted)]">
                        Saved{" "}
                        {new Date(b.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(b.id)}
                      aria-label={`Remove bookmark ${b.label}`}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-[color:var(--reader-muted)] transition-colors duration-200 hover:bg-[var(--reader-soft)] hover:text-[color:var(--reader-fg)]"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}