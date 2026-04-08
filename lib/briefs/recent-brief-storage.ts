import type { BriefListItem } from "./brief-list-items";

const STORAGE_KEY = "sivutminttiin_recent_briefs_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getRecentBriefs(): BriefListItem[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function upsertRecentBrief(item: BriefListItem) {
  if (!isBrowser()) return;

  const existing = getRecentBriefs().filter((entry) => entry.id !== item.id);
  const next = [item, ...existing].slice(0, 50);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function removeRecentBrief(id: string) {
  if (!isBrowser()) return;

  const next = getRecentBriefs().filter((entry) => entry.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
