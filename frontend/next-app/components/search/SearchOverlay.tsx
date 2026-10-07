"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Clock, Folder, Search, User, type LucideIcon } from "lucide-react";

import { clearRecent, getRecent, saveRecent } from "@/lib/search/recent";
import { searchAll } from "@/lib/search/search";
import { distance, duration, ease, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Kind = "book" | "author" | "category" | "recent" | "all";

interface Item {
  id: string;
  kind: Kind;
  label: string;
  sublabel?: string;
  href?: string;
}

interface Group {
  title: string;
  items: Item[];
}

const icons: Record<Kind, LucideIcon> = {
  book: BookOpen,
  author: User,
  category: Folder,
  recent: Clock,
  all: Search,
};

const exitTransition = { duration: duration.fast, ease: ease.out };

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);

  // Fresh state every time the overlay opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setRecent(getRecent());
    }
  }, [open]);

  const trimmed = query.trim();

  const groups = useMemo<Group[]>(() => {
    if (!trimmed) {
      return recent.length
        ? [
            {
              title: "Recent searches",
              items: recent.map((r) => ({ id: `recent-${r}`, kind: "recent", label: r })),
            },
          ]
        : [];
    }

    const r = searchAll(trimmed);
    const result: Group[] = [];

    if (r.books.length) {
      result.push({
        title: "Books",
        items: r.books.map((b) => ({
          id: `book-${b.id}`,
          kind: "book",
          label: b.title,
          sublabel: b.author.name,
          href: `/books/${b.id}`,
        })),
      });
    }
    if (r.authors.length) {
      result.push({
        title: "Authors",
        items: r.authors.map((a) => ({
          id: `author-${a.id}`,
          kind: "author",
          label: a.name,
          sublabel: `${a.bookCount} ${a.bookCount === 1 ? "book" : "books"}`,
          href: `/authors/${a.id}`,
        })),
      });
    }
    if (r.categories.length) {
      result.push({
        title: "Categories",
        items: r.categories.map((c) => ({
          id: `category-${c.value}`,
          kind: "category",
          label: c.label,
          href: `/books?category=${c.value}`,
        })),
      });
    }

    result.push({
      title: "",
      items: [
        {
          id: "all",
          kind: "all",
          label: `See all results for “${trimmed}”`,
          href: `/books?q=${encodeURIComponent(trimmed)}`,
        },
      ],
    });

    return result;
  }, [trimmed, recent]);

  const flat = groups.flatMap((g) => g.items);
  const activeIndex = Math.min(active, Math.max(flat.length - 1, 0));
  const hasMatches = flat.length > 1;

  // Keep the highlighted row visible while using the arrow keys
  useEffect(() => {
    document
      .getElementById(`search-opt-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const choose = (item: Item) => {
    if (item.kind === "recent") {
      setQuery(item.label);
      setActive(0);
      return;
    }
    if (trimmed) saveRecent(trimmed);
    if (item.href) router.push(item.href);
    onOpenChange(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[activeIndex];
      if (item) choose(item);
    }
  };

  let offset = 0;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-foreground/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: exitTransition }}
                transition={transition.normal}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed left-1/2 top-[8vh] z-50 flex max-h-[80vh] w-[calc(100%-2rem)] max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-cover focus:outline-none"
                initial={{ opacity: 0, x: "-50%", y: -distance.sm, scale: 0.98 }}
                animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: "-50%",
                  y: -distance.sm,
                  scale: 0.98,
                  transition: exitTransition,
                }}
                transition={transition.normal}
              >
                <Dialog.Title className="sr-only">Search</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Search books, authors, and categories. Use the arrow keys to move
                  through results and Enter to open one.
                </Dialog.Description>

                <div className="flex items-center gap-3 border-b border-border px-4">
                  <Search className="size-5 shrink-0 text-muted" aria-hidden />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActive(0);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Search books, authors, topics…"
                    role="combobox"
                    aria-label="Search"
                    aria-expanded="true"
                    aria-controls="search-listbox"
                    aria-autocomplete="list"
                    aria-activedescendant={
                      flat.length ? `search-opt-${activeIndex}` : undefined
                    }
                    className="h-14 flex-1 bg-transparent text-base text-foreground placeholder:text-muted focus:outline-none"
                  />
                  <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 text-[0.7rem] text-muted sm:inline">
                    Esc
                  </kbd>
                </div>

                <div
                  id="search-listbox"
                  role="listbox"
                  aria-label="Search results"
                  className="flex-1 overflow-y-auto p-2"
                >
                  {flat.length === 0 && (
                    <p className="px-3 py-10 text-center type-body-sm text-muted">
                      Start typing to search books, authors, and topics.
                    </p>
                  )}

                  {trimmed && !hasMatches && (
                    <p aria-live="polite" className="px-3 pb-2 pt-4 type-body-sm text-muted">
                      No matches for “{trimmed}”. Try another title, author, or topic.
                    </p>
                  )}

                  {groups.map((group) => {
                    const start = offset;
                    offset += group.items.length;

                    return (
                      <div
                        key={group.title || "all"}
                        role="group"
                        aria-label={group.title || "All results"}
                        className="pb-1"
                      >
                        {group.title && (
                          <div className="flex items-center justify-between px-3 pb-1 pt-3">
                            <p className="type-caption uppercase tracking-widest">
                              {group.title}
                            </p>
                            {group.title === "Recent searches" && (
                              <button
                                type="button"
                                onClick={() => {
                                  clearRecent();
                                  setRecent([]);
                                }}
                                className="type-caption underline hover:text-foreground"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        )}

                        {group.items.map((item, i) => {
                          const index = start + i;
                          const Icon = icons[item.kind];
                          const isActive = index === activeIndex;

                          return (
                            <button
                              key={item.id}
                              id={`search-opt-${index}`}
                              type="button"
                              role="option"
                              tabIndex={-1}
                              aria-selected={isActive}
                              onMouseMove={() => setActive(index)}
                              onClick={() => choose(item)}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-150",
                                isActive ? "bg-surface-soft" : "bg-transparent"
                              )}
                            >
                              <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate type-body-sm font-medium">
                                  {item.label}
                                </span>
                                {item.sublabel && (
                                  <span className="block truncate type-caption">
                                    {item.sublabel}
                                  </span>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                <div className="hidden items-center gap-4 border-t border-border px-4 py-2.5 type-caption sm:flex">
                  <span>↑↓ to move</span>
                  <span>Enter to select</span>
                  <span>Esc to close</span>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}