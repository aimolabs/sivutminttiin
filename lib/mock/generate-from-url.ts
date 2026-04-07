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
import {
  inferCompanySignals,
  type CompanySignals
} from "../source/infer-company-signals";

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

function getContactTargetSlug(
  blueprints: IndustryPageBlueprint[]
): string {
  return (
    blueprints.find((blueprint) => blueprint.pageType === "contact")?.slug ??
    "/yhteys"
  );
}

function getServicesTargetSlug(
  blueprints: IndustryPageBlueprint[]
): string {
  return (
    blueprints.find((blueprint) => blueprint.pageType === "services")?.slug ??
    "/palvelut"
  );
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

function getPrimaryCtaLabel(
  goal: CompanySignals["primaryConversionGoal"],
  fallback: string
): string {
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
      return fallback;
  }
}

function getSecondaryCtaLabel(
  signals: CompanySignals,
  fallback: string
): string {
  if (signals.trustProfile === "portfolio") {
    return "Katso työt";
  }

  if (signals.primaryConversionGoal === "demo") {
    return "Tutustu ratkaisuun";
  }

  if (signals.primaryConversionGoal === "quote") {
    return "Katso palvelut";
  }

  return fallback;
}

function getFinalCtaLabel(
  goal: CompanySignals["primaryConversionGoal"],
  fallback: string
): string {
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
      return fallback;
  }
}

function buildCTAs(input: {
  signals: CompanySignals;
  pageBlueprints: IndustryPageBlueprint[];
  fallbackPrimaryLabel: string;
  fallbackSecondaryLabel: string;
  fallbackFinalLabel: string;
}): CTA[] {
  const contactTarget = getContactTargetSlug(input.pageBlueprints);
  const servicesTarget = getServicesTargetSlug(input.pageBlueprints);

  return [
    {
      id: "cta-home-primary",
      label: getPrimaryCtaLabel(
        input.signals.primaryConversionGoal,
        input.fallbackPrimaryLabel
      ),
      actionType: getPrimaryCtaActionType(input.signals.primaryConversionGoal),
      target: contactTarget,
      goal: "primary-conversion",
      placement: "hero"
    },
    {
      id: "cta-home-secondary",
      label: getSecondaryCtaLabel(
        input.signals,
        input.fallbackSecondaryLabel
      ),
      actionType: "navigation",
      target: servicesTarget,
      goal: "secondary-action",
      placement: "hero"
    },
    {
      id: "cta-final-contact",
      label: getFinalCtaLabel(
        input.signals.primaryConversionGoal,
        input.fallbackFinalLabel
      ),
      actionType: getPrimaryCtaActionType(input.signals.primaryConversionGoal),
      target: contactTarget,
      goal: "primary-conversion",
      placement: "final"
    }
  ];
}

function getTrustStrength(
  trustProfile: CompanySignals["trustProfile"]
): TrustItem["proofStrength"] {
  switch (trustProfile) {
    case "expertise":
    case "outcome":
      return "high";
    default:
      return "medium";
  }
}

