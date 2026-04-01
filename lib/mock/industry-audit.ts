import type { AuditIssue, SuggestedSection } from "./projects";

type IndustryAudit = {
  auditIssues: AuditIssue[];
  suggestedSections: SuggestedSection[];
};

export function getIndustryAudit(industry: string): IndustryAudit {
  if (industry.includes("rakennus") || industry.includes("remont")) {
    return {
      auditIssues: [
        {
          title: "Luotettavuus ei välity heti",
          detail:
            "Rakennus- ja remonttipalveluissa päätös perustuu pitkälti luottamukseen. Nykyinen sivu ei tuo riittävästi esiin kokemusta, referenssejä tai työn laatua heti etusivulla."
        },
        {
          title: "Palvelukokonaisuus jää epäselväksi",
          detail:
            "Kävijän on vaikea hahmottaa nopeasti mitä kaikkea yritys tekee ja mitä palveluita kannattaa pyytää tarjouksena."
        },
        {
          title: "Yhteydenotto ei ole riittävän ohjattu",
          detail:
            "Tarjouspyyntöön ohjaava rakenne puuttuu tai jää liian heikoksi, mikä laskee konversiota."
        }
      ],
      suggestedSections: [
        {
          name: "Referenssit / ennen–jälkeen kuvat",
          reason:
            "Näyttämällä konkreettisia töitä kasvatetaan luottamusta välittömästi."
        },
        {
          name: "Selkeä palvelulistaus",
          reason:
            "Kävijän pitää nopeasti ymmärtää mitä kaikkea yritys tekee."
        },
        {
          name: "Prosessin kuvaus",
          reason:
            "Selkeä eteneminen lisää turvallisuuden tunnetta asiakkaalle."
        },
        {
          name: "Vahva tarjous-CTA",
          reason:
            "Kävijä pitää ohjata yhteen selkeään toimintaan ilman häiriöitä."
        }
      ]
    };
  }

  // default fallback
  return {
    auditIssues: [
      {
        title: "Pääviesti ei lukitu heti",
        detail:
          "Kävijän pitäisi ymmärtää muutamassa sekunnissa mitä yritys tekee, kenelle ja miksi siihen kannattaa luottaa."
      },
      {
        title: "Konversiopolku on heikko",
        detail:
          "Jos toimintakehote ei erotu selvästi, kävijä ei etene seuraavaan vaiheeseen."
      },
      {
        title: "Luottamussignaalit puuttuvat",
        detail:
          "Referenssit, asiakaspalaute ja konkreettiset esimerkit puuttuvat tai jäävät piiloon."
      }
    ],
    suggestedSections: [
      {
        name: "Selkeä hero + CTA",
        reason:
          "Ensivaikutelman pitää kertoa mitä tarjotaan ja mitä tehdä seuraavaksi."
      },
      {
        name: "Palvelut kortteina",
        reason:
          "Tarjooma pitää hahmottua nopeasti ilman raskasta tekstiä."
      },
      {
        name: "Luottamusta rakentava sisältö",
        reason:
          "Asiakaspalaute ja referenssit lisäävät uskottavuutta."
      },
      {
        name: "Yhteydenotto-osio",
        reason:
          "Kävijä pitää ohjata selkeään konversioon."
      }
    ]
  };
}
