import type {
  PageSEO,
  Project,
  ProjectPage,
  SiteSEO,
  SitemapItem,
  StyleDirection
} from "./projects";
import type { StylePresetId } from "./style-presets";
import { STYLE_PRESETS } from "./style-presets";
import { resolveIndustryProfile } from "./industry-profiles";
import { applyStylePresetToContent } from "./apply-style-preset";
import { buildSectionPlan } from "./section-plans";
import type { SourceSnapshot } from "../source/source-snapshot";
import { fetchSourceSnapshot } from "../source/fetch-source-snapshot";
import { normalizeSourceSnapshot } from "../source/normalize-source-snapshot";
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

function resolveCompanyName(snapshot: ReturnType<typeof normalizeSourceSnapshot>): string {
  return snapshot.companyNameCandidate || domainToCompanyName(snapshot.domain);
}

function buildBusinessSummary(
  snapshot: ReturnType<typeof normalizeSourceSnapshot>,
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
}): SiteSEO {
  return {
    siteName: input.companyName,
    titleSuffix: ` | ${input.companyName}`,
    titlePattern: `%PAGE_TITLE% | ${input.companyName}`,
    defaultMetaDescription:
      input.metaDescription ||
      `${input.companyName} tarjoaa palveluitaan selkeästi, uskottavasti ja yhteydenottoon ohjaavasti.`,
    canonicalDomain: `https://${input.domain}`,
    robotsDefault: "index,follow",
    sitemapEnabled: true,
    schemaProfileType: "LocalBusiness",
    schemaProfileName: input.companyName,
    schemaProfileDescription: input.industryDescription
  };
}

function buildPageSEO(input: {
  pageId: string;
  pageType: "home" | "about" | "services" | "contact";
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
    schemaType: input.schemaType,
    internalLinkTargets: input.internalLinkTargets
  };
}

