"use client";

import { ArrowLeft, Bookmark, List, Settings } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion";

export interface ReaderToolbarProps {
  title: string;
  chapter: string;
  percent: number;
  hidden: boolean;
  bookmarked: boolean;
  settingsOpen: boolean;
  bookmarksOpen: boolean;
  onBack: () => void;
  onToggleBookmark: () => void;
  onToggleBookmarks: () => void;
  onToggleSettings: () => void;
}

const iconBtn =
  "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-[var(--reader-soft)]";

export function ReaderToolbar({
  title,
  chapter,
  percent,
  hidden,
  bookmarked,
  settingsOpen,
  bookmarksOpen,
  onBack,
  onToggleBookmark,
  onToggleBookmarks,
  onToggleSettings,
}: ReaderToolbarProps) {
  const pct = Math.round(percent);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={transition.normal}
        className="fixed inset-x-0 top-0 z-40 border-b border-[color:var(--reader-border)] bg-[var(--reader-bg)] transition-colors duration-300"
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-1 px-3 sm:gap-2 sm:px-4">
          <button type="button" onClick={onBack} aria-label="Back to library" className={iconBtn}>
            <ArrowLeft className="size-5" aria-hidden />
          </button>

          <div className="min-w-0 flex-1 px-1 text-center">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="truncate text-xs text-[color:var(--reader-muted)]">{chapter}</p>
          </div>

          <span
            className="hidden w-10 shrink-0 text-right text-sm tabular-nums text-[color:var(--reader-muted)] sm:block"
            aria-hidden
          >
            {pct}%
          </span>

          <button
            type="button"
            onClick={onToggleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this spot"}
            aria-pressed={bookmarked}
            className={iconBtn}
          >
            <Bookmark
              className={cn("size-5", bookmarked && "fill-current text-[color:var(--reader-accent)]")}
              aria-hidden
            />
          </button>

          <button
            type="button"
            onClick={onToggleBookmarks}
            aria-label="Bookmarks"
            aria-expanded={bookmarksOpen}
            className={iconBtn}
          >
            <List className="size-5" aria-hidden />
          </button>

          <button
            type="button"
            onClick={onToggleSettings}
            aria-label="Reading settings"
            aria-expanded={settingsOpen}
            className={iconBtn}
          >
            <Settings className="size-5" aria-hidden />
          </button>
        </div>
      </motion.header>

      <div
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed inset-x-0 top-0 z-50 h-0.5"
      >
        <div
          className="h-full origin-left bg-[var(--reader-accent)]"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </div>
    </>
  );
}