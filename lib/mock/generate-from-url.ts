import type {
  AssetSlot,
  CTA,
  PageSEO,
  Project,
  ProjectPage,
  ProjectSection,
  RedesignSection,
  SiteSEO,
  SitemapItem,
  StyleDirection,
  TrustItem
} from "./projects";
import type { StylePresetId } from "./style-presets";
import { STYLE_PRESETS } from "./style-presets";
import { resolveIndustryProfile, type IndustryPageBlueprint } from "./industry-profiles";
import { applyStylePresetToContent } from "./apply-style-preset";
import { buildSectionPlan } from "./section-plans";
import type { SourceSnapshot } from "../source/source-snapshot";
import { fetchSourceSnapshot } from "../source/fetch-source-snapshot";
import {
  normalizeSourceSnapshot,
  type NormalizedSourceSnapshot
} from "../source/normalize-source-snapshot";
import { analyzeSourceSnapshot } from "../source/analyze-source-snapshot";

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

function resolveStylePreset(input?: string): StylePresetId {
  switch (input) {
    case "minimal-trust":
    case "premium-dark":
    case "bold-modern":
    case "editorial-clean":
      return input;
    default:
      return "premium-dark";
  }
}

function buildStyleDirection(stylePresetId: StylePresetId): StyleDirection {
  const preset = STYLE_PRESETS[stylePresetId];

  return {
    stylePresetId,
    visualTone: preset.label,
    density:
      preset.layout.density === "compact"
        ? "compact"
        : preset.layout.density === "spacious"
          ? "spacious"
          : "balanced",
    contrastLevel: preset.visual.theme === "dark" ? "high" : "medium",
    layoutDirection: preset.layout.emphasis,
    interactionMood: preset.copy.tone
  };
}

function resolveCompanyName(snapshot: NormalizedSourceSnapshot): string {
  return snapshot.companyNameCandidate || domainToCompanyName(snapshot.domain);
}

function buildBusinessSummary(
  snapshot: NormalizedSourceSnapshot,
  companyName: string
): string {
  const parts: string[] = [];

  if (snapshot.pageTitle) {
    parts.push(
      `Nykyinen sivu viestii tällä hetkellä otsikolla "${snapshot.pageTitle}".`
    );
  }

  if (snapshot.metaDescription) {
    parts.push(
      `Meta-kuvauksen perusteella ${companyName} painottaa tällä hetkellä viestiä "${snapshot.metaDescription}".`
    );
  } else if (snapshot.h1) {
    parts.push(
      `Etusivun pääotsikko näyttää tällä hetkellä olevan "${snapshot.h1}".`
    );
  }

  parts.push(
    "Uudistetun konseptin tavoite on tehdä arvolupaus selkeämmäksi, nostaa luottamusta ja ohjata kävijä nopeammin oikeaan seuraavaan toimintaan."
  );

  return parts.join(" ");
}

function buildSiteSEO(input: {
  companyName: string;
  domain: string;
  metaDescription: string;
  industryDescription: string;
  areaServed?: string;
}): SiteSEO {
  const canonicalBase = `https://${input.domain}`;

  return {
    siteName: input.companyName,
    titleSuffix: ` | ${input.companyName}`,
    titlePattern: `%PAGE_TITLE% | ${input.companyName}`,
    defaultTitle: input.companyName,
    defaultMetaDescription:
      input.metaDescription ||
      `${input.companyName} tarjoaa palveluitaan selkeästi, uskottavasti ja yhteydenottoon ohjaavasti.`,
    canonicalDomain: canonicalBase,
    canonicalBase,
    robotsDefault: "index,follow",
    sitemapEnabled: true,
    defaultOgImageAssetSlot: "asset-og-default",
    schemaProfileType: "LocalBusiness",
    schemaProfileName: input.companyName,
    schemaProfileDescription: input.industryDescription,
    schemaProfileAreaServed: input.areaServed,
    schemaProfileSameAsLinks: []
  };
}

