import type { CompanySignals } from "../source/infer-company-signals";
import type { IndustryPageBlueprint } from "./industry-profiles";
import type { ProjectSection } from "./projects";

export type CompanyArchetypeId =
  | "local-contractor"
  | "trusted-advisor"
  | "creative-showcase"
  | "b2b-solution"
  | "generic-service";

export type SectionBlueprint =
  | {
      kind: "hero";
      headingStrategy:
        | "industry-headline"
        | "clarify-value"
        | "clarify-expertise"
        | "clarify-outcome";
      bodyStrategy:
        | "cta-led"
        | "trust-led"
        | "outcome-led"
        | "positioning-led";
      includePrimaryCta: boolean;
      includeSecondaryCta: boolean;
    }
  | {
      kind: "services";
      sectionRole: ProjectSection["sectionRole"];
      heading: string;
      body?: string;
    }
  | {
      kind: "proof";
      sectionRole: ProjectSection["sectionRole"];
      heading: string;
      proofStyle: "testimonials" | "stats" | "process";
    }
  | {
      kind: "about";
      sectionRole: ProjectSection["sectionRole"];
      heading: string;
      bodyTemplate: string;
    }
  | {
      kind: "cta";
      sectionRole: "conversion";
      heading: string;
      body: string;
      ctaId: "cta-home-primary" | "cta-home-secondary" | "cta-final-contact";
    };

export type CompanyArchetype = {
  id: CompanyArchetypeId;
  label: string;
  pageBlueprints: IndustryPageBlueprint[];
  homepageBlueprint: SectionBlueprint[];
  pageBlueprintByType: Partial<
    Record<IndustryPageBlueprint["pageType"], SectionBlueprint[]>
  >;
};

const LOCAL_CONTRACTOR_PAGES: IndustryPageBlueprint[] = [
  {
    id: "home",
    pageType: "home",
    slug: "/",
    navigationLabel: "Etusivu",
    title: "Etusivu",
    purpose: "Esittele pääarvolupaus, palvelut ja tarjouspyynnön CTA",
    navVisible: true,
    footerVisible: true,
    isPrimary: true
  },
  {
    id: "services",
    pageType: "services",
    slug: "/palvelut",
    navigationLabel: "Palvelut",
    title: "Palvelut",
    purpose: "Jäsennä tärkeimmät remontti- ja rakennuspalvelut selkeästi",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "about",
    pageType: "about",
    slug: "/yritys",
    navigationLabel: "Yritys",
    title: "Yritys",
    purpose: "Rakenna luottamusta kokemuksen, toimintatavan ja paikallisen uskottavuuden kautta",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "contact",
    pageType: "contact",
    slug: "/pyyda-tarjous",
    navigationLabel: "Pyydä tarjous",
    title: "Pyydä tarjous",
    purpose: "Poista kitkaa tarjouspyynnöstä ja tee yhteydenotosta nopea",
    navVisible: true,
    footerVisible: true
  }
];

const TRUSTED_ADVISOR_PAGES: IndustryPageBlueprint[] = [
  {
    id: "home",
    pageType: "home",
    slug: "/",
    navigationLabel: "Etusivu",
    title: "Etusivu",
    purpose: "Esittele asiantuntijuus, tilanteet joissa autetaan ja turvallinen yhteydenotto",
    navVisible: true,
    footerVisible: true,
    isPrimary: true
  },
  {
    id: "services",
    pageType: "services",
    slug: "/osaamisalueet",
    navigationLabel: "Osaamisalueet",
    title: "Osaamisalueet",
    purpose: "Jäsennä oikeudelliset tai asiantuntijapalvelut tilanteiden kautta",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "about",
    pageType: "about",
    slug: "/asiantuntija",
    navigationLabel: "Asiantuntija",
    title: "Asiantuntija",
    purpose: "Rakenna luottamusta profiilin, kokemuksen ja toimintatavan kautta",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "contact",
    pageType: "contact",
    slug: "/ota-yhteytta",
    navigationLabel: "Ota yhteyttä",
    title: "Ota yhteyttä",
    purpose: "Tee ensimmäisestä yhteydenotosta turvallinen ja matalariskinen",
    navVisible: true,
    footerVisible: true
  }
];

