import type { NormalizedSourceSnapshot } from "../source/normalize-source-snapshot";

export type InferredIndustryId =
  | "restaurant"
  | "flower-shop"
  | "contractor"
  | "legal"
  | "accounting"
  | "clinic"
  | "beauty"
  | "fitness"
  | "cleaning"
  | "real-estate"
  | "ecommerce"
  | "technology"
  | "manufacturing"
  | "consultancy"
  | "creative"
  | "local-services";

export type InferredBusinessModel =
  | "local-transactional"
  | "lead-generation"
  | "booking-based"
  | "expert-advisory"
  | "catalog-commerce"
  | "b2b-solution"
  | "portfolio-showcase"
  | "local-general";

export type InferredPageArchetype =
  | "menu-led"
  | "catalog-led"
  | "quote-led"
  | "contact-led"
  | "booking-led"
  | "demo-led"
  | "portfolio-led"
  | "trust-led";

export type InferredIndustryResult = {
  industry: InferredIndustryId;
  businessModel: InferredBusinessModel;
  pageArchetype: InferredPageArchetype;
};

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

export function inferIndustryResult(
  snapshot: NormalizedSourceSnapshot
): InferredIndustryResult {
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
      "lounas",
      "burger",
      "kebab"
    ])
  ) {
    return {
      industry: "restaurant",
      businessModel: "local-transactional",
      pageArchetype: "menu-led"
    };
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
      "sidonta",
      "hautajaiskukat",
      "hääkukat"
    ])
  ) {
    return {
      industry: "flower-shop",
      businessModel: "catalog-commerce",
      pageArchetype: "catalog-led"
    };
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
    return {
      industry: "contractor",
      businessModel: "lead-generation",
      pageArchetype: "quote-led"
    };
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
    return {
      industry: "legal",
      businessModel: "expert-advisory",
      pageArchetype: "trust-led"
    };
  }

  if (
    includesAny(text, [
      "tilitoimisto",
      "accounting",
      "kirjanpito",
      "palkanlaskenta",
      "veroilmoitus",
      "bookkeeping"
    ])
  ) {
    return {
      industry: "accounting",
      businessModel: "expert-advisory",
      pageArchetype: "trust-led"
    };
  }

  if (
    includesAny(text, [
      "hammas",
      "lääkäri",
      "klinikka",
      "clinic",
      "fysioterapia",
      "therapy",
      "hieronta",
      "medical"
    ])
  ) {
    return {
      industry: "clinic",
      businessModel: "booking-based",
      pageArchetype: "booking-led"
    };
  }

  if (
    includesAny(text, [
      "kauneus",
      "beauty",
      "kampaamo",
      "parturi",
      "lash",
      "nails",
      "brows",
      "skincare"
    ])
  ) {
    return {
      industry: "beauty",
      businessModel: "booking-based",
      pageArchetype: "booking-led"
    };
  }

  if (
    includesAny(text, [
      "gym",
      "fitness",
      "valmennus",
      "personal trainer",
      "pt",
      "jooga",
      "pilates"
    ])
  ) {
    return {
      industry: "fitness",
      businessModel: "booking-based",
      pageArchetype: "booking-led"
    };
  }

  if (
    includesAny(text, [
      "siivous",
      "cleaning",
      "kotisiivous",
      "ikkunanpesu",
      "toimistosiivous"
    ])
  ) {
    return {
      industry: "cleaning",
      businessModel: "lead-generation",
      pageArchetype: "quote-led"
    };
  }

  if (
    includesAny(text, [
      "kiinteistö",
      "real estate",
      "välitys",
      "asunto",
      "vuokraus",
      "broker"
    ])
  ) {
    return {
      industry: "real-estate",
      businessModel: "lead-generation",
      pageArchetype: "contact-led"
    };
  }

  if (
    includesAny(text, [
      "shop",
      "store",
      "verkkokauppa",
      "cart",
      "checkout",
      "tuotteet",
      "collection",
      "product"
    ])
  ) {
    return {
      industry: "ecommerce",
      businessModel: "catalog-commerce",
      pageArchetype: "catalog-led"
    };
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
    return {
      industry: "technology",
      businessModel: "b2b-solution",
      pageArchetype: "demo-led"
    };
  }

  if (
    includesAny(text, [
      "teollisuus",
      "manufacturing",
      "factory",
      "industrial",
      "machine",
      "cnc",
      "automation line"
    ])
  ) {
    return {
      industry: "manufacturing",
      businessModel: "lead-generation",
      pageArchetype: "trust-led"
    };
  }

  if (
    includesAny(text, [
      "consulting",
      "consultancy",
      "advisory",
      "strategy",
      "sparraus",
      "kehitys"
    ])
  ) {
    return {
      industry: "consultancy",
      businessModel: "expert-advisory",
      pageArchetype: "trust-led"
    };
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
    return {
      industry: "creative",
      businessModel: "portfolio-showcase",
      pageArchetype: "portfolio-led"
    };
  }

  return {
    industry: "local-services",
    businessModel: "local-general",
    pageArchetype: "contact-led"
  };
}
