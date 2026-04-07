import type { CompanyArchetypeId } from "../mock/company-archetypes";
import type { InferredIndustryId } from "./infer-industry";
import type { CompanyBriefPage } from "./company-brief";

export type MappedConversionGoal =
  | "quote"
  | "contact"
  | "booking"
  | "demo"
  | "project-start";

export type IndustryMapping = {
  archetypeId: CompanyArchetypeId;
  targetAudienceSummary: string;
  primaryConversionGoal: MappedConversionGoal;
  primaryCTALabel: string;
  secondaryCTALabel: string;
  finalCTALabel: string;
  trustStrategy: string;
  recommendedPageSet: CompanyBriefPage[];
};

export const INDUSTRY_MAPPINGS: Record<InferredIndustryId, IndustryMapping> = {
  restaurant: {
    archetypeId: "generic-service",
    targetAudienceSummary: "Paikalliset asiakkaat, nouto- ja ruokailuasiakkaat",
    primaryConversionGoal: "booking",
    primaryCTALabel: "Tilaa nyt",
    secondaryCTALabel: "Katso menu",
    finalCTALabel: "Tee tilaus",
    trustStrategy:
      "Luottamus rakennetaan houkuttelevalla menulla, ravintolan fiiliksellä ja erittäin helpolla tilaamisen tai käynnin seuraavalla askeleella.",
    recommendedPageSet: [
      {
        id: "home",
        pageType: "home",
        slug: "/",
        navigationLabel: "Etusivu",
        title: "Etusivu",
        purpose: "Tee menu, tunnelma ja tilaaminen houkutteleviksi heti",
        navVisible: true,
        footerVisible: true,
        isPrimary: true
      },
      {
        id: "menu",
        pageType: "services",
        slug: "/menu",
        navigationLabel: "Menu",
        title: "Menu",
        purpose: "Jäsennä tarjonta helposti selattavaan muotoon",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "restaurant",
        pageType: "about",
        slug: "/ravintola",
        navigationLabel: "Ravintola",
        title: "Ravintola",
        purpose: "Näytä tunnelma, sijainti ja asioinnin helppous",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "order",
        pageType: "contact",
        slug: "/tilaa",
        navigationLabel: "Tilaa",
        title: "Tilaa",
        purpose: "Ohjaa kävijä tekemään tilaus tai tulemaan paikan päälle",
        navVisible: true,
        footerVisible: true
      }
    ]
  },

  "flower-shop": {
    archetypeId: "generic-service",
    targetAudienceSummary: "Paikalliset lahja- ja arkiostajat sekä yritysasiakkaat",
    primaryConversionGoal: "contact",
    primaryCTALabel: "Tilaa kukkia",
    secondaryCTALabel: "Katso valikoima",
    finalCTALabel: "Tilaa nyt",
    trustStrategy:
      "Luottamus rakennetaan paikallisuudella, toimituksen sujuvuudella, valikoiman selkeydellä ja tilaamisen helppoudella.",
    recommendedPageSet: [
      {
        id: "home",
        pageType: "home",
        slug: "/",
        navigationLabel: "Etusivu",
        title: "Etusivu",
        purpose: "Tee valikoima, toimitus ja tilaaminen nopeasti ymmärrettäviksi",
        navVisible: true,
        footerVisible: true,
        isPrimary: true
      },
      {
        id: "selection",
        pageType: "services",
        slug: "/valikoima",
        navigationLabel: "Valikoima",
        title: "Valikoima",
        purpose: "Jäsennä kukat, sidonnat ja tilanteet helposti hahmotettaviksi",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "delivery",
        pageType: "about",
        slug: "/toimitus",
        navigationLabel: "Toimitus",
        title: "Toimitus",
        purpose: "Rakenna luottamusta toimitusalueen, palvelun ja asioinnin kautta",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "order",
        pageType: "contact",
        slug: "/tilaa",
        navigationLabel: "Tilaa",
        title: "Tilaa",
        purpose: "Ohjaa kävijä tilaamaan tai ottamaan yhteyttä nopeasti",
        navVisible: true,
        footerVisible: true
      }
    ]
  },

  contractor: {
    archetypeId: "local-contractor",
    targetAudienceSummary: "Kotitaloudet ja kiinteistöjen omistajat",
    primaryConversionGoal: "quote",
    primaryCTALabel: "Pyydä tarjous",
    secondaryCTALabel: "Katso palvelut",
    finalCTALabel: "Pyydä tarjous",
    trustStrategy:
      "Luottamus rakennetaan paikallisen uskottavuuden, selkeän toimintatavan, kokemuksen ja matalan tarjouspyyntökynnyksen varaan.",
    recommendedPageSet: [
      {
        id: "home",
        pageType: "home",
        slug: "/",
        navigationLabel: "Etusivu",
        title: "Etusivu",
        purpose: "Esittele tärkeimmät palvelut, luotettava vaikutelma ja tarjouspyyntö",
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
        purpose: "Jäsennä remontti- ja rakennuspalvelut selkeiksi kokonaisuuksiksi",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "company",
        pageType: "about",
        slug: "/yritys",
        navigationLabel: "Yritys",
        title: "Yritys",
        purpose: "Rakenna luottamusta kokemuksen, toimintatavan ja luotettavuuden kautta",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "quote",
        pageType: "contact",
        slug: "/pyyda-tarjous",
        navigationLabel: "Pyydä tarjous",
        title: "Pyydä tarjous",
        purpose: "Poista kitkaa tarjouspyynnöstä ja tee yhteydenotosta nopea",
        navVisible: true,
        footerVisible: true
      }
    ]
  },

  legal: {
    archetypeId: "trusted-advisor",
    targetAudienceSummary: "Yksityisasiakkaat ja yrityspäättäjät",
    primaryConversionGoal: "contact",
    primaryCTALabel: "Ota yhteyttä",
    secondaryCTALabel: "Tutustu osaamiseen",
    finalCTALabel: "Aloita keskustelu",
    trustStrategy:
      "Luottamus rakennetaan asiantuntijuudella, rauhallisella viestillä, selkeällä toimintatavalla ja turvallisella ensikontaktilla.",
    recommendedPageSet: [
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
        id: "expertise",
        pageType: "services",
        slug: "/osaamisalueet",
        navigationLabel: "Osaamisalueet",
        title: "Osaamisalueet",
        purpose: "Jäsennä palvelut asiakkaan tilanteiden ja oikeudellisten teemojen kautta",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "advisor",
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
        purpose: "Tee ensimmäisestä yhteydenotosta turvallinen ja selkeä",
        navVisible: true,
        footerVisible: true
      }
    ]
  },

  technology: {
    archetypeId: "b2b-solution",
    targetAudienceSummary: "Yrityspäättäjät ja ostotiimit",
    primaryConversionGoal: "demo",
    primaryCTALabel: "Pyydä demo",
    secondaryCTALabel: "Tutustu ratkaisuun",
    finalCTALabel: "Pyydä demo",
    trustStrategy:
      "Luottamus rakennetaan hyötyjen, proofin, uskottavan positioningin ja selkeän demopolun varaan.",
    recommendedPageSet: [
      {
        id: "home",
        pageType: "home",
        slug: "/",
        navigationLabel: "Etusivu",
        title: "Etusivu",
        purpose: "Tee tuotteen arvo, hyöty ja seuraava askel heti ymmärrettäviksi",
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
        id: "demo",
        pageType: "contact",
        slug: "/pyyda-demo",
        navigationLabel: "Pyydä demo",
        title: "Pyydä demo",
        purpose: "Ohjaa ostaja demoon tai tarkempaan keskusteluun",
        navVisible: true,
        footerVisible: true
      }
    ]
  },

  creative: {
    archetypeId: "creative-showcase",
    targetAudienceSummary: "Brändit ja kasvuhakuiset yritykset",
    primaryConversionGoal: "project-start",
    primaryCTALabel: "Aloita projekti",
    secondaryCTALabel: "Katso työt",
    finalCTALabel: "Aloitetaan projekti",
    trustStrategy:
      "Luottamus rakennetaan laadun, omaleimaisuuden ja työn jäljen tunnelman varaan.",
    recommendedPageSet: [
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
        purpose: "Jäsennä strateginen ja luova tarjooma selkeiksi kokonaisuuksiksi",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "work",
        pageType: "other",
        slug: "/tyot",
        navigationLabel: "Työt",
        title: "Työt",
        purpose: "Rakenna laatuvaikutelmaa ja uskottavuutta työnäytteiden kautta",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "start",
        pageType: "contact",
        slug: "/aloita-projekti",
        navigationLabel: "Aloita projekti",
        title: "Aloita projekti",
        purpose: "Houkuttele oikeanlaiset toimeksiannot keskusteluun",
        navVisible: true,
        footerVisible: true
      }
    ]
  },

  "local-services": {
    archetypeId: "generic-service",
    targetAudienceSummary: "Paikalliset asiakkaat",
    primaryConversionGoal: "contact",
    primaryCTALabel: "Ota yhteyttä",
    secondaryCTALabel: "Tutustu palveluihin",
    finalCTALabel: "Ota yhteyttä",
    trustStrategy:
      "Luottamus rakennetaan selkeän arvolupauksen, helposti ymmärrettävän tarjooman ja matalan yhteydenottokynnyksen varaan.",
    recommendedPageSet: [
      {
        id: "home",
        pageType: "home",
        slug: "/",
        navigationLabel: "Etusivu",
        title: "Etusivu",
        purpose: "Esittele pääarvolupaus ja seuraava askel",
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
        purpose: "Jäsennä tarjooma selkeästi",
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
    ]
  }
};
