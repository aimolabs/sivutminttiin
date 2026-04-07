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
import { resolveIndustryProfile } from "./industry-profiles";
import { applyStylePresetToContent } from "./apply-style-preset";
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

function getPrimaryCtaLabel(goal: CompanySignals["primaryConversionGoal"]): string {
  switch (goal) {
    case "quote":
      return "Pyydä tarjous";
    case "booking":
      return "Varaa aika";
    case "demo":
      return "Pyydä demo";
    case "project-start":
      return "Aloita projekti";
    default:
      return "Ota yhteyttä";
  }
}

function getSecondaryCtaLabel(signals: CompanySignals): string {
  if (signals.companyArchetypeId === "creative-showcase") {
    return "Katso työt";
  }

  if (signals.companyArchetypeId === "b2b-solution") {
    return "Tutustu ratkaisuun";
  }

  return "Katso palvelut";
}

function buildCTAs(input: {
  signals: CompanySignals;
  sitemap: SitemapItem[];
}): CTA[] {
  const contactTarget = getContactTargetSlug(input.sitemap);
  const servicesTarget = getServicesTargetSlug(input.sitemap);

  return [
    {
      id: "cta-home-primary",
      label: getPrimaryCtaLabel(input.signals.primaryConversionGoal),
      actionType: getPrimaryCtaActionType(input.signals.primaryConversionGoal),
      target: contactTarget,
      goal: "primary-conversion",
      placement: "hero"
    },
    {
      id: "cta-home-secondary",
      label: getSecondaryCtaLabel(input.signals),
      actionType: "navigation",
      target: servicesTarget,
      goal: "secondary-action",
      placement: "hero"
    },
    {
      id: "cta-final-contact",
      label: getPrimaryCtaLabel(input.signals.primaryConversionGoal),
      actionType: getPrimaryCtaActionType(input.signals.primaryConversionGoal),
      target: contactTarget,
      goal: "primary-conversion",
      placement: "final"
    }
  ];
}

function buildTrustItems(signals: CompanySignals): TrustItem[] {
  switch (signals.trustProfile) {
    case "expertise":
      return [
        {
          id: "trust-1",
          type: "stat",
          title: "Asiantuntijuus",
          body: "Rakenna luottamusta profiilin, kokemuksen ja rauhallisen toimintatavan kautta.",
          proofStrength: "high"
        },
        {
          id: "trust-2",
          type: "testimonial",
          title: "Asiakastilanteet",
          body: "Sivun pitää auttaa kävijää tunnistamaan nopeasti missä tilanteissa apua saa.",
          proofStrength: "medium"
        }
      ];
    case "portfolio":
      return [
        {
          id: "trust-1",
          type: "case",
          title: "Työn laatu",
          body: "Laatuvaikutelman pitää syntyä nopeasti ilman geneeristä studiokieltä.",
          proofStrength: "high"
        },
        {
          id: "trust-2",
          type: "testimonial",
          title: "Omaleimaisuus",
          body: "Sivun pitää tuntua harkitulta, omaleimaiselta ja projektin arvoa tukevaksi.",
          proofStrength: "medium"
        }
      ];
    case "outcome":
      return [
        {
          id: "trust-1",
          type: "stat",
          title: "Liiketoimintahyöty",
          body: "Uskottavuus syntyy hyödyistä, selkeästä arvosta ja ostajalle relevantista viestistä.",
          proofStrength: "high"
        },
        {
          id: "trust-2",
          type: "badge",
          title: "Selkeä seuraava askel",
          body: "Oikean kävijän pitää siirtyä helposti demoon tai keskusteluun.",
          proofStrength: "medium"
        }
      ];
    case "process":
      return [
        {
          id: "trust-1",
          type: "stat",
          title: "Toimintatapa",
          body: "Luottamus syntyy siitä, että prosessi ja eteneminen ovat selkeitä.",
          proofStrength: "medium"
        },
        {
          id: "trust-2",
          type: "testimonial",
          title: "Ennakoitavuus",
          body: "Sivun pitää vähentää epävarmuutta ja tehdä etenemisestä ymmärrettävää.",
          proofStrength: "medium"
        }
      ];
    default:
      return [
        {
          id: "trust-1",
          type: "testimonial",
          title: "Luotettava vaikutelma",
          body: "Yrityksen pitää tuntua uskottavalta jo ennen ensimmäistä yhteydenottoa.",
          proofStrength: "medium"
        },
        {
          id: "trust-2",
          type: "stat",
          title: "Selkeä seuraava askel",
          body: "Kun rakenne on oikea, kiinnostunut kävijä etenee helpommin yhteydenottoon.",
          proofStrength: "medium"
        }
      ];
  }
}

