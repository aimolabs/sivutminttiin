import { getProjectById } from "@/lib/mock/projects";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/projects/status-badge";
import { ProjectSummaryCard } from "@/components/projects/project-summary-card";
import { ProjectAuditGrid } from "@/components/projects/project-audit-grid";

type Props = {
  params: { id: string };
};

export default function ProjectPage({ params }: Props) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          {project.siteProfile.companyName}
        </h1>
        <StatusBadge status={project.status} />
      </div>

      <ProjectSummaryCard project={project} />

      <ProjectAuditGrid project={project} />
    </div>
  );
}
