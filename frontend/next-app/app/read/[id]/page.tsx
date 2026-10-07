"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { BookmarksPanel } from "@/components/reader/BookmarksPanel";
import { ReaderContent } from "@/components/reader/ReaderContent";
import { ReaderSettingsPanel } from "@/components/reader/ReaderSettingsPanel";
import { ReaderSkeleton } from "@/components/reader/ReaderSkeleton";
import { ReaderToolbar } from "@/components/reader/ReaderToolbar";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useLibrary } from "@/hooks/useLibrary";
import { useReaderScroll } from "@/hooks/useReaderScroll";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { mockBooks } from "@/lib/mock-data";
import { getChapters, type Chapter } from "@/lib/mock/chapters";
import { libraryService } from "@/services/library";
import { readerThemeStyle, resolveReaderTheme } from "@/types/reader";

import type { Book } from "@/types/book";
import type { Bookmark, ReadingProgress } from "@/types/library";

function scrollToPercent(p: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: (p / 100) * max, behavior: "instant" as ScrollBehavior });
}

/** The chapter whose heading has scrolled past the top of the screen. */
function currentChapterTitle(chapters: Chapter[]) {
  let current = chapters[0].title;
  for (const c of chapters) {
    const el = document.getElementById(c.id);
    if (el && el.getBoundingClientRect().top <= 140) current = c.title;
  }
  return current;
}

function ReaderView({ book, saved }: { book: Book; saved?: ReadingProgress }) {
  const router = useRouter();
  const { toast } = useToast();
  const { state } = useLibrary();
  const chapters = useMemo(() => getChapters(book.id), [book.id]);
  const { percent, hidden } = useReaderScroll();
  const { settings, update, reset } = useReaderSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  const initial = useRef(saved).current; // position at the moment the book was opened
  const restored = useRef(false);
  const percentRef = useRef(0);
  const prevLayout = useRef(settings);
  const [chapterTitle, setChapterTitle] = useState(initial?.chapter ?? chapters[0].title);

  useEffect(() => {
    percentRef.current = percent;
  }, [percent]);

  // Resume where the reader left off (a finished book restarts from the top)
  useEffect(() => {
    const start = initial && initial.percent < 100 ? initial.percent : 0;
    const raf = requestAnimationFrame(() => {
      scrollToPercent(start);
      restored.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, [initial]);

  // When text size / spacing / width change, keep the reader at the same place
  useEffect(() => {
    const prev = prevLayout.current;
    prevLayout.current = settings;
    const layoutChanged =
      prev.fontSize !== settings.fontSize ||
      prev.fontFamily !== settings.fontFamily ||
      prev.lineHeight !== settings.lineHeight ||
      prev.width !== settings.width;
    if (!layoutChanged) return;

    const p = percentRef.current;
    const raf = requestAnimationFrame(() => scrollToPercent(p));
    return () => cancelAnimationFrame(raf);
  }, [settings]);

  // Track the current chapter and save progress (debounced)
  useEffect(() => {
    if (!restored.current) return;

    const timer = window.setTimeout(() => {
      const current = currentChapterTitle(chapters);
      setChapterTitle(current);

      libraryService.saveProgress({
        bookId: book.id,
        percent,
        chapter: current,
        position: Math.round(window.scrollY),
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [percent, book.id, chapters]);

  // 08.6: save immediately when the reader leaves, so the last bit of scrolling is never lost
  useEffect(() => {
    const flush = () => {
      if (!restored.current) return;
      libraryService.saveProgress({
        bookId: book.id,
        percent: percentRef.current,
        chapter: currentChapterTitle(chapters),
        position: Math.round(window.scrollY),
      });
    };

    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush(); // also runs when navigating away inside the app
    };
  }, [book.id, chapters]);

  // 08.7: bookmarks for this book, in reading order
  const bookmarks = useMemo(
    () =>
      (state?.bookmarks ?? [])
        .filter((b) => b.bookId === book.id)
        .sort((a, b) => a.position - b.position),
    [state, book.id],
  );
  const nearby = bookmarks.find((b) => Math.abs(b.position - percent) < 1);

  const toggleBookmark = () => {
    if (nearby) {
      libraryService.removeBookmark(nearby.id);
      toast({ title: "Bookmark removed" });
      return;
    }
    libraryService.addBookmark({
      bookId: book.id,
      label: `${currentChapterTitle(chapters)} · ${Math.round(percent)}%`,
      position: Math.round(percent * 10) / 10, // stored as percent so it survives text-size changes
    });
    toast({ title: "Bookmark added" });
  };

  const jumpTo = (b: Bookmark) => {
    scrollToPercent(b.position);
    setBookmarksOpen(false);
  };

  const toggleSettings = () => {
    setSettingsOpen((o) => !o);
    setBookmarksOpen(false);
  };
  const toggleBookmarks = () => {
    setBookmarksOpen((o) => !o);
    setSettingsOpen(false);
  };

  const goBack = () => router.push("/library");
  const theme = resolveReaderTheme(settings.theme);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={readerThemeStyle(theme)}
    >
      <ReaderToolbar
        title={book.title}
        chapter={chapterTitle}
        percent={percent}
        hidden={hidden && !settingsOpen && !bookmarksOpen}
        bookmarked={Boolean(nearby)}
        settingsOpen={settingsOpen}
        bookmarksOpen={bookmarksOpen}
        onBack={goBack}
        onToggleBookmark={toggleBookmark}
        onToggleBookmarks={toggleBookmarks}
        onToggleSettings={toggleSettings}
      />
      <BookmarksPanel
        open={bookmarksOpen}
        bookmarks={bookmarks}
        onJump={jumpTo}
        onRemove={libraryService.removeBookmark}
        onClose={() => setBookmarksOpen(false)}
      />
      <ReaderSettingsPanel
        open={settingsOpen}
        settings={settings}
        onChange={update}
        onReset={reset}
        onClose={() => setSettingsOpen(false)}
      />
      <ReaderContent chapters={chapters} settings={settings} onFinish={goBack} />
    </div>
  );
}

function Message({ title, body, cta, href }: { title: string; body: string; cta: string; href: string }) {
  const router = useRouter();
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-3xl">{title}</h1>
      <p className="mt-3 text-muted">{body}</p>
      <Button className="mt-6" onClick={() => router.push(href)}>
        {cta}
      </Button>
    </main>
  );
}

export default function ReadPage() {
  const { id } = useParams<{ id: string }>();
  const { state, loading } = useLibrary();
  const book = mockBooks.find((b) => b.id === id);

  return (
    <RequireAuth>
      {loading || !state ? (
        <ReaderSkeleton />
      ) : !book ? (
        <Message
          title="We couldn't find this book."
          body="It may have been removed."
          cta="Back to library"
          href="/library"
        />
      ) : !state.owned.includes(book.id) ? (
        <Message
          title="This book isn't in your library yet."
          body="Get it first, then you can read it here."
          cta="View book"
          href={`/books/${book.id}`}
        />
      ) : (
        <ReaderView book={book} saved={state.progress[book.id]} />
      )}
    </RequireAuth>
  );
}