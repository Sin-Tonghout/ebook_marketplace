// Single source of truth for motion. Mirrors blueprint §12 (Levels 1–3).
type Bezier = [number, number, number, number];

export const duration = {
  fast: 0.18, // Level 1: micro (hover, focus, color)
  normal: 0.3, // Level 2: UI (modal, drawer, tabs, toast)
  slow: 0.6, // Level 3: showcase (hero, featured, big reveals)
} as const;

export const ease: { out: Bezier; inOut: Bezier } = {
  out: [0.22, 1, 0.36, 1], // default: fast start, soft landing
  inOut: [0.65, 0, 0.35, 1],
};

export const transition = {
  fast: { duration: duration.fast, ease: ease.out },
  normal: { duration: duration.normal, ease: ease.out },
  slow: { duration: duration.slow, ease: ease.out },
} as const;

export const distance = {
  sm: 8,
  md: 16,
  lg: 32,
} as const;

export const stagger = {
  tight: 0.05,
  normal: 0.08,
  relaxed: 0.12,
} as const;

export type MotionLevel = keyof typeof transition;