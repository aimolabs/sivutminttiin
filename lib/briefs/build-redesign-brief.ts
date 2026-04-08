import type { SourceSnapshot } from "../source/source-snapshot";
import { normalizeSourceSnapshot } from "../source/normalize-source-snapshot";
import { analyzeSourceSnapshot } from "../source/analyze-source-snapshot";
import { inferCompanySignals } from "../source/infer-company-signals";
import type {
  RedesignBrief,
  RedesignBriefPage,
  RedesignBriefImage,
  RedesignBriefContentReservoir
} from "./redesign-brief";

type BuildRedesignBriefInput = {
  primaryUrl: string;
  additionalUrls: string[];
  snapshots: SourceSnapshot[];
};

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function compact(values: Array<string | undefined | null>): string[] {
  return values.map((value) => (value ?? "").trim()).filter(Boolean);
}

function uniqueByUrl<T extends { url: string }>(values: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const value of values) {
    if (seen.has(value.url)) continue;
    seen.add(value.url);
    result.push(value);
  }

  return result;
}

function pickContentBlocks(
  bodyText: string,
  paragraphTexts: string[]
): string[] {
  const blocks = [
    ...paragraphTexts,
    ...bodyText
      .split(/(?<=[.!?])\s+/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 60 && item.length <= 320)
  ];

  return unique(blocks).slice(0, 16);
}

function extractLocationsFromTexts(values: string[]): string[] {
  const text = values.join(" ");
  const matches = text.match(
    /\b(Helsinki|Espoo|Vantaa|Kauniainen|Tampere|Turku|Oulu|Jyväskylä|Lahti|Kuopio|Klaukkala|Konala|Nurmijärvi|Uusimaa|Pirkanmaa|Suomi|Finland)\b/gi
  ) ?? [];

  return unique(matches.map((item) => item.trim())).slice(0, 12);
}

function extractCandidateServices(input: {
  pageTitle: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  navItems: string[];
}): string[] {
  const candidates = [
    ...input.h2s,
    ...input.navItems,
    input.h1,
    input.pageTitle,
    input.metaDescription
  ]
    .map((item) => item.trim())
    .filter(Boolean);

  return unique(
    candidates.filter((item) => {
      const lower = item.toLowerCase();
      if (item.length < 3 || item.length > 90) return false;
      if (/^(yhteystiedot|contact|etusivu|home)$/i.test(item)) return false;
      if (/facebook/i.test(item)) return false;
      if (/tarjouspyyntölomake/i.test(lower)) return false;
      return (
        /huolto|korjaus|jarru|jousi|laakeri|ilmastointi|rengas|vanne|poistomyynti|autokorjaamo|autohuolto|palvelu/i.test(
          lower
        ) || item.split(" ").length <= 4
      );
    })
  ).slice(0, 10);
}

function extractClaims(contentBlocks: string[]): string[] {
  return unique(
    contentBlocks.filter((item) => {
      const lower = item.toLowerCase();
      return (
        item.length >= 30 &&
        item.length <= 220 &&
        (
          /vahvuus|joustavuus|nopeus|laatu|kokemus|asiakas|palvelu|ammattil/i.test(lower) ||
          /kannattaa|muistakaa|toimitamme|tarjoamme|varmistamme|teemme/i.test(lower)
        )
      );
    })
  ).slice(0, 8);
}

function detectPageRole(input: {
  sourceUrl: string;
  pageTitle: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  ctas: string[];
  navItems: string[];
  contentBlocks: string[];
}): RedesignBriefPage["pageRole"] {
  const text = [
    input.sourceUrl,
    input.pageTitle,
    input.metaDescription,
    input.h1,
    ...input.h2s,
    ...input.ctas,
    ...input.navItems,
    ...input.contentBlocks.slice(0, 4)
  ]
    .join(" ")
    .toLowerCase();

  if (/lomake\.html|tarjouspyyntölomake|lähetä tarjouspyyntö|tarjouspyyntö/.test(text)) {
    return "form";
  }

  if (
    /yhteystiedot|contact|ota yhteyttä|toimipiste|facebook klaukkala|facebook konala/.test(text)
  ) {
    return "contact";
  }

  if (
    /ilmastointi|jarru|jousi|laakeri|rengas|vanne|autohuolto|autokorjaamo|poistomyynti/.test(text)
  ) {
    if (/palvelut|services|osaamisalue/.test(text)) {
      return "service-category";
    }

    return "service";
  }

  if (/meistä|about|yritys|asiantuntija/.test(text)) {
    return "about";
  }

  if (/kampanja|campaign|poistomyynti/.test(text)) {
    return "campaign";
  }

  return "other";
}

function pickCoreOffer(primaryPage: RedesignBriefPage): string {
  const serviceCandidate =
    primaryPage.extractedServices[0] ||
    primaryPage.h2s.find((item) => !/yhteystiedot|contact/i.test(item)) ||
    primaryPage.metaDescription ||
    primaryPage.h1;

  return serviceCandidate || "Pääpalvelu";
}

