import type { NormalizedSourceSnapshot } from "./normalize-source-snapshot";

export type PrimaryConversionGoal =
  | "quote"
  | "contact"
  | "booking"
  | "demo"
  | "project-start";

export type TrustProfile =
  | "local-reliability"
  | "expertise"
  | "portfolio"
  | "outcome"
  | "process";

export type ServiceModel =
  | "named-services"
  | "solution-led"
  | "problem-led"
  | "mixed";

export type LocationMode = "strong-local" | "regional" | "broad";

export type BrandStrength = "weak" | "medium" | "strong";

export type PageBlueprintVariant =
  | "quote-led"
  | "contact-led"
  | "demo-led"
  | "portfolio-led";

export type CompanySignals = {
  industryId: string;
  primaryConversionGoal: PrimaryConversionGoal;
  trustProfile: TrustProfile;
  serviceModel: ServiceModel;
  locationMode: LocationMode;
  brandStrength: BrandStrength;
  pageBlueprintVariant: PageBlueprintVariant;
  likelyPrimaryService: string | null;
  likelySecondaryServices: string[];
};

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function inferIndustryId(text: string): string {
  if (includesAny(text, ["rakenn", "remont", "urak", "maala"])) {
    return "construction";
  }

  if (includesAny(text, ["laki", "legal", "law", "jurist", "asianaj", "lakimies"])) {
    return "legal";
  }

  if (includesAny(text, ["studio", "design", "creative", "brand", "visua", "portfolio"])) {
    return "creative";
  }

  if (includesAny(text, ["tech", "soft", "data", "cloud", "digital", "app", "saas", "platform"])) {
    return "technology";
  }

  return "local-services";
}

function inferPrimaryConversionGoal(text: string, industryId: string): PrimaryConversionGoal {
  if (includesAny(text, ["demo", "book demo", "request demo"])) {
    return "demo";
  }

  if (includesAny(text, ["book", "reserve", "varaa", "ajanvaraus"])) {
    return "booking";
  }

  if (includesAny(text, ["quote", "tarjous", "pyydä tarjous"])) {
    return "quote";
  }

  if (industryId === "technology") {
    return "demo";
  }

  if (industryId === "creative") {
    return "project-start";
  }

  return "contact";
}

function inferTrustProfile(text: string, industryId: string): TrustProfile {
  if (industryId === "construction") {
    return "local-reliability";
  }

  if (industryId === "legal") {
    return "expertise";
  }

  if (industryId === "creative") {
    return "portfolio";
  }

  if (industryId === "technology") {
    return "outcome";
  }

  if (includesAny(text, ["kokemus", "experience", "asiantunt", "expert"])) {
    return "expertise";
  }

  if (includesAny(text, ["portfolio", "work", "case", "projekti", "työ"])) {
    return "portfolio";
  }

  if (includesAny(text, ["process", "prosessi", "how we work", "toimintatapa"])) {
    return "process";
  }

  return "local-reliability";
}

function inferServiceModel(snapshot: NormalizedSourceSnapshot): ServiceModel {
  const headings = snapshot.h2s.map((item) => item.toLowerCase());
  const joined = headings.join(" ");

  if (headings.length === 0) {
    return "mixed";
  }

  if (includesAny(joined, ["ratkaisu", "solution", "platform", "system"])) {
    return "solution-led";
  }

  if (includesAny(joined, ["ongelma", "problem", "haaste", "challenge"])) {
    return "problem-led";
  }

  const shortNamedServices = headings.filter(
    (item) => item.split(" ").length <= 3 && item.length <= 32
  );

  if (shortNamedServices.length >= 2) {
    return "named-services";
  }

  return "mixed";
}

function inferLocationMode(text: string): LocationMode {
  if (
    includesAny(text, [
      "jyväskylä",
      "helsinki",
      "espoo",
      "vantaa",
      "turku",
      "tampere",
      "oulu",
      "uusimaa",
      "pirkanmaa",
      "paikallinen",
      "local"
    ])
  ) {
    return "strong-local";
  }

  if (
    includesAny(text, [
      "suomi",
      "finland",
      "nationwide",
      "koko suomi",
      "throughout finland"
    ])
  ) {
    return "broad";
  }

  return "regional";
}

function inferBrandStrength(snapshot: NormalizedSourceSnapshot): BrandStrength {
  const titleHasBrand =
    snapshot.pageTitle &&
    snapshot.companyNameCandidate &&
    snapshot.pageTitle.toLowerCase().includes(snapshot.companyNameCandidate.toLowerCase());

  const h1HasBrand =
    snapshot.h1 &&
    snapshot.companyNameCandidate &&
    snapshot.h1.toLowerCase().includes(snapshot.companyNameCandidate.toLowerCase());

  if (titleHasBrand && h1HasBrand) {
    return "strong";
  }

  if (titleHasBrand || h1HasBrand) {
    return "medium";
  }

  return "weak";
}

function inferPageBlueprintVariant(
  industryId: string,
  conversionGoal: PrimaryConversionGoal,
  trustProfile: TrustProfile
): PageBlueprintVariant {
  if (conversionGoal === "demo") {
    return "demo-led";
  }

  if (trustProfile === "portfolio") {
    return "portfolio-led";
  }

  if (conversionGoal === "quote") {
    return "quote-led";
  }

  if (industryId === "legal") {
    return "contact-led";
  }

  return "contact-led";
}

function inferPrimaryService(snapshot: NormalizedSourceSnapshot): string | null {
  return snapshot.h2s[0] ?? null;
}

function inferSecondaryServices(snapshot: NormalizedSourceSnapshot): string[] {
  return snapshot.h2s.slice(1, 4);
}

export function inferCompanySignals(
  snapshot: NormalizedSourceSnapshot
): CompanySignals {
  const signalText = [
    snapshot.industrySignalText,
    snapshot.pageTitle,
    snapshot.metaDescription,
    snapshot.h1,
    ...snapshot.h2s,
    ...snapshot.ctaTexts,
    ...snapshot.navItems
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const industryId = inferIndustryId(signalText);
  const primaryConversionGoal = inferPrimaryConversionGoal(signalText, industryId);
  const trustProfile = inferTrustProfile(signalText, industryId);
  const serviceModel = inferServiceModel(snapshot);
  const locationMode = inferLocationMode(signalText);
  const brandStrength = inferBrandStrength(snapshot);
  const pageBlueprintVariant = inferPageBlueprintVariant(
    industryId,
    primaryConversionGoal,
    trustProfile
  );

  return {
    industryId,
    primaryConversionGoal,
    trustProfile,
    serviceModel,
    locationMode,
    brandStrength,
    pageBlueprintVariant,
    likelyPrimaryService: inferPrimaryService(snapshot),
    likelySecondaryServices: inferSecondaryServices(snapshot)
  };
}
