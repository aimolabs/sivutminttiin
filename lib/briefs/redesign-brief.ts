export type RedesignBrief = {
  source: {
    url: string;
    domain: string;
    companyName: string;
  };

  brand: {
    siteName?: string;
    logoUrl?: string;
    iconUrl?: string;
    themeColor?: string;
    imageUrls: string[];
  };

  business: {
    industry?: string;
    audience?: string;
    coreOffer?: string;
    secondaryOffers: string[];
    locations: string[];
  };

  content: {
    headings: string[];
    navItems: string[];
    ctas: string[];
    summary: string;
  };

  analysis: {
    strengths: string[];
    weaknesses: string[];
  };

  redesign: {
    heroAngle: string;
    primaryCTA: string;
    sections: Array<{
      id: string;
      purpose: string;
      direction: string;
    }>;
    keep: string[];
    improve: string[];
  };
};
