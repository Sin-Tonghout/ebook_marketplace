"use client";

import { useCallback, useEffect, useState } from "react";

import { DEFAULT_READER_SETTINGS, type ReaderSettings } from "@/types/reader";

const KEY = "folio.reader.v1";

function read(): ReaderSettings {
  if (typeof window === "undefined") return DEFAULT_READER_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_READER_SETTINGS, ...JSON.parse(raw) } : DEFAULT_READER_SETTINGS;
  } catch {
    return DEFAULT_READER_SETTINGS;
  }
}

export function useReaderSettings() {
  // Safe to read storage here: the reader only renders on the client, after the library has loaded
  const [settings, setSettings] = useState<ReaderSettings>(read);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* storage blocked or full: settings just won't persist */
    }
  }, [settings]);

  const update = useCallback(
    (patch: Partial<ReaderSettings>) => setSettings((s) => ({ ...s, ...patch })),
    [],
  );
  const reset = useCallback(() => setSettings(DEFAULT_READER_SETTINGS), []);

  return { settings, update, reset };
}