const CREATIVE_SHOWCASE_PAGES: IndustryPageBlueprint[] = [
  {
    id: "home",
    pageType: "home",
    slug: "/",
    navigationLabel: "Etusivu",
    title: "Etusivu",
    purpose: "Näytä luova taso, omaleimaisuus ja projektin aloituksen CTA",
    navVisible: true,
    footerVisible: true,
    isPrimary: true
  },
  {
    id: "services",
    pageType: "services",
    slug: "/palvelut",
    navigationLabel: "Palvelut",
    title: "Palvelut",
    purpose: "Jäsennä tarjooma strategisiin ja luoviin kokonaisuuksiin",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "cases",
    pageType: "other",
    slug: "/tyot",
    navigationLabel: "Työt",
    title: "Työt",
    purpose: "Rakenna laatufiilistä ja uskottavuutta työnäytteiden kautta",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "contact",
    pageType: "contact",
    slug: "/aloita-projekti",
    navigationLabel: "Aloita projekti",
    title: "Aloita projekti",
    purpose: "Houkuttele oikeanlaiset toimeksiannot keskusteluun",
    navVisible: true,
    footerVisible: true
  }
];

const B2B_SOLUTION_PAGES: IndustryPageBlueprint[] = [
  {
    id: "home",
    pageType: "home",
    slug: "/",
    navigationLabel: "Etusivu",
    title: "Etusivu",
    purpose: "Tee tuotteen arvo, hyöty ja seuraava askel heti ymmärrettäväksi",
    navVisible: true,
    footerVisible: true,
    isPrimary: true
  },
  {
    id: "solution",
    pageType: "services",
    slug: "/ratkaisu",
    navigationLabel: "Ratkaisu",
    title: "Ratkaisu",
    purpose: "Jäsennä ratkaisu ongelman, hyödyn ja toimintatavan kautta",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "proof",
    pageType: "other",
    slug: "/miksi-me",
    navigationLabel: "Miksi me",
    title: "Miksi me",
    purpose: "Rakenna uskottavuutta hyötyjen, prosessin ja proofin kautta",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "contact",
    pageType: "contact",
    slug: "/pyyda-demo",
    navigationLabel: "Pyydä demo",
    title: "Pyydä demo",
    purpose: "Ohjaa ostaja demoon tai tarkempaan keskusteluun",
    navVisible: true,
    footerVisible: true
  }
];

const GENERIC_SERVICE_PAGES: IndustryPageBlueprint[] = [
  {
    id: "home",
    pageType: "home",
    slug: "/",
    navigationLabel: "Etusivu",
    title: "Etusivu",
    purpose: "Esittele pääarvolupaus, tärkeimmät palvelut ja ensisijainen CTA",
    navVisible: true,
    footerVisible: true,
    isPrimary: true
  },
  {
    id: "services",
    pageType: "services",
    slug: "/palvelut",
    navigationLabel: "Palvelut",
    title: "Palvelut",
    purpose: "Jäsennä tarjooma selkeiksi palvelukokonaisuuksiksi",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "about",
    pageType: "about",
    slug: "/yritys",
    navigationLabel: "Yritys",
    title: "Yritys",
    purpose: "Rakenna luottamusta ja kerro yrityksestä",
    navVisible: true,
    footerVisible: true
  },
  {
    id: "contact",
    pageType: "contact",
    slug: "/yhteys",
    navigationLabel: "Yhteys",
    title: "Yhteys",
    purpose: "Ohjaa kävijä yhteydenottoon",
    navVisible: true,
    footerVisible: true
  }
];

