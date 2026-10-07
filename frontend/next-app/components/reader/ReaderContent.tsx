"use client";

import type { Chapter } from "@/lib/mock/chapters";
import { FONT_STACKS, type ReaderSettings } from "@/types/reader";

export function ReaderContent({
  chapters,
  settings,
  onFinish,
}: {
  chapters: Chapter[];
  settings: ReaderSettings;
  onFinish: () => void;
}) {
  return (
    <article
      className="mx-auto px-6 pb-32 pt-28"
      style={{
        maxWidth: `${settings.width}ch`,
        fontFamily: FONT_STACKS[settings.fontFamily],
        fontSize: settings.fontSize,
        lineHeight: settings.lineHeight,
      }}
    >
      {chapters.map((chapter) => (
        <section key={chapter.id} id={chapter.id} className="mb-20 scroll-mt-24">
          <header className="mb-10 text-center">
            <p
              className="text-xs uppercase tracking-widest text-[color:var(--reader-muted)]"
              style={{ fontFamily: FONT_STACKS.sans }}
            >
              {chapter.title}
            </p>
            <h2 className="mt-3 text-3xl leading-tight">{chapter.subtitle}</h2>
          </header>

          <div className="space-y-6">
            {chapter.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ))}

      <footer
        className="border-t border-[color:var(--reader-border)] pt-12 text-center"
        style={{ fontFamily: FONT_STACKS.sans, fontSize: 16 }}
      >
        <p className="text-[color:var(--reader-muted)]">You reached the end.</p>
        <button
          type="button"
          onClick={onFinish}
          className="mt-5 rounded-md bg-[var(--reader-fg)] px-5 py-2.5 text-sm font-medium text-[color:var(--reader-bg)] transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--reader-accent)]"
        >
          Back to library
        </button>
      </footer>
    </article>
  );
}