function buildPageSEO(input: {
  pageId: string;
  pageType: "home" | "about" | "services" | "contact" | "landing" | "other";
  pagePurpose: string;
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  primaryTopic: string;
  secondaryTopics: string[];
  searchIntent: string;
  schemaType: string;
  internalLinkTargets: string[];
  targetLocations?: string[];
  targetServices?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImageAssetSlot?: string;
}): PageSEO {
  return {
    pageId: input.pageId,
    pageType: input.pageType,
    pagePurpose: input.pagePurpose,
    searchIntent: input.searchIntent,
    primaryTopic: input.primaryTopic,
    secondaryTopics: input.secondaryTopics,
    slug: input.slug,
    title: input.title,
    metaDescription: input.metaDescription,
    h1: input.h1,
    canonicalPath: input.slug,
    indexable: true,
    robots: "index,follow",
    schemaType: input.schemaType,
    targetLocations: input.targetLocations ?? [],
    targetServices: input.targetServices ?? [],
    internalLinkTargets: input.internalLinkTargets,
    ogTitle: input.ogTitle ?? input.title,
    ogDescription: input.ogDescription ?? input.metaDescription,
    ogImageAssetSlot: input.ogImageAssetSlot ?? "asset-og-default"
  };
}

function buildAssetSlots(companyName: string): AssetSlot[] {
  return [
    {
      id: "asset-og-default",
      type: "image",
      purpose: "og-default",
      altText: `${companyName} Open Graph -kuva`
    },
    {
      id: "asset-og-home",
      type: "image",
      purpose: "og-page",
      altText: `${companyName} etusivun Open Graph -kuva`
    }
  ];
}

function buildCTAs(input: {
  primaryLabel: string;
  secondaryLabel: string;
  finalLabel: string;
}): CTA[] {
  return [
    {
      id: "cta-home-primary",
      label: input.primaryLabel,
      actionType: "quote",
      target: "/yhteys",
      goal: "primary-conversion",
      placement: "hero"
    },
    {
      id: "cta-home-secondary",
      label: input.secondaryLabel,
      actionType: "navigation",
      target: "/palvelut",
      goal: "secondary-action",
      placement: "hero"
    },
    {
      id: "cta-final-contact",
      label: input.finalLabel,
      actionType: "contact",
      target: "/yhteys",
      goal: "primary-conversion",
      placement: "final"
    }
  ];
}

function buildTrustItems(
  testimonials: Extract<RedesignSection, { type: "testimonials" }>
): TrustItem[] {
  return testimonials.items.map((item, index) => ({
    id: `trust-testimonial-${index + 1}`,
    type: "testimonial",
    title: item.name,
    body: item.quote,
    proofStrength: "medium"
  }));
}

function servicesToSectionItems(
  section: Extract<RedesignSection, { type: "services" }>
) {
  return section.items.map((item, index) => ({
    id: `service-item-${index + 1}`,
    title: item.title,
    body: item.description
  }));
}

