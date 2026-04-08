import type { CompanyArchetypeId } from "../briefs/archetype-id";
import type {
  InferredBusinessModel,
  InferredIndustryId,
  InferredPageArchetype
} from "./infer-industry";
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

function buildPageSet(
  archetype: InferredPageArchetype,
  industry: InferredIndustryId
): CompanyBriefPage[] {
  switch (archetype) {
    case "menu-led":
      return [
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
      ];

    case "catalog-led":
      return [
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
          slug: industry === "flower-shop" ? "/valikoima" : "/tuotteet",
          navigationLabel: industry === "flower-shop" ? "Valikoima" : "Tuotteet",
          title: industry === "flower-shop" ? "Valikoima" : "Tuotteet",
          purpose: "Jäsennä tarjooma helposti hahmotettavaan muotoon",
          navVisible: true,
          footerVisible: true
        },
        {
          id: "delivery",
          pageType: "about",
          slug: industry === "flower-shop" ? "/toimitus" : "/ostosohjeet",
          navigationLabel: industry === "flower-shop" ? "Toimitus" : "Ostosohjeet",
          title: industry === "flower-shop" ? "Toimitus" : "Ostosohjeet",
          purpose: "Rakenna luottamusta toimituksen, asioinnin tai ostamisen helppouden kautta",
          navVisible: true,
          footerVisible: true
        },
        {
          id: "order",
          pageType: "contact",
          slug: industry === "flower-shop" ? "/tilaa" : "/osta",
          navigationLabel: industry === "flower-shop" ? "Tilaa" : "Osta",
          title: industry === "flower-shop" ? "Tilaa" : "Osta",
          purpose: "Ohjaa kävijä tilaamaan tai ostamaan nopeasti",
          navVisible: true,
          footerVisible: true
        }
      ];

    case "quote-led":
      return [
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
          purpose: "Jäsennä palvelut selkeiksi kokonaisuuksiksi",
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
      ];

    case "booking-led":
      return [
        {
          id: "home",
          pageType: "home",
          slug: "/",
          navigationLabel: "Etusivu",
          title: "Etusivu",
          purpose: "Tee palvelu, luottamus ja ajanvaraus ymmärrettäviksi heti",
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
          purpose: "Jäsennä palvelut, hoidot tai valmennukset selkeästi",
          navVisible: true,
          footerVisible: true
        },
        {
          id: "about",
          pageType: "about",
          slug: "/toimipiste",
          navigationLabel: "Toimipiste",
          title: "Toimipiste",
          purpose: "Rakenna luottamusta sijainnin, osaamisen ja asioinnin kautta",
          navVisible: true,
          footerVisible: true
        },
        {
          id: "booking",
          pageType: "contact",
          slug: "/varaa-aika",
          navigationLabel: "Varaa aika",
          title: "Varaa aika",
          purpose: "Ohjaa kävijä suoraan ajanvaraukseen tai ensimmäiseen kontaktiin",
          navVisible: true,
          footerVisible: true
        }
      ];

    case "demo-led":
      return [
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
      ];

    case "portfolio-led":
      return [
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
          purpose: "Jäsennä tarjooma selkeiksi kokonaisuuksiksi",
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
      ];

    case "trust-led":
    default:
      return [
        {
          id: "home",
          pageType: "home",
          slug: "/",
          navigationLabel: "Etusivu",
          title: "Etusivu",
          purpose: "Esittele asiantuntijuus, arvolupaus ja turvallinen seuraava askel",
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
          purpose: "Jäsennä palvelut tai osaamisalueet selkeästi",
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
          purpose: "Tee yhteydenotosta turvallinen ja selkeä",
          navVisible: true,
          footerVisible: true
        }
      ];
  }
}

function inferArchetypeId(
  industry: InferredIndustryId,
  businessModel: InferredBusinessModel,
  pageArchetype: InferredPageArchetype
): CompanyArchetypeId {
  if (industry === "contractor" || pageArchetype === "quote-led") {
    return "local-contractor";
  }

  if (industry === "legal" || industry === "accounting" || businessModel === "expert-advisory") {
    return "trusted-advisor";
  }

  if (industry === "creative" || pageArchetype === "portfolio-led") {
    return "creative-showcase";
  }

  if (industry === "technology" || pageArchetype === "demo-led") {
    return "b2b-solution";
  }

  return "generic-service";
}

function inferAudience(
  industry: InferredIndustryId,
  businessModel: InferredBusinessModel
): string {
  switch (industry) {
    case "restaurant":
      return "Paikalliset asiakkaat, nouto- ja ruokailuasiakkaat";
    case "flower-shop":
      return "Paikalliset lahja- ja arkiostajat sekä yritysasiakkaat";
    case "contractor":
      return "Kotitaloudet ja kiinteistöjen omistajat";
    case "legal":
      return "Yksityisasiakkaat ja yrityspäättäjät";
    case "accounting":
      return "Yrittäjät ja yrityspäättäjät";
    case "clinic":
      return "Paikalliset ajanvarausasiakkaat";
    case "beauty":
      return "Paikalliset ajanvarausasiakkaat";
    case "fitness":
      return "Paikalliset hyvinvointi- ja valmennusasiakkaat";
    case "cleaning":
      return "Kotitaloudet ja yritysasiakkaat";
    case "real-estate":
      return "Asunnon ostajat, myyjät ja vuokraajat";
    case "ecommerce":
      return "Verkkokaupan ostajat";
    case "technology":
      return "Yrityspäättäjät ja ostotiimit";
    case "manufacturing":
      return "Yritysasiakkaat ja hankintapäättäjät";
    case "consultancy":
      return "Yritysjohto ja kehitysvastuulliset";
    case "creative":
      return "Brändit ja kasvuhakuiset yritykset";
    default:
      return businessModel === "local-general" ? "Paikalliset asiakkaat" : "Yritys- ja kuluttaja-asiakkaat";
  }
}

