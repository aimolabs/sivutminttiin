import type { NormalizedSourceSnapshot } from "../source/normalize-source-snapshot";

export type InferredIndustryId =
  | "restaurant"
  | "flower-shop"
  | "contractor"
  | "legal"
  | "technology"
  | "creative"
  | "local-services";

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function buildSignalText(snapshot: NormalizedSourceSnapshot): string {
  return [
    snapshot.domain,
    snapshot.pageTitle,
    snapshot.metaDescription,
    snapshot.h1,
    ...snapshot.h2s,
    ...snapshot.navItems,
    ...snapshot.ctaTexts,
    snapshot.bodyText
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function inferIndustry(
  snapshot: NormalizedSourceSnapshot
): InferredIndustryId {
  const text = buildSignalText(snapshot);

  if (
    includesAny(text, [
      "pizza",
      "pizzeria",
      "ravintola",
      "restaurant",
      "menu",
      "takeaway",
      "foodora",
      "wolt",
      "annokset",
      "lounas"
    ])
  ) {
    return "restaurant";
  }

  if (
    includesAny(text, [
      "kukka",
      "flowers",
      "florist",
      "kukkakauppa",
      "kukkalähetys",
      "interflora",
      "kimppu",
      "sidonta"
    ])
  ) {
    return "flower-shop";
  }

  if (
    includesAny(text, [
      "rakenn",
      "remont",
      "maala",
      "urak",
      "saneeraus",
      "kylpyhuone",
      "keittiöremontti",
      "terassi",
      "pintaremontti"
    ])
  ) {
    return "contractor";
  }

  if (
    includesAny(text, [
      "laki",
      "legal",
      "law",
      "jurist",
      "asianaj",
      "lakimies",
      "riita",
      "sopimus",
      "perintö",
      "oikeus"
    ])
  ) {
    return "legal";
  }

  if (
    includesAny(text, [
      "saas",
      "software",
      "platform",
      "cloud",
      "data",
      "automation",
      "api",
      "integration",
      "demo",
      "enterprise"
    ])
  ) {
    return "technology";
  }

  if (
    includesAny(text, [
      "studio",
      "design",
      "creative",
      "branding",
      "brand",
      "visual identity",
      "portfolio"
    ])
  ) {
    return "creative";
  }

  return "local-services";
}