function buildStructuredHomeSections(input: {
  hero: Extract<RedesignSection, { type: "hero" }>;
  services: Extract<RedesignSection, { type: "services" }>;
  about: Extract<RedesignSection, { type: "about" }>;
  testimonials: Extract<RedesignSection, { type: "testimonials" }>;
  cta: Extract<RedesignSection, { type: "cta" }>;
  orderedLegacySections: RedesignSection[];
  trustItems: TrustItem[];
}): ProjectSection[] {
  const sectionMap: Record<RedesignSection["type"], ProjectSection> = {
    hero: {
      id: "home-hero",
      type: "hero",
      sectionRole: "value-proposition",
      eyebrow: input.hero.eyebrow,
      heading: input.hero.headline,
      body: input.hero.subheadline,
      ctaIds: ["cta-home-primary", "cta-home-secondary"],
      trustItemIds: [],
      assetSlotIds: [],
      seoHints: {
        sectionId: "home-hero",
        sectionRole: "value-proposition",
        targetSubtopic: input.hero.eyebrow.toLowerCase(),
        anchorId: "etusivu-hero",
        faqEligible: false
      }
    },
    services: {
      id: "home-services",
      type: "services",
      sectionRole: "service-overview",
      heading: input.services.title,
      items: servicesToSectionItems(input.services),
      ctaIds: [],
      trustItemIds: [],
      assetSlotIds: [],
      seoHints: {
        sectionId: "home-services",
        sectionRole: "service-overview",
        targetSubtopic: input.services.title.toLowerCase(),
        anchorId: "palvelut",
        faqEligible: false
      }
    },
    about: {
      id: "home-about",
      type: "about",
      sectionRole: "supporting",
      heading: input.about.title,
      body: input.about.body,
      ctaIds: [],
      trustItemIds: [],
      assetSlotIds: []
    },
    testimonials: {
      id: "home-testimonials",
      type: "testimonials",
      sectionRole: "trust-building",
      heading: input.testimonials.title,
      ctaIds: [],
      trustItemIds: input.trustItems.map((item) => item.id),
      assetSlotIds: []
    },
    cta: {
      id: "home-cta",
      type: "cta",
      sectionRole: "conversion",
      heading: input.cta.title,
      body: input.cta.body,
      ctaIds: ["cta-final-contact"],
      trustItemIds: [],
      assetSlotIds: []
    }
  };

  return input.orderedLegacySections.map((section) => sectionMap[section.type]);
}

function buildAboutSections(companyName: string, testimonialsTitle: string): ProjectSection[] {
  return [
    {
      id: "about-company",
      type: "about",
      sectionRole: "trust-building",
      heading: `${companyName} yrityksenä`,
      body:
        "Tämän sivun tarkoitus on tehdä yrityksen toimintatavasta, kokemuksesta ja luotettavuudesta näkyvämpi osa kokonaisuutta.",
      ctaIds: [],
      trustItemIds: [],
      assetSlotIds: []
    },
    {
      id: "about-testimonials",
      type: "testimonials",
      sectionRole: "trust-building",
      heading: testimonialsTitle,
      ctaIds: [],
      trustItemIds: ["trust-testimonial-1", "trust-testimonial-2"],
      assetSlotIds: []
    },
    {
      id: "about-cta",
      type: "cta",
      sectionRole: "conversion",
      heading: "Keskustellaan projektistasi",
      body:
        "Yrityssivun tehtävä ei ole vain kertoa historiasta, vaan tukea seuraavaa askelta kohti yhteydenottoa.",
      ctaIds: ["cta-final-contact"],
      trustItemIds: [],
      assetSlotIds: []
    }
  ];
}

function buildServicesSections(
  servicesSection: Extract<RedesignSection, { type: "services" }>
): ProjectSection[] {
  return [
    {
      id: "services-overview",
      type: "services",
      sectionRole: "service-overview",
      heading: servicesSection.title,
      items: servicesToSectionItems(servicesSection),
      ctaIds: [],
      trustItemIds: [],
      assetSlotIds: []
    },
    {
      id: "services-supporting",
      type: "about",
      sectionRole: "supporting",
      heading: "Miten palvelusivu toimii paremmin",
      body:
        "Palvelusivun tarkoitus on tehdä tarjoomasta helposti ymmärrettävä, tukea päätöksentekoa ja ohjata kävijä suoraan oikeaan toimintoon.",
      ctaIds: [],
      trustItemIds: [],
      assetSlotIds: []
    },
    {
      id: "services-cta",
      type: "cta",
      sectionRole: "conversion",
      heading: "Pyydä tarjous oikeasta palvelusta",
      body:
        "Kun palvelut on jäsennelty selkeästi, kiinnostunut kävijä etenee helpommin yhteydenottoon.",
      ctaIds: ["cta-home-primary"],
      trustItemIds: [],
      assetSlotIds: []
    }
  ];
}

