import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function BookNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">We couldn't find this book.</h1>
        <p className="mt-3 text-muted-foreground">
          It may have been removed, or the link might be wrong.
        </p>
        <Link
          href="/books"
          className="mt-6 inline-block underline underline-offset-4 hover:text-accent"
        >
          Browse all books
        </Link>
      </main>
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-muted-foreground">
          Ebook Marketplace
        </div>
      </footer>
    </>
  );
}