function pickRecommendedPages(pages: RedesignBriefPage[]): string[] {
  const roles = new Set(pages.map((page) => page.pageRole));
  const recommended: string[] = ["Etusivu"];

  if (roles.has("service") || roles.has("service-category")) recommended.push("Palvelut");
  if (roles.has("about")) recommended.push("Yritys");
  if (roles.has("contact")) recommended.push("Yhteystiedot");
  if (roles.has("form")) recommended.push("Tarjouspyyntö");

  if (!roles.has("service") && !roles.has("service-category")) recommended.push("Palvelut");
  if (!roles.has("contact")) recommended.push("Yhteystiedot");

  return unique(recommended).slice(0, 6);
}

function buildDetectedImages(
  normalized: ReturnType<typeof normalizeSourceSnapshot>[],
  primaryUrl: string
): RedesignBriefImage[] {
  const items: RedesignBriefImage[] = [];

  for (const snapshot of normalized) {
    if (snapshot.ogImageUrl) {
      items.push({
        id: `img-${items.length + 1}`,
        url: snapshot.ogImageUrl,
        sourceUrl: snapshot.sourceUrl,
        label: snapshot.sourceUrl === primaryUrl ? "Primary page OG image" : "Page OG image",
        kind: snapshot.sourceUrl === primaryUrl ? "hero" : "gallery",
        selected: snapshot.sourceUrl === primaryUrl
      });
    }

    for (const imageUrl of snapshot.imageUrls.slice(0, 12)) {
      const lower = imageUrl.toLowerCase();

      items.push({
        id: `img-${items.length + 1}`,
        url: imageUrl,
        sourceUrl: snapshot.sourceUrl,
        label: snapshot.sourceUrl === primaryUrl ? "Primary page image" : "Detected page image",
        kind:
          /logo|icon|favicon/.test(lower)
            ? "logo"
            : /screen|screenshot/.test(lower)
              ? "other"
              : snapshot.sourceUrl === primaryUrl
                ? "gallery"
                : "service",
        selected: false
      });
    }

    if (snapshot.iconUrl) {
      items.push({
        id: `img-${items.length + 1}`,
        url: snapshot.iconUrl,
        sourceUrl: snapshot.sourceUrl,
        label: "Favicon / icon",
        kind: "logo",
        selected: snapshot.sourceUrl === primaryUrl
      });
    }
  }

  return uniqueByUrl(items).slice(0, 80).map((item, index) => ({
    ...item,
    id: `img-${index + 1}`
  }));
}

function buildContentReservoir(pages: RedesignBriefPage[]): RedesignBriefContentReservoir {
  return {
    services: unique(pages.flatMap((page) => page.extractedServices)).slice(0, 24),
    trustClaims: unique(
      pages.flatMap((page) => [...page.extractedClaims, ...page.keepSignals])
    ).slice(0, 24),
    contactPoints: unique(
      pages.flatMap((page) => [
        ...page.extractedPhones,
        ...page.extractedEmails,
        ...page.ctas
      ])
    ).slice(0, 24),
    locations: unique(pages.flatMap((page) => page.extractedLocations)).slice(0, 16),
    ctas: unique(pages.flatMap((page) => page.ctas)).slice(0, 16),
    rawSnippets: unique(
      pages.flatMap((page) => page.contentBlocks.slice(0, 6))
    ).slice(0, 40)
  };
}

