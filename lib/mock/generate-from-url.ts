import type { Project } from "./projects";
import type { StylePresetId } from "./style-presets";
import { resolveIndustryProfile } from "./industry-profiles";
import { applyStylePresetToContent } from "./apply-style-preset";
import { buildSectionPlan } from "./section-plans";
import { getIndustryAudit } from "./industry-audit";

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

function resolveStylePreset(input?: string): StylePresetId {
  switch (input) {
    case "minimal-trust":
    case "premium-dark":
    case "bold-modern":
    case "editorial-clean":
      return input;
    default:
      return "premium-dark";
  }
}

export function generateProjectFromUrl(
  url: string,
  options?: { stylePreset?: string }
): Project {
  const domain = extractDomain(url);
  const companyName = domainToCompanyName(domain);
  const stylePreset = resolveStylePreset(options?.stylePreset);
  const industryProfile = resolveIndustryProfile(domain);
  const industryAudit = getIndustryAudit(industryProfile.label.toLowerCase(), companyName);

  const baseAboutBody =
    "Konsepti tekee sivusta myynnillisesti terävämmän. Kävijä näkee nopeammin mitä tarjotaan, miksi siihen kannattaa luottaa ja mitä seuraavaksi kannattaa tehdä. Näin etusivu ei jää vain käyntikortiksi, vaan alkaa ohjata toimintaa.";

  const presetContent = applyStylePresetToContent({
    stylePreset,
    companyName,
    industryLabel: industryProfile.label,
    baseHeadline: industryProfile.heroHeadlineTemplate(companyName),
    baseSubheadline: industryProfile.heroSubheadline,
    baseAboutBody
  });

  const heroSection = {
    type: "hero" as const,
    eyebrow: industryProfile.heroEyebrow,
    headline: presetContent.heroHeadline,
    subheadline: presetContent.heroSubheadline,
    primaryCta: presetContent.primaryCta,
    secondaryCta: presetContent.secondaryCta
  };

  const servicesSection = {
    type: "services" as const,
    title: industryProfile.serviceSectionTitle,
    items: industryProfile.serviceItems
  };

  const aboutSection = {
    type: "about" as const,
    title: presetContent.aboutTitle,
    body: presetContent.aboutBody
  };

  const testimonialsSection = {
    type: "testimonials" as const,
    title: presetContent.testimonialsTitle,
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
  };

  const ctaSection = {
    type: "cta" as const,
    title: industryProfile.ctaTitle,
    body: industryProfile.ctaBody,
    button: presetContent.primaryCta
  };

  const sections = buildSectionPlan(stylePreset, {
    hero: heroSection,
    services: servicesSection,
    about: aboutSection,
    testimonials: testimonialsSection,
    cta: ctaSection
  });

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
    auditIssues: industryAudit.auditIssues,
    suggestedSections: industryAudit.suggestedSections,
    redesign: {
      stylePreset,
      sections
    }
  };
}
