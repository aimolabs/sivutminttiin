import { StylePresetId } from "./style-presets";
import type { CompanyBrief } from "../briefs/company-brief";

export type AuditIssue = {
  title: string;
  detail: string;
};

export type SuggestedSection = {
  name: string;
  reason: string;
};

export type SiteProfile = {
  domain: string;
  companyName: string;
  industry: string;
  audience: string;
  tone: string;
};

export type SourceBrand = {
  siteName?: string;
  themeColor?: string;
  ogImageUrl?: string;
  iconUrl?: string;
};

export type StyleDirection = {
  stylePresetId: StylePresetId;
  visualTone: string;
  density: "compact" | "balanced" | "spacious";
  contrastLevel: "medium" | "high";
  layoutDirection: string;
  interactionMood: string;
};

export type RedesignSection =
  | {
      type: "hero";
      eyebrow: string;
      headline: string;
      subheadline: string;
      primaryCta: string;
      secondaryCta: string;
    }
  | {
      type: "services";
      title: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    }
  | {
      type: "about";
      title: string;
      body: string;
    }
  | {
      type: "testimonials";
      title: string;
      items: Array<{
        quote: string;
        name: string;
      }>;
    }
  | {
      type: "cta";
      title: string;
      body: string;
      button: string;
    };

export type PageType =
  | "home"
  | "about"
  | "services"
  | "contact"
  | "landing"
  | "other";

export type CTAActionType =
  | "contact"
  | "quote"
  | "booking"
  | "demo"
  | "navigation";

export type CTAGoal =
  | "primary-conversion"
  | "secondary-action"
  | "micro-conversion";

export type CTAPlacement = "hero" | "section" | "final";

export type CTA = {
  id: string;
  label: string;
  actionType: CTAActionType;
  target: string;
  goal: CTAGoal;
  placement: CTAPlacement;
};

export type TrustItemType =
  | "testimonial"
  | "rating"
  | "case"
  | "badge"
  | "stat";

export type TrustItem = {
  id: string;
  type: TrustItemType;
  title?: string;
  body?: string;
  proofStrength: "low" | "medium" | "high";
};

export type AssetSlotType = "image" | "video" | "icon";

export type AssetSlotPurpose =
  | "hero-visual"
  | "service-visual"
  | "trust"
  | "general"
  | "og-default"
  | "og-page";

export type AssetSlot = {
  id: string;
  type: AssetSlotType;
  purpose: AssetSlotPurpose;
  altText?: string;
};

export type SectionSEOHints = {
  sectionId: string;
  sectionRole: ProjectSectionRole;
  targetSubtopic?: string;
  anchorId?: string;
  faqEligible?: boolean;
};

export type ProjectSectionRole =
  | "value-proposition"
  | "service-overview"
  | "trust-building"
  | "conversion"
  | "supporting"
  | "faq";

export type ProjectSectionType =
  | "hero"
  | "services"
  | "about"
  | "testimonials"
  | "cta"
  | "content"
  | "faq";

export type ProjectSectionItem = {
  id: string;
  title: string;
  body?: string;
};

export type ProjectSection = {
  id: string;
  type: ProjectSectionType;
  sectionRole: ProjectSectionRole;
  heading: string;
  body?: string;
  eyebrow?: string;
  items?: ProjectSectionItem[];
  ctaIds: string[];
  trustItemIds: string[];
  assetSlotIds: string[];
  seoHints?: SectionSEOHints;
};

export type SiteSEO = {
  siteName: string;
  titleSuffix: string;
  titlePattern: string;
  defaultTitle: string;
  defaultMetaDescription: string;
  canonicalDomain: string;
  canonicalBase: string;
  robotsDefault: string;
  sitemapEnabled: boolean;
  defaultOgImageAssetSlot?: string;
  schemaProfileType: "LocalBusiness" | "Organization";
  schemaProfileName: string;
  schemaProfileDescription: string;
  schemaProfilePhone?: string;
  schemaProfileEmail?: string;
  schemaProfileAddress?: string;
  schemaProfileAreaServed?: string;
  schemaProfileSameAsLinks?: string[];
};

