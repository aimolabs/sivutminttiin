import type { RedesignBrief } from "./redesign-brief";

export type BriefListItem = {
  id: string;
  companyName: string;
  domain: string;
  createdAt: string;
  href: string;
  summary: string;
  briefText: string;
};

export function mapBriefToListItem(
  brief: RedesignBrief,
  href: string
): BriefListItem {
  return {
    id: `${brief.site.domain}:${brief.site.primaryUrl}`,
    companyName: brief.site.companyName,
    domain: brief.site.domain,
    createdAt: new Date().toISOString(),
    href,
    summary:
      brief.business.coreOffer ||
      brief.redesign.homepageGoal ||
      "Structured redesign brief",
    briefText: JSON.stringify(brief, null, 2)
  };
}
