import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/projects/status-badge";
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
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
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

            <Link
              href={`/projects/${project.id}/preview`}
              className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              Avaa client preview
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Audit findings</h2>

            <div className="mt-5 space-y-4">
              {project.auditIssues.map((issue) => (
                <div
                  key={issue.title}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <h3 className="text-base font-semibold">{issue.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {issue.detail}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Suggested sections</h2>

            <div className="mt-5 space-y-4">
              {project.suggestedSections.map((section) => (
                <div
                  key={section.name}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <h3 className="text-base font-semibold">{section.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {section.reason}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
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