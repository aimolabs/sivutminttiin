import type { ProjectListItem } from "./project-list-items";

export const RECENT_GENERATED_PROJECTS_KEY = "sivutminttiin.recent-generated-projects";

function isValidItem(value: unknown): value is ProjectListItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.companyName === "string" &&
    typeof item.industryLabel === "string" &&
    typeof item.businessSummary === "string" &&
    typeof item.createdAt === "string" &&
    (item.status === "draft" || item.status === "ready") &&
    typeof item.href === "string" &&
    (item.source === "seed" || item.source === "generated")
  );
}

export function readRecentGeneratedProjects(): ProjectListItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(RECENT_GENERATED_PROJECTS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidItem);
  } catch {
    return [];
  }
}

export function writeRecentGeneratedProjects(items: ProjectListItem[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      RECENT_GENERATED_PROJECTS_KEY,
      JSON.stringify(items)
    );
  } catch {}
}

export function upsertRecentGeneratedProject(item: ProjectListItem) {
  const existing = readRecentGeneratedProjects();

  const filtered = existing.filter(
    (candidate) =>
      !(
        candidate.companyName === item.companyName &&
        candidate.href === item.href
      )
  );

  const next = [item, ...filtered].slice(0, 24);
  writeRecentGeneratedProjects(next);
}