export type PageSEO = {
  pageId: string;
  pageType: PageType;
  pagePurpose: string;
  searchIntent: string;
  primaryTopic: string;
  secondaryTopics: string[];
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  canonicalPath: string;
  indexable: boolean;
  robots: "index,follow" | "noindex,nofollow";
  robotsOverride?: string;
  schemaType: string;
  targetLocations: string[];
  targetServices: string[];
  internalLinkTargets: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImageAssetSlot?: string;
};

export type SitemapItem = {
  pageId: string;
  slug: string;
  pageType: PageType;
  title: string;
  purpose: string;
  navigationLabel: string;
  navVisible: boolean;
  footerVisible: boolean;
  isPrimary?: boolean;
};

export type ProjectPage = SitemapItem & {
  pageSEO: PageSEO;
  sections: ProjectSection[];
};

export type ProjectInput = {
  sourceUrl: string;
  industryId: string;
  stylePreset: StylePresetId;
};

export type Project = {
  id: string;
  input: ProjectInput;
  siteProfile: SiteProfile;
  sourceUrl: string;
  status: "draft" | "ready";
  createdAt: string;
  businessSummary: string;
  companyBrief?: CompanyBrief;
  sourceBrand?: SourceBrand;
  auditIssues: AuditIssue[];
  suggestedSections: SuggestedSection[];
  styleDirection: StyleDirection;
  ctas: CTA[];
  trustItems: TrustItem[];
  assetSlots: AssetSlot[];
  siteSEO: SiteSEO;
  sitemap: SitemapItem[];
  pages: ProjectPage[];
  redesign: {
    stylePreset: StylePresetId;
    sections: RedesignSection[];
  };
};

