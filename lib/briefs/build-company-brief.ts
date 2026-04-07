import type { CompanyBrief, CompanyBriefOffer, CompanyBriefProofPoint } from "./company-brief";
import type { NormalizedSourceSnapshot } from "../source/normalize-source-snapshot";
import type { CompanySignals } from "../source/infer-company-signals";
import type { IndustryProfile } from "../mock/industry-profiles";
import type { CompanyArchetype } from "../mock/company-archetypes";

function buildOfferSummary(
  title: string,
  signals: CompanySignals
): string {
  switch (signals.serviceModel) {
    case "solution-led":
      return "Tämä tarjooma pitää tehdä hyötylähtöisesti ymmärrettäväksi eikä jättää pelkäksi ominaisuustiedoksi.";
    case "problem-led":
      return "Tämä tarjooma kannattaa kuvata asiakkaan tilanteen ja ongelman ratkaisuna.";
    case "named-services":
      return "Tämä palvelu pitää tehdä nopeasti hahmotettavaksi ja uskottavaksi.";
    default:
      return "Tämä tarjooma pitää jäsentää selkeästi osaksi uskottavaa kokonaisuutta.";
  }
}

function buildOffers(
  snapshot: NormalizedSourceSnapshot,
  profile: IndustryProfile,
  signals: CompanySignals
): { coreOffer: CompanyBriefOffer; secondaryOffers: CompanyBriefOffer[] } {
  const rawTitles =
    snapshot.h2s.length >= 2
      ? snapshot.h2s.slice(0, 4)
      : profile.serviceItems.map((item) => item.title);

  const offers = rawTitles.map((title) => ({
    title,
    summary: buildOfferSummary(title, signals)
  }));

  const coreOffer = offers[0] ?? {
    title: profile.serviceItems[0]?.title ?? "Pääpalvelu",
    summary: buildOfferSummary(profile.serviceItems[0]?.title ?? "Pääpalvelu", signals)
  };

  const secondaryOffers = offers.slice(1, 4);

  return { coreOffer, secondaryOffers };
}

function buildPositioningSummary(
  companyName: string,
  profile: IndustryProfile,
  signals: CompanySignals,
  coreOffer: CompanyBriefOffer
): string {
  switch (signals.companyArchetypeId) {
    case "local-contractor":
      return `${companyName} kannattaa positioida luotettavana tekijänä, jonka ${coreOffer.title.toLowerCase()} ja yhteydenoton helppous näkyvät heti.`;
    case "trusted-advisor":
      return `${companyName} kannattaa positioida rauhallisena asiantuntijana, jonka apu ja toimintatapa ymmärretään nopeasti.`;
    case "creative-showcase":
      return `${companyName} kannattaa positioida omaleimaisena tekijänä, jonka taso, laatu ja projektin arvo tuntuvat heti.`;
    case "b2b-solution":
      return `${companyName} kannattaa positioida ratkaisuna, jonka liiketoimintahyöty ja seuraava askel ymmärretään nopeasti.`;
    default:
      return `${companyName} kannattaa positioida selkeänä ${profile.label.toLowerCase()}-toimijana, jonka tarjooma ja CTA ovat helposti ymmärrettäviä.`;
  }
}

function buildHeroMessage(
  companyName: string,
  signals: CompanySignals,
  coreOffer: CompanyBriefOffer
): string {
  switch (signals.companyArchetypeId) {
    case "local-contractor":
      return `${companyName} tarvitsee sivun, jossa ${coreOffer.title.toLowerCase()} ja luotettava vaikutelma näkyvät heti.`;
    case "trusted-advisor":
      return `${companyName} tarvitsee sivun, joka viestii asiantuntemusta ja turvallista ensikontaktia heti.`;
    case "creative-showcase":
      return `${companyName} tarvitsee sivun, joka näyttää yhtä vahvalta kuin sen taso ja omaleimaisuus.`;
    case "b2b-solution":
      return `${companyName} tarvitsee sivun, joka tekee ratkaisun arvon ymmärrettäväksi nopeasti.`;
    default:
      return `${companyName} tarvitsee sivun, joka tekee arvon ja seuraavan askeleen selkeiksi heti.`;
  }
}

