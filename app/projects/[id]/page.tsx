import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/projects/status-badge";
import { ProjectAuditGrid } from "@/components/projects/project-audit-grid";
import { ProjectSummaryCard } from "@/components/projects/project-summary-card";
import { getProjectById } from "@/lib/mock/projects";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  {project.companyName}
                </h1>
                <StatusBadge status={project.status} />
              </div>

              <p className="mt-4 text-sm text-sky-300/80">{project.sourceUrl}</p>

              <p className="mt-5 text-base leading-7 text-white/75">
                {project.businessSummary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/projects/${project.id}/preview`}
                className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Avaa client preview
              </Link>

              <Link
                href="/projects"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Takaisin projekteihin
              </Link>
            </div>
          </div>
        </section>

        <ProjectSummaryCard project={project} />
        <ProjectAuditGrid project={project} />

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Style direction
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            {project.redesign.styleDirection}
          </p>
        </section>
      </div>
    </main>
  );
}