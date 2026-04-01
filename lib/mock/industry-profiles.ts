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
};

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
    "Selkeä loppuosa ja yksi ensisijainen CTA nostavat todennäköisyyttä, että kiinnostunut kävijä ottaa yhteyttä heti."
};

export const INDUSTRY_PROFILES: IndustryProfile[] = [
  {
    id: "construction",
    label: "Rakennus ja remontointi",
    audience: "Kotitaloudet ja kiinteistöjen omistajat",
    tone: "Luotettava ja käytännöllinen",
    heroEyebrow: "Rakennus ja remontointi",
    heroHeadlineTemplate: (companyName) =>
      `${companyName} tarvitsee verkkosivun, joka näyttää yhtä luotettavalta kuin työnjälki.`,
    heroSubheadline:
      "Konsepti tekee palveluista, luottamuksesta ja tarjouspyynnöstä heti selkeämmät. Sivun pitää näyttää siltä, että yritys osaa työnsä jo ennen ensimmäistä yhteydenottoa.",
    serviceSectionTitle: "Palvelut nopeasti ymmärrettäviksi",
    serviceItems: [
      {
        title: "Remontit",
        description:
          "Yleisimmät remonttipalvelut nostetaan heti näkyviin, jotta kävijä tunnistaa oikean palvelun nopeasti."
      },
      {
        title: "Rakennustyöt",
        description:
          "Laajemmat toteutukset esitetään selkeästi ja uskottavasti ilman raskasta listamaisuutta."
      },
      {
        title: "Luotettava toteutus",
        description:
          "Työtapa, kokemus ja yhteydenoton helppous rakennetaan näkyväksi osaksi etusivua."
      }
    ],
    ctaTitle: "Pyydä tarjous matalalla kynnyksellä",
    ctaBody:
      "Rakennusalan sivun tärkein tehtävä on poistaa epävarmuutta ja tehdä ensimmäisestä yhteydenotosta mahdollisimman helppo."
  },
  {
    id: "legal",
    label: "Lakipalvelut",
    audience: "Yksityisasiakkaat ja yrityspäättäjät",
    tone: "Asiantunteva ja rauhallinen",
    heroEyebrow: "Lakipalvelut",
    heroHeadlineTemplate: (companyName) =>
      `${companyName} tarvitsee verkkosivun, joka viestii asiantuntemusta heti ensisilmäyksellä.`,
    heroSubheadline:
      "Lakipalveluissa uskottavuus syntyy selkeydestä, rauhallisuudesta ja siitä, että asiakas ymmärtää nopeasti missä asioissa apua on saatavilla.",
    serviceSectionTitle: "Palvelualueet selkeästi esiin",
    serviceItems: [
      {
        title: "Ydinosaaminen",
        description:
          "Keskeiset oikeudelliset palvelut kuvataan tiiviisti ja vakuuttavasti ilman vaikeaselkoista jargonia."
      },
      {
        title: "Asiakastilanteet",
        description:
          "Sivu auttaa kävijää tunnistamaan nopeasti, missä tilanteissa juuri tämä toimisto voi auttaa."
      },
      {
        title: "Luottamus ja prosessi",
        description:
          "Yhteydenoton tapa, toimintamalli ja asiantuntijuus rakennetaan näkyviksi jo etusivulla."
      }
    ],
    ctaTitle: "Tee yhteydenotosta turvallinen",
    ctaBody:
      "Lakipalveluissa CTA:n pitää tuntua selkeältä, rauhalliselta ja matalariskiseltä ensimmäiseltä askeleelta."
  },
  {
    id: "creative",
    label: "Luova studio",
    audience: "Brändit ja kasvuhakuiset yritykset",
    tone: "Rohkea ja moderni",
    heroEyebrow: "Luova studio",
    heroHeadlineTemplate: (companyName) =>
      `${companyName} tarvitsee sivun, joka näyttää yhtä vahvalta kuin sen luova osaaminen.`,
    heroSubheadline:
      "Luovan studion sivun pitää näyttää omaleimaiselta, mutta samalla tehdä palvelu ja arvolupaus välittömästi ymmärrettäviksi.",
    serviceSectionTitle: "Palvelut ja vahvuudet näkyviksi",
    serviceItems: [
      {
        title: "Brändi ja konsepti",
        description:
          "Strateginen ja luova osaaminen nostetaan näkyviin heti, ei piiloteta yleisen esittelyn alle."
      },
      {
        title: "Design ja toteutus",
        description:
          "Palvelut esitetään modernilla tavalla, joka tukee premium-vaikutelmaa eikä tunnu geneeriseltä."
      },
      {
        title: "Referenssifiilis",
        description:
          "Etusivu rakentaa tunnetta siitä, että studio tekee harkittua ja omaleimaista työtä."
      }
    ],
    ctaTitle: "Aloitetaan uusi projekti",
    ctaBody:
      "Luovan studion sivun pitää houkutella oikeanlaisia toimeksiantoja ja tehdä yhteydenotosta luonnollinen seuraava askel."
  },
  {
    id: "technology",
    label: "Teknologiayritys",
    audience: "Yrityspäättäjät ja ostotiimit",
    tone: "Moderni ja vakuuttava",
    heroEyebrow: "Teknologiayritys",
    heroHeadlineTemplate: (companyName) =>
      `${companyName} tarvitsee sivun, joka tekee tuotteesta ja arvosta ymmärrettävän nopeasti.`,
    heroSubheadline:
      "Teknologiayrityksen ongelma ei yleensä ole ominaisuuksien puute vaan epäselvä viestintä. Konseptin tehtävä on tehdä hyöty, uskottavuus ja seuraava askel heti näkyväksi.",
    serviceSectionTitle: "Tarjooma ja hyöty näkyviksi",
    serviceItems: [
      {
        title: "Ratkaisun ydin",
        description:
          "Kävijän pitää ymmärtää nopeasti mitä ongelmaa tuote ratkaisee ja kenelle se on tarkoitettu."
      },
      {
        title: "Keskeiset hyödyt",
        description:
          "Tärkeimmät hyödyt esitetään liiketoimintakielellä, ei pelkkänä ominaisuuslistana."
      },
      {
        title: "Luottamussignaalit",
        description:
          "Uskottavuus rakennetaan selkeällä rakenteella, referensseillä ja vahvalla CTA:lla."
      }
    ],
    ctaTitle: "Ohjaa kohti demoa tai keskustelua",
    ctaBody:
      "B2B-teknologiasivun tärkein tehtävä on siirtää oikea kävijä kohti demoa, yhteydenottoa tai muuta seuraavaa askelta."
  }
];

export function resolveIndustryProfile(domain: string): IndustryProfile {
  const normalized = domain.toLowerCase();

  if (
    normalized.includes("rakenn") ||
    normalized.includes("remont") ||
    normalized.includes("urak") ||
    normalized.includes("maala")
  ) {
    return INDUSTRY_PROFILES.find((profile) => profile.id === "construction")!;
  }

  if (
    normalized.includes("laki") ||
    normalized.includes("legal") ||
    normalized.includes("law") ||
    normalized.includes("jurist")
  ) {
    return INDUSTRY_PROFILES.find((profile) => profile.id === "legal")!;
  }

  if (
    normalized.includes("studio") ||
    normalized.includes("design") ||
    normalized.includes("creative") ||
    normalized.includes("brand")
  ) {
    return INDUSTRY_PROFILES.find((profile) => profile.id === "creative")!;
  }

  if (
    normalized.includes("tech") ||
    normalized.includes("soft") ||
    normalized.includes("data") ||
    normalized.includes("cloud") ||
    normalized.includes("digital") ||
    normalized.includes("app") ||
    normalized.includes("io")
  ) {
    return INDUSTRY_PROFILES.find((profile) => profile.id === "technology")!;
  }

  return DEFAULT_INDUSTRY_PROFILE;
}
