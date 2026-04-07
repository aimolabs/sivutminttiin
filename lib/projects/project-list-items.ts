import type { Project } from "../mock/projects";

export type ProjectListItem = {
  id: string;
  companyName: string;
  industryLabel: string;
  businessSummary: string;
  createdAt: string;
  status: "draft" | "ready";
  href: string;
  source: "seed" | "generated";
};

export function mapProjectToListItem(project: Project): ProjectListItem {
  return {
    id: project.id,
    companyName: project.siteProfile.companyName,
    industryLabel: project.siteProfile.industry,
    businessSummary: project.businessSummary,
    createdAt: project.createdAt,
    status: project.status,
    href: `/projects/${project.id}`,
    source: "seed"
  };
}
