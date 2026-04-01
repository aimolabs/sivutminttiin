export type AuditIssue = {
  title: string;
  detail: string;
};

export type SuggestedSection = {
  name: string;
  reason: string;
};

export type RedesignSection =
  | {
      type: "hero";
      eyebrow: string;
      headline: string;
      subheadline: string;
      primaryCta: string;
      secondaryCta: string;
    }
  | {
      type: "services";
      title: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    }
  | {
      type: "about";
      title: string;
      body: string;
    }
  | {
      type: "testimonials";
      title: string;
      items: Array<{
        quote: string;
        name: string;
      }>;
    }
  | {
      type: "cta";
      title: string;
      body: string;
      button: string;
    };

export type Project = {
  id: string;
  companyName: string;
  sourceUrl: string;
  status: "draft" | "ready";
  createdAt: string;
  businessSummary: string;
  auditIssues: AuditIssue[];
  suggestedSections: SuggestedSection[];
  redesign: {
    styleDirection: string;
    sections: RedesignSection[];
  };
};

export const mockProjects: Project[] = [
  {
    id: "demo",
    companyName: "Rakennus Laine",
    sourceUrl: "https://rakennuslaine.fi",
    status: "ready",
    createdAt: "2026-04-01",
    businessSummary:
      "Paikallinen rakennus- ja remonttipalvelu, jonka nykyinen sivu ei viesti laatua, luotettavuutta eikä selkeää palvelurakennetta mobiilissa.",
    auditIssues: [
      {
        title: "Epäselvä etusivun arvolupaus",
        detail:
          "Sivulta ei selviä heti mitä yritys tekee, kenelle ja millä painotuksella."
      },
      {
        title: "Heikko mobiilihierarkia",
        detail:
          "Sisältö tuntuu raskaalta ja toimintakehotteet jäävät piiloon pienellä näytöllä."
      },
      {
        title: "Luottamusta rakentava sisältö puuttuu",
        detail:
          "Referenssit, asiakaspalaute ja selkeä prosessikuvaus eivät nouse esiin."
      }
    ],
    suggestedSections: [
      {
        name: "Hero + selkeä CTA",
        reason: "Yrityksen palvelu ja toimintalue pitää ymmärtää viidessä sekunnissa."
      },
      {
        name: "Palvelut kortteina",
        reason: "Tarjooma pitää saada nopeasti hahmotettavaksi."
      },
      {
        name: "Miksi valita meidät",
        reason: "Luottamus syntyy selkeydestä, kokemuksesta ja toimintatavasta."
      },
      {
        name: "Asiakaspalaute",
        reason: "Sosiaalinen todiste nostaa uskottavuutta."
      },
      {
        name: "Yhteydenotto-osio",
        reason: "Konversiopolku pitää päättää yhteen selkeään toimintaan."
      }
    ],
    redesign: {
      styleDirection: "Moderni, tumma, laadukas ja helposti lähestyttävä palveluyrityksen etusivu.",
      sections: [
        {
          type: "hero",
          eyebrow: "Rakennus ja remontointi",
          headline: "Luotettava tekijä remontteihin ja rakennustöihin Uudellamaalla.",
          subheadline:
            "Selkeämpi palvelu, laadukas työnjälki ja sujuva yhteydenotto. Uudistettu konsepti tekee tarjonnasta heti ymmärrettävän.",
          primaryCta: "Pyydä tarjous",
          secondaryCta: "Katso palvelut"
        },
        {
          type: "services",
          title: "Palvelut",
          items: [
            {
              title: "Kylpyhuoneremontit",
              description:
                "Huolellisesti suunnitellut ja viimeistellyt remontit alusta loppuun."
            },
            {
              title: "Keittiöremontit",
              description:
                "Toimivat, siistit ja arkea kestävät ratkaisut kotitalouksille."
            },
            {
              title: "Pienrakentaminen",
              description:
                "Terassit, väliseinät, pintatyöt ja muut käytännölliset toteutukset."
            }
          ]
        },
        {
          type: "about",
          title: "Miksi tämä konsepti toimii paremmin",
          body:
            "Uusi rakenne tekee yrityksen osaamisesta välittömästi uskottavampaa. Sivun pääviesti, palvelut ja yhteydenotto tukevat samaa tavoitetta: kävijän pitää ymmärtää nopeasti mitä tarjotaan ja miten pääsee eteenpäin."
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
                "Siisti työnjälki ja erittäin helppo asioida. Tämä olisi juuri oikea tunnelma myös verkkosivulle.",
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
  }
];

export function getProjectById(id: string) {
  return mockProjects.find((project) => project.id === id);
}