"use client";

import { useState, type FormEvent } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryRow } from "@/components/admin/CategoryRow";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminCategories } from "@/hooks/useAdminCategories";

export default function AdminCategoriesPage() {
  const { categories, usage, loading, error, retry, create, rename, remove, move } =
    useAdminCategories();
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState<string | undefined>();
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError(undefined);
    try {
      await create(newName);
      setNotice(`“${newName.trim()}” was added.`);
      setNewName("");
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAdding(false);
    }
  }

  const find = (id: string) => categories.find((c) => c.id === id)?.name ?? "Category";

  return (
    <AdminShell>
      <header>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Categories</h1>
        <p className="mt-2 text-muted">
          These are the categories authors can choose when they publish a book.
        </p>
      </header>

      {!loading && !error && (
        <form onSubmit={handleAdd} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <Input
              label="New category"
              placeholder="e.g. Travel"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              error={addError}
            />
          </div>
          <Button type="submit" disabled={adding || !newName.trim()} className="sm:mt-7">
            {adding ? "Adding…" : "Add category"}
          </Button>
        </form>
      )}

      <div role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-foreground">
        {notice}
      </div>

      <section aria-label="Categories" className="mt-4">
        {error ? (
          <ErrorState
            title="We couldn't load categories."
            description="Please try again."
            onRetry={retry}
            retryLabel="Retry"
          />
        ) : loading ? (
          <div className="flex flex-col gap-3" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                <Skeleton className="size-9" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {categories.map((c, i) => (
              <CategoryRow
                key={c.id}
                category={c}
                index={i}
                total={categories.length}
                count={usage[c.name] ?? 0}
                onRename={async (id, name) => {
                  const old = find(id);
                  await rename(id, name);
                  setNotice(`“${old}” was renamed to “${name.trim()}”.`);
                }}
                onDelete={async (id) => {
                  const old = find(id);
                  await remove(id);
                  setNotice(`“${old}” was deleted.`);
                }}
                onMove={async (id, dir) => {
                  const old = find(id);
                  await move(id, dir);
                  setNotice(`“${old}” moved ${dir === -1 ? "up" : "down"}.`);
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}