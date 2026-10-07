"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { distance, transition } from "@/lib/motion";
import {
  FONT_OPTIONS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_SIZE_STEP,
  LINE_HEIGHT_OPTIONS,
  THEME_OPTIONS,
  WIDTH_OPTIONS,
  type ReaderSettings,
} from "@/types/reader";

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-widest text-[color:var(--reader-muted)]">
        {label}
      </p>
      <div
        role="group"
        aria-label={label}
        className="grid grid-flow-col auto-cols-fr gap-1 rounded-md bg-[var(--reader-soft)] p-1"
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "rounded px-2 py-1.5 text-sm transition-colors duration-200",
                active
                  ? "bg-[var(--reader-bg)] text-[color:var(--reader-fg)] shadow-sm"
                  : "text-[color:var(--reader-muted)] hover:text-[color:var(--reader-fg)]",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface ReaderSettingsPanelProps {
  open: boolean;
  settings: ReaderSettings;
  onChange: (patch: Partial<ReaderSettings>) => void;
  onReset: () => void;
  onClose: () => void;
}

export function ReaderSettingsPanel({
  open,
  settings,
  onChange,
  onReset,
  onClose,
}: ReaderSettingsPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const stepBtn =
    "flex size-9 items-center justify-center rounded-md bg-[var(--reader-soft)] text-base transition-colors duration-200 hover:bg-[var(--reader-border)] disabled:opacity-40 disabled:hover:bg-[var(--reader-soft)]";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Click-away layer (sits below the toolbar so the gear still toggles) */}
          <div className="fixed inset-0 z-30" onClick={onClose} aria-hidden />

          <motion.div
            role="dialog"
            aria-label="Reading settings"
            initial={{ opacity: 0, y: -distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -distance.sm }}
            transition={transition.fast}
            className="fixed right-4 top-16 z-50 w-[min(22rem,calc(100vw-2rem))] space-y-5 rounded-lg border border-[color:var(--reader-border)] bg-[var(--reader-surface)] p-5 text-[color:var(--reader-fg)] shadow-lg"
          >
            <Segmented
              label="Theme"
              options={THEME_OPTIONS}
              value={settings.theme}
              onChange={(theme) => onChange({ theme })}
            />

            {/* Font size */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-[color:var(--reader-muted)]">
                Text size
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={stepBtn}
                  aria-label="Decrease text size"
                  disabled={settings.fontSize <= FONT_SIZE_MIN}
                  onClick={() => onChange({ fontSize: settings.fontSize - FONT_SIZE_STEP })}
                >
                  <span className="text-sm">A</span>
                </button>
                <span className="flex-1 text-center text-sm tabular-nums" aria-live="polite">
                  {settings.fontSize}px
                </span>
                <button
                  type="button"
                  className={stepBtn}
                  aria-label="Increase text size"
                  disabled={settings.fontSize >= FONT_SIZE_MAX}
                  onClick={() => onChange({ fontSize: settings.fontSize + FONT_SIZE_STEP })}
                >
                  <span className="text-xl leading-none">A</span>
                </button>
              </div>
            </div>

            <Segmented
              label="Font"
              options={FONT_OPTIONS}
              value={settings.fontFamily}
              onChange={(fontFamily) => onChange({ fontFamily })}
            />
            <Segmented
              label="Line spacing"
              options={LINE_HEIGHT_OPTIONS}
              value={settings.lineHeight}
              onChange={(lineHeight) => onChange({ lineHeight })}
            />
            <Segmented
              label="Reading width"
              options={WIDTH_OPTIONS}
              value={settings.width}
              onChange={(width) => onChange({ width })}
            />

            <button
              type="button"
              onClick={onReset}
              className="text-sm text-[color:var(--reader-muted)] underline-offset-4 transition-colors duration-200 hover:text-[color:var(--reader-fg)] hover:underline"
            >
              Reset to defaults
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}