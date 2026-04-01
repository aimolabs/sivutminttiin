import { Project } from "@/lib/mock/projects";

type ProjectSummaryCardProps = {
  project: Project;
};

export function ProjectSummaryCard({ project }: ProjectSummaryCardProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
        Project summary
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Company
          </p>
          <p className="mt-2 text-lg font-semibold">{project.companyName}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Source URL
          </p>
          <p className="mt-2 break-all text-sm text-white/80">{project.sourceUrl}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Created
          </p>
          <p className="mt-2 text-sm text-white/80">{project.createdAt}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Output type
          </p>
          <p className="mt-2 text-sm text-white/80">
            Homepage redesign concept preview
          </p>
        </div>
      </div>
    </section>
  );
}