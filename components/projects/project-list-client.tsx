"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ProjectListItem } from "@/lib/projects/project-list-items";
import { readRecentGeneratedProjects } from "@/lib/projects/recent-generated-storage";

type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc";

type Props = {
  baseItems: ProjectListItem[];
};

function sortItems(items: ProjectListItem[], sort: SortOption): ProjectListItem[] {
  const next = [...items];

  switch (sort) {
    case "date-asc":
      return next.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "name-asc":
      return next.sort((a, b) => a.companyName.localeCompare(b.companyName, "fi"));
    case "name-desc":
      return next.sort((a, b) => b.companyName.localeCompare(a.companyName, "fi"));
    case "date-desc":
    default:
      return next.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

function mergeItems(
  baseItems: ProjectListItem[],
  recentItems: ProjectListItem[]
): ProjectListItem[] {
  const map = new Map<string, ProjectListItem>();

  for (const item of [...recentItems, ...baseItems]) {
    const key = `${item.source}:${item.id}:${item.href}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return Array.from(map.values());
}

export function ProjectListClient({ baseItems }: Props) {
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [recentItems, setRecentItems] = useState<ProjectListItem[]>([]);

  useEffect(() => {
    setRecentItems(readRecentGeneratedProjects());
  }, []);

  const items = useMemo(() => {
    return sortItems(mergeItems(baseItems, recentItems), sort);
  }, [baseItems, recentItems, sort]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Projects
          </p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Olemassa olevat projektit
          </h2>
          <p className="text-sm text-white/60">
            Listassa näkyvät seed-projektit ja tässä selaimessa luodut uudet generated previewt.
          </p>
        </div>

        <div className="w-full md:w-[260px]">
          <label
            htmlFor="project-sort"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            Järjestä
          </label>
          <select
            id="project-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="date-desc" className="text-black">Uusin ensin</option>
            <option value="date-asc" className="text-black">Vanhin ensin</option>
            <option value="name-asc" className="text-black">A–Ö</option>
            <option value="name-desc" className="text-black">Ö–A</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Ei vielä projekteja.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Link
              key={`${item.source}:${item.id}:${item.href}`}
              href={item.href}
              className="block rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-white md:text-2xl">
                      {item.companyName}
                    </h3>

                    <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/60">
                      {item.industryLabel}
                    </span>

                    <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/45">
                      {item.source === "generated" ? "Generated" : "Seed"}
                    </span>
                  </div>

                  <p className="max-w-3xl text-sm leading-6 text-white/70">
                    {item.businessSummary}
                  </p>
                </div>

                <div className="shrink-0 space-y-2 text-sm text-white/55 md:text-right">
                  <p>{item.createdAt}</p>
                  <p>{item.status === "ready" ? "Ready" : "Draft"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
