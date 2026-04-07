import { StylePresetId } from "./style-presets";

export type AuditIssue = {
  title: string;
  detail: string;
};

export type SuggestedSection = {
  name: string;
  reason: string;
};

export type SiteProfile = {
  domain: string;
  companyName: string;
  industry: string;
  audience: string;
  tone: string;
};

export type StyleDirection = {
  stylePresetId: StylePresetId;
  visualTone: string;
  density: "compact" | "balanced" | "spacious";
  contrastLevel: "medium" | "high";
  layoutDirection: string;
  interactionMood: string;
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

export type PageType = "home" | "about" | "services" | "contact";

export type SitemapItem = {
  pageId: string;
  slug: string;
  pageType: PageType;
  title: string;
  purpose: string;
  navigationLabel: string;
  navVisible: boolean;
  footerVisible: boolean;
};

export type ProjectPage = SitemapItem & {
  sections: RedesignSection[];
};

export type Project = {
  id: string;
  siteProfile: SiteProfile;
  sourceUrl: string;
  status: "draft" | "ready";
  createdAt: string;
  businessSummary: string;
  auditIssues: AuditIssue[];
  suggestedSections: SuggestedSection[];
  styleDirection: StyleDirection;
  sitemap: SitemapItem[];
  pages: ProjectPage[];
};

export const mockProjects: Project[] = [
  {
    id: "demo",
    siteProfile: {
      domain: "rakennuslaine.fi",
      companyName: "Rakennus Laine",
      industry: "Rakennus ja remontointi",
      audience: "Kotitaloudet Uudellamaalla",
      tone: "Luotettava ja selkeä palveluyritys"
    },
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
        reason: "Yrityksen palvelu ja toiminta-alue pitää ymmärtää viidessä sekunnissa."
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
    styleDirection: {
      stylePresetId: "premium-dark",
      visualTone: "Premium dark",
      density: "spacious",
      contrastLevel: "high",
      layoutDirection: "brand-forward",
      interactionMood: "confident"
    },
    sitemap: [
      {
        pageId: "home",
        slug: "/",
        pageType: "home",
        title: "Etusivu",
        purpose: "Esittele pääarvolupaus, palvelut ja ensisijainen CTA",
        navigationLabel: "Etusivu",
        navVisible: true,
        footerVisible: true
      },
      {
        pageId: "about",
        slug: "/yritys",
        pageType: "about",
        title: "Yritys",
        purpose: "Rakenna luottamusta ja kerro yrityksestä",
        navigationLabel: "Yritys",
        navVisible: true,
        footerVisible: true
      },
      {
        pageId: "services",
        slug: "/palvelut",
        pageType: "services",
        title: "Palvelut",
        purpose: "Jäsennä tarjooma selkeiksi palvelukokonaisuuksiksi",
        navigationLabel: "Palvelut",
        navVisible: true,
        footerVisible: true
      },
      {
        pageId: "contact",
        slug: "/yhteys",
        pageType: "contact",
        title: "Yhteys",
        purpose: "Ohjaa kävijä yhteydenottoon tai tarjouspyyntöön",
        navigationLabel: "Yhteys",
        navVisible: true,
        footerVisible: true
      }
    ],
    pages: [
      {
        pageId: "home",
        slug: "/",
        pageType: "home",
        title: "Etusivu",
        purpose: "Esittele pääarvolupaus, palvelut ja ensisijainen CTA",
        navigationLabel: "Etusivu",
        navVisible: true,
        footerVisible: true,
        sections: [
          {
            type: "hero",
            eyebrow: "Rakennus ja remontointi",
            headline:
              "Luotettava tekijä remontteihin ja rakennustöihin Uudellamaalla.",
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
      },
      {
        pageId: "about",
        slug: "/yritys",
        pageType: "about",
        title: "Yritys",
        purpose: "Rakenna luottamusta ja kerro yrityksestä",
        navigationLabel: "Yritys",
        navVisible: true,
        footerVisible: true,
        sections: [
          {
            type: "about",
            title: "Rakennus Laine yrityksenä",
            body:
              "Tämän sivun tarkoitus on tehdä yrityksen toimintatavasta, kokemuksesta ja luotettavuudesta näkyvämpi osa kokonaisuutta."
          },
          {
            type: "testimonials",
            title: "Luottamus rakennetaan näkyviin",
            items: [
              {
                quote:
                  "Yrityssivu tekee tekijästä uskottavamman jo ennen ensimmäistä yhteydenottoa.",
                name: "Konseptihavainto 1"
              },
              {
                quote:
                  "Kun kokemus, toimintatapa ja luottamussignaalit nostetaan näkyviin, koko sivusto tuntuu vahvemmalta.",
                name: "Konseptihavainto 2"
              }
            ]
          },
          {
            type: "cta",
            title: "Keskustellaan projektistasi",
            body:
              "Yrityssivun tehtävä ei ole vain kertoa historiasta, vaan tukea seuraavaa askelta kohti yhteydenottoa.",
            button: "Ota yhteyttä"
          }
        ]
      },
      {
        pageId: "services",
        slug: "/palvelut",
        pageType: "services",
        title: "Palvelut",
        purpose: "Jäsennä tarjooma selkeiksi palvelukokonaisuuksiksi",
        navigationLabel: "Palvelut",
        navVisible: true,
        footerVisible: true,
        sections: [
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
            title: "Miten palvelusivu toimii paremmin",
            body:
              "Palvelusivun tarkoitus on tehdä tarjoomasta helposti ymmärrettävä, tukea päätöksentekoa ja ohjata kävijä suoraan oikeaan toimintoon."
          },
          {
            type: "cta",
            title: "Pyydä tarjous oikeasta palvelusta",
            body:
              "Kun palvelut on jäsennelty selkeästi, kiinnostunut kävijä etenee helpommin yhteydenottoon.",
            button: "Pyydä tarjous"
          }
        ]
      },
      {
        pageId: "contact",
        slug: "/yhteys",
        pageType: "contact",
        title: "Yhteys",
        purpose: "Ohjaa kävijä yhteydenottoon tai tarjouspyyntöön",
        navigationLabel: "Yhteys",
        navVisible: true,
        footerVisible: true,
        sections: [
          {
            type: "about",
            title: "Ota yhteyttä",
            body:
              "Yhteyssivun tehtävä on poistaa kitkaa ja tehdä ensimmäisestä yhteydenotosta mahdollisimman helppo."
          },
          {
            type: "cta",
            title: "Pyydä tarjous helposti",
            body:
              "Selkeä yhteydenottopolku lisää todennäköisyyttä, että kiinnostunut kävijä toimii heti.",
            button: "Ota yhteyttä"
          }
        ]
      }
    ]
  }
];

export function getProjectById(id: string) {
  return mockProjects.find((project) => project.id === id);
}

export function getHomePage(project: Project) {
  return (
    project.pages.find((page) => page.pageType === "home") ??
    project.pages[0] ??
    null
  );
}
