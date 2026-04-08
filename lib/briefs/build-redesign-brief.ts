import type { SourceSnapshot } from "../source/source-snapshot";
import { normalizeSourceSnapshot } from "../source/normalize-source-snapshot";
import { analyzeSourceSnapshot } from "../source/analyze-source-snapshot";
import { inferCompanySignals } from "../source/infer-company-signals";
import type { RedesignBrief, RedesignBriefPage, RedesignBriefImage } from "./redesign-brief";

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

function detectPageRole(input: {
  url: string;
  pageTitle: string;
  h1: string;
  navItems: string[];
}): RedesignBriefPage["pageRole"] {
  const text = [
    input.url,
    input.pageTitle,
    input.h1,
    ...input.navItems
  ]
    .join(" ")
    .toLowerCase();

  if (/yhteys|contact|ota-yhteytt|booking|varaa|ajanvaraus/.test(text)) {
    return "contact";
  }

  if (/palvelu|services|service|huolto|korjaus|remontti|osaamisalue/.test(text)) {
    return "services";
  }

  if (/meistä|about|yritys|company|asiantuntija/.test(text)) {
    return "about";
  }

  if (/etusivu|home/.test(text)) {
    return "home";
  }

  return "other";
}

function pickCoreOffer(
  primaryH1: string,
  primaryH2s: string[]
): string {
  if (primaryH1 && !/yhteystiedot|contact/i.test(primaryH1)) {
    return primaryH1;
  }

  const firstGoodH2 = primaryH2s.find((item) => !/yhteystiedot|contact/i.test(item));
  if (firstGoodH2) return firstGoodH2;

  return primaryH1 || "Pääpalvelu";
}

function pickRecommendedPages(pages: RedesignBriefPage[]): string[] {
  const roles = new Set(pages.map((page) => page.pageRole));
  const recommended: string[] = ["Etusivu"];

  if (roles.has("services")) recommended.push("Palvelut");
  if (roles.has("about")) recommended.push("Yritys");
  if (roles.has("contact")) recommended.push("Yhteystiedot");
  if (!roles.has("services")) recommended.push("Palvelut");
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

    for (const imageUrl of snapshot.imageUrls.slice(0, 8)) {
      items.push({
        id: `img-${items.length + 1}`,
        url: imageUrl,
        sourceUrl: snapshot.sourceUrl,
        label: snapshot.sourceUrl === primaryUrl ? "Primary page image" : "Detected page image",
        kind: snapshot.sourceUrl === primaryUrl ? "gallery" : "other",
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

  return uniqueByUrl(items).slice(0, 60).map((item, index) => ({
    ...item,
    id: `img-${index + 1}`
  }));
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

  const primarySignals = inferCompanySignals(primary);

  const pages: RedesignBriefPage[] = normalized.map((snapshot, index) => {
    const analysis = analyses[index];
    const pageRole =
      snapshot.sourceUrl === primaryUrl
        ? "home"
        : detectPageRole({
            url: snapshot.sourceUrl,
            pageTitle: snapshot.pageTitle,
            h1: snapshot.h1,
            navItems: snapshot.navItems
          });

    return {
      sourceUrl: snapshot.sourceUrl,
      pageRole,
      pageTitle: snapshot.pageTitle,
      metaDescription: snapshot.metaDescription,
      h1: snapshot.h1,
      h2s: snapshot.h2s,
      navItems: snapshot.navItems,
      ctas: snapshot.ctaTexts,
      summary: snapshot.usableTextSummary,
      keepSignals: [
        ...snapshot.navItems.slice(0, 3),
        ...snapshot.h2s.slice(0, 2)
      ].filter(Boolean),
      improveSignals: analysis.auditIssues.map((issue) => issue.title),
      imageUrls: unique(
        compact([snapshot.ogImageUrl, ...snapshot.imageUrls])
      ).slice(0, 12)
    };
  });

  const companyName = primary.companyNameCandidate;
  const domain = primary.domain;
  const coreOffer = pickCoreOffer(primary.h1, primary.h2s);

  const allH2s = unique(
    normalized.flatMap((snapshot) => snapshot.h2s)
  );

  const allCtas = unique(
    normalized.flatMap((snapshot) => snapshot.ctaTexts)
  );

  const allNavItems = unique(
    normalized.flatMap((snapshot) => snapshot.navItems)
  );

  const heroImageCandidates = unique(
    compact([
      primary.ogImageUrl,
      ...primary.imageUrls.slice(0, 6),
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
  ).slice(0, 60);

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
      audience: undefined,
      coreOffer,
      secondaryOffers: allH2s.slice(0, 8),
      locations: [],
      trustSignals: allSuggestions.slice(0, 6),
      primaryCTA: allCtas[0] || "Ota yhteyttä"
    },

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
        "Korjaa erityisesti nämä ongelmat:",
        ...allWeaknesses.slice(0, 6),
        "Hyödynnä näitä vahvuuksia ja säilytettäviä signaaleja:",
        ...allSuggestions.slice(0, 6),
        ...allNavItems.slice(0, 6)
      ]
    }
  };
}
