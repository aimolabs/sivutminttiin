import type { AuditIssue, SuggestedSection } from "./projects";

type IndustryAudit = {
  auditIssues: AuditIssue[];
  suggestedSections: SuggestedSection[];
};

export function getIndustryAudit(
  industry: string,
  companyName: string
): IndustryAudit {
  if (industry.includes("rakennus") || industry.includes("remont")) {
    return {
      auditIssues: [
        {
          title: "Luotettavuus ei välity heti",
          detail:
            `${companyName} sivu näyttää siltä, että se ei vielä hyödynnä luottamusta rakentavia elementtejä täysimääräisesti. Rakennusalalla päätös perustuu usein referensseihin ja kokemukseen, mutta nämä eivät todennäköisesti nouse riittävän näkyvästi heti etusivulla.`
        },
        {
          title: "Palvelukokonaisuus jää epäselväksi",
          detail:
            `Kävijälle ei välttämättä muodostu nopeasti selkeää kuvaa siitä, mitä kaikkea ${companyName} tarjoaa. Tämä on tyypillinen ongelma vastaavilla sivuilla, joissa sisältö on olemassa mutta rakennetta ei ole optimoitu nopeaan ymmärtämiseen.`
        },
        {
          title: "Yhteydenotto ei ole riittävän ohjattu",
          detail:
            `Sivun rakenne ei todennäköisesti ohjaa käyttäjää riittävän selkeästi tarjouspyyntöön. Usein tämä näkyy siinä, että CTA:t jäävät visuaalisesti heikoiksi tai sijoittuvat väärään kohtaan sivua.`
        }
      ],
      suggestedSections: [
        {
          name: "Referenssit / ennen–jälkeen kuvat",
          reason:
            `Jos ${companyName} nostaa konkreettiset työt näkyviin, luottamus kasvaa välittömästi ilman lisäselityksiä.`
        },
        {
          name: "Selkeä palvelulistaus",
          reason:
            "Palvelut kannattaa esittää tavalla, jonka kävijä ymmärtää sekunneissa ilman tulkintaa."
        },
        {
          name: "Prosessin kuvaus",
          reason:
            "Selkeä eteneminen poistaa epävarmuutta ja madaltaa yhteydenoton kynnystä."
        },
        {
          name: "Vahva tarjous-CTA",
          reason:
            "Yksi selkeä toimintakehote toimii paremmin kuin useat hajanaiset vaihtoehdot."
        }
      ]
    };
  }

  return {
    auditIssues: [
      {
        title: "Pääviesti ei lukitu heti",
        detail:
          `${companyName} sivu vaikuttaa siltä, että sen pääviesti ei välity täysin selkeästi ensimmäisten sekuntien aikana. Tämä on yleinen haaste sivuilla, joissa sisältö on olemassa mutta priorisointi ei ole riittävän terävä.`
      },
      {
        title: "Konversiopolku on heikko",
        detail:
          "Kävijälle ei todennäköisesti muodostu selkeää seuraavaa askelta. Tämä johtaa usein siihen, että kiinnostus ei muutu yhteydenotoksi."
      },
      {
        title: "Luottamussignaalit puuttuvat",
        detail:
          "Referenssit, asiakaspalaute ja muut uskottavuutta vahvistavat elementit eivät näytä olevan keskiössä, mikä heikentää kokonaisvaikutelmaa."
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
