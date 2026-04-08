export type RedesignBriefImage = {
  id: string;
  url: string;
  sourceUrl: string;
  label?: string;
  kind?: "logo" | "hero" | "gallery" | "service" | "other";
  selected: boolean;
};

export type RedesignBriefPage = {
  sourceUrl: string;
  pageRole: "home" | "services" | "about" | "contact" | "other";
  pageTitle: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  navItems: string[];
  ctas: string[];
  summary: string;
  keepSignals: string[];
  improveSignals: string[];
  imageUrls: string[];
};

export type RedesignBrief = {
  site: {
    companyName: string;
    domain: string;
    primaryUrl: string;
    additionalUrls: string[];
    allUrls: string[];
  };

  brand: {
    siteName?: string;
    logoUrl?: string;
    faviconUrl?: string;
    themeColor?: string;
    secondaryColors: string[];
  };

  assets: {
    heroImageCandidates: string[];
    logoCandidates: string[];
    galleryImages: string[];
    pageImages: Array<{
      url: string;
      sourceUrl: string;
      purposeHint?: string;
    }>;
    detectedImages: RedesignBriefImage[];
  };

  business: {
    industry?: string;
    audience?: string;
    coreOffer?: string;
    secondaryOffers: string[];
    locations: string[];
    trustSignals: string[];
    primaryCTA?: string;
  };

  pages: RedesignBriefPage[];

  redesign: {
    globalDirection: string;
    homepageGoal: string;
    recommendedPages: string[];
    visualDirection: string;
    notesForAI: string[];
  };
};
