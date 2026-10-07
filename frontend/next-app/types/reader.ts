import type { CSSProperties } from "react";

export type ReaderFont = "serif" | "sans";
export type ReaderTheme = "auto" | "light" | "sepia" | "dark";
export type ResolvedReaderTheme = Exclude<ReaderTheme, "auto">;

export interface ReaderSettings {
  fontSize: number;   // px
  fontFamily: ReaderFont;
  lineHeight: number; // unitless multiplier
  width: number;      // reading column width in "ch"
  theme: ReaderTheme;
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 18,
  fontFamily: "serif",
  lineHeight: 1.8,
  width: 65,
  theme: "auto",
};

export const FONT_SIZE_MIN = 14;
export const FONT_SIZE_MAX = 28;
export const FONT_SIZE_STEP = 2;

export const FONT_STACKS: Record<ReaderFont, string> = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: "var(--font-inter), system-ui, sans-serif",
};

export const FONT_OPTIONS = [
  { label: "Serif", value: "serif" as const },
  { label: "Sans", value: "sans" as const },
];

export const LINE_HEIGHT_OPTIONS = [
  { label: "Compact", value: 1.6 },
  { label: "Normal", value: 1.8 },
  { label: "Relaxed", value: 2.1 },
];

export const WIDTH_OPTIONS = [
  { label: "Narrow", value: 52 },
  { label: "Medium", value: 65 },
  { label: "Wide", value: 80 },
];

export const THEME_OPTIONS = [
  { label: "Auto", value: "auto" as const },
  { label: "Light", value: "light" as const },
  { label: "Sepia", value: "sepia" as const },
  { label: "Dark", value: "dark" as const },
];

interface Palette {
  bg: string;
  fg: string;
  muted: string;
  border: string;
  surface: string;
  soft: string;
  accent: string;
}

export const READER_THEMES: Record<ResolvedReaderTheme, Palette> = {
  light: {
    bg: "#F7F5F0",
    fg: "#1B1D1B",
    muted: "#6F746F",
    border: "#E2DED5",
    surface: "#FFFFFF",
    soft: "#F1EEE7",
    accent: "#C98B5B",
  },
  sepia: {
    bg: "#F4ECD8",
    fg: "#433422",
    muted: "#8A7355",
    border: "#DCCFB2",
    surface: "#FBF5E6",
    soft: "#EADFC4",
    accent: "#B07A45",
  },
  dark: {
    bg: "#111412",
    fg: "#F4F1EA",
    muted: "#A9AEA9",
    border: "#303631",
    surface: "#181C19",
    soft: "#202521",
    accent: "#C98B5B",
  },
};

/** "auto" follows the site theme (the `dark` class on <html>). Client-only. */
export function resolveReaderTheme(theme: ReaderTheme): ResolvedReaderTheme {
  if (theme !== "auto") return theme;
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** CSS variables the reader components read via var(--reader-*). */
export function readerThemeStyle(theme: ResolvedReaderTheme): CSSProperties {
  const p = READER_THEMES[theme];
  return {
    "--reader-bg": p.bg,
    "--reader-fg": p.fg,
    "--reader-muted": p.muted,
    "--reader-border": p.border,
    "--reader-surface": p.surface,
    "--reader-soft": p.soft,
    "--reader-accent": p.accent,
    backgroundColor: p.bg,
    color: p.fg,
    colorScheme: theme === "dark" ? "dark" : "light",
  } as CSSProperties;
}