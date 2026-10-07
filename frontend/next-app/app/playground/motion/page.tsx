"use client";

import { useState } from "react";
import {
  FadeIn,
  ScaleIn,
  StaggerChildren,
  StaggerItem,
  HoverLift,
  PressScale,
} from "@/components/motion";
import Link from "next/link";

const Box = ({ label }: { label: string }) => (
  <div className="flex h-24 items-center justify-center rounded-xl border border-border bg-surface text-sm text-muted-foreground">
    {label}
  </div>
);

export default function MotionPlayground() {
  const [run, setRun] = useState(0);

  return (
    <main className="mx-auto max-w-5xl space-y-16 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Motion playground</h1>
        <button
          onClick={() => setRun((n) => n + 1)}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Replay
        </button>
      </header>

      <section key={`fade-${run}`} className="space-y-4">
        <h2 className="text-xl">FadeIn (up / left / none, normal / slow)</h2>
        <div className="grid grid-cols-3 gap-4">
          <FadeIn direction="up">
            <Box label="up" />
          </FadeIn>
          <FadeIn direction="left" delay={0.1}>
            <Box label="left" />
          </FadeIn>
          <FadeIn direction="none" level="slow" delay={0.2}>
            <Box label="none, slow" />
          </FadeIn>
        </div>
      </section>

      <section key={`scale-${run}`} className="space-y-4">
        <h2 className="text-xl">ScaleIn</h2>
        <ScaleIn>
          <Box label="scale in" />
        </ScaleIn>
      </section>

      <section key={`stagger-${run}`} className="space-y-4">
        <h2 className="text-xl">StaggerChildren</h2>
        <StaggerChildren inView={false} className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <StaggerItem key={i}>
              <Box label={`item ${i + 1}`} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">HoverLift + PressScale</h2>
        <div className="grid grid-cols-2 gap-4">
          <HoverLift>
            <Box label="hover me" />
          </HoverLift>
          <PressScale>
            <Box label="press me" />
          </PressScale>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Scroll reveal</h2>
        <div className="h-[60vh]" />
        <FadeIn inView>
          <Box label="revealed on scroll" />
        </FadeIn>
        <div className="h-[20vh]" />
      </section>

      <Link href="/playground/motion/overlays" className="underline">
        Overlay motion →
      </Link>
      <Link href="/playground/motion/scroll" className="underline">
  Scroll reveal →
</Link>
    </main>
  );
}