function buildHeroSupport(
  snapshot: NormalizedSourceSnapshot,
  profile: IndustryProfile,
  signals: CompanySignals
): string {
  if (snapshot.metaDescription) {
    return snapshot.metaDescription;
  }

  switch (signals.companyArchetypeId) {
    case "local-contractor":
      return "Sivun pitää vähentää epävarmuutta, nostaa tärkeimmät palvelut näkyviin ja tehdä yhteydenotosta helppo.";
    case "trusted-advisor":
      return "Sivun pitää tehdä selväksi missä tilanteissa apua saa ja miksi ensimmäinen yhteydenotto tuntuu turvalliselta.";
    case "creative-showcase":
      return "Sivun pitää tuntua omaleimaiselta, mutta samalla tehdä palvelu ja arvolupaus nopeasti ymmärrettäviksi.";
    case "b2b-solution":
      return "Sivun pitää tehdä hyöty, uskottavuus ja demoon siirtyminen näkyväksi ilman raskasta ominaisuuslistaa.";
    default:
      return profile.heroSubheadline;
  }
}

function buildCTASet(
  signals: CompanySignals
): Pick<CompanyBrief, "primaryCTALabel" | "secondaryCTALabel" | "finalCTALabel"> {
  switch (signals.primaryConversionGoal) {
    case "quote":
      return {
        primaryCTALabel: "Pyydä tarjous",
        secondaryCTALabel: "Katso palvelut",
        finalCTALabel: "Pyydä tarjous"
      };
    case "booking":
      return {
        primaryCTALabel: "Varaa aika",
        secondaryCTALabel: "Tutustu palveluun",
        finalCTALabel: "Varaa aika"
      };
    case "demo":
      return {
        primaryCTALabel: "Pyydä demo",
        secondaryCTALabel: "Tutustu ratkaisuun",
        finalCTALabel: "Pyydä demo"
      };
    case "project-start":
      return {
        primaryCTALabel: "Aloita projekti",
        secondaryCTALabel: "Katso työt",
        finalCTALabel: "Aloitetaan projekti"
      };
    default:
      return {
        primaryCTALabel: "Ota yhteyttä",
        secondaryCTALabel: "Tutustu palveluihin",
        finalCTALabel: "Ota yhteyttä"
      };
  }
}

function buildTrustStrategy(signals: CompanySignals): string {
  switch (signals.trustProfile) {
    case "local-reliability":
      return "Luottamus rakennetaan paikallisen uskottavuuden, selkeän toimintatavan ja matalan yhteydenottokynnyksen varaan.";
    case "expertise":
      return "Luottamus rakennetaan asiantuntijuuden, profiilin ja rauhallisen viestinnän varaan.";
    case "portfolio":
      return "Luottamus rakennetaan laadun, omaleimaisuuden ja työn jäljen tunnelman varaan.";
    case "outcome":
      return "Luottamus rakennetaan hyötyjen, relevantin proofin ja selkeän seuraavan askeleen varaan.";
    case "process":
      return "Luottamus rakennetaan prosessin, ennakoitavuuden ja selkeän etenemisen varaan.";
  }
}

