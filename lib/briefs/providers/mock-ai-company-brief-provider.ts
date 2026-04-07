import type { CompanyBriefProvider, BuildCompanyBriefInput } from "./company-brief-provider";
import type { CompanyBrief } from "../company-brief";

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

function buildMockAIBrief(domain: string, snapshotText: string): CompanyBrief {
  const companyName = domainToCompanyName(domain);
  const lower = snapshotText.toLowerCase();

  const isFlower =
    lower.includes("kukka") ||
    lower.includes("flowers") ||
    lower.includes("florist") ||
    lower.includes("interflora");

  const isRestaurant =
    lower.includes("pizza") ||
    lower.includes("pizzeria") ||
    lower.includes("ravintola") ||
    lower.includes("restaurant") ||
    lower.includes("menu");

  if (isFlower) {
    return {
      companyName,
      inferredIndustryId: "local-services",
      archetypeId: "generic-service",
      targetAudienceSummary: "Paikalliset lahja- ja arkiostajat sekä yritysasiakkaat",
      positioningSummary:
        `${companyName} kannattaa positioida helposti lähestyttävänä paikallisena kukkakauppana, jonka nopea toimitus ja valikoima näkyvät heti.`,
      heroMessage:
        `${companyName} tarvitsee sivun, joka tekee kukkalähetyksestä ja toimituksesta helpon heti ensisilmäyksellä.`,
      heroSupport:
        "Sivun pitää tehdä valikoima, toimitusalue ja tilaamisen helppous nopeasti ymmärrettäviksi ilman geneeristä verkkokauppafiilistä.",
      primaryConversionGoal: "contact",
      primaryCTALabel: "Tilaa kukkia",
      secondaryCTALabel: "Katso valikoima",
      finalCTALabel: "Tilaa nyt",
      trustStrategy:
        "Luottamus rakennetaan paikallisuudella, toimituksen sujuvuudella ja selkeällä palvelulupauksella.",
      coreOffer: {
        title: "Kukkalähetys ja toimitus",
        summary:
          "Pääpalvelu pitää tehdä välittömästi ymmärrettäväksi ja helposti tilattavaksi."
      },
      secondaryOffers: [
        {
          title: "Juhla- ja surusidonta",
          summary:
            "Tarjooma kannattaa jäsentää käyttötapojen ja tilanteiden kautta."
        },
        {
          title: "Yrityskukat",
          summary:
            "Yritysasiakkaiden tarpeet kannattaa nostaa erilliseksi uskottavaksi osa-alueeksi."
        }
      ],
      proofPoints: [
        {
          id: "proof-1",
          type: "principle",
          title: "Nopea ja helppo tilaus",
          body: "Ensivaikutelman pitää tehdä tilaamisesta vaivatonta eikä monimutkaista."
        },
        {
          id: "proof-2",
          type: "principle",
          title: "Paikallinen luotettavuus",
          body: "Toimitusalue, palvelun varmuus ja selkeä asiointi ovat tärkeimmät luottamussignaalit."
        }
      ],
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
          id: "services",
          pageType: "services",
          slug: "/valikoima",
          navigationLabel: "Valikoima",
          title: "Valikoima",
          purpose: "Jäsennä kukat ja sidonnat helposti hahmotettaviin kokonaisuuksiin",
          navVisible: true,
          footerVisible: true
        },
        {
          id: "about",
          pageType: "about",
          slug: "/toimitus",
          navigationLabel: "Toimitus",
          title: "Toimitus",
          purpose: "Rakenna luottamusta toimitusalueen, palvelun ja asioinnin helppouden kautta",
          navVisible: true,
          footerVisible: true
        },
        {
          id: "contact",
          pageType: "contact",
          slug: "/tilaa",
          navigationLabel: "Tilaa",
          title: "Tilaa",
          purpose: "Ohjaa kävijä nopeasti tilaamaan tai ottamaan yhteyttä",
          navVisible: true,
          footerVisible: true
        }
      ]
    };
  }

  if (isRestaurant) {
    return {
      companyName,
      inferredIndustryId: "local-services",
      archetypeId: "generic-service",
      targetAudienceSummary: "Paikalliset asiakkaat, nouto- ja ruokailuasiakkaat",
      positioningSummary:
        `${companyName} kannattaa positioida helposti valittavana paikallisena ravintolana, jossa menu, tunnelma ja tilaaminen näkyvät heti.`,
      heroMessage:
        `${companyName} tarvitsee sivun, joka tekee menusta, tunnelmasta ja tilaamisesta heti houkuttelevan.`,
      heroSupport:
        "Sivun pitää tehdä menu, asioinnin helppous ja ravintolan fiilis näkyväksi nopeasti ilman geneeristä palveluyrityksen rakennetta.",
      primaryConversionGoal: "booking",
      primaryCTALabel: "Tilaa nyt",
      secondaryCTALabel: "Katso menu",
      finalCTALabel: "Tee tilaus",
      trustStrategy:
        "Luottamus rakennetaan selkeällä menulla, helposti ymmärrettävällä asioinnilla ja ravintolan omalla tunnelmalla.",
      coreOffer: {
        title: "Pizza ja menu",
        summary:
          "Pääviestin pitää tehdä tarjonta houkuttelevaksi ja nopeasti selattavaksi."
      },
      secondaryOffers: [
        {
          title: "Nouto ja toimitus",
          summary:
            "Tilaamisen tapa pitää tehdä näkyväksi ilman kitkaa."
        },
        {
          title: "Paikan päällä ruokailu",
          summary:
            "Tunnelma ja käynnin helppous kannattaa tehdä uskottavaksi osaksi kokonaisuutta."
        }
      ],
      proofPoints: [
        {
          id: "proof-1",
          type: "principle",
          title: "Houkutteleva menu",
          body: "Kävijän pitää nähdä nopeasti mikä tekee tarjonnasta kiinnostavan."
        },
        {
          id: "proof-2",
          type: "principle",
          title: "Helppo tilaus",
          body: "Tilaamisen tai käynnin seuraavan askeleen pitää olla erittäin selkeä."
        }
      ],
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
          id: "services",
          pageType: "services",
          slug: "/menu",
          navigationLabel: "Menu",
          title: "Menu",
          purpose: "Jäsennä pizza- ja ruokatarjonta helposti selattavaan muotoon",
          navVisible: true,
          footerVisible: true
        },
        {
          id: "about",
          pageType: "about",
          slug: "/ravintola",
          navigationLabel: "Ravintola",
          title: "Ravintola",
          purpose: "Näytä tunnelma, sijainti ja asioinnin helppous",
          navVisible: true,
          footerVisible: true
        },
        {
          id: "contact",
          pageType: "contact",
          slug: "/tilaa",
          navigationLabel: "Tilaa",
          title: "Tilaa",
          purpose: "Ohjaa kävijä tekemään tilaus tai tulemaan paikan päälle",
          navVisible: true,
          footerVisible: true
        }
      ]
    };
  }

  return {
    companyName,
    inferredIndustryId: "local-services",
    archetypeId: "generic-service",
    targetAudienceSummary: "Paikalliset asiakkaat",
    positioningSummary:
      `${companyName} kannattaa positioida selkeänä palveluyrityksenä, jonka arvolupaus ja seuraava askel ymmärretään nopeasti.`,
    heroMessage:
      `${companyName} tarvitsee sivun, joka tekee palvelun ja seuraavan askeleen selkeiksi heti.`,
    heroSupport:
      "Sivun pitää tehdä pääpalvelu, uskottavuus ja yhteydenotto nopeasti ymmärrettäviksi.",
    primaryConversionGoal: "contact",
    primaryCTALabel: "Ota yhteyttä",
    secondaryCTALabel: "Tutustu palveluihin",
    finalCTALabel: "Ota yhteyttä",
    trustStrategy:
      "Luottamus rakennetaan selkeän palvelulupauksen ja helpon yhteydenoton varaan.",
    coreOffer: {
      title: "Pääpalvelu",
      summary: "Pääpalvelu pitää nostaa näkyväksi heti."
    },
    secondaryOffers: [],
    proofPoints: [
      {
        id: "proof-1",
        type: "principle",
        title: "Selkeä arvolupaus",
        body: "Kävijän pitää ymmärtää nopeasti mitä yritys tekee ja miksi siihen kannattaa luottaa."
      }
    ],
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
  };
}

export const mockAICompanyBriefProvider: CompanyBriefProvider = {
  id: "mock-ai",
  async buildBrief({ snapshot }: BuildCompanyBriefInput) {
    const text = [
      snapshot.domain,
      snapshot.pageTitle,
      snapshot.metaDescription,
      snapshot.h1,
      ...snapshot.h2s,
      ...snapshot.navItems
    ]
      .filter(Boolean)
      .join(" ");

    return buildMockAIBrief(snapshot.domain, text);
  }
};