function buildContactSections(
  ctaTitle: string,
  ctaBody: string
): ProjectSection[] {
  return [
    {
      id: "contact-about",
      type: "about",
      sectionRole: "conversion",
      heading: "Ota yhteyttä",
      body:
        "Yhteyssivun tehtävä on poistaa kitkaa ja tehdä ensimmäisestä yhteydenotosta mahdollisimman helppo.",
      ctaIds: [],
      trustItemIds: [],
      assetSlotIds: []
    },
    {
      id: "contact-cta",
      type: "cta",
      sectionRole: "conversion",
      heading: ctaTitle,
      body: ctaBody,
      ctaIds: ["cta-final-contact"],
      trustItemIds: [],
      assetSlotIds: []
    }
  ];
}

function buildOtherSections(
  companyName: string,
  blueprint: IndustryPageBlueprint
): ProjectSection[] {
  return [
    {
      id: `${blueprint.id}-intro`,
      type: "about",
      sectionRole: "supporting",
      heading: blueprint.title,
      body: `${companyName} tarvitsee sivun, jonka tarkoitus on: ${blueprint.purpose.toLowerCase()}.`,
      ctaIds: [],
      trustItemIds: [],
      assetSlotIds: []
    },
    {
      id: `${blueprint.id}-cta`,
      type: "cta",
      sectionRole: "conversion",
      heading: "Jatketaan seuraavaan askeleeseen",
      body:
        "Tämän sivun pitää tukea selkeästi yhtä tarkoitusta ja ohjata kävijä eteenpäin ilman kitkaa.",
      ctaIds: ["cta-final-contact"],
      trustItemIds: [],
      assetSlotIds: []
    }
  ];
}

function inferSearchIntent(pageType: IndustryPageBlueprint["pageType"]): string {
  switch (pageType) {
    case "home":
      return "homepage conversion";
    case "services":
      return "service discovery";
    case "about":
      return "company credibility";
    case "contact":
      return "contact conversion";
    default:
      return "supporting page intent";
  }
}

function inferSchemaType(pageType: IndustryPageBlueprint["pageType"]): string {
  switch (pageType) {
    case "home":
      return "WebPage";
    case "services":
      return "CollectionPage";
    case "about":
      return "AboutPage";
    case "contact":
      return "ContactPage";
    default:
      return "WebPage";
  }
}

