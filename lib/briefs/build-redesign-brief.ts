import type { SourceSnapshot } from "../source/source-snapshot";
import { normalizeSourceSnapshot } from "../source/normalize-source-snapshot";
import { analyzeSourceSnapshot } from "../source/analyze-source-snapshot";
import { inferCompanySignals } from "../source/infer-company-signals";
import type { RedesignBrief } from "./redesign-brief";

export function buildRedesignBrief(
  raw: SourceSnapshot
): RedesignBrief {
  const snapshot = normalizeSourceSnapshot(raw);
  const analysis = analyzeSourceSnapshot(snapshot, snapshot.companyNameCandidate);
  const signals = inferCompanySignals(snapshot);

  return {
    source: {
      url: snapshot.sourceUrl,
      domain: snapshot.domain,
      companyName: snapshot.companyNameCandidate
    },

    brand: {
      siteName: snapshot.siteName,
      logoUrl: snapshot.ogImageUrl,
      iconUrl: snapshot.iconUrl,
      themeColor: snapshot.themeColor,
      imageUrls: snapshot.ogImageUrl ? [snapshot.ogImageUrl] : []
    },

    business: {
      industry: signals.industryId,
      audience: signals.audienceType,
      coreOffer: snapshot.h1,
      secondaryOffers: snapshot.h2s,
      locations: []
    },

    content: {
      headings: [snapshot.h1, ...snapshot.h2s].filter(Boolean),
      navItems: snapshot.navItems,
      ctas: snapshot.ctaTexts,
      summary: snapshot.usableTextSummary
    },

    analysis: {
      strengths: analysis.suggestedSections.map((s) => s.name),
      weaknesses: analysis.auditIssues.map((i) => i.title)
    },

    redesign: {
      heroAngle: snapshot.h1 || "Selkeä arvolupaus",
      primaryCTA: snapshot.ctaTexts[0] || "Ota yhteyttä",
      sections: [
        {
          id: "hero",
          purpose: "Value proposition + CTA",
          direction: "Selkeä hyöty + kohderyhmä + sijainti"
        },
        {
          id: "services",
          purpose: "Tarjooman jäsentäminen",
          direction: "3–5 selkeää palvelua"
        },
        {
          id: "trust",
          purpose: "Luottamus",
          direction: "Referenssit / prosessi / kokemus"
        },
        {
          id: "cta",
          purpose: "Konversio",
          direction: "Yksi selkeä seuraava askel"
        }
      ],
      keep: snapshot.navItems.slice(0, 3),
      improve: analysis.auditIssues.map((i) => i.title)
    }
  };
}