function buildProofPoints(signals: CompanySignals): CompanyBriefProofPoint[] {
  switch (signals.companyArchetypeId) {
    case "local-contractor":
      return [
        {
          id: "proof-1",
          type: "principle",
          title: "Luotettava toteutus",
          body: "Sivun pitää viestiä, että työn jälki ja asioinnin sujuvuus ovat uskottavia jo ennen yhteydenottoa."
        },
        {
          id: "proof-2",
          type: "principle",
          title: "Matalan kynnyksen tarjouspyyntö",
          body: "Tarjouspyynnön pitää tuntua helpolta, ei raskaalta päätökseltä."
        }
      ];

    case "trusted-advisor":
      return [
        {
          id: "proof-1",
          type: "stat",
          title: "Asiantuntijuus",
          body: "Asiakkaan pitää ymmärtää nopeasti missä asioissa apua saa ja miksi tähän toimijaan voi luottaa."
        },
        {
          id: "proof-2",
          type: "principle",
          title: "Turvallinen ensikontakti",
          body: "Ensimmäisen yhteydenoton pitää tuntua matalariskiseltä ja rauhalliselta."
        }
      ];

    case "creative-showcase":
      return [
        {
          id: "proof-1",
          type: "case",
          title: "Työn taso",
          body: "Laadun pitää tuntua nopeasti ilman geneeristä studiokieltä."
        },
        {
          id: "proof-2",
          type: "principle",
          title: "Omaleimaisuus",
          body: "Sivun pitää tuntua harkitulta, omaleimaiselta ja projektin arvoa tukevaksi."
        }
      ];

    case "b2b-solution":
      return [
        {
          id: "proof-1",
          type: "stat",
          title: "Ratkaisun hyöty",
          body: "Uskottavuus syntyy siitä, että hyöty tehdään liiketoimintakielellä ymmärrettäväksi."
        },
        {
          id: "proof-2",
          type: "principle",
          title: "Selkeä demo-polku",
          body: "Oikean ostajan pitää siirtyä nopeasti demoon tai keskusteluun ilman turhaa kitkaa."
        }
      ];

    default:
      return [
        {
          id: "proof-1",
          type: "principle",
          title: "Selkeä arvolupaus",
          body: "Yrityksen pitää tuntua uskottavalta ja helposti ymmärrettävältä heti."
        },
        {
          id: "proof-2",
          type: "principle",
          title: "Selkeä seuraava askel",
          body: "Kiinnostuneen kävijän pitää nähdä nopeasti mitä tehdään seuraavaksi."
        }
      ];
  }
}

export function buildCompanyBrief(input: {
  companyName: string;
  snapshot: NormalizedSourceSnapshot;
  signals: CompanySignals;
  industryProfile: IndustryProfile;
  archetype: CompanyArchetype;
}): CompanyBrief {
  const { coreOffer, secondaryOffers } = buildOffers(
    input.snapshot,
    input.industryProfile,
    input.signals
  );

  const ctas = buildCTASet(input.signals);

  return {
    companyName: input.companyName,
    inferredIndustryId: input.signals.industryId,
    archetypeId: input.archetype.id,
    targetAudienceSummary: input.industryProfile.audience,
    positioningSummary: buildPositioningSummary(
      input.companyName,
      input.industryProfile,
      input.signals,
      coreOffer
    ),
    heroMessage: buildHeroMessage(
      input.companyName,
      input.signals,
      coreOffer
    ),
    heroSupport: buildHeroSupport(
      input.snapshot,
      input.industryProfile,
      input.signals
    ),
    primaryConversionGoal: input.signals.primaryConversionGoal,
    primaryCTALabel: ctas.primaryCTALabel,
    secondaryCTALabel: ctas.secondaryCTALabel,
    finalCTALabel: ctas.finalCTALabel,
    trustStrategy: buildTrustStrategy(input.signals),
    coreOffer,
    secondaryOffers,
    proofPoints: buildProofPoints(input.signals),
    recommendedPageSet: input.archetype.pageBlueprints.map((page) => ({
      id: page.id,
      pageType: page.pageType,
      slug: page.slug,
      navigationLabel: page.navigationLabel,
      title: page.title,
      purpose: page.purpose,
      navVisible: page.navVisible,
      footerVisible: page.footerVisible,
      isPrimary: page.isPrimary
    }))
  };
}
