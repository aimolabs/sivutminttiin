import type { NormalizedSourceSnapshot } from "../source/normalize-source-snapshot";
import type { InferredIndustryId } from "./infer-industry";
import type { CompanyBriefOffer } from "./company-brief";

const NOISE_PATTERNS = [
  /^avoinna$/i,
  /^auki$/i,
  /^menu$/i,
  /^home$/i,
  /^etusivu$/i,
  /^palvelut$/i,
  /^about$/i,
  /^contact$/i,
  /^a\./i,
  /^b\./i,
  /personal information/i,
  /non-personal information/i,
  /cookie/i,
  /privacy/i,
  /terms/i
];

function isNoise(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.length < 3) return true;
  return NOISE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function cleanCandidates(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter((value) => !isNoise(value)))];
}

function extractLocationText(snapshot: NormalizedSourceSnapshot): string | null {
  const text = [
    snapshot.metaDescription,
    snapshot.h1,
    snapshot.pageTitle,
    snapshot.bodyText
  ]
    .filter(Boolean)
    .join(" ");

  const patterns = [
    /helsingissä/gi,
    /helsinkiin/gi,
    /lahdessa/gi,
    /espoossa/gi,
    /vantaa(?:lla|n)?/gi,
    /etur?-?suomessa/gi,
    /uusimaalla/gi
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[0]) {
      return match[0];
    }
  }

  return null;
}

function buildRestaurantOffer(snapshot: NormalizedSourceSnapshot): {
  coreOffer: CompanyBriefOffer;
  secondaryOffers: CompanyBriefOffer[];
} {
  const location = extractLocationText(snapshot);
  const coreTitle = location ? `Pizza ja ruokailu ${location}` : "Pizza ja menu";
  return {
    coreOffer: {
      title: coreTitle,
      summary:
        "Pääviestin pitää tehdä tarjonnasta, ravintolan fiiliksestä ja tilaamisesta välittömästi houkuttelevaa."
    },
    secondaryOffers: [
      {
        title: "Nouto ja toimitus",
        summary:
          "Tilaamisen tavat pitää tehdä näkyviksi ilman kitkaa."
      },
      {
        title: "Paikan päällä ruokailu",
        summary:
          "Tunnelma, sijainti ja asioinnin helppous kannattaa tuoda uskottavasti esiin."
      }
    ]
  };
}

function buildFlowerShopOffer(snapshot: NormalizedSourceSnapshot): {
  coreOffer: CompanyBriefOffer;
  secondaryOffers: CompanyBriefOffer[];
} {
  const location = extractLocationText(snapshot);
  const coreTitle = location
    ? `Kukkalähetykset ${location}`
    : "Kukkalähetykset ja toimitus";

  return {
    coreOffer: {
      title: coreTitle,
      summary:
        "Pääpalvelun pitää tehdä tilaamisesta, toimituksesta ja valikoimasta nopeasti ymmärrettäviä."
    },
    secondaryOffers: [
      {
        title: "Kimput ja sidonnat",
        summary:
          "Valikoima kannattaa jäsentää tilanteiden ja ostotapojen kautta."
      },
      {
        title: "Yritys- ja juhlatilaukset",
        summary:
          "Yritystarpeet ja suuremmat tilaukset kannattaa nostaa omaksi uskottavaksi osa-alueekseen."
      }
    ]
  };
}

function buildContractorOffer(snapshot: NormalizedSourceSnapshot): {
  coreOffer: CompanyBriefOffer;
  secondaryOffers: CompanyBriefOffer[];
} {
  const headings = cleanCandidates(snapshot.h2s);
  const location = extractLocationText(snapshot);

  const primary =
    headings.find((item) => /maala|remont|rakenn|saneera/i.test(item)) ??
    "Maalaus- ja remonttipalvelut";

  const coreTitle = location ? `${primary} ${location}` : primary;

  const secondaries = headings
    .filter((item) => item !== primary)
    .slice(0, 2)
    .map((item) => ({
      title: item,
      summary: "Tämä palvelu kannattaa tehdä helposti ymmärrettäväksi ja uskottavaksi osaksi kokonaisuutta."
    }));

  return {
    coreOffer: {
      title: coreTitle,
      summary:
        "Pääpalvelun pitää tehdä työn sisältö, alue ja yhteydenoton helppous näkyviksi heti."
    },
    secondaryOffers:
      secondaries.length > 0
        ? secondaries
        : [
            {
              title: "Luotettava toteutus",
              summary:
                "Työtapa, kokemus ja sujuva asiointi kannattaa tehdä näkyviksi luottamuksen rakentamiseksi."
            }
          ]
  };
}