function buildPages(input: {
  companyName: string;
  siteProfile: {
    industry: string;
    audience: string;
  };
  siteSEO: SiteSEO;
  servicesSection: ProjectPage["sections"][number];
  aboutSection: ProjectPage["sections"][number];
  testimonialsSection: ProjectPage["sections"][number];
  ctaSection: ProjectPage["sections"][number];
  homeSections: ProjectPage["sections"];
}): { sitemap: SitemapItem[]; pages: ProjectPage[] } {
  const sitemap: SitemapItem[] = [
    {
      pageId: "home",
      slug: "/",
      pageType: "home",
      title: "Etusivu",
      purpose: "Esittele pääarvolupaus, palvelut ja ensisijainen CTA",
      navigationLabel: "Etusivu",
      navVisible: true,
      footerVisible: true
    },
    {
      pageId: "about",
      slug: "/yritys",
      pageType: "about",
      title: "Yritys",
      purpose: "Rakenna luottamusta ja kerro yrityksestä",
      navigationLabel: "Yritys",
      navVisible: true,
      footerVisible: true
    },
    {
      pageId: "services",
      slug: "/palvelut",
      pageType: "services",
      title: "Palvelut",
      purpose: "Jäsennä tarjooma selkeiksi palvelukokonaisuuksiksi",
      navigationLabel: "Palvelut",
      navVisible: true,
      footerVisible: true
    },
    {
      pageId: "contact",
      slug: "/yhteys",
      pageType: "contact",
      title: "Yhteys",
      purpose: "Ohjaa kävijä yhteydenottoon tai tarjouspyyntöön",
      navigationLabel: "Yhteys",
      navVisible: true,
      footerVisible: true
    }
  ];

  const homeSEO = buildPageSEO({
    pageId: "home",
    pageType: "home",
    pagePurpose: sitemap[0].purpose,
    slug: "/",
    title: `${input.siteProfile.industry} ${input.siteProfile.audience}`,
    metaDescription:
      input.siteSEO.defaultMetaDescription ||
      `${input.companyName} tarjoaa palveluitaan selkeästi ja yhteydenottoon ohjaavasti.`,
    h1:
      input.homeSections.find((section) => section.type === "hero")?.headline ||
      `${input.companyName} palvelut`,
    primaryTopic: input.siteProfile.industry,
    secondaryTopics: [input.siteProfile.audience],
    searchIntent: "homepage conversion",
    schemaType: "WebPage",
    internalLinkTargets: ["/palvelut", "/yritys", "/yhteys"]
  });

  const aboutSEO = buildPageSEO({
    pageId: "about",
    pageType: "about",
    pagePurpose: sitemap[1].purpose,
    slug: "/yritys",
    title: `${input.companyName} yrityksenä`,
    metaDescription:
      `Tutustu ${input.companyName} yritykseen, toimintatapaan ja siihen, miksi se on uskottava valinta.`,
    h1: `${input.companyName} yrityksenä`,
    primaryTopic: `${input.companyName} yrityksenä`,
    secondaryTopics: ["kokemus", "luotettavuus", "toimintatapa"],
    searchIntent: "company credibility",
    schemaType: "AboutPage",
    internalLinkTargets: ["/", "/palvelut", "/yhteys"]
  });

  const servicesSEO = buildPageSEO({
    pageId: "services",
    pageType: "services",
    pagePurpose: sitemap[2].purpose,
    slug: "/palvelut",
    title: `${input.siteProfile.industry} palvelut`,
    metaDescription:
      `${input.companyName} palvelut selkeästi jäsenneltynä. Tutustu tarjoomaan ja löydä oikea seuraava askel.`,
    h1: `${input.siteProfile.industry} palvelut`,
    primaryTopic: `${input.siteProfile.industry} palvelut`,
    secondaryTopics: ["tarjooma", "palvelukokonaisuudet"],
    searchIntent: "service discovery",
    schemaType: "CollectionPage",
    internalLinkTargets: ["/", "/yritys", "/yhteys"]
  });

  const contactSEO = buildPageSEO({
    pageId: "contact",
    pageType: "contact",
    pagePurpose: sitemap[3].purpose,
    slug: "/yhteys",
    title: `Ota yhteyttä | ${input.companyName}`,
    metaDescription:
      `Ota yhteyttä ${input.companyName} ja pyydä tarjous tai aloita keskustelu projektistasi helposti.`,
    h1: "Ota yhteyttä",
    primaryTopic: `Yhteydenotto ${input.companyName}`,
    secondaryTopics: ["tarjouspyyntö", "yhteystiedot"],
    searchIntent: "contact conversion",
    schemaType: "ContactPage",
    internalLinkTargets: ["/", "/palvelut", "/yritys"]
  });

  const pages: ProjectPage[] = [
    {
      ...sitemap[0],
      pageSEO: homeSEO,
      sections: input.homeSections
    },
    {
      ...sitemap[1],
      pageSEO: aboutSEO,
      sections: [
        {
          type: "about",
          title: `${input.companyName} yrityksenä`,
          body:
            "Tämän sivun tarkoitus on tehdä yrityksen toimintatavasta, kokemuksesta ja luotettavuudesta näkyvämpi osa kokonaisuutta."
        },
        input.testimonialsSection,
        {
          type: "cta",
          title: "Keskustellaan projektistasi",
          body:
            "Yrityssivun tehtävä ei ole vain kertoa historiasta, vaan tukea seuraavaa askelta kohti yhteydenottoa.",
          button:
            input.ctaSection.type === "cta" ? input.ctaSection.button : "Ota yhteyttä"
        }
      ]
    },
    {
      ...sitemap[2],
      pageSEO: servicesSEO,
      sections: [
        input.servicesSection,
        {
          type: "about",
          title: "Miten palvelusivu toimii paremmin",
          body:
            "Palvelusivun tarkoitus on tehdä tarjoomasta helposti ymmärrettävä, tukea päätöksentekoa ja ohjata kävijä suoraan oikeaan toimintoon."
        },
        {
          type: "cta",
          title: "Pyydä tarjous oikeasta palvelusta",
          body:
            "Kun palvelut on jäsennelty selkeästi, kiinnostunut kävijä etenee helpommin yhteydenottoon.",
          button:
            input.ctaSection.type === "cta" ? input.ctaSection.button : "Pyydä tarjous"
        }
      ]
    },
    {
      ...sitemap[3],
      pageSEO: contactSEO,
      sections: [
        {
          type: "about",
          title: "Ota yhteyttä",
          body:
            "Yhteyssivun tehtävä on poistaa kitkaa ja tehdä ensimmäisestä yhteydenotosta mahdollisimman helppo."
        },
        input.ctaSection
      ]
    }
  ];

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

  const heroSection = {
    type: "hero" as const,
    eyebrow: industryProfile.heroEyebrow,
    headline: presetContent.heroHeadline,
    subheadline: presetContent.heroSubheadline,
    primaryCta: presetContent.primaryCta,
    secondaryCta:
      snapshot.ctaTexts[0] && snapshot.ctaTexts[0].length <= 28
        ? snapshot.ctaTexts[0]
        : presetContent.secondaryCta
  };

  const servicesSection = {
    type: "services" as const,
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

  const aboutSection = {
    type: "about" as const,
    title: presetContent.aboutTitle,
    body: presetContent.aboutBody
  };

  const testimonialsSection = {
    type: "testimonials" as const,
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

  const ctaSection = {
    type: "cta" as const,
    title: industryProfile.ctaTitle,
    body: industryProfile.ctaBody,
    button:
      snapshot.ctaTexts[0] && snapshot.ctaTexts[0].length <= 24
        ? snapshot.ctaTexts[0]
        : presetContent.primaryCta
  };

  const homeSections = buildSectionPlan(stylePreset, {
    hero: heroSection,
    services: servicesSection,
    about: aboutSection,
    testimonials: testimonialsSection,
    cta: ctaSection
  });

  const siteSEO = buildSiteSEO({
    companyName,
    domain: snapshot.domain,
    metaDescription: snapshot.metaDescription,
    industryDescription: `${industryProfile.label} yritys, jonka sivurakenne ja hakukonenäkyvyyden perusta on mallinnettu rakenteisesti.`
  });

  const { sitemap, pages } = buildPages({
    companyName,
    siteProfile: {
      industry: industryProfile.label,
      audience: industryProfile.audience
    },
    siteSEO,
    servicesSection,
    aboutSection,
    testimonialsSection,
    ctaSection,
    homeSections
  });

  return {
    id: "generated",
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
    siteSEO,
    sitemap,
    pages
  };
}

export async function generateProjectFromUrl(
  url: string,
  options?: { stylePreset?: string }
): Promise<Project> {
  const snapshot = await fetchSourceSnapshot(url);
  return buildProjectFromSourceSnapshot(snapshot, options);
}
