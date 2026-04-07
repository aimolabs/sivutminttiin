import { generateCompanyBriefFromUrl } from "@/lib/ai/generate-company-brief";
import type {
  AssetSlot,
  CTA,
  PageSEO,
  Project,
  ProjectPage,
  ProjectSection,
  SiteSEO,
  SitemapItem,
  StyleDirection,
  TrustItem
} from "./projects";
import type { StylePresetId } from "./style-presets";
import { STYLE_PRESETS } from "./style-presets";
import { getIndustryProfileById } from "./industry-profiles";
import type { SourceSnapshot } from "../source/source-snapshot";
import { fetchSourceSnapshot } from "../source/fetch-source-snapshot";
import {
  normalizeSourceSnapshot,
  type NormalizedSourceSnapshot
} from "../source/normalize-source-snapshot";
import { analyzeSourceSnapshot } from "../source/analyze-source-snapshot";
import {
  inferCompanySignals,
  type CompanySignals
} from "../source/infer-company-signals";
import {
  getCompanyArchetype,
  resolveCompanyArchetypeId,
  type SectionBlueprint
} from "./company-archetypes";
import { getCompanyBriefProvider } from "../briefs/providers";
import type { CompanyBrief } from "../briefs/company-brief";

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

function buildLocationText(
  signals: CompanySignals,
  industryAudience: string
): string {
  switch (signals.locationMode) {
    case "strong-local":
      return industryAudience;
    case "broad":
      return "koko Suomeen";
    default:
      return industryAudience;
  }
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

function getContactTargetSlug(sitemap: SitemapItem[]): string {
  return sitemap.find((item) => item.pageType === "contact")?.slug ?? "/yhteys";
}

function getServicesTargetSlug(sitemap: SitemapItem[]): string {
  return sitemap.find((item) => item.pageType === "services")?.slug ?? "/palvelut";
}

function getPrimaryCtaActionType(
  goal: CompanySignals["primaryConversionGoal"]
): CTA["actionType"] {
  switch (goal) {
    case "quote":
      return "quote";
    case "booking":
      return "booking";
    case "demo":
      return "demo";
    case "project-start":
      return "contact";
    default:
      return "contact";
  }
}

function buildCTAs(input: {
  brief: CompanyBrief;
  sitemap: SitemapItem[];
  signals: CompanySignals;
}): CTA[] {
  const contactTarget = getContactTargetSlug(input.sitemap);
  const servicesTarget = getServicesTargetSlug(input.sitemap);

  return [
    {
      id: "cta-home-primary",
      label: input.brief.primaryCTALabel,
      actionType: getPrimaryCtaActionType(input.signals.primaryConversionGoal),
      target: contactTarget,
      goal: "primary-conversion",
      placement: "hero"
    },
    {
      id: "cta-home-secondary",
      label: input.brief.secondaryCTALabel,
      actionType: "navigation",
      target: servicesTarget,
      goal: "secondary-action",
      placement: "hero"
    },
    {
      id: "cta-final-contact",
      label: input.brief.finalCTALabel,
      actionType: getPrimaryCtaActionType(input.signals.primaryConversionGoal),
      target: contactTarget,
      goal: "primary-conversion",
      placement: "final"
    }
  ];
}

function buildTrustItems(brief: CompanyBrief): TrustItem[] {
  return brief.proofPoints.map((point, index) => ({
    id: `trust-${index + 1}`,
    type:
      point.type === "principle"
        ? "badge"
        : point.type === "case"
          ? "case"
          : point.type === "stat"
            ? "stat"
            : "testimonial",
    title: point.title,
    body: point.body,
    proofStrength: point.type === "stat" || point.type === "case" ? "high" : "medium"
  }));
}

function buildServiceItems(brief: CompanyBrief) {
  return [brief.coreOffer, ...brief.secondaryOffers].map((offer, index) => ({
    id: `service-item-${index + 1}`,
    title: offer.title,
    body: offer.summary
  }));
}

function buildPageSections(input: {
  blueprintList: SectionBlueprint[];
  brief: CompanyBrief;
  trustItems: TrustItem[];
  industryEyebrow: string;
}): ProjectSection[] {
  const serviceItems = buildServiceItems(input.brief);

  return input.blueprintList.map((blueprint, index) => {
    const baseId = `section-${index + 1}`;

    switch (blueprint.kind) {
      case "hero":
        return {
          id: `${baseId}-hero`,
          type: "hero",
          sectionRole: "value-proposition",
          eyebrow: input.industryEyebrow,
          heading: input.brief.heroMessage,
          body: input.brief.heroSupport,
          ctaIds: [
            ...(blueprint.includePrimaryCta ? ["cta-home-primary"] : []),
            ...(blueprint.includeSecondaryCta ? ["cta-home-secondary"] : [])
          ],
          trustItemIds: [],
          assetSlotIds: [],
          seoHints: {
            sectionId: `${baseId}-hero`,
            sectionRole: "value-proposition",
            targetSubtopic: input.brief.coreOffer.title.toLowerCase(),
            anchorId: "hero",
            faqEligible: false
          }
        };

      case "services":
        return {
          id: `${baseId}-services`,
          type: "services",
          sectionRole: blueprint.sectionRole,
          heading: blueprint.heading,
          body: blueprint.body,
          items: serviceItems,
          ctaIds: [],
          trustItemIds: [],
          assetSlotIds: [],
          seoHints: {
            sectionId: `${baseId}-services`,
            sectionRole: blueprint.sectionRole,
            targetSubtopic: input.brief.coreOffer.title.toLowerCase(),
            anchorId: "services",
            faqEligible: false
          }
        };

      case "proof":
        return blueprint.proofStyle === "process"
          ? {
              id: `${baseId}-proof`,
              type: "about",
              sectionRole: blueprint.sectionRole,
              heading: blueprint.heading,
              body: input.brief.trustStrategy,
              ctaIds: [],
              trustItemIds: [],
              assetSlotIds: []
            }
          : {
              id: `${baseId}-proof`,
              type: "testimonials",
              sectionRole: blueprint.sectionRole,
              heading: blueprint.heading,
              ctaIds: [],
              trustItemIds: input.trustItems.map((item) => item.id),
              assetSlotIds: []
            };

      case "about":
        return {
          id: `${baseId}-about`,
          type: "about",
          sectionRole: blueprint.sectionRole,
          heading: blueprint.heading,
          body: `${blueprint.bodyTemplate} ${input.brief.positioningSummary}`,
          ctaIds: [],
          trustItemIds: [],
          assetSlotIds: []
        };

      case "cta":
        return {
          id: `${baseId}-cta`,
          type: "cta",
          sectionRole: "conversion",
          heading: blueprint.heading,
          body: blueprint.body,
          ctaIds: [blueprint.ctaId],
          trustItemIds: [],
          assetSlotIds: []
        };
    }
  });
}

function inferSearchIntent(pageType: SitemapItem["pageType"]): string {
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

function inferSchemaType(pageType: SitemapItem["pageType"]): string {
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

function buildPageSEO(input: {
  pageId: string;
  pageType: SitemapItem["pageType"];
  pagePurpose: string;
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  primaryTopic: string;
  secondaryTopics: string[];
  internalLinkTargets: string[];
  targetLocations: string[];
  targetServices: string[];
  ogImageAssetSlot: string;
}): PageSEO {
  return {
    pageId: input.pageId,
    pageType: input.pageType,
    pagePurpose: input.pagePurpose,
    searchIntent: inferSearchIntent(input.pageType),
    primaryTopic: input.primaryTopic,
    secondaryTopics: input.secondaryTopics,
    slug: input.slug,
    title: input.title,
    metaDescription: input.metaDescription,
    h1: input.h1,
    canonicalPath: input.slug,
    indexable: true,
    robots: "index,follow",
    schemaType: inferSchemaType(input.pageType),
    targetLocations: input.targetLocations,
    targetServices: input.targetServices,
    internalLinkTargets: input.internalLinkTargets,
    ogTitle: input.title,
    ogDescription: input.metaDescription,
    ogImageAssetSlot: input.ogImageAssetSlot
  };
}

export async function buildProjectFromSourceSnapshot(
  rawSnapshot: SourceSnapshot,
  options?: { stylePreset?: string; industryId?: string }
): Promise<Project> {
  const snapshot = normalizeSourceSnapshot(rawSnapshot);
  const inferredSignals = inferCompanySignals(snapshot);

  const companyName = snapshot.companyNameCandidate || domainToCompanyName(snapshot.domain);
  const stylePreset = resolveStylePreset(options?.stylePreset);
  const styleDirection = buildStyleDirection(stylePreset);
  const industryProfile = getIndustryProfileById(options?.industryId);
  const sourceAnalysis = analyzeSourceSnapshot(snapshot, companyName);
  const briefProvider = getCompanyBriefProvider();

  const fallbackCompanyBrief = await briefProvider.buildBrief({ snapshot });
const companyBrief = await getCompanyBrief(snapshot.sourceUrl, fallbackCompanyBrief);

  if (options?.industryId) {
    companyBrief.inferredIndustryId = options.industryId;
    companyBrief.targetAudienceSummary = industryProfile.audience;
  }

  const signals: CompanySignals = {
    ...inferredSignals,
    industryId: options?.industryId ?? inferredSignals.industryId
  };

  const archetype = getCompanyArchetype(companyBrief.archetypeId);

  const sitemap: SitemapItem[] = companyBrief.recommendedPageSet.map((page: any) => ({
    pageId: page.id,
    slug: page.slug,
    pageType: page.pageType,
    title: page.title,
    purpose: page.purpose,
    navigationLabel: page.navigationLabel,
    navVisible: page.navVisible,
    footerVisible: page.footerVisible,
    isPrimary: page.isPrimary
  }));

  const ctas = buildCTAs({
    brief: companyBrief,
    sitemap,
    signals
  });

  const trustItems = buildTrustItems(companyBrief);
  const assetSlots = buildAssetSlots(companyName);
  const locationText = buildLocationText(signals, industryProfile.audience);

  const pages: ProjectPage[] = sitemap.map((page) => {
    const pageBlueprints =
      page.pageType === "home"
        ? archetype.homepageBlueprint
        : archetype.pageBlueprintByType[page.pageType] ??
          [
            {
              kind: "about",
              sectionRole: "supporting",
              heading: page.title,
              bodyTemplate: `${companyName} tarvitsee sivun, jonka tarkoitus on: ${page.purpose.toLowerCase()}.`
            },
            {
              kind: "cta",
              sectionRole: "conversion",
              heading: companyBrief.finalCTALabel,
              body: "Tämän sivun pitää ohjata kävijä selkeästi seuraavaan vaiheeseen.",
              ctaId: "cta-final-contact"
            }
          ];

    const sections = buildPageSections({
      blueprintList: pageBlueprints,
      brief: companyBrief,
      trustItems,
      industryEyebrow: industryProfile.heroEyebrow
    });

    const h1 =
      sections.find((section) => section.type === "hero")?.heading ??
      sections[0]?.heading ??
      page.title;

    const title =
      page.pageType === "home"
        ? `${industryProfile.label} ${locationText}`
        : `${page.title} | ${companyName}`;

    const metaDescription =
      page.pageType === "home"
        ? snapshot.metaDescription ||
          `${companyName} tarjoaa palveluitaan selkeästi, uskottavasti ja yhteydenottoon ohjaavasti.`
        : `${companyName}: ${page.purpose}.`;

    const targetServices = [
      companyBrief.coreOffer.title,
      ...companyBrief.secondaryOffers.map((offer: any) => offer.title)
    ];

    const secondaryTopics =
      page.pageType === "services"
        ? targetServices
        : page.pageType === "about"
          ? [companyBrief.trustStrategy]
          : page.pageType === "contact"
            ? [companyBrief.primaryCTALabel, "yhteydenotto"]
            : [page.purpose];

    return {
      ...page,
      pageSEO: buildPageSEO({
        pageId: page.pageId,
        pageType: page.pageType,
        pagePurpose: page.purpose,
        slug: page.slug,
        title,
        metaDescription,
        h1,
        primaryTopic: companyBrief.coreOffer.title,
        secondaryTopics,
        internalLinkTargets: sitemap
          .filter((item) => item.pageId !== page.pageId)
          .map((item) => item.slug),
        targetLocations: [locationText],
        targetServices: page.pageType === "services" ? targetServices : [],
        ogImageAssetSlot: page.pageType === "home" ? "asset-og-home" : "asset-og-default"
      }),
      sections
    };
  });

  const siteSEO = buildSiteSEO({
    companyName,
    domain: snapshot.domain,
    metaDescription: snapshot.metaDescription,
    industryDescription:
      `${industryProfile.label} yritys, jonka sivurakenne ja hakukonenäkyvyyden perusta on mallinnettu rakenteisesti.`,
    areaServed: locationText
  });

  return {
    id: "generated",
    input: {
      sourceUrl: snapshot.sourceUrl,
      industryId: options?.industryId ?? signals.industryId,
      stylePreset
    },
    siteProfile: {
      domain: snapshot.domain,
      companyName,
      industry: industryProfile.label,
      audience: locationText,
      tone: industryProfile.tone
    },
    sourceUrl: snapshot.sourceUrl,
    status: snapshot.fetchStatus === "live" ? "ready" : "draft",
    createdAt: new Date().toISOString().slice(0, 10),
    businessSummary: buildBusinessSummary(snapshot, companyName),
    companyBrief,
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
      sections: []
    }
  };
}

export async function generateProjectFromUrl(
  url: string,
  options?: { stylePreset?: string; industryId?: string }
): Promise<Project> {
  const snapshot = await fetchSourceSnapshot(url);
  return buildProjectFromSourceSnapshot(snapshot, options);
}

// --- AI BRIEF OVERRIDE (temporary) ---
async function getCompanyBrief(url: string, fallback: any) {
  try {
    const ai = await generateCompanyBriefFromUrl(url);
    if (ai) {
      console.log("AI brief used");
      return ai;
    }
  } catch (e) {
    console.error("AI failed, fallback used");
  }
  return fallback;
}
