"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/mock/projects";

type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc";

type Props = {
  projects: Project[];
};

function sortProjects(projects: Project[], sort: SortOption): Project[] {
  const items = [...projects];

  switch (sort) {
    case "date-asc":
      return items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "name-asc":
      return items.sort((a, b) =>
        a.siteProfile.companyName.localeCompare(b.siteProfile.companyName, "fi")
      );
    case "name-desc":
      return items.sort((a, b) =>
        b.siteProfile.companyName.localeCompare(a.siteProfile.companyName, "fi")
      );
    case "date-desc":
    default:
      return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export function ProjectListClient({ projects }: Props) {
  const [sort, setSort] = useState<SortOption>("date-desc");

  const sortedProjects = useMemo(() => {
    return sortProjects(projects, sort);
  }, [projects, sort]);

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
            Projektit toimivat redesign-engine workflow’n lähtöpisteinä ja jatkuvana työjonona.
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
            <option value="date-desc">Uusin ensin</option>
            <option value="date-asc">Vanhin ensin</option>
            <option value="name-asc">A–Ö</option>
            <option value="name-desc">Ö–A</option>
          </select>
        </div>
      </div>

      {sortedProjects.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Ei vielä projekteja.
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-white md:text-2xl">
                      {project.siteProfile.companyName}
                    </h3>
                    <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/60">
                      {project.siteProfile.industry}
                    </span>
                  </div>

                  <p className="max-w-3xl text-sm leading-6 text-white/70">
                    {project.businessSummary}
                  </p>
                </div>

                <div className="shrink-0 space-y-2 text-sm text-white/55 md:text-right">
                  <p>{project.createdAt}</p>
                  <p>{project.status === "ready" ? "Ready" : "Draft"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
