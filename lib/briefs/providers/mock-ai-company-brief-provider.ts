import type { CompanyBriefProvider, BuildCompanyBriefInput } from "./company-brief-provider";
import { inferIndustryResult } from "../infer-industry";
import { buildCompanyBrief } from "../build-company-brief";

function domainToCompanyName(domain: string): string {
  const withoutTld = domain.replace(/\.[^.]+$/, "");
  const cleaned = withoutTld.replace(/[-_]+/g, " ").trim();

  if (!cleaned) {
    return "Yritys";
  }

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const mockAICompanyBriefProvider: CompanyBriefProvider = {
  id: "mock-ai",
  async buildBrief({ snapshot }: BuildCompanyBriefInput) {
    const companyName = snapshot.companyNameCandidate || domainToCompanyName(snapshot.domain);
    const inferred = inferIndustryResult(snapshot);

    return buildCompanyBrief({
      companyName,
      snapshot,
      industry: inferred.industry,
      businessModel: inferred.businessModel,
      pageArchetype: inferred.pageArchetype
    });
  }
};