function buildServiceItems(
  snapshot: NormalizedSourceSnapshot,
  signals: CompanySignals,
  fallbackItems: Array<{ title: string; description: string }>
) {
  if (snapshot.h2s.length >= 3) {
    return snapshot.h2s.slice(0, 3).map((heading, index) => ({
      id: `service-item-${index + 1}`,
      title: heading,
      body:
        signals.serviceModel === "solution-led"
          ? "Tämä teema viittaa ratkaisuun, joka pitää tehdä hyötylähtöisesti ymmärrettäväksi."
          : signals.serviceModel === "problem-led"
            ? "Tämä teema viittaa asiakastilanteeseen, joka pitää tehdä nopeasti tunnistettavaksi."
            : "Tämä teema pitää jäsentää redesignissa selkeästi ymmärrettäväksi palvelukokonaisuudeksi."
    }));
  }

  return fallbackItems.map((item, index) => ({
    id: `service-item-${index + 1}`,
    title: item.title,
    body: item.description
  }));
}

function buildHeroHeading(
  companyName: string,
  industryLabel: string,
  signals: CompanySignals
): string {
  switch (signals.companyArchetypeId) {
    case "trusted-advisor":
      return `${companyName} tarvitsee sivun, joka viestii asiantuntemusta ja selkeyttä heti.`;
    case "creative-showcase":
      return `${companyName} tarvitsee sivun, joka näyttää yhtä vahvalta kuin sen luova taso.`;
    case "b2b-solution":
      return `${companyName} tarvitsee sivun, joka tekee ratkaisun arvon ymmärrettäväksi nopeasti.`;
    case "local-contractor":
      return `${companyName} tarvitsee sivun, joka tuntuu yhtä luotettavalta kuin työn jälki.`;
    default:
      return `${companyName} tarvitsee selkeämmän ja uskottavamman ${industryLabel.toLowerCase()}-sivun.`;
  }
}

function buildHeroBody(
  snapshot: NormalizedSourceSnapshot,
  industryFallback: string,
  signals: CompanySignals
): string {
  if (signals.companyArchetypeId === "b2b-solution") {
    return snapshot.metaDescription ||
      "Teknologiayrityksen ongelma ei yleensä ole ominaisuuksien puute vaan epäselvä viestintä. Sivun pitää tehdä hyöty, uskottavuus ja seuraava askel heti näkyväksi.";
  }

  if (signals.companyArchetypeId === "creative-showcase") {
    return snapshot.metaDescription ||
      "Luovan studion sivun pitää näyttää omaleimaiselta, mutta samalla tehdä palvelu ja arvolupaus välittömästi ymmärrettäviksi.";
  }

  if (signals.companyArchetypeId === "trusted-advisor") {
    return snapshot.metaDescription ||
      "Asiantuntijapalveluissa uskottavuus syntyy rauhallisuudesta, selkeydestä ja siitä, että asiakas ymmärtää nopeasti missä asioissa apua saa.";
  }

  return snapshot.metaDescription || snapshot.h1 || industryFallback;
}

function buildAboutBody(
  archetypeId: CompanySignals["companyArchetypeId"]
): string {
  switch (archetypeId) {
    case "trusted-advisor":
      return "Tämän rakenteen tehtävä on tehdä asiantuntijuudesta, toimintatavasta ja ensimmäisestä kontaktista nopeasti ymmärrettäviä.";
    case "creative-showcase":
      return "Tämän rakenteen tehtävä on nostaa laatuvaikutelmaa, omaleimaisuutta ja oikeanlaisten projektien houkuttelevuutta.";
    case "b2b-solution":
      return "Tämän rakenteen tehtävä on selkeyttää arvoa, hyötyä ja seuraavaa askelta ilman raskasta ominaisuuslistaa.";
    case "local-contractor":
      return "Tämän rakenteen tehtävä on nostaa luotettavuus, palvelut ja tarjouspyynnön helppous näkyviksi heti.";
    default:
      return "Tämän rakenteen tehtävä on tehdä arvolupaus, tarjooma ja seuraava askel nopeasti ymmärrettäviksi.";
  }
}