function inferConversion(
  businessModel: InferredBusinessModel,
  pageArchetype: InferredPageArchetype
): MappedConversionGoal {
  if (pageArchetype === "quote-led") return "quote";
  if (pageArchetype === "booking-led") return "booking";
  if (pageArchetype === "demo-led") return "demo";
  if (pageArchetype === "portfolio-led") return "project-start";
  if (businessModel === "catalog-commerce") return "contact";
  return "contact";
}

function inferCtas(
  pageArchetype: InferredPageArchetype,
  industry: InferredIndustryId
): Pick<IndustryMapping, "primaryCTALabel" | "secondaryCTALabel" | "finalCTALabel"> {
  switch (pageArchetype) {
    case "menu-led":
      return {
        primaryCTALabel: "Tilaa nyt",
        secondaryCTALabel: "Katso menu",
        finalCTALabel: "Tee tilaus"
      };
    case "catalog-led":
      return industry === "flower-shop"
        ? {
            primaryCTALabel: "Tilaa kukkia",
            secondaryCTALabel: "Katso valikoima",
            finalCTALabel: "Tilaa nyt"
          }
        : {
            primaryCTALabel: "Osta nyt",
            secondaryCTALabel: "Katso tuotteet",
            finalCTALabel: "Osta nyt"
          };
    case "quote-led":
      return {
        primaryCTALabel: "Pyydä tarjous",
        secondaryCTALabel: "Katso palvelut",
        finalCTALabel: "Pyydä tarjous"
      };
    case "booking-led":
      return {
        primaryCTALabel: "Varaa aika",
        secondaryCTALabel: "Tutustu palveluun",
        finalCTALabel: "Varaa aika"
      };
    case "demo-led":
      return {
        primaryCTALabel: "Pyydä demo",
        secondaryCTALabel: "Tutustu ratkaisuun",
        finalCTALabel: "Pyydä demo"
      };
    case "portfolio-led":
      return {
        primaryCTALabel: "Aloita projekti",
        secondaryCTALabel: "Katso työt",
        finalCTALabel: "Aloitetaan projekti"
      };
    case "trust-led":
    default:
      return {
        primaryCTALabel: "Ota yhteyttä",
        secondaryCTALabel: "Tutustu osaamiseen",
        finalCTALabel: "Aloita keskustelu"
      };
  }
}

function inferTrustStrategy(
  industry: InferredIndustryId,
  businessModel: InferredBusinessModel,
  pageArchetype: InferredPageArchetype
): string {
  if (industry === "restaurant") {
    return "Luottamus rakennetaan houkuttelevalla menulla, ravintolan fiiliksellä ja helpolla tilaamisen tai käynnin seuraavalla askeleella.";
  }

  if (industry === "flower-shop") {
    return "Luottamus rakennetaan paikallisuudella, toimituksen sujuvuudella, valikoiman selkeydellä ja tilaamisen helppoudella.";
  }

  if (industry === "contractor") {
    return "Luottamus rakennetaan paikallisen uskottavuuden, selkeän toimintatavan, kokemuksen ja matalan tarjouspyyntökynnyksen varaan.";
  }

  if (industry === "legal" || industry === "accounting" || businessModel === "expert-advisory") {
    return "Luottamus rakennetaan asiantuntijuudella, rauhallisella viestillä, selkeällä toimintatavalla ja turvallisella ensikontaktilla.";
  }

  if (pageArchetype === "demo-led") {
    return "Luottamus rakennetaan hyötyjen, proofin, uskottavan positioningin ja selkeän demopolun varaan.";
  }

  if (pageArchetype === "portfolio-led") {
    return "Luottamus rakennetaan laadun, omaleimaisuuden ja työn jäljen tunnelman varaan.";
  }

  return "Luottamus rakennetaan selkeän arvolupauksen, helposti ymmärrettävän tarjooman ja matalan yhteydenottokynnyksen varaan.";
}

export function getIndustryMapping(input: {
  industry: InferredIndustryId;
  businessModel: InferredBusinessModel;
  pageArchetype: InferredPageArchetype;
}): IndustryMapping {
  const archetypeId = inferArchetypeId(
    input.industry,
    input.businessModel,
    input.pageArchetype
  );

  const primaryConversionGoal = inferConversion(
    input.businessModel,
    input.pageArchetype
  );

  const ctas = inferCtas(input.pageArchetype, input.industry);

  return {
    archetypeId,
    targetAudienceSummary: inferAudience(input.industry, input.businessModel),
    primaryConversionGoal,
    primaryCTALabel: ctas.primaryCTALabel,
    secondaryCTALabel: ctas.secondaryCTALabel,
    finalCTALabel: ctas.finalCTALabel,
    trustStrategy: inferTrustStrategy(
      input.industry,
      input.businessModel,
      input.pageArchetype
    ),
    recommendedPageSet: buildPageSet(input.pageArchetype, input.industry)
  };
}
