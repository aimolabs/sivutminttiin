import type { NormalizedSourceSnapshot } from "../../source/normalize-source-snapshot";
import type { CompanyBrief } from "../company-brief";

export type BuildCompanyBriefInput = {
  snapshot: NormalizedSourceSnapshot;
};

export interface CompanyBriefProvider {
  id: string;
  buildBrief(input: BuildCompanyBriefInput): Promise<CompanyBrief>;
}
