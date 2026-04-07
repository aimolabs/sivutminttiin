export type IndustryPageBlueprint = {
  id: string;
  pageType: "home" | "about" | "services" | "contact" | "landing" | "other";
  slug: string;
  navigationLabel: string;
  title: string;
  purpose: string;
  navVisible: boolean;
  footerVisible: boolean;
  isPrimary?: boolean;
};

export type IndustryProfile = {
  id: string;
  label: string;
  audience: string;
  tone: string;
  heroEyebrow: string;
  heroHeadlineTemplate: (companyName: string) => string;
  heroSubheadline: string;
  serviceSectionTitle: string;
  serviceItems: Array<{
    title: string;
    description: string;
  }>;
  ctaTitle: string;
  ctaBody: string;
  pageBlueprints: IndustryPageBlueprint[];
};

const DEFAULT_PAGE_BLUEPRINTS: IndustryPageBlueprint[] = [
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
    purpose: "Ohjaa kävijä yhteydenottoon tai tarjouspyyntöön",
    navVisible: true,
    footerVisible: true
  }
];

export const DEFAULT_INDUSTRY_PROFILE: IndustryProfile = {
  id: "local-services",
  label: "Paikallinen palveluyritys",
  audience: "Paikalliset asiakkaat",
  tone: "Selkeä ja luotettava",
  heroEyebrow: "Paikallinen palveluyritys",
  heroHeadlineTemplate: (companyName) =>
    `${companyName} ansaitsee selkeämmän ja uskottavamman verkkosivun.`,
  heroSubheadline:
    "Tämä konsepti tekee yrityksen palvelusta helpommin ymmärrettävän, nostaa luottamusta ja ohjaa kävijää kohti yhteydenottoa.",
  serviceSectionTitle: "Palvelut selkeästi esiin",
  serviceItems: [
    {
      title: "Ydinpalvelu",
      description:
        "Etusivun tärkein palvelu nostetaan heti näkyväksi niin, että kävijä ymmärtää mitä yritys myy."
    },
    {
      title: "Lisäpalvelu",
      description:
        "Toissijaiset palvelut tukevat kokonaiskuvaa ilman että sivu muuttuu sekavaksi."
    },
    {
      title: "Erottava vahvuus",
      description:
        "Yrityksen kilpailuetu tai erityisosaaminen tuodaan näkyväksi uskottavasti ja tiiviisti."
    }
  ],
  ctaTitle: "Tehdään yhteydenotosta helppoa",
  ctaBody:
    "Selkeä loppuosa ja yksi ensisijainen CTA nostavat todennäköisyyttä, että kiinnostunut kävijä ottaa yhteyttä heti.",
  pageBlueprints: DEFAULT_PAGE_BLUEPRINTS
};

