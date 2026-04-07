import type { CompanyBriefProvider, BuildCompanyBriefInput } from "./company-brief-provider";
import { inferCompanySignals } from "../../source/infer-company-signals";
import { resolveIndustryProfile } from "../../mock/industry-profiles";
import { getCompanyArchetype, resolveCompanyArchetypeId } from "../../mock/company-archetypes";
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

export const heuristicCompanyBriefProvider: CompanyBriefProvider = {
  id: "heuristic",
  async buildBrief({ snapshot }: BuildCompanyBriefInput) {
    const signals = inferCompanySignals(snapshot);
    const archetypeId = resolveCompanyArchetypeId(signals);
    signals.companyArchetypeId = archetypeId;

    const companyName = snapshot.companyNameCandidate || domainToCompanyName(snapshot.domain);
    const industryProfile = resolveIndustryProfile(snapshot.industrySignalText);
    const archetype = getCompanyArchetype(archetypeId);

    return buildCompanyBrief({
      companyName,
      snapshot,
      signals,
      industryProfile,
      archetype
    });
  }
};
