"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function LibraryEmpty({
  title,
  body,
  cta = "Explore Books",
}: {
  title: string;
  body: string;
  cta?: string;
}) {
  const router = useRouter();
  return (
    <div className="rounded-lg bg-surface-soft px-6 py-16 text-center">
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-muted">{body}</p>
      <Button className="mt-6" onClick={() => router.push("/books")}>
        {cta}
      </Button>
    </div>
  );
}