function buildTrustItems(
  testimonials: Extract<RedesignSection, { type: "testimonials" }>,
  signals: CompanySignals
): TrustItem[] {
  return testimonials.items.map((item, index) => ({
    id: `trust-testimonial-${index + 1}`,
    type: "testimonial",
    title: item.name,
    body: item.quote,
    proofStrength: getTrustStrength(signals.trustProfile)
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

function getServicesHeading(
  signals: CompanySignals,
  fallbackTitle: string
): string {
  switch (signals.serviceModel) {
    case "solution-led":
      return "Ratkaisut selkeästi esiin";
    case "problem-led":
      return "Tilanteet joissa autamme";
    default:
      return fallbackTitle;
  }
}

function getAboutHeading(
  signals: CompanySignals,
  fallbackTitle: string
): string {
  switch (signals.trustProfile) {
    case "expertise":
      return "Miksi tämä asiantuntijaprofiili toimii";
    case "portfolio":
      return "Miksi tämä luova suunta toimii";
    case "outcome":
      return "Miksi tämä kaupallinen rakenne toimii";
    case "process":
      return "Miksi tämä toimintatapaan perustuva rakenne toimii";
    default:
      return fallbackTitle;
  }
}

function getTestimonialsHeading(
  signals: CompanySignals,
  fallbackTitle: string
): string {
  switch (signals.trustProfile) {
    case "expertise":
      return "Asiantuntijuutta tukevat signaalit";
    case "portfolio":
      return "Laatuvaikutelmaa tukevat signaalit";
    case "outcome":
      return "Uskottavuutta tukevat tulossignaalit";
    case "process":
      return "Toimintatapaa tukevat signaalit";
    default:
      return fallbackTitle;
  }
}

function getCtaTitle(
  signals: CompanySignals,
  fallbackTitle: string
): string {
  switch (signals.primaryConversionGoal) {
    case "quote":
      return "Pyydä tarjous matalalla kynnyksellä";
    case "booking":
      return "Varaa aika helposti";
    case "demo":
      return "Pyydä demo tai keskustelu";
    case "project-start":
      return "Aloitetaan uusi projekti";
    default:
      return fallbackTitle;
  }
}

function getCtaBody(
  signals: CompanySignals,
  fallbackBody: string
): string {
  switch (signals.primaryConversionGoal) {
    case "quote":
      return "Tämän sivun tärkein tehtävä on poistaa epävarmuutta ja tehdä tarjouspyynnöstä mahdollisimman helppo.";
    case "booking":
      return "Tämän sivun pitää ohjata kävijä nopeasti ajanvaraukseen tai ensimmäiseen tapaamiseen.";
    case "demo":
      return "Tämän sivun pitää siirtää oikea kävijä kohti demoa, keskustelua tai tuotearviointia.";
    case "project-start":
      return "Tämän sivun pitää houkutella oikeanlaisia projekteja ja tehdä yhteydenotosta luonnollinen seuraava askel.";
    default:
      return fallbackBody;
  }
}

function buildStructuredHomeSections(input: {
  hero: Extract<RedesignSection, { type: "hero" }>;
  services: Extract<RedesignSection, { type: "services" }>;
  about: Extract<RedesignSection, { type: "about" }>;
  testimonials: Extract<RedesignSection, { type: "testimonials" }>;
  cta: Extract<RedesignSection, { type: "cta" }>;
  orderedLegacySections: RedesignSection[];
  trustItems: TrustItem[];
  signals: CompanySignals;
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
      sectionRole: input.signals.trustProfile === "process" ? "trust-building" : "supporting",
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

function buildAboutSections(
  companyName: string,
  testimonialsTitle: string,
  signals: CompanySignals
): ProjectSection[] {
  const firstHeading =
    signals.trustProfile === "expertise"
      ? `${companyName} asiantuntijana`
      : signals.trustProfile === "portfolio"
        ? `${companyName} studiona`
        : `${companyName} yrityksenä`;

  const firstBody =
    signals.brandStrength === "strong"
      ? "Tämän sivun tarkoitus on vahvistaa jo näkyvää brändiä, luottamusta ja toimintatapaa."
      : "Tämän sivun tarkoitus on tehdä yrityksen toimintatavasta, kokemuksesta ja luotettavuudesta näkyvämpi osa kokonaisuutta.";

  return [
    {
      id: "about-company",
      type: "about",
      sectionRole: "trust-building",
      heading: firstHeading,
      body: firstBody,
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
      heading:
        signals.primaryConversionGoal === "demo"
          ? "Keskustellaan demosta"
          : signals.primaryConversionGoal === "project-start"
            ? "Keskustellaan projektistasi"
            : "Otetaan seuraava askel",
      body:
        "Yrityssivun tehtävä ei ole vain kertoa taustasta, vaan tukea seuraavaa askelta kohti yhteydenottoa.",
      ctaIds: ["cta-final-contact"],
      trustItemIds: [],
      assetSlotIds: []
    }
  ];
}

function buildServicesSections(
  servicesSection: Extract<RedesignSection, { type: "services" }>,
  signals: CompanySignals
): ProjectSection[] {
  const supportHeading =
    signals.serviceModel === "solution-led"
      ? "Miten ratkaisu tehdään ymmärrettäväksi"
      : signals.serviceModel === "problem-led"
        ? "Miten tämä sivu auttaa oikeaa asiakastilannetta"
        : "Miten palvelusivu toimii paremmin";

  const supportBody =
    signals.serviceModel === "solution-led"
      ? "Ratkaisusivun tarkoitus on tehdä tarjooma, hyöty ja seuraava askel ymmärrettäväksi ilman raskasta ominaisuuslistaa."
      : signals.serviceModel === "problem-led"
        ? "Palvelusivun tarkoitus on auttaa kävijää tunnistamaan oma tilanteensa ja löytämään oikea apu nopeasti."
        : "Palvelusivun tarkoitus on tehdä tarjoomasta helposti ymmärrettävä, tukea päätöksentekoa ja ohjata kävijä suoraan oikeaan toimintoon.";

  const ctaHeading =
    signals.primaryConversionGoal === "quote"
      ? "Pyydä tarjous oikeasta palvelusta"
      : signals.primaryConversionGoal === "demo"
        ? "Pyydä demo oikeasta ratkaisusta"
        : "Siirry seuraavaan askeleeseen";

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
      heading: supportHeading,
      body: supportBody,
      ctaIds: [],
      trustItemIds: [],
      assetSlotIds: []
    },
    {
      id: "services-cta",
      type: "cta",
      sectionRole: "conversion",
      heading: ctaHeading,
      body:
        "Kun tarjooma on jäsennelty selkeästi, kiinnostunut kävijä etenee helpommin oikeaan toimintoon.",
      ctaIds: ["cta-home-primary"],
      trustItemIds: [],
      assetSlotIds: []
    }
  ];
}

function buildContactSections(
  ctaTitle: string,
  ctaBody: string,
  signals: CompanySignals
): ProjectSection[] {
  const introHeading =
    signals.primaryConversionGoal === "quote"
      ? "Pyydä tarjous"
      : signals.primaryConversionGoal === "demo"
        ? "Pyydä demo"
        : signals.primaryConversionGoal === "booking"
          ? "Varaa aika"
          : "Ota yhteyttä";

  const introBody =
    signals.primaryConversionGoal === "quote"
      ? "Tämän sivun tehtävä on tehdä tarjouspyynnöstä mahdollisimman helppo ensimmäinen askel."
      : signals.primaryConversionGoal === "demo"
        ? "Tämän sivun tehtävä on tehdä demopyynnöstä tai keskustelun aloittamisesta mahdollisimman helppo."
        : signals.primaryConversionGoal === "booking"
          ? "Tämän sivun tehtävä on poistaa kitkaa ajanvarauksesta ja nopeuttaa ensimmäistä kontaktia."
          : "Tämän sivun tehtävä on poistaa kitkaa ja tehdä ensimmäisestä yhteydenotosta mahdollisimman helppo.";

  return [
    {
      id: "contact-about",
      type: "about",
      sectionRole: "conversion",
      heading: introHeading,
      body: introBody,
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
  blueprint: IndustryPageBlueprint,
  signals: CompanySignals
): ProjectSection[] {
  const introBody =
    signals.trustProfile === "portfolio"
      ? `${companyName} tarvitsee sivun, joka rakentaa referenssi- ja laatufiilistä tämän tarkoituksen ympärille: ${blueprint.purpose.toLowerCase()}.`
      : `${companyName} tarvitsee sivun, jonka tarkoitus on: ${blueprint.purpose.toLowerCase()}.`;

  return [
    {
      id: `${blueprint.id}-intro`,
      type: "about",
      sectionRole: "supporting",
      heading: blueprint.title,
      body: introBody,
      ctaIds: [],
      trustItemIds: [],
      assetSlotIds: []
    },
    {
      id: `${blueprint.id}-cta`,
      type: "cta",
      sectionRole: "conversion",
      heading:
        signals.primaryConversionGoal === "demo"
          ? "Pyydä demo tai keskustelu"
          : "Jatketaan seuraavaan askeleeseen",
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

function buildPages(input: {
  companyName: string;
  industryProfile: ReturnType<typeof resolveIndustryProfile>;
  siteSEO: SiteSEO;
  servicesSection: Extract<RedesignSection, { type: "services" }>;
  testimonialsSection: Extract<RedesignSection, { type: "testimonials" }>;
  ctaSection: Extract<RedesignSection, { type: "cta" }>;
  homeSections: ProjectSection[];
  signals: CompanySignals;
}): { sitemap: SitemapItem[]; pages: ProjectPage[] } {
  const targetServices = input.servicesSection.items.map((item) => item.title);
  const locationText = buildLocationText(
    input.signals,
    input.industryProfile.audience
  );
  const targetLocations = [locationText];

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
        sections = buildAboutSections(
          input.companyName,
          input.testimonialsSection.title,
          input.signals
        );
        break;
      case "services":
        sections = buildServicesSections(input.servicesSection, input.signals);
        break;
      case "contact":
        sections = buildContactSections(
          input.ctaSection.title,
          input.ctaSection.body,
          input.signals
        );
        break;
      default:
        sections = buildOtherSections(input.companyName, blueprint, input.signals);
        break;
    }

    const h1 =
      sections.find((section) => section.type === "hero")?.heading ??
      sections[0]?.heading ??
      blueprint.title;

    const title =
      blueprint.pageType === "home"
        ? `${input.industryProfile.label} ${locationText}`
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
          ? input.signals.trustProfile === "expertise"
            ? ["asiantuntijuus", "kokemus", "toimintatapa"]
            : ["luotettavuus", "kokemus", "toimintatapa"]
          : blueprint.pageType === "contact"
            ? ["yhteydenotto", "seuraava askel"]
            : [blueprint.purpose];

    const primaryTopic =
      blueprint.pageType === "services" && input.signals.likelyPrimaryService
        ? input.signals.likelyPrimaryService
        : blueprint.purpose;

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
        primaryTopic,
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
  const signals = inferCompanySignals(snapshot);
  const companyName = resolveCompanyName(snapshot);
  const stylePreset = resolveStylePreset(options?.stylePreset);
  const styleDirection = buildStyleDirection(stylePreset);
  const industryProfile = resolveIndustryProfile(snapshot.industrySignalText);
  const sourceAnalysis = analyzeSourceSnapshot(snapshot, companyName);

  const baseAboutBody =
    signals.trustProfile === "expertise"
      ? "Konsepti tekee sivusta uskottavamman asiantuntijakontekstissa. Kävijä näkee nopeammin missä asioissa yritys voi auttaa, miksi siihen kannattaa luottaa ja miten ensimmäinen yhteydenotto tapahtuu."
      : signals.trustProfile === "portfolio"
        ? "Konsepti tekee sivusta vahvemman luovan myyntityökalun. Kävijä näkee nopeammin mitä yritys tekee, miksi työn jälki tuntuu uskottavalta ja miten projekti voidaan aloittaa."
        : signals.trustProfile === "outcome"
          ? "Konsepti tekee sivusta kaupallisesti terävämmän. Kävijä näkee nopeammin mitä arvoa ratkaisu tuottaa, miksi siihen kannattaa luottaa ja mikä on oikea seuraava askel."
          : "Konsepti tekee sivusta myynnillisesti terävämmän. Kävijä näkee nopeammin mitä tarjotaan, miksi siihen kannattaa luottaa ja mitä seuraavaksi kannattaa tehdä. Näin etusivu ei jää vain käyntikortiksi, vaan alkaa ohjata toimintaa.";

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
    primaryCta: getPrimaryCtaLabel(
      signals.primaryConversionGoal,
      presetContent.primaryCta
    ),
    secondaryCta: getSecondaryCtaLabel(
      signals,
      snapshot.ctaTexts[0] && snapshot.ctaTexts[0].length <= 28
        ? snapshot.ctaTexts[0]
        : presetContent.secondaryCta
    )
  };

  const servicesSection: Extract<RedesignSection, { type: "services" }> = {
    type: "services",
    title: getServicesHeading(signals, industryProfile.serviceSectionTitle),
    items:
      snapshot.h2s.length >= 3
        ? snapshot.h2s.slice(0, 3).map((heading) => ({
            title: heading,
            description:
              signals.serviceModel === "solution-led"
                ? "Tämä teema viittaa ratkaisuun tai tarjoomaan, joka pitää tehdä redesignissa selkeästi ymmärrettäväksi ja hyötylähtöiseksi."
                : signals.serviceModel === "problem-led"
                  ? "Tämä teema viittaa asiakastilanteeseen tai ongelmaan, joka pitää tehdä redesignissa nopeasti tunnistettavaksi."
                  : "Tämä teema nousi nykyiseltä sivulta näkyviin, mutta tarvitsee selkeämmän kaupallisen esitystavan redesign-konseptissa."
          }))
        : industryProfile.serviceItems
  };

  const aboutSection: Extract<RedesignSection, { type: "about" }> = {
    type: "about",
    title: getAboutHeading(signals, presetContent.aboutTitle),
    body: presetContent.aboutBody
  };

  const testimonialsSection: Extract<RedesignSection, { type: "testimonials" }> = {
    type: "testimonials",
    title: getTestimonialsHeading(signals, presetContent.testimonialsTitle),
    items: [
      {
        quote:
          signals.trustProfile === "expertise"
            ? "Nykyiseltä sivulta löytyy jo aineksia asiantuntijuuden viestimiseen, mutta rakenne ei vielä tue niitä riittävän vakuuttavasti."
            : signals.trustProfile === "portfolio"
              ? "Nykyiseltä sivulta löytyy jo aineksia vahvaan laatu- ja referenssivaikutelmaan, mutta rakenne ei vielä tee siitä riittävän kiinnostavaa."
              : "Nykyiseltä sivulta löytyy jo aineksia uskottavaan esitystapaan, mutta rakenne ei vielä tue niitä riittävän hyvin.",
        name: "Snapshot-havainto 1"
      },
      {
        quote:
          signals.primaryConversionGoal === "demo"
            ? "Kun nykyinen viesti jäsennellään selkeämmin, kokonaisuus alkaa ohjata oikeaa kävijää demoon tai keskusteluun paljon tehokkaammin."
            : signals.primaryConversionGoal === "project-start"
              ? "Kun nykyinen viesti jäsennellään selkeämmin, kokonaisuus alkaa houkutella oikeanlaisia projekteja eikä tunnu enää geneeriseltä."
              : "Kun nykyisen sivun viesti jäsennellään selkeämmin, kokonaisuus alkaa näyttää enemmän myyntityökalulta kuin pelkältä verkkoläsnäololta.",
        name: "Snapshot-havainto 2"
      }
    ]
  };

  const ctaSection: Extract<RedesignSection, { type: "cta" }> = {
    type: "cta",
    title: getCtaTitle(signals, industryProfile.ctaTitle),
    body: getCtaBody(signals, industryProfile.ctaBody),
    button: getFinalCtaLabel(
      signals.primaryConversionGoal,
      snapshot.ctaTexts[0] && snapshot.ctaTexts[0].length <= 24
        ? snapshot.ctaTexts[0]
        : presetContent.primaryCta
    )
  };

  const orderedLegacySections = buildSectionPlan(stylePreset, {
    hero: heroSection,
    services: servicesSection,
    about: aboutSection,
    testimonials: testimonialsSection,
    cta: ctaSection
  });

  const ctas = buildCTAs({
    signals,
    pageBlueprints: industryProfile.pageBlueprints,
    fallbackPrimaryLabel: heroSection.primaryCta,
    fallbackSecondaryLabel: heroSection.secondaryCta,
    fallbackFinalLabel: ctaSection.button
  });

  const trustItems = buildTrustItems(testimonialsSection, signals);
  const assetSlots = buildAssetSlots(companyName);

  const homeSections = buildStructuredHomeSections({
    hero: heroSection,
    services: servicesSection,
    about: aboutSection,
    testimonials: testimonialsSection,
    cta: ctaSection,
    orderedLegacySections,
    trustItems,
    signals
  });

  const siteSEO = buildSiteSEO({
    companyName,
    domain: snapshot.domain,
    metaDescription: snapshot.metaDescription,
    industryDescription:
      `${industryProfile.label} yritys, jonka sivurakenne ja hakukonenäkyvyyden perusta on mallinnettu rakenteisesti.`,
    areaServed: buildLocationText(signals, industryProfile.audience)
  });

  const { sitemap, pages } = buildPages({
    companyName,
    industryProfile,
    siteSEO,
    servicesSection,
    testimonialsSection,
    ctaSection,
    homeSections,
    signals
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
      audience: buildLocationText(signals, industryProfile.audience),
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
