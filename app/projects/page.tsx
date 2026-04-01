import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/projects/status-badge";
import { mockProjects } from "@/lib/mock/projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Internal dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Projektit
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Ensimmäinen vaihe käyttää staattista mock-dataa. Tavoite on rakentaa
            selkeä virta: projektilista → projektisivu → client preview.
          </p>
        </div>

        <section className="grid gap-4">
          {mockProjects.map((project) => (
            <article
              key={project.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">{project.companyName}</h2>
                    <StatusBadge status={project.status} />
                  </div>

                  <p className="mt-3 text-sm text-sky-300/80">{project.sourceUrl}</p>

                  <p className="mt-4 text-sm leading-6 text-white/70">
                    {project.businessSummary}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3">
                  <Link
                    href={`/projects/${project.id}`}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                  >
                    Avaa projekti
                  </Link>

                  <Link
                    href={`/projects/${project.id}/preview`}
                    className="rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                  >
                    Avaa preview
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}