import { Project } from "@/lib/mock/projects";

type Props = {
  project: Project;
};

export function ProjectSummaryCard({ project }: Props) {
  return (
    <div className="border rounded-xl p-6 space-y-3">
      <p className="text-sm text-neutral-500">Yritys</p>
      <p className="text-lg font-semibold">
        {project.siteProfile.companyName}
      </p>

      <p className="text-sm text-neutral-500">Yhteenveto</p>
      <p className="text-neutral-700">{project.businessSummary}</p>
    </div>
  );
}