function buildLegalOffer(snapshot: NormalizedSourceSnapshot): {
  coreOffer: CompanyBriefOffer;
  secondaryOffers: CompanyBriefOffer[];
} {
  const headings = cleanCandidates(snapshot.h2s);
  const primary =
    headings.find((item) => /riita|sopimus|työoikeus|perhe|perintö|yritys/i.test(item)) ??
    "Lakipalvelut yrityksille ja yksityisille";

  return {
    coreOffer: {
      title: primary,
      summary:
        "Pääpalvelun pitää tehdä nopeasti selväksi missä tilanteissa asiakas saa apua."
    },
    secondaryOffers: headings
      .filter((item) => item !== primary)
      .slice(0, 2)
      .map((item) => ({
        title: item,
        summary:
          "Tämä osaamisalue kannattaa kuvata asiakkaan tilanteen ja avun näkökulmasta."
      }))
  };
}

function buildTechnologyOffer(snapshot: NormalizedSourceSnapshot): {
  coreOffer: CompanyBriefOffer;
  secondaryOffers: CompanyBriefOffer[];
} {
  const headings = cleanCandidates(snapshot.h2s);
  const primary =
    headings.find((item) => /ratkaisu|platform|alusta|automation|data|integra/i.test(item)) ??
    "Ratkaisu ja liiketoimintahyödyt";

  return {
    coreOffer: {
      title: primary,
      summary:
        "Pääviestin pitää tehdä hyöty, relevanssi ja seuraava askel ymmärrettäviksi ilman raskasta ominaisuuslistaa."
    },
    secondaryOffers: headings
      .filter((item) => item !== primary)
      .slice(0, 2)
      .map((item) => ({
        title: item,
        summary:
          "Tämä kannattaa jäsentää hyötylähtöisesti eikä teknisinä irrallisina ominaisuuksina."
      }))
  };
}

function buildCreativeOffer(snapshot: NormalizedSourceSnapshot): {
  coreOffer: CompanyBriefOffer;
  secondaryOffers: CompanyBriefOffer[];
} {
  const headings = cleanCandidates(snapshot.h2s);
  const primary =
    headings.find((item) => /brand|design|studio|strategy|konsepti|visual/i.test(item)) ??
    "Luova konsepti ja design";

  return {
    coreOffer: {
      title: primary,
      summary:
        "Pääviestin pitää tehdä tason, omaleimaisuuden ja projektin arvon tunne näkyväksi nopeasti."
    },
    secondaryOffers: headings
      .filter((item) => item !== primary)
      .slice(0, 2)
      .map((item) => ({
        title: item,
        summary:
          "Tämä kannattaa esittää harkittuna vahvuutena, ei geneerisenä palvelulistana."
      }))
  };
}

function buildFallbackOffer(snapshot: NormalizedSourceSnapshot): {
  coreOffer: CompanyBriefOffer;
  secondaryOffers: CompanyBriefOffer[];
} {
  const headings = cleanCandidates(snapshot.h2s);
  const primary = headings[0] ?? "Pääpalvelu";

  return {
    coreOffer: {
      title: primary,
      summary:
        "Pääpalvelu pitää nostaa heti ymmärrettäväksi osaksi arvolupausta."
    },
    secondaryOffers: headings.slice(1, 3).map((item) => ({
      title: item,
      summary:
        "Tämä kannattaa jäsentää selkeäksi osaksi tarjoomaa."
    }))
  };
}

export function buildCoreOffer(input: {
  snapshot: NormalizedSourceSnapshot;
  industry: InferredIndustryId;
}): {
  coreOffer: CompanyBriefOffer;
  secondaryOffers: CompanyBriefOffer[];
} {
  switch (input.industry) {
    case "restaurant":
      return buildRestaurantOffer(input.snapshot);
    case "flower-shop":
      return buildFlowerShopOffer(input.snapshot);
    case "contractor":
      return buildContractorOffer(input.snapshot);
    case "legal":
      return buildLegalOffer(input.snapshot);
    case "technology":
      return buildTechnologyOffer(input.snapshot);
    case "creative":
      return buildCreativeOffer(input.snapshot);
    default:
      return buildFallbackOffer(input.snapshot);
  }
}
