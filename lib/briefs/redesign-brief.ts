export type RedesignBriefImage = {
  id: string;
  url: string;
  sourceUrl: string;
  label?: string;
  kind?: "logo" | "hero" | "gallery" | "service" | "other";
  selected: boolean;
};

export type RedesignBriefContentReservoir = {
  services: string[];
  trustClaims: string[];
  contactPoints: string[];
  locations: string[];
  ctas: string[];
  rawSnippets: string[];
};

export type RedesignBriefPage = {
  sourceUrl: string;
  pageRole:
    | "home"
    | "service"
    | "service-category"
    | "contact"
    | "form"
    | "about"
    | "campaign"
    | "other";
  pageTitle: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  navItems: string[];
  ctas: string[];
  summary: string;
  rawText: string;
  contentBlocks: string[];
  keepSignals: string[];
  improveSignals: string[];
  imageUrls: string[];
  extractedServices: string[];
  extractedClaims: string[];
  extractedLocations: string[];
  extractedPhones: string[];
  extractedEmails: string[];
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

  contentReservoir: RedesignBriefContentReservoir;

  pages: RedesignBriefPage[];

  redesign: {
    globalDirection: string;
    homepageGoal: string;
    recommendedPages: string[];
    visualDirection: string;
    notesForAI: string[];
  };
};
