import { Project } from "@/lib/mock/projects";

type ProjectAuditGridProps = {
  project: Project;
};

export function ProjectAuditGrid({ project }: ProjectAuditGridProps) {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Audit findings</h2>

        <div className="mt-5 space-y-4">
          {project.auditIssues.map((issue) => (
            <div
              key={issue.title}
              className="rounded-2xl border border-white/10 bg-black/10 p-4"
            >
              <h3 className="text-base font-semibold">{issue.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{issue.detail}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Suggested sections</h2>

        <div className="mt-5 space-y-4">
          {project.suggestedSections.map((section) => (
            <div
              key={section.name}
              className="rounded-2xl border border-white/10 bg-black/10 p-4"
            >
              <h3 className="text-base font-semibold">{section.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{section.reason}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}