export const INDUSTRY_PROFILES: IndustryProfile[] = [
  {
    id: "restaurant",
    label: "Ravintola",
    audience: "Paikalliset asiakkaat ja noutoasiakkaat",
    tone: "Houkutteleva ja helposti lähestyttävä",
    heroEyebrow: "Ravintola",
    heroHeadlineTemplate: (companyName) =>
      `${companyName} tarvitsee sivun, joka tekee menusta, tunnelmasta ja tilaamisesta houkuttelevia heti.`,
    heroSubheadline:
      "Ravintolan sivun pitää tehdä tarjonta, fiilis ja tilaamisen seuraava askel nopeasti ymmärrettäviksi.",
    serviceSectionTitle: "Menu ja tarjonta näkyviksi",
    serviceItems: [
      {
        title: "Suosikit",
        description:
          "Tärkeimmät annokset ja kategoriat pitää tehdä nopeasti selattaviksi."
      },
      {
        title: "Nouto ja tilaus",
        description:
          "Tilaamisen tapa ja seuraava askel pitää olla täysin selkeä."
      },
      {
        title: "Tunnelma",
        description:
          "Ravintolan fiilis ja asioinnin helppous pitää tuntua heti."
      }
    ],
    ctaTitle: "Tee tilauksesta helppo",
    ctaBody:
      "Ravintolasivun tärkein tehtävä on tehdä tilaamisesta tai käynnistä mahdollisimman mutkaton.",
    pageBlueprints: [
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
  {
    id: "flower-shop",
    label: "Kukkakauppa",
    audience: "Paikalliset lahja- ja arkiostajat sekä yritysasiakkaat",
    tone: "Lämmin ja laadukas",
    heroEyebrow: "Kukkakauppa",
    heroHeadlineTemplate: (companyName) =>
      `${companyName} tarvitsee sivun, joka tekee kukkalähetyksestä ja toimituksesta helpon heti ensisilmäyksellä.`,
    heroSubheadline:
      "Kukkakaupan sivun pitää tehdä valikoima, toimitus ja tilaamisen helppous nopeasti ymmärrettäviksi.",
    serviceSectionTitle: "Valikoima helposti hahmotettavaksi",
    serviceItems: [
      {
        title: "Kimput ja sidonnat",
        description:
          "Valikoima kannattaa jäsentää tilanteiden ja ostotapojen kautta."
      },
      {
        title: "Toimitus",
        description:
          "Toimitusalue ja nopeus pitää tehdä selväksi heti."
      },
      {
        title: "Yritystilaukset",
        description:
          "Yritysasiakkaiden tarpeet kannattaa nostaa omaksi uskottavaksi osa-alueekseen."
      }
    ],
    ctaTitle: "Tilaa kukkia helposti",
    ctaBody:
      "Sivun tärkein tehtävä on tehdä tilaamisesta, toimituksesta ja valikoimasta mahdollisimman helppoa.",
    pageBlueprints: [
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
  {
    id: "contractor",
    label: "Rakennus ja remontointi",
    audience: "Kotitaloudet ja kiinteistöjen omistajat",
    tone: "Luotettava ja käytännöllinen",
    heroEyebrow: "Rakennus ja remontointi",
    heroHeadlineTemplate: (companyName) =>
      `${companyName} tarvitsee sivun, jossa palvelut ja luotettava vaikutelma näkyvät heti.`,
    heroSubheadline:
      "Sivun pitää vähentää epävarmuutta, nostaa tärkeimmät palvelut näkyviin ja tehdä tarjouspyynnöstä helppo.",
    serviceSectionTitle: "Palvelut nopeasti ymmärrettäviksi",
    serviceItems: [
      {
        title: "Remontit",
        description:
          "Yleisimmät remonttipalvelut pitää nostaa nopeasti näkyviin."
      },
      {
        title: "Rakennustyöt",
        description:
          "Laajemmat toteutukset pitää esittää selkeästi ja uskottavasti."
      },
      {
        title: "Luotettava toteutus",
        description:
          "Työtapa, kokemus ja yhteydenoton helppous pitää tehdä näkyviksi."
      }
    ],
    ctaTitle: "Pyydä tarjous matalalla kynnyksellä",
    ctaBody:
      "Tämän sivun tärkein tehtävä on poistaa epävarmuutta ja tehdä tarjouspyynnöstä mahdollisimman helppo.",
    pageBlueprints: [
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
  {
    id: "legal",
    label: "Lakipalvelut",
    audience: "Yksityisasiakkaat ja yrityspäättäjät",
    tone: "Asiantunteva ja rauhallinen",
    heroEyebrow: "Lakipalvelut",
    heroHeadlineTemplate: (companyName) =>
      `${companyName} tarvitsee sivun, joka viestii asiantuntemusta ja turvallista ensikontaktia heti.`,
    heroSubheadline:
      "Sivun pitää tehdä selväksi missä tilanteissa apua saa ja miksi ensimmäinen yhteydenotto tuntuu turvalliselta.",
    serviceSectionTitle: "Osaamisalueet selkeästi esiin",
    serviceItems: [
      {
        title: "Yritysjuridiikka",
        description:
          "Osaaminen kannattaa kuvata asiakkaan tilanteiden kautta."
      },
      {
        title: "Yksityisasiakkaan tilanteet",
        description:
          "Kävijän pitää tunnistaa nopeasti missä tilanteissa apua on saatavilla."
      },
      {
        title: "Luottamus ja prosessi",
        description:
          "Asiantuntijuus, toimintatapa ja turvallinen yhteydenotto pitää tehdä näkyviksi."
      }
    ],
    ctaTitle: "Aloita keskustelu turvallisesti",
    ctaBody:
      "Tämän sivun tärkein tehtävä on tehdä yhteydenotosta selkeä, rauhallinen ja matalariskinen.",
    pageBlueprints: [
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
  {
    id: "clinic",
    label: "Klinikka ja hoitopalvelut",
    audience: "Paikalliset ajanvarausasiakkaat",
    tone: "Luotettava ja rauhoittava",
    heroEyebrow: "Klinikka ja hoitopalvelut",
    heroHeadlineTemplate: (companyName) =>
      `${companyName} tarvitsee sivun, joka tekee palvelun, luottamuksen ja ajanvarauksen helpoksi heti.`,
    heroSubheadline:
      "Sivun pitää tehdä palvelu, osaaminen ja ajanvarauksen seuraava askel välittömästi ymmärrettäviksi.",
    serviceSectionTitle: "Palvelut ja hoidot selkeästi esiin",
    serviceItems: [
      {
        title: "Ydinpalvelu",
        description:
          "Pääpalvelu pitää nostaa nopeasti ymmärrettäväksi."
      },
      {
        title: "Ajanvaraus",
        description:
          "Seuraava askel pitää olla näkyvä ja kitkaton."
      },
      {
        title: "Luottamus",
        description:
          "Osaaminen, toimipiste ja hoidon hyöty pitää tehdä näkyviksi."
      }
    ],
    ctaTitle: "Varaa aika helposti",
    ctaBody:
      "Tämän sivun tärkein tehtävä on tehdä ajanvarauksesta mahdollisimman helppo ensimmäinen askel.",
    pageBlueprints: [
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
        purpose: "Jäsennä palvelut ja hoidot selkeästi",
        navVisible: true,
        footerVisible: true
      },
      {
        id: "location",
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
    ]
  }
];

export function getIndustryProfileById(industryId?: string): IndustryProfile {
  if (!industryId) {
    return DEFAULT_INDUSTRY_PROFILE;
  }

  return (
    INDUSTRY_PROFILES.find((profile) => profile.id === industryId) ??
    DEFAULT_INDUSTRY_PROFILE
  );
}

export function getIndustryOptions() {
  return INDUSTRY_PROFILES.map((profile) => ({
    id: profile.id,
    label: profile.label
  }));
}
