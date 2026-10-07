import type { ReactNode } from "react";
import Link from "next/link";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Editorial side (desktop only) */}
      <aside className="relative hidden flex-col justify-between bg-[var(--primary)] p-12 text-[var(--background)] lg:flex">
        <Link href="/" className="font-serif text-2xl">
          Folio
        </Link>
        <blockquote className="max-w-md font-serif text-4xl leading-tight">
          A reader lives a thousand lives before he dies.
        </blockquote>
        <p className="text-sm opacity-70">Read. Collect. Share.</p>
      </aside>

      {/* Form side */}
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">
            {title}
          </h1>
          <p className="mb-8 mt-2 text-[var(--text-secondary)]">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