function buildPages(input: {
  companyName: string;
  industryProfile: ReturnType<typeof resolveIndustryProfile>;
  siteSEO: SiteSEO;
  servicesSection: Extract<RedesignSection, { type: "services" }>;
  testimonialsSection: Extract<RedesignSection, { type: "testimonials" }>;
  ctaSection: Extract<RedesignSection, { type: "cta" }>;
  homeSections: ProjectSection[];
}): { sitemap: SitemapItem[]; pages: ProjectPage[] } {
  const targetServices = input.servicesSection.items.map((item) => item.title);
  const targetLocations = [input.industryProfile.audience];

  const sitemap: SitemapItem[] = input.industryProfile.pageBlueprints.map((blueprint) => ({
    pageId: blueprint.id,
    slug: blueprint.slug,
    pageType: blueprint.pageType,
    title: blueprint.title,
    purpose: blueprint.purpose,
    navigationLabel: blueprint.navigationLabel,
    navVisible: blueprint.navVisible,
    footerVisible: blueprint.footerVisible,
    isPrimary: blueprint.isPrimary
  }));

  const pages: ProjectPage[] = input.industryProfile.pageBlueprints.map((blueprint) => {
    let sections: ProjectSection[];

    switch (blueprint.pageType) {
      case "home":
        sections = input.homeSections;
        break;
      case "about":
        sections = buildAboutSections(input.companyName, input.testimonialsSection.title);
        break;
      case "services":
        sections = buildServicesSections(input.servicesSection);
        break;
      case "contact":
        sections = buildContactSections(input.ctaSection.title, input.ctaSection.body);
        break;
      default:
        sections = buildOtherSections(input.companyName, blueprint);
        break;
    }

    const h1 =
      sections.find((section) => section.type === "hero")?.heading ??
      sections[0]?.heading ??
      blueprint.title;

    const title =
      blueprint.pageType === "home"
        ? `${input.industryProfile.label} ${input.industryProfile.audience}`
        : blueprint.title === blueprint.navigationLabel
          ? `${blueprint.title} | ${input.companyName}`
          : `${blueprint.title}`;

    const metaDescription =
      blueprint.pageType === "home"
        ? input.siteSEO.defaultMetaDescription
        : `${input.companyName}: ${blueprint.purpose}.`;

    const secondaryTopics =
      blueprint.pageType === "services"
        ? targetServices
        : blueprint.pageType === "about"
          ? ["luotettavuus", "kokemus", "toimintatapa"]
          : blueprint.pageType === "contact"
            ? ["yhteydenotto", "seuraava askel"]
            : [blueprint.purpose];

    return {
      pageId: blueprint.id,
      slug: blueprint.slug,
      pageType: blueprint.pageType,
      title: blueprint.title,
      purpose: blueprint.purpose,
      navigationLabel: blueprint.navigationLabel,
      navVisible: blueprint.navVisible,
      footerVisible: blueprint.footerVisible,
      isPrimary: blueprint.isPrimary,
      pageSEO: buildPageSEO({
        pageId: blueprint.id,
        pageType: blueprint.pageType,
        pagePurpose: blueprint.purpose,
        slug: blueprint.slug,
        title,
        metaDescription,
        h1,
        primaryTopic: blueprint.purpose,
        secondaryTopics,
        searchIntent: inferSearchIntent(blueprint.pageType),
        schemaType: inferSchemaType(blueprint.pageType),
        internalLinkTargets: sitemap
          .filter((item) => item.pageId !== blueprint.id)
          .map((item) => item.slug),
        targetLocations,
        targetServices: blueprint.pageType === "services" ? targetServices : [],
        ogTitle: title,
        ogDescription: metaDescription,
        ogImageAssetSlot: blueprint.pageType === "home" ? "asset-og-home" : "asset-og-default"
      }),
      sections
    };
  });

  return { sitemap, pages };
}

