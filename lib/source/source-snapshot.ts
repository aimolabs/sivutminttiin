export type SourceSnapshot = {
  sourceUrl: string;
  domain: string;
  fetchStatus: "live" | "fallback";
  pageTitle: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  navItems: string[];
  ctaTexts: string[];
  bodyText: string;
};
