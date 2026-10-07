"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

// Covers are artwork, so these colors stay the same in light and dark mode.
const palettes = [
  { bg: "#1F2A24", fg: "#F4F1EA" },
  { bg: "#C98B5B", fg: "#1B1D1B" },
  { bg: "#E9D8C8", fg: "#1F2A24" },
  { bg: "#557A61", fg: "#F7F5F0" },
  { bg: "#493A2F", fg: "#E9D8C8" },
  { bg: "#A85C54", fg: "#F7F5F0" },
];

function pickPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return palettes[hash % palettes.length];
}

export interface BookCoverProps {
  title: string;
  author: string;
  src?: string | null;
  priority?: boolean;
  className?: string;
}

export function BookCover({
  title,
  author,
  src,
  priority = false,
  className,
}: BookCoverProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle images that finished loading before React attached listeners
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) {
      if (img.naturalWidth === 0) setFailed(true);
      else setLoaded(true);
    }
  }, []);

  const showImage = !!src && !failed;
  const palette = pickPalette(title);

  return (
    <div
      className={cn(
        "relative aspect-2/3 w-full overflow-hidden rounded-sm bg-surface-soft",
        className,
      )}
    >
      {showImage ? (
        <>
          {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt={`Cover of ${title} by ${author}`}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={cn(
              "size-full object-cover transition-opacity duration-(--duration-normal)",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
        </>
      ) : (
        <div
          role="img"
          aria-label={`Cover of ${title} by ${author}`}
          className="flex size-full flex-col justify-between p-[12%]"
          style={{ background: palette.bg, color: palette.fg }}
        >
          <span className="line-clamp-4 font-serif text-[clamp(0.9rem,2.2vw,1.35rem)] font-medium leading-tight">
            {title}
          </span>
          <span className="line-clamp-2 text-[0.65rem] uppercase tracking-widest opacity-80">
            {author}
          </span>
        </div>
      )}

      {/* Spine highlight for a physical feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.22),rgba(255,255,255,0.08)_3%,transparent_8%)]"
      />
    </div>
  );
}
