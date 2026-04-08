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
    id: `${brief.source.domain}:${brief.source.url}`,
    companyName: brief.source.companyName,
    domain: brief.source.domain,
    createdAt: new Date().toISOString(),
    href,
    summary:
      brief.content.summary ||
      brief.redesign.heroAngle ||
      "Structured redesign brief",
    briefText: JSON.stringify(brief, null, 2)
  };
}