const ARCHETYPES: Record<CompanyArchetypeId, CompanyArchetype> = {
  "local-contractor": {
    id: "local-contractor",
    label: "Local contractor",
    pageBlueprints: LOCAL_CONTRACTOR_PAGES,
    homepageBlueprint: [
      {
        kind: "hero",
        headingStrategy: "clarify-value",
        bodyStrategy: "trust-led",
        includePrimaryCta: true,
        includeSecondaryCta: true
      },
      {
        kind: "services",
        sectionRole: "service-overview",
        heading: "Palvelut nopeasti ymmärrettäviksi"
      },
      {
        kind: "proof",
        sectionRole: "trust-building",
        heading: "Miksi tähän tekijään voi luottaa",
        proofStyle: "process"
      },
      {
        kind: "cta",
        sectionRole: "conversion",
        heading: "Pyydä tarjous matalalla kynnyksellä",
        body: "Poista epävarmuutta ja tee ensimmäisestä yhteydenotosta helppo.",
        ctaId: "cta-final-contact"
      }
    ],
    pageBlueprintByType: {
      about: [
        {
          kind: "about",
          sectionRole: "trust-building",
          heading: "Toimintatapa ja luotettavuus",
          bodyTemplate:
            "Tämän sivun tehtävä on tehdä yrityksen työn jäljestä, toimintatavasta ja luotettavuudesta näkyvämpi osa kokonaisuutta."
        },
        {
          kind: "proof",
          sectionRole: "trust-building",
          heading: "Luottamusta tukevat signaalit",
          proofStyle: "testimonials"
        },
        {
          kind: "cta",
          sectionRole: "conversion",
          heading: "Pyydä tarjous",
          body: "Kun luottamus on rakennettu, seuraavan askeleen pitää olla helppo.",
          ctaId: "cta-final-contact"
        }
      ],
      services: [
        {
          kind: "services",
          sectionRole: "service-overview",
          heading: "Keskeiset palvelut"
        },
        {
          kind: "about",
          sectionRole: "supporting",
          heading: "Miten palvelut kannattaa esittää",
          bodyTemplate:
            "Palvelusivun pitää tehdä tarjoomasta selkeä, uskottava ja nopeasti hahmotettava."
        },
        {
          kind: "cta",
          sectionRole: "conversion",
          heading: "Pyydä tarjous oikeasta palvelusta",
          body: "Selkeä tarjooma tukee päätöstä ottaa yhteyttä.",
          ctaId: "cta-home-primary"
        }
      ]
    }
  },
  "trusted-advisor": {
    id: "trusted-advisor",
    label: "Trusted advisor",
    pageBlueprints: TRUSTED_ADVISOR_PAGES,
    homepageBlueprint: [
      {
        kind: "hero",
        headingStrategy: "clarify-expertise",
        bodyStrategy: "positioning-led",
        includePrimaryCta: true,
        includeSecondaryCta: true
      },
      {
        kind: "services",
        sectionRole: "service-overview",
        heading: "Tilanteet joissa autamme"
      },
      {
        kind: "about",
        sectionRole: "trust-building",
        heading: "Asiantuntijuus nopeasti ymmärrettäväksi",
        bodyTemplate:
          "Etusivun pitää viestiä rauhallisesti missä asioissa apua saa ja miksi yhteydenotto tuntuu turvalliselta."
      },
      {
        kind: "cta",
        sectionRole: "conversion",
        heading: "Ota yhteyttä turvallisesti",
        body: "Ensimmäisen kontaktin pitää tuntua matalariskiseltä ja selkeältä.",
        ctaId: "cta-final-contact"
      }
    ],
    pageBlueprintByType: {
      about: [
        {
          kind: "about",
          sectionRole: "trust-building",
          heading: "Profiili ja toimintatapa",
          bodyTemplate:
            "Tämän sivun tehtävä on rakentaa asiantuntijaluottamusta profiilin, kokemuksen ja prosessin kautta."
        },
        {
          kind: "proof",
          sectionRole: "trust-building",
          heading: "Luottamusta tukevat havainnot",
          proofStyle: "testimonials"
        },
        {
          kind: "cta",
          sectionRole: "conversion",
          heading: "Aloita keskustelu",
          body: "Kun asiantuntijuus on selkeä, yhteydenoton pitää olla helppo.",
          ctaId: "cta-final-contact"
        }
      ]
    }
  },
  "creative-showcase": {
    id: "creative-showcase",
    label: "Creative showcase",
    pageBlueprints: CREATIVE_SHOWCASE_PAGES,
    homepageBlueprint: [
      {
        kind: "hero",
        headingStrategy: "clarify-value",
        bodyStrategy: "positioning-led",
        includePrimaryCta: true,
        includeSecondaryCta: true
      },
      {
        kind: "proof",
        sectionRole: "trust-building",
        heading: "Miksi tämä tuntuu vahvemmalta",
        proofStyle: "testimonials"
      },
      {
        kind: "services",
        sectionRole: "service-overview",
        heading: "Palvelut ja vahvuudet näkyviksi"
      },
      {
        kind: "cta",
        sectionRole: "conversion",
        heading: "Aloitetaan uusi projekti",
        body: "Sivun pitää houkutella oikeanlaiset toimeksiannot seuraavaan keskusteluun.",
        ctaId: "cta-final-contact"
      }
    ],
    pageBlueprintByType: {
      other: [
        {
          kind: "about",
          sectionRole: "supporting",
          heading: "Työt ja laatuvaikutelma",
          bodyTemplate:
            "Tämän sivun tehtävä on rakentaa tunnetta siitä, että studio tekee harkittua ja omaleimaista työtä."
        },
        {
          kind: "cta",
          sectionRole: "conversion",
          heading: "Keskustellaan seuraavasta projektista",
          body: "Kun laatu tuntuu uskottavalta, siirtymän pitää tapahtua luonnollisesti.",
          ctaId: "cta-final-contact"
        }
      ]
    }
  },
  "b2b-solution": {
    id: "b2b-solution",
    label: "B2B solution",
    pageBlueprints: B2B_SOLUTION_PAGES,
    homepageBlueprint: [
      {
        kind: "hero",
        headingStrategy: "clarify-outcome",
        bodyStrategy: "outcome-led",
        includePrimaryCta: true,
        includeSecondaryCta: true
      },
      {
        kind: "services",
        sectionRole: "service-overview",
        heading: "Ratkaisu ja hyöty näkyviksi"
      },
      {
        kind: "proof",
        sectionRole: "trust-building",
        heading: "Miksi tämä on uskottava valinta",
        proofStyle: "stats"
      },
      {
        kind: "cta",
        sectionRole: "conversion",
        heading: "Pyydä demo tai keskustelu",
        body: "Oikean ostajan pitää päästä nopeasti seuraavaan vaiheeseen.",
        ctaId: "cta-final-contact"
      }
    ],
    pageBlueprintByType: {
      services: [
        {
          kind: "services",
          sectionRole: "service-overview",
          heading: "Ratkaisu jäsenneltynä"
        },
        {
          kind: "about",
          sectionRole: "supporting",
          heading: "Hyöty ensin, ei ominaisuudet ensin",
          bodyTemplate:
            "Ratkaisusivun tehtävä on tehdä hyöty, toimintatapa ja relevanssi nopeasti ymmärrettäväksi."
        },
        {
          kind: "cta",
          sectionRole: "conversion",
          heading: "Pyydä demo",
          body: "Kun ratkaisu on ymmärrettävä, demoon siirtymisen pitää olla helppoa.",
          ctaId: "cta-home-primary"
        }
      ]
    }
  },
  "generic-service": {
    id: "generic-service",
    label: "Generic service",
    pageBlueprints: GENERIC_SERVICE_PAGES,
    homepageBlueprint: [
      {
        kind: "hero",
        headingStrategy: "clarify-value",
        bodyStrategy: "cta-led",
        includePrimaryCta: true,
        includeSecondaryCta: true
      },
      {
        kind: "services",
        sectionRole: "service-overview",
        heading: "Palvelut selkeästi esiin"
      },
      {
        kind: "about",
        sectionRole: "supporting",
        heading: "Miksi tämä rakenne toimii",
        bodyTemplate:
          "Etusivun pitää tehdä arvolupaus, tarjooma ja seuraava askel nopeasti ymmärrettäviksi."
      },
      {
        kind: "cta",
        sectionRole: "conversion",
        heading: "Ota yhteyttä",
        body: "Kiinnostuneen kävijän pitää nähdä selkeä seuraava askel.",
        ctaId: "cta-final-contact"
      }
    ],
    pageBlueprintByType: {}
  }
};

export function resolveCompanyArchetypeId(
  signals: CompanySignals
): CompanyArchetypeId {
  if (signals.industryId === "construction") {
    return "local-contractor";
  }

  if (signals.industryId === "legal") {
    return "trusted-advisor";
  }

  if (signals.industryId === "creative") {
    return "creative-showcase";
  }

  if (signals.industryId === "technology") {
    return "b2b-solution";
  }

  if (signals.trustProfile === "portfolio") {
    return "creative-showcase";
  }

  if (signals.primaryConversionGoal === "demo") {
    return "b2b-solution";
  }

  if (signals.trustProfile === "expertise") {
    return "trusted-advisor";
  }

  return "generic-service";
}

export function getCompanyArchetype(
  archetypeId: CompanyArchetypeId
): CompanyArchetype {
  return ARCHETYPES[archetypeId];
}
