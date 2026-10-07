"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { distance, transition } from "@/lib/motion";
import { HeroBookStack } from "./HeroBookStack";

export function Hero() {
  const reduce = useReducedMotion();

  const item = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: distance.lg },
    animate: { opacity: 1, y: 0 },
    transition: { ...transition.slow, delay: reduce ? 0 : delay },
  });

  return (
    <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10 lg:gap-20">
      <div>
        <motion.p
          {...item(0)}
          className="mb-4 type-caption font-medium uppercase tracking-widest text-accent"
        >
          A digital library
        </motion.p>

        <motion.h1
          {...item(0.1)}
          className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl"
        >
          Discover stories
          <br />
          worth keeping.
        </motion.h1>

        <motion.p
          {...item(0.25)}
          className="mt-6 max-w-md type-body-lg text-muted"
        >
          Read. Collect. Share.
        </motion.p>

        <motion.div {...item(0.4)} className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/books"
            className="rounded-xl bg-primary px-6 py-3 text-base font-medium text-background transition duration-200 hover:bg-primary/80 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Explore Books
          </Link>
          <Link
            href="/seller"
            className="rounded-xl border border-border px-6 py-3 text-base font-medium transition duration-200 hover:border-foreground/30 hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Publish Your Book
          </Link>
        </motion.div>
      </div>

      <HeroBookStack />
    </section>
  );
}