export function buildRedesignBrief({
  primaryUrl,
  additionalUrls,
  snapshots
}: BuildRedesignBriefInput): RedesignBrief {
  const normalized = snapshots.map((snapshot) => normalizeSourceSnapshot(snapshot));
  const primary =
    normalized.find((snapshot) => snapshot.sourceUrl === primaryUrl) ??
    normalized[0];

  const analyses = normalized.map((snapshot) =>
    analyzeSourceSnapshot(snapshot, snapshot.companyNameCandidate)
  );

  const pages: RedesignBriefPage[] = normalized.map((snapshot, index) => {
    const analysis = analyses[index];
    const contentBlocks = pickContentBlocks(snapshot.bodyText, snapshot.paragraphTexts);

    const preliminaryRole =
      snapshot.sourceUrl === primaryUrl
        ? "home"
        : detectPageRole({
            sourceUrl: snapshot.sourceUrl,
            pageTitle: snapshot.pageTitle,
            metaDescription: snapshot.metaDescription,
            h1: snapshot.h1,
            h2s: snapshot.h2s,
            ctas: snapshot.ctaTexts,
            navItems: snapshot.navItems,
            contentBlocks
          });

    const extractedServices = extractCandidateServices({
      pageTitle: snapshot.pageTitle,
      metaDescription: snapshot.metaDescription,
      h1: snapshot.h1,
      h2s: snapshot.h2s,
      navItems: snapshot.navItems
    });

    const extractedLocations = extractLocationsFromTexts([
      snapshot.pageTitle,
      snapshot.metaDescription,
      snapshot.h1,
      ...snapshot.h2s,
      ...contentBlocks
    ]);

    const extractedClaims = extractClaims(contentBlocks);

    return {
      sourceUrl: snapshot.sourceUrl,
      pageRole: preliminaryRole,
      pageTitle: snapshot.pageTitle,
      metaDescription: snapshot.metaDescription,
      h1: snapshot.h1,
      h2s: snapshot.h2s,
      navItems: snapshot.navItems,
      ctas: snapshot.ctaTexts,
      summary: snapshot.usableTextSummary,
      rawText: snapshot.bodyText,
      contentBlocks,
      keepSignals: [
        ...snapshot.navItems.slice(0, 4),
        ...snapshot.h2s.slice(0, 3),
        ...extractedClaims.slice(0, 2)
      ].filter(Boolean),
      improveSignals: analysis.auditIssues.map((issue) => issue.title),
      imageUrls: unique(compact([snapshot.ogImageUrl, ...snapshot.imageUrls])).slice(0, 16),
      extractedServices,
      extractedClaims,
      extractedLocations,
      extractedPhones: snapshot.phoneNumbers,
      extractedEmails: snapshot.emailAddresses
    };
  });

  const primaryPage =
    pages.find((page) => page.sourceUrl === primaryUrl) ??
    pages[0];

  const primarySignals = inferCompanySignals(primary);
  const companyName = primary.companyNameCandidate;
  const domain = primary.domain;
  const contentReservoir = buildContentReservoir(pages);
  const coreOffer = pickCoreOffer(primaryPage);

  const heroImageCandidates = unique(
    compact([
      primary.ogImageUrl,
      ...primary.imageUrls.slice(0, 8),
      ...normalized.flatMap((snapshot) => compact([snapshot.ogImageUrl]))
    ])
  );

  const logoCandidates = unique(
    compact([primary.iconUrl, ...normalized.map((snapshot) => snapshot.iconUrl)])
  );

  const pageImages = uniqueByUrl(
    normalized.flatMap((snapshot) =>
      unique(compact([snapshot.ogImageUrl, ...snapshot.imageUrls])).map((url) => ({
        url,
        sourceUrl: snapshot.sourceUrl,
        purposeHint: snapshot.sourceUrl === primaryUrl ? "primary-page-image" : "page-image"
      }))
    )
  ).slice(0, 80);

  const detectedImages = buildDetectedImages(normalized, primaryUrl);

  const allWeaknesses = unique(
    analyses.flatMap((analysis) => analysis.auditIssues.map((issue) => issue.title))
  );

  const allSuggestions = unique(
    analyses.flatMap((analysis) =>
      analysis.suggestedSections.map((suggestion) => suggestion.name)
    )
  );

  return {
    site: {
      companyName,
      domain,
      primaryUrl,
      additionalUrls,
      allUrls: [primaryUrl, ...additionalUrls]
    },

    brand: {
      siteName: primary.siteName || companyName,
      logoUrl: "",
      faviconUrl: primary.iconUrl,
      themeColor: primary.themeColor,
      secondaryColors: []
    },

    assets: {
      heroImageCandidates,
      logoCandidates,
      galleryImages: heroImageCandidates.slice(1),
      pageImages,
      detectedImages
    },

    business: {
      industry: primarySignals.industryId,
      audience: contentReservoir.locations.length
        ? `Palvelee alueilla: ${contentReservoir.locations.join(", ")}`
        : undefined,
      coreOffer,
      secondaryOffers: contentReservoir.services.slice(0, 12),
      locations: contentReservoir.locations,
      trustSignals: unique([
        ...allSuggestions,
        ...contentReservoir.trustClaims.slice(0, 8)
      ]).slice(0, 12),
      primaryCTA: contentReservoir.ctas[0] || "Ota yhteyttä"
    },

    contentReservoir,

    pages,

    redesign: {
      globalDirection:
        "Säilytä yrityksen tunnistettavat brand-signaalit, mutta rakenna selkeämpi, kaupallisempi ja visuaalisesti vahvempi kokonaisuus.",
      homepageGoal:
        "Tee yrityksen arvolupaus, tärkeimmät palvelut ja ensisijainen CTA heti ymmärrettäviksi.",
      recommendedPages: pickRecommendedPages(pages),
      visualDirection:
        "Hyödynnä lähdesivun kuvia, faviconia, mahdollisia brand-värejä ja sisältösignaaleja. Älä tee geneeristä templatea.",
      notesForAI: [
        `Primary URL toimii etusivun lähteenä: ${primaryUrl}`,
        "Säilytä liiketoiminnan todellinen sisältö, älä keksi uusia palveluita ilman signaaleja.",
        "Käytä vain selected=true merkittyjä kuvia, logoja ja assetteja generation pohjana.",
        "Käytä pages[].rawText, pages[].contentBlocks ja contentReservoir-osiota aktiivisena lähdesisältönä.",
        "Korjaa erityisesti nämä ongelmat:",
        ...allWeaknesses.slice(0, 8),
        "Hyödynnä näitä vahvuuksia ja säilytettäviä signaaleja:",
        ...contentReservoir.services.slice(0, 8),
        ...contentReservoir.trustClaims.slice(0, 8)
      ]
    }
  };
}