function buildPageSections(input: {
  blueprintList: SectionBlueprint[];
  snapshot: NormalizedSourceSnapshot;
  companyName: string;
  industryProfile: ReturnType<typeof resolveIndustryProfile>;
  signals: CompanySignals;
  trustItems: TrustItem[];
}): ProjectSection[] {
  const serviceItems = buildServiceItems(
    input.snapshot,
    input.signals,
    input.industryProfile.serviceItems
  );

  return input.blueprintList.map((blueprint, index) => {
    const idBase = `section-${index + 1}`;

    switch (blueprint.kind) {
      case "hero":
        return {
          id: `${idBase}-hero`,
          type: "hero",
          sectionRole: "value-proposition",
          eyebrow: input.industryProfile.heroEyebrow,
          heading: buildHeroHeading(
            input.companyName,
            input.industryProfile.label,
            input.signals
          ),
          body: buildHeroBody(
            input.snapshot,
            input.industryProfile.heroSubheadline,
            input.signals
          ),
          ctaIds: [
            ...(blueprint.includePrimaryCta ? ["cta-home-primary"] : []),
            ...(blueprint.includeSecondaryCta ? ["cta-home-secondary"] : [])
          ],
          trustItemIds: [],
          assetSlotIds: [],
          seoHints: {
            sectionId: `${idBase}-hero`,
            sectionRole: "value-proposition",
            targetSubtopic: input.industryProfile.label.toLowerCase(),
            anchorId: "hero",
            faqEligible: false
          }
        };

      case "services":
        return {
          id: `${idBase}-services`,
          type: "services",
          sectionRole: blueprint.sectionRole,
          heading: blueprint.heading,
          body: blueprint.body,
          items: serviceItems,
          ctaIds: [],
          trustItemIds: [],
          assetSlotIds: [],
          seoHints: {
            sectionId: `${idBase}-services`,
            sectionRole: blueprint.sectionRole,
            targetSubtopic: blueprint.heading.toLowerCase(),
            anchorId: "services",
            faqEligible: false
          }
        };

      case "proof":
        return {
          id: `${idBase}-proof`,
          type: blueprint.proofStyle === "process" ? "about" : "testimonials",
          sectionRole: blueprint.sectionRole,
          heading: blueprint.heading,
          body:
            blueprint.proofStyle === "process"
              ? "Tämän osion tehtävä on vähentää epävarmuutta ja tehdä toimintatavasta uskottava."
              : undefined,
          ctaIds: [],
          trustItemIds:
            blueprint.proofStyle === "process"
              ? []
              : input.trustItems.map((item) => item.id),
          assetSlotIds: []
        };

      case "about":
        return {
          id: `${idBase}-about`,
          type: "about",
          sectionRole: blueprint.sectionRole,
          heading: blueprint.heading,
          body: blueprint.bodyTemplate,
          ctaIds: [],
          trustItemIds: [],
          assetSlotIds: []
        };

      case "cta":
        return {
          id: `${idBase}-cta`,
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

export function buildProjectFromSourceSnapshot(
  rawSnapshot: SourceSnapshot,
  options?: { stylePreset?: string }
): Project {
  const snapshot = normalizeSourceSnapshot(rawSnapshot);
  const signals = inferCompanySignals(snapshot);
  const archetypeId = resolveCompanyArchetypeId(signals);
  signals.companyArchetypeId = archetypeId;

  const companyName = resolveCompanyName(snapshot);
  const stylePreset = resolveStylePreset(options?.stylePreset);
  const styleDirection = buildStyleDirection(stylePreset);
  const industryProfile = resolveIndustryProfile(snapshot.industrySignalText);
  const archetype = getCompanyArchetype(archetypeId);
  const sourceAnalysis = analyzeSourceSnapshot(snapshot, companyName);

  const sitemap: SitemapItem[] = archetype.pageBlueprints.map((blueprint) => ({
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

  const ctas = buildCTAs({ signals, sitemap });
  const trustItems = buildTrustItems(signals);
  const assetSlots = buildAssetSlots(companyName);
  const locationText = buildLocationText(signals, industryProfile.audience);

  const pages: ProjectPage[] = sitemap.map((page) => {
    const blueprintList =
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
              heading: "Jatketaan seuraavaan askeleeseen",
              body: "Tämän sivun pitää ohjata kävijä selkeästi eteenpäin.",
              ctaId: "cta-final-contact"
            }
          ];

    const sections = buildPageSections({
      blueprintList,
      snapshot,
      companyName,
      industryProfile,
      signals,
      trustItems
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

    const targetServices = snapshot.h2s.slice(0, 3);
    const secondaryTopics =
      page.pageType === "services"
        ? targetServices
        : page.pageType === "about"
          ? [signals.trustProfile, "luottamus", "toimintatapa"]
          : page.pageType === "contact"
            ? [signals.primaryConversionGoal, "yhteydenotto"]
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
        primaryTopic: page.purpose,
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
      industryId: signals.industryId,
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
  options?: { stylePreset?: string }
): Promise<Project> {
  const snapshot = await fetchSourceSnapshot(url);
  return buildProjectFromSourceSnapshot(snapshot, options);
}
