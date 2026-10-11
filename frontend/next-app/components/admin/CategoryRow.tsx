"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Category } from "@/types/category";

const iconButton =
  "inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type Mode = "view" | "edit" | "delete";

export function CategoryRow({
  category,
  index,
  total,
  count,
  onRename,
  onDelete,
  onMove,
}: {
  category: Category;
  index: number;
  total: number;
  count: number;
  onRename: (id: string, name: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  onMove: (id: string, dir: -1 | 1) => Promise<unknown>;
}) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("view");
  const [name, setName] = useState(category.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(fn: () => Promise<unknown>, onDone?: () => void) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const inUse = count > 0;
  const onlyOne = total <= 1;

  return (
    <motion.li
      layout
      transition={{ layout: { duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] } }}
      className="rounded-xl border border-border bg-surface p-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          <button
            type="button"
            className={iconButton}
            aria-label={`Move ${category.name} up`}
            disabled={busy || index === 0}
            onClick={() => run(() => onMove(category.id, -1))}
          >
            <ChevronUp className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label={`Move ${category.name} down`}
            disabled={busy || index === total - 1}
            onClick={() => run(() => onMove(category.id, 1))}
          >
            <ChevronDown className="size-4" aria-hidden />
          </button>
        </div>

        {mode === "edit" ? (
          <form
            className="flex flex-1 flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(
                () => onRename(category.id, name),
                () => setMode("view")
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setName(category.name);
                setError(null);
                setMode("view");
              }
            }}
          >
            <div className="min-w-48 flex-1">
              <Input
                label="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <Button size="sm" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              disabled={busy}
              onClick={() => {
                setName(category.name);
                setError(null);
                setMode("view");
              }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-base font-medium text-foreground">{category.name}</p>
              <p className="type-caption text-muted">
                {count === 0 ? "No books" : `${count} book${count === 1 ? "" : "s"}`}
              </p>
            </div>
            {mode === "view" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => {
                    setName(category.name);
                    setMode("edit");
                  }}
                >
                  Rename
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy || inUse || onlyOne}
                  title={
                    inUse
                      ? "In use by books. Rename it instead."
                      : onlyOne
                        ? "Keep at least one category."
                        : undefined
                  }
                  onClick={() => setMode("delete")}
                >
                  Delete
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {mode === "delete" && (
        <div className="mt-3 rounded-lg bg-surface-soft p-3">
          <p className="text-sm text-foreground">
            Delete “{category.name}”? Authors won't be able to pick it any more.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() => run(() => onDelete(category.id))}
            >
              {busy ? "Deleting…" : "Delete category"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                setError(null);
                setMode("view");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </motion.li>
  );
}