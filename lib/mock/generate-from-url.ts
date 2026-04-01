import type { Project } from "./projects";
import type { StylePresetId } from "./style-presets";
import { resolveIndustryProfile } from "./industry-profiles";

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return "tuntematon.fi";
  }
}

function domainToCompanyName(domain: string): string {
  const withoutTld = domain.replace(/\.[^.]+$/, "");
  const cleaned = withoutTld.replace(/[-_]+/g, " ").trim();

  if (!cleaned) {
    return "Yritys";
  }

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildBusinessSummary(companyName: string, domain: string): string {
  return `${companyName} (${domain}) näyttää tällä hetkellä enemmän tekniseltä olemassaololta kuin selkeältä myyntisivulta. Uudistetun konseptin tavoite on tehdä palvelu ymmärrettäväksi nopeasti, vahvistaa luottamusta ja ohjata kävijä yhteen selkeään seuraavaan toimintaan.`;
}

export function generateProjectFromUrl(url: string): Project {
  const domain = extractDomain(url);
  const companyName = domainToCompanyName(domain);
  const stylePreset: StylePresetId = "premium-dark";
  const industryProfile = resolveIndustryProfile(domain);

  return {
    id: "generated",
    siteProfile: {
      domain,
      companyName,
      industry: industryProfile.label,
      audience: industryProfile.audience,
      tone: industryProfile.tone
    },
    sourceUrl: url,
    status: "draft",
    createdAt: new Date().toISOString().slice(0, 10),
    businessSummary: buildBusinessSummary(companyName, domain),
    auditIssues: [
      {
        title: "Pääviesti ei lukitu heti",
        detail:
          "Kävijän pitäisi ymmärtää muutamassa sekunnissa mitä yritys tekee, kenelle se on tarkoitettu ja miksi siihen kannattaa luottaa. Nykyinen rakenne ei todennäköisesti tee tätä riittävän selvästi."
      },
      {
        title: "Konversiopolku on liian heikko",
        detail:
          "Jos ensisijainen toimintakehote ei erotu heti, kiinnostunut kävijä jää helposti selaamaan ilman että etenee yhteydenottoon tai tarjouspyyntöön."
      },
      {
        title: "Luottamuksen rakentaminen jää vajaaksi",
        detail:
          "Referenssit, asiakaspalaute, prosessi ja muut uskottavuutta vahvistavat elementit pitäisi tuoda näkyvämmäksi jo etusivulla."
      }
    ],
    suggestedSections: [
      {
        name: "Selkeä hero + toimintakehote",
        reason:
          "Ensivaikutelman pitää kertoa heti mitä yritys tarjoaa ja mitä kävijän kannattaa tehdä seuraavaksi."
      },
      {
        name: "Palvelut tiiviinä kortteina",
        reason:
          "Tarjooma pitää hahmottua nopeasti ilman raskasta tekstimassaa."
      },
      {
        name: "Miksi valita meidät",
        reason:
          "Erottautuminen ja luottamus pitää perustella näkyvästi, ei jättää rivien väliin."
      },
      {
        name: "Asiakaspalaute tai referenssit",
        reason:
          "Sosiaalinen todiste tekee konseptista uskottavamman ja kaupallisemman."
      },
      {
        name: "Vahva CTA-loppuosa",
        reason:
          "Etusivun pitää päättyä yhteen selkeään toimenpiteeseen, ei hajota huomiota."
      }
    ],
    redesign: {
      stylePreset,
      sections: [
        {
          type: "hero",
          eyebrow: industryProfile.heroEyebrow,
          headline: industryProfile.heroHeadlineTemplate(companyName),
          subheadline: industryProfile.heroSubheadline,
          primaryCta: "Pyydä tarjous",
          secondaryCta: "Katso palvelut"
        },
        {
          type: "services",
          title: industryProfile.serviceSectionTitle,
          items: industryProfile.serviceItems
        },
        {
          type: "about",
          title: "Miksi tämä konsepti toimii paremmin",
          body:
            "Konsepti tekee sivusta myynnillisesti terävämmän. Kävijä näkee nopeammin mitä tarjotaan, miksi siihen kannattaa luottaa ja mitä seuraavaksi kannattaa tehdä. Näin etusivu ei jää vain käyntikortiksi, vaan alkaa ohjata toimintaa."
        },
        {
          type: "testimonials",
          title: "Luottamus näkyväksi",
          items: [
            {
              quote:
                "Selkeämpi rakenne ja vahvempi viesti tekevät yrityksestä heti ammattimaisemman oloisen.",
              name: "Konseptihavainto 1"
            },
            {
              quote:
                "Kun CTA, palvelut ja luottamussignaalit ovat näkyvissä, sivu alkaa näyttää oikealta myyntityökalulta.",
              name: "Konseptihavainto 2"
            }
          ]
        },
        {
          type: "cta",
          title: industryProfile.ctaTitle,
          body: industryProfile.ctaBody,
          button: "Ota yhteyttä"
        }
      ]
    }
  };
}
