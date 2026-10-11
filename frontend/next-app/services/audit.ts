import type { AuditEntry } from "@/types/admin";

const KEY = "folio.admin.audit.v1";
const MAX_ENTRIES = 200;

export function readAuditEntries(): AuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function addAuditEntry(
  entry: Omit<AuditEntry, "id" | "createdAt">
): AuditEntry {
  const full: AuditEntry = {
    ...entry,
    id: `au-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      const next = [full, ...readAuditEntries()].slice(0, MAX_ENTRIES);
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* audit is best-effort in the mock layer */
    }
  }
  return full;
}