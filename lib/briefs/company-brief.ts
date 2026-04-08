import type { CompanyArchetypeId } from "../briefs/archetype-id";

export type CompanyBriefPage = {
  id: string;
  pageType: "home" | "about" | "services" | "contact" | "landing" | "other";
  slug: string;
  navigationLabel: string;
  title: string;
  purpose: string;
  navVisible: boolean;
  footerVisible: boolean;
  isPrimary?: boolean;
};

export type CompanyBriefOffer = {
  title: string;
  summary: string;
};

export type CompanyBriefProofPoint = {
  id: string;
  type: "testimonial" | "stat" | "case" | "principle";
  title: string;
  body: string;
};

export type CompanyBrief = {
  companyName: string;
  inferredIndustryId: string;
  archetypeId: CompanyArchetypeId;

  targetAudienceSummary: string;
  positioningSummary: string;

  heroMessage: string;
  heroSupport: string;

  primaryConversionGoal: "quote" | "contact" | "booking" | "demo" | "project-start";
  primaryCTALabel: string;
  secondaryCTALabel: string;
  finalCTALabel: string;

  trustStrategy: string;

  coreOffer: CompanyBriefOffer;
  secondaryOffers: CompanyBriefOffer[];

  proofPoints: CompanyBriefProofPoint[];

  recommendedPageSet: CompanyBriefPage[];
};
