import type { CompanyBrief } from "./company-brief";
import type { NormalizedSourceSnapshot } from "../source/normalize-source-snapshot";
import type {
  InferredIndustryId,
  InferredBusinessModel,
  InferredPageArchetype
} from "./infer-industry";
import { getIndustryMapping } from "./industry-mappings";
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
    case "accounting":
      return `${companyName} tarvitsee sivun, joka tekee asiantuntija-avun ja luottamuksen näkyväksi heti.`;
    case "clinic":
      return `${companyName} tarvitsee sivun, joka tekee palvelun, luottamuksen ja ajanvarauksen helpoksi heti.`;
    case "beauty":
      return `${companyName} tarvitsee sivun, joka tekee palvelun, tunnelman ja ajanvarauksen houkutteleviksi heti.`;
    case "fitness":
      return `${companyName} tarvitsee sivun, joka tekee valmennuksen, energian ja aloittamisen helpoksi heti.`;
    case "cleaning":
      return `${companyName} tarvitsee sivun, jossa palvelu, luotettavuus ja tarjouspyyntö näkyvät heti.`;
    case "real-estate":
      return `${companyName} tarvitsee sivun, joka tekee kohteet, luottamuksen ja yhteydenoton selkeiksi heti.`;
    case "ecommerce":
      return `${companyName} tarvitsee sivun, joka tekee valikoimasta ja ostamisesta sujuvaa heti.`;
    case "technology":
      return `${companyName} tarvitsee sivun, joka tekee ratkaisun arvon ymmärrettäväksi nopeasti.`;
    case "manufacturing":
      return `${companyName} tarvitsee sivun, joka tekee osaamisen, kapasiteetin ja yhteydenoton uskottaviksi heti.`;
    case "consultancy":
      return `${companyName} tarvitsee sivun, joka tekee asiantuntija-avun arvon ja seuraavan askeleen selkeiksi heti.`;
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
    case "accounting":
      return "Sivun pitää tehdä selväksi missä asioissa apua saa ja miksi ensimmäinen yhteydenotto tuntuu turvalliselta.";
    case "clinic":
    case "beauty":
    case "fitness":
      return "Sivun pitää tehdä palvelu, osaaminen ja ajanvarauksen seuraava askel välittömästi ymmärrettäviksi.";
    case "cleaning":
      return "Sivun pitää tehdä palvelun sisältö, luotettavuus ja tarjouspyyntö selkeiksi nopeasti.";
    case "real-estate":
      return "Sivun pitää tehdä kohteet, asiantuntijuus ja yhteydenoton seuraava askel helposti ymmärrettäviksi.";
    case "ecommerce":
      return "Sivun pitää tehdä valikoima, ostaminen ja toimituspolku sujuviksi heti.";
    case "technology":
      return "Sivun pitää tehdä hyöty, uskottavuus ja demoon siirtyminen näkyväksi ilman raskasta ominaisuuslistaa.";
    case "manufacturing":
      return "Sivun pitää tehdä tekninen osaaminen, toimintakyky ja yhteydenoton relevanssi uskottaviksi.";
    case "consultancy":
      return "Sivun pitää tehdä asiantuntija-avun hyöty, toimintatapa ja seuraava askel nopeasti ymmärrettäviksi.";
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
    case "accounting":
      return `${companyName} kannattaa positioida luotettavana talouskumppanina, jonka apu tuntuu selkeältä ja matalariskiseltä.`;
    case "clinic":
      return `${companyName} kannattaa positioida luotettavana hoitopaikkana, jossa ajanvaraus ja palvelun hyöty ymmärretään nopeasti.`;
    case "beauty":
      return `${companyName} kannattaa positioida houkuttelevana palvelupaikkana, jossa tunnelma ja ajanvarauksen helppous tuntuvat heti.`;
    case "fitness":
      return `${companyName} kannattaa positioida helposti lähestyttävänä valmennus- tai hyvinvointitoimijana, jonka aloittaminen tuntuu helpolta.`;
    case "cleaning":
      return `${companyName} kannattaa positioida luotettavana palvelukumppanina, jonka työn sisältö ja tarjouspyyntö ovat selkeitä heti.`;
    case "real-estate":
      return `${companyName} kannattaa positioida uskottavana välittäjänä, jonka kohteet, asiantuntemus ja yhteydenotto toimivat saumattomasti.`;
    case "ecommerce":
      return `${companyName} kannattaa positioida selkeänä verkkokauppana, jossa valikoima ja ostaminen tuntuvat sujuvilta heti.`;
    case "technology":
      return `${companyName} kannattaa positioida ratkaisuna, jonka liiketoimintahyöty ja seuraava askel ymmärretään nopeasti.`;
    case "manufacturing":
      return `${companyName} kannattaa positioida teknisesti uskottavana toimijana, jonka osaaminen ja kapasiteetti näkyvät heti.`;
    case "consultancy":
      return `${companyName} kannattaa positioida asiantuntijakumppanina, jonka hyöty ja toimintatapa ymmärretään nopeasti.`;
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
  businessModel: InferredBusinessModel;
  pageArchetype: InferredPageArchetype;
}): CompanyBrief {
  const mapping = getIndustryMapping({
    industry: input.industry,
    businessModel: input.businessModel,
    pageArchetype: input.pageArchetype
  });

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