export function buildProjectFromSourceSnapshot(
  rawSnapshot: SourceSnapshot,
  options?: { stylePreset?: string }
): Project {
  const snapshot = normalizeSourceSnapshot(rawSnapshot);
  const companyName = resolveCompanyName(snapshot);
  const stylePreset = resolveStylePreset(options?.stylePreset);
  const styleDirection = buildStyleDirection(stylePreset);
  const industryProfile = resolveIndustryProfile(snapshot.industrySignalText);
  const sourceAnalysis = analyzeSourceSnapshot(snapshot, companyName);

  const baseAboutBody =
    "Konsepti tekee sivusta myynnillisesti terävämmän. Kävijä näkee nopeammin mitä tarjotaan, miksi siihen kannattaa luottaa ja mitä seuraavaksi kannattaa tehdä. Näin etusivu ei jää vain käyntikortiksi, vaan alkaa ohjata toimintaa.";

  const presetContent = applyStylePresetToContent({
    stylePreset,
    companyName,
    industryLabel: industryProfile.label,
    baseHeadline: industryProfile.heroHeadlineTemplate(companyName),
    baseSubheadline:
      snapshot.metaDescription || snapshot.h1 || industryProfile.heroSubheadline,
    baseAboutBody
  });

  const heroSection: Extract<RedesignSection, { type: "hero" }> = {
    type: "hero",
    eyebrow: industryProfile.heroEyebrow,
    headline: presetContent.heroHeadline,
    subheadline: presetContent.heroSubheadline,
    primaryCta: presetContent.primaryCta,
    secondaryCta:
      snapshot.ctaTexts[0] && snapshot.ctaTexts[0].length <= 28
        ? snapshot.ctaTexts[0]
        : presetContent.secondaryCta
  };

  const servicesSection: Extract<RedesignSection, { type: "services" }> = {
    type: "services",
    title: industryProfile.serviceSectionTitle,
    items:
      snapshot.h2s.length >= 3
        ? snapshot.h2s.slice(0, 3).map((heading) => ({
            title: heading,
            description:
              "Tämä teema nousi nykyiseltä sivulta näkyviin, mutta tarvitsee selkeämmän kaupallisen esitystavan redesign-konseptissa."
          }))
        : industryProfile.serviceItems
  };

  const aboutSection: Extract<RedesignSection, { type: "about" }> = {
    type: "about",
    title: presetContent.aboutTitle,
    body: presetContent.aboutBody
  };

  const testimonialsSection: Extract<RedesignSection, { type: "testimonials" }> = {
    type: "testimonials",
    title: presetContent.testimonialsTitle,
    items: [
      {
        quote:
          "Nykyiseltä sivulta löytyy jo aineksia uskottavaan esitystapaan, mutta rakenne ei vielä tue niitä riittävän hyvin.",
        name: "Snapshot-havainto 1"
      },
      {
        quote:
          "Kun nykyisen sivun viesti jäsennellään selkeämmin, kokonaisuus alkaa näyttää enemmän myyntityökalulta kuin pelkältä verkkoläsnäololta.",
        name: "Snapshot-havainto 2"
      }
    ]
  };

  const ctaSection: Extract<RedesignSection, { type: "cta" }> = {
    type: "cta",
    title: industryProfile.ctaTitle,
    body: industryProfile.ctaBody,
    button:
      snapshot.ctaTexts[0] && snapshot.ctaTexts[0].length <= 24
        ? snapshot.ctaTexts[0]
        : presetContent.primaryCta
  };

  const orderedLegacySections = buildSectionPlan(stylePreset, {
    hero: heroSection,
    services: servicesSection,
    about: aboutSection,
    testimonials: testimonialsSection,
    cta: ctaSection
  });

  const ctas = buildCTAs({
    primaryLabel: heroSection.primaryCta,
    secondaryLabel: heroSection.secondaryCta,
    finalLabel: ctaSection.button
  });

  const trustItems = buildTrustItems(testimonialsSection);
  const assetSlots = buildAssetSlots(companyName);

  const homeSections = buildStructuredHomeSections({
    hero: heroSection,
    services: servicesSection,
    about: aboutSection,
    testimonials: testimonialsSection,
    cta: ctaSection,
    orderedLegacySections,
    trustItems
  });

  const siteSEO = buildSiteSEO({
    companyName,
    domain: snapshot.domain,
    metaDescription: snapshot.metaDescription,
    industryDescription:
      `${industryProfile.label} yritys, jonka sivurakenne ja hakukonenäkyvyyden perusta on mallinnettu rakenteisesti.`,
    areaServed: industryProfile.audience
  });

  const { sitemap, pages } = buildPages({
    companyName,
    industryProfile,
    siteSEO,
    servicesSection,
    testimonialsSection,
    ctaSection,
    homeSections
  });

  return {
    id: "generated",
    input: {
      sourceUrl: snapshot.sourceUrl,
      industryId: industryProfile.id,
      stylePreset
    },
    siteProfile: {
      domain: snapshot.domain,
      companyName,
      industry: industryProfile.label,
      audience: industryProfile.audience,
      tone: industryProfile.tone
    },
    sourceUrl: snapshot.sourceUrl,
    status: snapshot.fetchStatus === "live" ? "ready" : "draft",
    createdAt: new Date().toISOString().slice(0, 10),
    businessSummary: buildBusinessSummary(snapshot, companyName),
    auditIssues: sourceAnalysis.auditIssues,
    suggestedSections: sourceAnalysis.suggestedSections,
    styleDirection,
    ctas,
    trustItems,
    assetSlots,
    siteSEO,
    sitemap,
    pages,
    redesign: {
      stylePreset,
      sections: orderedLegacySections
    }
  };
}

export async function generateProjectFromUrl(
  url: string,
  options?: { stylePreset?: string }
): Promise<Project> {
  const snapshot = await fetchSourceSnapshot(url);
  return buildProjectFromSourceSnapshot(snapshot, options);
}
