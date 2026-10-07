"use client";

import Link from "next/link";
import { RevealOnScroll, ParallaxLayer, StaggerChildren, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/Button";

const categories = ["Technology", "Design", "Fiction", "Business", "Science", "History"];
const authors = ["Maya Chen", "Daniel Okafor", "Sophea Lim", "Arjun Rao"];

export default function ScrollRevealPlayground() {
  return (
    <main className="overflow-x-hidden">
      <div className="mx-auto max-w-6xl p-8">
        <h1 className="type-h2">Scroll reveal</h1>
        <Link href="/playground/motion" className="underline">
          ← Back to motion playground
        </Link>
        <p className="mt-4 text-muted">Scroll down. Each section should reveal once.</p>
      </div>

      <div className="h-[50vh]" />

      {/* Featured: RevealOnScroll + parallax background */}
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-xl bg-surface-soft p-10 md:p-16">
        <ParallaxLayer
          offset={40}
          className="absolute -right-16 -top-16 size-72 rounded-full bg-accent/20"
        />
        <RevealOnScroll className="relative space-y-4">
          <p className="type-caption uppercase tracking-widest">Featured this week</p>
          <h2 className="type-h1">The Future of Design</h2>
          <p className="max-w-xl text-muted">
            The big circle behind this block should drift slightly slower than the page as you scroll.
          </p>
        </RevealOnScroll>
      </section>

      <div className="h-[30vh]" />

      {/* Categories: heading reveal + staggered blocks */}
      <section className="mx-auto max-w-6xl space-y-8 px-8">
        <RevealOnScroll>
          <h2 className="type-h2">Browse by category</h2>
        </RevealOnScroll>
        <StaggerChildren className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((c) => (
            <StaggerItem key={c}>
              <div className="flex h-32 items-end rounded-xl border border-border bg-surface p-5 type-h4">
                {c}
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      <div className="h-[30vh]" />

      {/* Authors */}
      <section className="mx-auto max-w-6xl space-y-8 px-8">
        <RevealOnScroll>
          <h2 className="type-h2">Popular authors</h2>
        </RevealOnScroll>
        <StaggerChildren className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {authors.map((a) => (
            <StaggerItem key={a} className="space-y-3">
              <div className="aspect-square rounded-full bg-surface-soft" />
              <p className="text-center type-label">{a}</p>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      <div className="h-[30vh]" />

      {/* Publishing CTA */}
      <section className="mx-auto mb-24 max-w-6xl rounded-xl bg-primary p-12 text-center text-primary-foreground">
        <RevealOnScroll className="space-y-5">
          <h2 className="type-h1">Have a story to share?</h2>
          <p className="opacity-80">Publish your book.</p>
          <Button variant="secondary" size="lg">Start publishing</Button>
        </RevealOnScroll>
      </section>
    </main>
  );
}