export const mockProjects: Project[] = [
  {
    id: "demo",
    input: {
      sourceUrl: "https://rakennuslaine.fi",
      industryId: "construction",
      stylePreset: "premium-dark"
    },
    siteProfile: {
      domain: "rakennuslaine.fi",
      companyName: "Rakennus Laine",
      industry: "Rakennus ja remontointi",
      audience: "Kotitaloudet Uudellamaalla",
      tone: "Luotettava ja selkeä palveluyritys"
    },
    sourceUrl: "https://rakennuslaine.fi",
    status: "ready",
    createdAt: "2026-04-01",
    businessSummary:
      "Paikallinen rakennus- ja remonttipalvelu, jonka nykyinen sivu ei viesti laatua, luotettavuutta eikä selkeää palvelurakennetta mobiilissa.",
    auditIssues: [
      {
        title: "Epäselvä etusivun arvolupaus",
        detail:
          "Sivulta ei selviä heti mitä yritys tekee, kenelle ja millä painotuksella."
      },
      {
        title: "Heikko mobiilihierarkia",
        detail:
          "Sisältö tuntuu raskaalta ja toimintakehotteet jäävät piiloon pienellä näytöllä."
      },
      {
        title: "Luottamusta rakentava sisältö puuttuu",
        detail:
          "Referenssit, asiakaspalaute ja selkeä prosessikuvaus eivät nouse esiin."
      }
    ],
    suggestedSections: [
      {
        name: "Hero + selkeä CTA",
        reason:
          "Yrityksen palvelu ja toiminta-alue pitää ymmärtää viidessä sekunnissa."
      },
      {
        name: "Palvelut kortteina",
        reason: "Tarjooma pitää saada nopeasti hahmotettavaksi."
      },
      {
        name: "Miksi valita meidät",
        reason:
          "Luottamus syntyy selkeydestä, kokemuksesta ja toimintatavasta."
      },
      {
        name: "Asiakaspalaute",
        reason: "Sosiaalinen todiste nostaa uskottavuutta."
      },
      {
        name: "Yhteydenotto-osio",
        reason: "Konversiopolku pitää päättää yhteen selkeään toimintaan."
      }
    ],
    styleDirection: {
      stylePresetId: "premium-dark",
      visualTone: "Premium dark",
      density: "spacious",
      contrastLevel: "high",
      layoutDirection: "brand-forward",
      interactionMood: "confident"
    },
    ctas: [
      {
        id: "cta-home-primary",
        label: "Pyydä tarjous",
        actionType: "quote",
        target: "/yhteys",
        goal: "primary-conversion",
        placement: "hero"
      },
      {
        id: "cta-home-secondary",
        label: "Katso palvelut",
        actionType: "navigation",
        target: "/palvelut",
        goal: "secondary-action",
        placement: "hero"
      },
      {
        id: "cta-final-contact",
        label: "Ota yhteyttä",
        actionType: "contact",
        target: "/yhteys",
        goal: "primary-conversion",
        placement: "final"
      }
    ],
    trustItems: [
      {
        id: "trust-testimonial-1",
        type: "testimonial",
        title: "Asiakas 1",
        body:
          "Työ valmistui sovitusti ja viestintä toimi koko projektin ajan erinomaisesti.",
        proofStrength: "high"
      },
      {
        id: "trust-testimonial-2",
        type: "testimonial",
        title: "Asiakas 2",
        body:
          "Siisti työnjälki ja erittäin helppo asioida. Tämä olisi juuri oikea tunnelma myös verkkosivulle.",
        proofStrength: "high"
      }
    ],
    assetSlots: [
      {
        id: "asset-og-default",
        type: "image",
        purpose: "og-default",
        altText: "Rakennus Laine Open Graph -kuva"
      },
      {
        id: "asset-og-home",
        type: "image",
        purpose: "og-page",
        altText: "Rakennus Laine etusivun Open Graph -kuva"
      }
    ],
    siteSEO: {
      siteName: "Rakennus Laine",
      titleSuffix: " | Rakennus Laine",
      titlePattern: "%PAGE_TITLE% | Rakennus Laine",
      defaultTitle: "Rakennus Laine",
      defaultMetaDescription:
        "Rakennus Laine tarjoaa remontti- ja rakennuspalveluita selkeästi, luotettavasti ja yhteydenottoon ohjaavasti.",
      canonicalDomain: "https://rakennuslaine.fi",
      canonicalBase: "https://rakennuslaine.fi",
      robotsDefault: "index,follow",
      sitemapEnabled: true,
      defaultOgImageAssetSlot: "asset-og-default",
      schemaProfileType: "LocalBusiness",
      schemaProfileName: "Rakennus Laine",
      schemaProfileDescription:
        "Paikallinen rakennus- ja remonttipalvelu kotitalouksille ja kiinteistöjen omistajille.",
      schemaProfileAreaServed: "Uusimaa",
      schemaProfileSameAsLinks: []
    },
    sitemap: [
      {
        pageId: "home",
        slug: "/",
        pageType: "home",
        title: "Etusivu",
        purpose: "Esittele pääarvolupaus, palvelut ja ensisijainen CTA",
        navigationLabel: "Etusivu",
        navVisible: true,
        footerVisible: true,
        isPrimary: true
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
    ],
    pages: [
      {
        pageId: "home",
        slug: "/",
        pageType: "home",
        title: "Etusivu",
        purpose: "Esittele pääarvolupaus, palvelut ja ensisijainen CTA",
        navigationLabel: "Etusivu",
        navVisible: true,
        footerVisible: true,
        isPrimary: true,
        pageSEO: {
          pageId: "home",
          pageType: "home",
          pagePurpose:
            "Esittele pääarvolupaus, palvelut ja ensisijainen CTA",
          searchIntent: "local service homepage",
          primaryTopic: "Rakennus- ja remonttipalvelut",
          secondaryTopics: [
            "kylpyhuoneremontit",
            "keittiöremontit",
            "pienrakentaminen"
          ],
          slug: "/",
          title: "Rakennus ja remontointi Uudellamaalla",
          metaDescription:
            "Rakennus Laine tarjoaa remontti- ja rakennuspalveluita Uudellamaalla. Tutustu palveluihin ja pyydä tarjous helposti.",
          h1: "Luotettava tekijä remontteihin ja rakennustöihin Uudellamaalla.",
          canonicalPath: "/",
          indexable: true,
          robots: "index,follow",
          schemaType: "WebPage",
          targetLocations: ["Uusimaa"],
          targetServices: [
            "Kylpyhuoneremontit",
            "Keittiöremontit",
            "Pienrakentaminen"
          ],
          internalLinkTargets: ["/palvelut", "/yritys", "/yhteys"],
          ogTitle: "Rakennus ja remontointi Uudellamaalla",
          ogDescription:
            "Tutustu Rakennus Laineen palveluihin ja pyydä tarjous helposti.",
          ogImageAssetSlot: "asset-og-home"
        },
        sections: [
          {
            id: "home-hero",
            type: "hero",
            sectionRole: "value-proposition",
            eyebrow: "Rakennus ja remontointi",
            heading:
              "Luotettava tekijä remontteihin ja rakennustöihin Uudellamaalla.",
            body:
              "Selkeämpi palvelu, laadukas työnjälki ja sujuva yhteydenotto. Uudistettu konsepti tekee tarjonnasta heti ymmärrettävän.",
            ctaIds: ["cta-home-primary", "cta-home-secondary"],
            trustItemIds: [],
            assetSlotIds: [],
            seoHints: {
              sectionId: "home-hero",
              sectionRole: "value-proposition",
              targetSubtopic: "rakennus- ja remonttipalvelut",
              anchorId: "etusivu-hero",
              faqEligible: false
            }
          },
          {
            id: "home-services",
            type: "services",
            sectionRole: "service-overview",
            heading: "Palvelut",
            items: [
              {
                id: "home-service-1",
                title: "Kylpyhuoneremontit",
                body:
                  "Huolellisesti suunnitellut ja viimeistellyt remontit alusta loppuun."
              },
              {
                id: "home-service-2",
                title: "Keittiöremontit",
                body:
                  "Toimivat, siistit ja arkea kestävät ratkaisut kotitalouksille."
              },
              {
                id: "home-service-3",
                title: "Pienrakentaminen",
                body:
                  "Terassit, väliseinät, pintatyöt ja muut käytännölliset toteutukset."
              }
            ],
            ctaIds: [],
            trustItemIds: [],
            assetSlotIds: [],
            seoHints: {
              sectionId: "home-services",
              sectionRole: "service-overview",
              targetSubtopic: "remonttipalvelut",
              anchorId: "palvelut",
              faqEligible: false
            }
          },
          {
            id: "home-about",
            type: "about",
            sectionRole: "supporting",
            heading: "Miksi tämä konsepti toimii paremmin",
            body:
              "Uusi rakenne tekee yrityksen osaamisesta välittömästi uskottavampaa. Sivun pääviesti, palvelut ja yhteydenotto tukevat samaa tavoitetta: kävijän pitää ymmärtää nopeasti mitä tarjotaan ja miten pääsee eteenpäin.",
            ctaIds: [],
            trustItemIds: [],
            assetSlotIds: []
          },
          {
            id: "home-testimonials",
            type: "testimonials",
            sectionRole: "trust-building",
            heading: "Asiakkaiden luottamus näkyväksi",
            ctaIds: [],
            trustItemIds: ["trust-testimonial-1", "trust-testimonial-2"],
            assetSlotIds: []
          },
          {
            id: "home-cta",
            type: "cta",
            sectionRole: "conversion",
            heading: "Pyydä tarjous helposti",
            body:
              "Selkeä yhteydenotto-osio nostaa todennäköisyyttä, että kiinnostunut kävijä ottaa heti yhteyttä.",
            ctaIds: ["cta-final-contact"],
            trustItemIds: [],
            assetSlotIds: []
          }
        ]
      },
      {
        pageId: "about",
        slug: "/yritys",
        pageType: "about",
        title: "Yritys",
        purpose: "Rakenna luottamusta ja kerro yrityksestä",
        navigationLabel: "Yritys",
        navVisible: true,
        footerVisible: true,
        pageSEO: {
          pageId: "about",
          pageType: "about",
          pagePurpose: "Rakenna luottamusta ja kerro yrityksestä",
          searchIntent: "company credibility",
          primaryTopic: "Rakennus Laine yrityksenä",
          secondaryTopics: ["kokemus", "toimintatapa", "luotettavuus"],
          slug: "/yritys",
          title: "Rakennus Laine yrityksenä",
          metaDescription:
            "Tutustu Rakennus Laineen toimintatapaan, kokemukseen ja siihen, miksi yritys on luotettava valinta remontti- ja rakennustöihin.",
          h1: "Rakennus Laine yrityksenä",
          canonicalPath: "/yritys",
          indexable: true,
          robots: "index,follow",
          schemaType: "AboutPage",
          targetLocations: ["Uusimaa"],
          targetServices: [],
          internalLinkTargets: ["/", "/palvelut", "/yhteys"],
          ogTitle: "Rakennus Laine yrityksenä",
          ogDescription:
            "Tutustu yritykseen, toimintatapaan ja luotettavuuteen.",
          ogImageAssetSlot: "asset-og-default"
        },
        sections: [
          {
            id: "about-company",
            type: "about",
            sectionRole: "trust-building",
            heading: "Rakennus Laine yrityksenä",
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
            heading: "Luottamus rakennetaan näkyviin",
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
        ]
      },
      {
        pageId: "services",
        slug: "/palvelut",
        pageType: "services",
        title: "Palvelut",
        purpose: "Jäsennä tarjooma selkeiksi palvelukokonaisuuksiksi",
        navigationLabel: "Palvelut",
        navVisible: true,
        footerVisible: true,
        pageSEO: {
          pageId: "services",
          pageType: "services",
          pagePurpose: "Jäsennä tarjooma selkeiksi palvelukokonaisuuksiksi",
          searchIntent: "service discovery",
          primaryTopic: "Rakennus Laine palvelut",
          secondaryTopics: [
            "kylpyhuoneremontit",
            "keittiöremontit",
            "pienrakentaminen"
          ],
          slug: "/palvelut",
          title: "Rakennus- ja remonttipalvelut",
          metaDescription:
            "Tutustu Rakennus Laineen palveluihin: kylpyhuoneremontit, keittiöremontit ja pienrakentaminen selkeästi esitettynä.",
          h1: "Rakennus- ja remonttipalvelut",
          canonicalPath: "/palvelut",
          indexable: true,
          robots: "index,follow",
          schemaType: "CollectionPage",
          targetLocations: ["Uusimaa"],
          targetServices: [
            "Kylpyhuoneremontit",
            "Keittiöremontit",
            "Pienrakentaminen"
          ],
          internalLinkTargets: ["/", "/yritys", "/yhteys"],
          ogTitle: "Rakennus- ja remonttipalvelut",
          ogDescription:
            "Tutustu selkeästi jäsenneltyihin palveluihin ja pyydä tarjous.",
          ogImageAssetSlot: "asset-og-default"
        },
        sections: [
          {
            id: "services-overview",
            type: "services",
            sectionRole: "service-overview",
            heading: "Palvelut",
            items: [
              {
                id: "services-1",
                title: "Kylpyhuoneremontit",
                body:
                  "Huolellisesti suunnitellut ja viimeistellyt remontit alusta loppuun."
              },
              {
                id: "services-2",
                title: "Keittiöremontit",
                body:
                  "Toimivat, siistit ja arkea kestävät ratkaisut kotitalouksille."
              },
              {
                id: "services-3",
                title: "Pienrakentaminen",
                body:
                  "Terassit, väliseinät, pintatyöt ja muut käytännölliset toteutukset."
              }
            ],
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
        ]
      },
      {
        pageId: "contact",
        slug: "/yhteys",
        pageType: "contact",
        title: "Yhteys",
        purpose: "Ohjaa kävijä yhteydenottoon tai tarjouspyyntöön",
        navigationLabel: "Yhteys",
        navVisible: true,
        footerVisible: true,
        pageSEO: {
          pageId: "contact",
          pageType: "contact",
          pagePurpose:
            "Ohjaa kävijä yhteydenottoon tai tarjouspyyntöön",
          searchIntent: "contact conversion",
          primaryTopic: "Yhteydenotto Rakennus Laine",
          secondaryTopics: ["tarjouspyyntö", "yhteystiedot"],
          slug: "/yhteys",
          title: "Ota yhteyttä",
          metaDescription:
            "Ota yhteyttä Rakennus Laineeseen ja pyydä tarjous remontti- tai rakennusprojektistasi helposti.",
          h1: "Ota yhteyttä",
          canonicalPath: "/yhteys",
          indexable: true,
          robots: "index,follow",
          schemaType: "ContactPage",
          targetLocations: ["Uusimaa"],
          targetServices: [],
          internalLinkTargets: ["/", "/palvelut", "/yritys"],
          ogTitle: "Ota yhteyttä",
          ogDescription:
            "Pyydä tarjous tai aloita keskustelu projektistasi helposti.",
          ogImageAssetSlot: "asset-og-default"
        },
        sections: [
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
            heading: "Pyydä tarjous helposti",
            body:
              "Selkeä yhteydenottopolku lisää todennäköisyyttä, että kiinnostunut kävijä toimii heti.",
            ctaIds: ["cta-final-contact"],
            trustItemIds: [],
            assetSlotIds: []
          }
        ]
      }
    ],
    redesign: {
      stylePreset: "premium-dark",
      sections: [
        {
          type: "hero",
          eyebrow: "Rakennus ja remontointi",
          headline:
            "Luotettava tekijä remontteihin ja rakennustöihin Uudellamaalla.",
          subheadline:
            "Selkeämpi palvelu, laadukas työnjälki ja sujuva yhteydenotto. Uudistettu konsepti tekee tarjonnasta heti ymmärrettävän.",
          primaryCta: "Pyydä tarjous",
          secondaryCta: "Katso palvelut"
        },
        {
          type: "services",
          title: "Palvelut",
          items: [
            {
              title: "Kylpyhuoneremontit",
              description:
                "Huolellisesti suunnitellut ja viimeistellyt remontit alusta loppuun."
            },
            {
              title: "Keittiöremontit",
              description:
                "Toimivat, siistit ja arkea kestävät ratkaisut kotitalouksille."
            },
            {
              title: "Pienrakentaminen",
              description:
                "Terassit, väliseinät, pintatyöt ja muut käytännölliset toteutukset."
            }
          ]
        },
        {
          type: "about",
          title: "Miksi tämä konsepti toimii paremmin",
          body:
            "Uusi rakenne tekee yrityksen osaamisesta välittömästi uskottavampaa. Sivun pääviesti, palvelut ja yhteydenotto tukevat samaa tavoitetta: kävijän pitää ymmärtää nopeasti mitä tarjotaan ja miten pääsee eteenpäin."
        },
        {
          type: "testimonials",
          title: "Asiakkaiden luottamus näkyväksi",
          items: [
            {
              quote:
                "Työ valmistui sovitusti ja viestintä toimi koko projektin ajan erinomaisesti.",
              name: "Asiakas 1"
            },
            {
              quote:
                "Siisti työnjälki ja erittäin helppo asioida. Tämä olisi juuri oikea tunnelma myös verkkosivulle.",
              name: "Asiakas 2"
            }
          ]
        },
        {
          type: "cta",
          title: "Pyydä tarjous helposti",
          body:
            "Selkeä yhteydenotto-osio nostaa todennäköisyyttä, että kiinnostunut kävijä ottaa heti yhteyttä.",
          button: "Ota yhteyttä"
        }
      ]
    }
  }
];

export function getProjectById(id: string) {
  return mockProjects.find((project) => project.id === id);
}

export function getHomePage(project: Project) {
  return project.pages.find((page) => page.pageType === "home") ?? project.pages[0] ?? null;
}
