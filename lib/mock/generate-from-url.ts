import type { Project } from "./projects";
import type { StylePresetId } from "./style-presets";
import { resolveIndustryProfile } from "./industry-profiles";
import { applyStylePresetToContent } from "./apply-style-preset";
import { buildSectionPlan } from "./section-plans";
import { getIndustryAudit } from "./industry-audit";
import type { SourceSnapshot } from "../source/source-snapshot";
import { fetchSourceSnapshot } from "../source/fetch-source-snapshot";
import { normalizeSourceSnapshot } from "../source/normalize-source-snapshot";

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

function resolveCompanyName(snapshot: ReturnType<typeof normalizeSourceSnapshot>): string {
  return snapshot.companyNameCandidate || domainToCompanyName(snapshot.domain);
}

function buildBusinessSummary(
  snapshot: ReturnType<typeof normalizeSourceSnapshot>,
  companyName: string
): string {
  const parts: string[] = [];

  if (snapshot.pageTitle) {
    parts.push(
      `Nykyinen sivu viestii tällä hetkellä otsikolla "${snapshot.pageTitle}".`
    );
  }

  if (snapshot.metaDescription) {
    parts.push(
      `Meta-kuvauksen perusteella ${companyName} painottaa tällä hetkellä viestiä "${snapshot.metaDescription}".`
    );
  } else if (snapshot.h1) {
    parts.push(
      `Etusivun pääotsikko näyttää tällä hetkellä olevan "${snapshot.h1}".`
    );
  }

  parts.push(
    "Uudistetun konseptin tavoite on tehdä arvolupaus selkeämmäksi, nostaa luottamusta ja ohjata kävijä nopeammin oikeaan seuraavaan toimintaan."
  );

  return parts.join(" ");
}

export function buildProjectFromSourceSnapshot(
  rawSnapshot: SourceSnapshot,
  options?: { stylePreset?: string }
): Project {
  const snapshot = normalizeSourceSnapshot(rawSnapshot);
  const companyName = resolveCompanyName(snapshot);
  const stylePreset = resolveStylePreset(options?.stylePreset);
  const industryProfile = resolveIndustryProfile(snapshot.industrySignalText);
  const industryAudit = getIndustryAudit(
    industryProfile.label.toLowerCase(),
    companyName
  );

  const baseAboutBody =
    "Konsepti tekee sivusta myynnillisesti terävämmän. Kävijä näkee nopeammin mitä tarjotaan, miksi siihen kannattaa luottaa ja mitä seuraavaksi kannattaa tehdä. Näin etusivu ei jää vain käyntikortiksi, vaan alkaa ohjata toimintaa.";

  const presetContent = applyStylePresetToContent({
    stylePreset,
    companyName,
    industryLabel: industryProfile.label,
    baseHeadline: industryProfile.heroHeadlineTemplate(companyName),
    baseSubheadline:
      snapshot.metaDescription || snapshot.h1 || industryProfile.heroSubheadline,
    baseAboutBody
  });

  const heroSection = {
    type: "hero" as const,
    eyebrow: industryProfile.heroEyebrow,
    headline: presetContent.heroHeadline,
    subheadline: presetContent.heroSubheadline,
    primaryCta: presetContent.primaryCta,
    secondaryCta:
      snapshot.ctaTexts[0] && snapshot.ctaTexts[0].length <= 28
        ? snapshot.ctaTexts[0]
        : presetContent.secondaryCta
  };

  const servicesSection = {
    type: "services" as const,
    title: industryProfile.serviceSectionTitle,
    items:
      snapshot.h2s.length >= 3
        ? snapshot.h2s.slice(0, 3).map((heading) => ({
            title: heading,
            description:
              "Tämä teema nousi nykyiseltä sivulta näkyviin, mutta tarvitsee selkeämmän kaupallisen esitystavan redesign-konseptissa."
          }))
        : industryProfile.serviceItems
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
          "Nykyiseltä sivulta löytyy jo aineksia uskottavaan esitystapaan, mutta rakenne ei vielä tue niitä riittävän hyvin.",
        name: "Snapshot-havainto 1"
      },
      {
        quote:
          "Kun nykyisen sivun viesti jäsennellään selkeämmin, kokonaisuus alkaa näyttää enemmän myyntityökalulta kuin pelkältä verkkoläsnäololta.",
        name: "Snapshot-havainto 2"
      }
    ]
  };

  const ctaSection = {
    type: "cta" as const,
    title: industryProfile.ctaTitle,
    body: industryProfile.ctaBody,
    button:
      snapshot.ctaTexts[0] && snapshot.ctaTexts[0].length <= 24
        ? snapshot.ctaTexts[0]
        : presetContent.primaryCta
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
      domain: snapshot.domain,
      companyName,
      industry: industryProfile.label,
      audience: industryProfile.audience,
      tone: industryProfile.tone
    },
    sourceUrl: snapshot.sourceUrl,
    status: snapshot.fetchStatus === "live" ? "ready" : "draft",
    createdAt: new Date().toISOString().slice(0, 10),
    businessSummary: buildBusinessSummary(snapshot, companyName),
    auditIssues: industryAudit.auditIssues,
    suggestedSections: industryAudit.suggestedSections,
    redesign: {
      stylePreset,
      sections
    }
  };
}

export async function generateProjectFromUrl(
  url: string,
  options?: { stylePreset?: string }
): Promise<Project> {
  const snapshot = await fetchSourceSnapshot(url);
  return buildProjectFromSourceSnapshot(snapshot, options);
}
