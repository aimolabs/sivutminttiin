import type { Project } from "./projects";

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return "tuntematon";
  }
}

function domainToCompanyName(domain: string): string {
  const withoutTld = domain.replace(/\.[^.]+$/, "");
  return withoutTld.charAt(0).toUpperCase() + withoutTld.slice(1);
}

export function generateProjectFromUrl(url: string): Project {
  const domain = extractDomain(url);
  const companyName = domainToCompanyName(domain);

  return {
    id: "generated",
    companyName,
    sourceUrl: url,
    status: "draft",
    createdAt: new Date().toISOString().slice(0, 10),
    businessSummary:
      `${companyName}-verkkosivuston nykyinen rakenne ei tue selkeää viestintää. ` +
      "Etusivu ei johdata kävijää eteenpäin, arvolupaus jää epäselväksi ja mobiilikokemus on puutteellinen.",
    auditIssues: [
      {
        title: "Epäselvä arvolupaus",
        detail:
          "Sivun pääviesti ei selviä heti — kävijä ei ymmärrä mitä yritys tekee, kenelle ja miksi."
      },
      {
        title: "Heikko toimintakehotehierarkia",
        detail:
          "Sivulta puuttuu selkeä ensisijainen CTA. Kävijän on vaikea tietää mitä tehdä seuraavaksi."
      },
      {
        title: "Luottamussignaalit puuttuvat",
        detail:
          "Referenssit, asiakaspalautteet ja prosessikuvaus eivät nouse esiin riittävän selkeästi."
      }
    ],
    suggestedSections: [
      {
        name: "Hero + selkeä CTA",
        reason: "Palvelu ja kohderyhmä pitää ymmärtää viidessä sekunnissa."
      },
      {
        name: "Palvelut kortteina",
        reason: "Tarjooma pitää saada nopeasti hahmotettavaksi rakenteellisessa muodossa."
      },
      {
        name: "Miksi valita meidät",
        reason: "Luottamus syntyy selkeydestä, kokemuksesta ja toimintatavasta."
      },
      {
        name: "Asiakaspalaute",
        reason: "Sosiaalinen todiste vahvistaa uskottavuutta."
      },
      {
        name: "Yhteydenotto-osio",
        reason: "Konversiopolku päättyy yhteen selkeään toimintaan."
      }
    ],
    redesign: {
      styleDirection:
        "Moderni, selkeä ja laadukas etusivu, joka viestii ammattimaisuutta ja tekee toimintakehotteesta välittömästi näkyvän.",
      sections: [
        {
          type: "hero",
          eyebrow: domain,
          headline: `${companyName} — selkeämpi verkkosivu, enemmän yhteydenottoja.`,
          subheadline:
            "Tämä konsepti näyttää miltä uudistettu etusivu voisi näyttää: selkeämpi rakenne, vahvempi viesti ja parempi mobiilikokemus.",
          primaryCta: "Pyydä tarjous",
          secondaryCta: "Katso palvelut"
        },
        {
          type: "services",
          title: "Palvelut",
          items: [
            {
              title: "Ydinpalvelu",
              description:
                "Selkeästi esitelty pääpalvelu, joka vastaa kävijän ensimmäiseen kysymykseen."
            },
            {
              title: "Lisäpalvelu",
              description:
                "Täydentävä tarjooma, joka laajentaa asiakkaan vaihtoehtoja luontevasti."
            },
            {
              title: "Erikoisosaaminen",
              description:
                "Erottava tekijä, joka tekee yrityksestä muista poikkeavan valinnan."
            }
          ]
        },
        {
          type: "about",
          title: "Miksi tämä konsepti toimii paremmin",
          body:
            "Uusi rakenne tekee yrityksen osaamisesta välittömästi uskottavampaa. " +
            "Pääviesti, palvelut ja yhteydenotto tukevat samaa tavoitetta: kävijän pitää ymmärtää nopeasti mitä tarjotaan ja miten pääsee eteenpäin."
        },
        {
          type: "testimonials",
          title: "Asiakkaiden luottamus näkyväksi",
          items: [
            {
              quote:
                "Työ valmistui sovitusti ja viestintä toimi koko projektin ajan erinomaisesti.",
              name: "Asiakas 1"
            },
            {
              quote:
                "Siisti lopputulos ja erittäin helppo asioida. Suosittelen.",
              name: "Asiakas 2"
            }
          ]
        },
        {
          type: "cta",
          title: "Pyydä tarjous helposti",
          body:
            "Selkeä yhteydenotto-osio nostaa todennäköisyyttä, että kiinnostunut kävijä ottaa heti yhteyttä.",
          button: "Ota yhteyttä"
        }
      ]
    }
  };
}
