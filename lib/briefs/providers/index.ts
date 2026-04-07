import type { CompanyBriefProvider } from "./company-brief-provider";
import { heuristicCompanyBriefProvider } from "./heuristic-company-brief-provider";
import { mockAICompanyBriefProvider } from "./mock-ai-company-brief-provider";

export function getCompanyBriefProvider(): CompanyBriefProvider {
  const provider = process.env.SIVUTMINTTIIN_BRIEF_PROVIDER ?? "heuristic";

  switch (provider) {
    case "mock-ai":
      return mockAICompanyBriefProvider;
    case "heuristic":
    default:
      return heuristicCompanyBriefProvider;
  }
}
