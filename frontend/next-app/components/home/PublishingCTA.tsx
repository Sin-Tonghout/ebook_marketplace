import Link from "next/link";

import { ParallaxLayer, RevealOnScroll } from "@/components/motion";

export function PublishingCTA() {
  return (
    <section
      aria-labelledby="publish-heading"
      className="mx-auto max-w-7xl px-6 py-12 md:px-10"
    >
      <div className="relative overflow-hidden rounded-xl bg-primary px-8 py-16 text-center text-primary-foreground md:px-16 md:py-24">
        <ParallaxLayer
          offset={36}
          className="absolute -left-24 -top-24 size-80 rounded-full bg-accent/25"
        />
        <ParallaxLayer
          offset={24}
          className="absolute -bottom-32 -right-16 size-96 rounded-full bg-accent/15"
        />

        <RevealOnScroll className="relative mx-auto max-w-2xl space-y-6">
          <h2 id="publish-heading" className="type-h1">
            Have a story to share?
            <br />
            Publish your book.
          </h2>
          <p className="type-body-lg opacity-80">
            Upload your book, add a cover, set a price, and submit it for review
            in a few simple steps.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/seller"
              className="rounded-xl bg-background px-6 py-3 text-base font-medium text-foreground transition duration-200 hover:opacity-85 hover:shadow-cover focus-visible:outline-offset-4"
            >
              Start publishing
            </Link>
            <Link
              href="/books"
              className="rounded-xl border border-primary-foreground/40 px-6 py-3 text-base font-medium transition duration-200 hover:border-primary-foreground hover:bg-primary-foreground/10 focus-visible:outline-offset-4"
            >
              Explore books
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}