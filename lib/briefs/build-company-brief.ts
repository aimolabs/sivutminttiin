import type { CompanyBrief } from "./company-brief";
import type { NormalizedSourceSnapshot } from "../source/normalize-source-snapshot";
import type { InferredIndustryId } from "./infer-industry";
import { INDUSTRY_MAPPINGS } from "./industry-mappings";
import { buildCoreOffer } from "./build-core-offer";

function buildHeroMessage(
  companyName: string,
  industry: InferredIndustryId,
  coreOfferTitle: string
): string {
  switch (industry) {
    case "restaurant":
      return `${companyName} tarvitsee sivun, joka tekee menusta, tunnelmasta ja tilaamisesta houkuttelevia heti.`;
    case "flower-shop":
      return `${companyName} tarvitsee sivun, joka tekee kukkalähetyksestä ja toimituksesta helpon heti ensisilmäyksellä.`;
    case "contractor":
      return `${companyName} tarvitsee sivun, jossa ${coreOfferTitle.toLowerCase()} ja luotettava vaikutelma näkyvät heti.`;
    case "legal":
      return `${companyName} tarvitsee sivun, joka viestii asiantuntemusta ja turvallista ensikontaktia heti.`;
    case "technology":
      return `${companyName} tarvitsee sivun, joka tekee ratkaisun arvon ymmärrettäväksi nopeasti.`;
    case "creative":
      return `${companyName} tarvitsee sivun, joka näyttää yhtä vahvalta kuin sen luova taso.`;
    default:
      return `${companyName} tarvitsee sivun, joka tekee palvelun ja seuraavan askeleen selkeiksi heti.`;
  }
}

function buildHeroSupport(
  snapshot: NormalizedSourceSnapshot,
  industry: InferredIndustryId
): string {
  if (snapshot.metaDescription) {
    return snapshot.metaDescription;
  }

  switch (industry) {
    case "restaurant":
      return "Sivun pitää tehdä tarjonnasta, tilaamisesta ja ravintolan tunnelmasta nopeasti houkuttelevaa.";
    case "flower-shop":
      return "Sivun pitää tehdä valikoima, toimitusalue ja tilaamisen helppous nopeasti ymmärrettäviksi.";
    case "contractor":
      return "Sivun pitää vähentää epävarmuutta, nostaa tärkeimmät palvelut näkyviin ja tehdä tarjouspyynnöstä helppo.";
    case "legal":
      return "Sivun pitää tehdä selväksi missä tilanteissa apua saa ja miksi ensimmäinen yhteydenotto tuntuu turvalliselta.";
    case "technology":
      return "Sivun pitää tehdä hyöty, uskottavuus ja demoon siirtyminen näkyväksi ilman raskasta ominaisuuslistaa.";
    case "creative":
      return "Sivun pitää tuntua omaleimaiselta, mutta samalla tehdä palvelu ja arvolupaus nopeasti ymmärrettäviksi.";
    default:
      return "Sivun pitää tehdä pääpalvelu, uskottavuus ja yhteydenotto nopeasti ymmärrettäviksi.";
  }
}

function buildPositioningSummary(
  companyName: string,
  industry: InferredIndustryId,
  coreOfferTitle: string
): string {
  switch (industry) {
    case "restaurant":
      return `${companyName} kannattaa positioida helposti valittavana paikallisena ravintolana, jossa menu, fiilis ja tilaaminen näkyvät heti.`;
    case "flower-shop":
      return `${companyName} kannattaa positioida helposti lähestyttävänä paikallisena kukkakauppana, jonka ${coreOfferTitle.toLowerCase()} ja toimituksen sujuvuus näkyvät heti.`;
    case "contractor":
      return `${companyName} kannattaa positioida luotettavana tekijänä, jonka ${coreOfferTitle.toLowerCase()} ja yhteydenoton helppous näkyvät heti.`;
    case "legal":
      return `${companyName} kannattaa positioida rauhallisena asiantuntijana, jonka apu ja toimintatapa ymmärretään nopeasti.`;
    case "technology":
      return `${companyName} kannattaa positioida ratkaisuna, jonka liiketoimintahyöty ja seuraava askel ymmärretään nopeasti.`;
    case "creative":
      return `${companyName} kannattaa positioida omaleimaisena tekijänä, jonka taso, laatu ja projektin arvo tuntuvat heti.`;
    default:
      return `${companyName} kannattaa positioida selkeänä palvelutoimijana, jonka arvolupaus ja seuraava askel ymmärretään nopeasti.`;
  }
}

export function buildCompanyBrief(input: {
  companyName: string;
  snapshot: NormalizedSourceSnapshot;
  industry: InferredIndustryId;
}): CompanyBrief {
  const mapping = INDUSTRY_MAPPINGS[input.industry];
  const { coreOffer, secondaryOffers } = buildCoreOffer({
    snapshot: input.snapshot,
    industry: input.industry
  });

  return {
    companyName: input.companyName,
    inferredIndustryId: input.industry,
    archetypeId: mapping.archetypeId,
    targetAudienceSummary: mapping.targetAudienceSummary,
    positioningSummary: buildPositioningSummary(
      input.companyName,
      input.industry,
      coreOffer.title
    ),
    heroMessage: buildHeroMessage(
      input.companyName,
      input.industry,
      coreOffer.title
    ),
    heroSupport: buildHeroSupport(input.snapshot, input.industry),
    primaryConversionGoal: mapping.primaryConversionGoal,
    primaryCTALabel: mapping.primaryCTALabel,
    secondaryCTALabel: mapping.secondaryCTALabel,
    finalCTALabel: mapping.finalCTALabel,
    trustStrategy: mapping.trustStrategy,
    coreOffer,
    secondaryOffers,
    proofPoints: [
      {
        id: "proof-1",
        type: "principle",
        title: "Selkeä arvolupaus",
        body: mapping.trustStrategy
      },
      {
        id: "proof-2",
        type: "principle",
        title: "Ydinpalvelu näkyviin",
        body: `${coreOffer.title} pitää tehdä nopeasti ymmärrettäväksi osaksi sivun pääviestiä.`
      }
    ],
    recommendedPageSet: mapping.recommendedPageSet
  };
}
