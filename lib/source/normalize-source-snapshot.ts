import type { SourceSnapshot } from "./source-snapshot";

export type NormalizedSourceSnapshot = {
  sourceUrl: string;
  domain: string;
  fetchStatus: "live" | "fallback";
  pageTitle: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  navItems: string[];
  ctaTexts: string[];
  bodyText: string;
  paragraphTexts: string[];
  companyNameCandidate: string;
  industrySignalText: string;
  usableTextSummary: string;
  siteName: string;
  themeColor: string;
  ogImageUrl: string;
  iconUrl: string;
  imageUrls: string[];
  phoneNumbers: string[];
  emailAddresses: string[];
};

const GENERIC_HEADINGS = /^(etusivu|home|palvelut|services|yhteystiedot|contact|meistä|about|blogi|blog|faq)$/i;
const CTA_KEYWORDS =
  /(contact|quote|demo|book|call|talk|start|request|pricing|trial|tarjous|yhteys|ota yhteyttä|varaa|aloita|pyydä tarjous|lue lisää|katso lisää|tutustu|facebook)/i;

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8226;/g, "•")
    .replace(/&#x27;/g, "'")
    .replace(/&ouml;/g, "ö")
    .replace(/&Ouml;/g, "Ö")
    .replace(/&auml;/g, "ä")
    .replace(/&Auml;/g, "Ä")
    .replace(/&aring;/g, "å")
    .replace(/&Aring;/g, "Å")
    .replace(/&uuml;/g, "ü")
    .replace(/&Uuml;/g, "Ü")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, " ")
    .replace(/&nbsp;/g, " ");
}

function removeComments(value: string): string {
  return value.replace(/<!--[\s\S]*?-->/g, " ");
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ");
}

function removeDataUris(value: string): string {
  return value.replace(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g, " ");
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeText(value: string): string {
  return normalizeWhitespace(
    decodeHtml(removeDataUris(stripTags(removeComments(value))))
  );
}

function sanitizeUrl(value: string): string {
  const cleaned = normalizeWhitespace(value);
  if (!cleaned) return "";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return "";
}

function looksGarbage(value: string): boolean {
  if (!value) return true;
  if (/[<>]/.test(value)) return true;
  if (/^\W+$/.test(value)) return true;
  if (value.length > 2400) return true;
  if (/function\s*\(|=>|var\s+|const\s+|return\s+/i.test(value)) return true;
  if (/base64|aria-hidden|viewBox|xmlns|svg|icon-|fa-|menu-toggle/i.test(value)) return true;
  return false;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function cleanList(
  values: string[],
  options?: {
    minLength?: number;
    maxLength?: number;
    maxItems?: number;
  }
): string[] {
  const minLength = options?.minLength ?? 2;
  const maxLength = options?.maxLength ?? 120;
  const maxItems = options?.maxItems ?? 12;

  return unique(
    values
      .map(sanitizeText)
      .filter((value) => !looksGarbage(value))
      .filter((value) => value.length >= minLength && value.length <= maxLength)
  ).slice(0, maxItems);
}

function filterNavItems(values: string[]): string[] {
  return cleanList(values, { minLength: 2, maxLength: 40, maxItems: 12 }).filter(
    (item) =>
      !CTA_KEYWORDS.test(item) &&
      !/^\d+$/.test(item) &&
      item.split(" ").length <= 6
  );
}

function filterCtas(values: string[]): string[] {
  const cleaned = cleanList(values, { minLength: 2, maxLength: 48, maxItems: 16 });

  const prioritized = cleaned.filter(
    (item) =>
      CTA_KEYWORDS.test(item) &&
      item.split(" ").length <= 8 &&
      !GENERIC_HEADINGS.test(item)
  );

  const fallback = cleaned.filter(
    (item) =>
      item.split(" ").length <= 6 &&
      !GENERIC_HEADINGS.test(item)
  );

  return (prioritized.length > 0 ? prioritized : fallback).slice(0, 8);
}

function filterH2s(values: string[]): string[] {
  return cleanList(values, { minLength: 3, maxLength: 120, maxItems: 12 }).filter(
    (item) =>
      !GENERIC_HEADINGS.test(item) &&
      item.split(" ").length <= 14
  );
}

function normalizeBodyText(value: string): string {
  const cleaned = sanitizeText(value);
  return cleaned.slice(0, 10000);
}

function normalizeParagraphTexts(values: string[]): string[] {
  return unique(
    values
      .map(sanitizeText)
      .filter((value) => !looksGarbage(value))
      .filter((value) => value.length >= 30 && value.length <= 1500)
  ).slice(0, 24);
}

function normalizeImageUrls(values: string[]): string[] {
  return unique(values.map(sanitizeUrl).filter(Boolean)).slice(0, 40);
}

function normalizeContactList(values: string[], maxItems = 12): string[] {
  return unique(values.map(sanitizeText).filter(Boolean)).slice(0, maxItems);
}

function domainToCompanyName(domain: string): string {
  const withoutTld = domain.replace(/\.[^.]+$/, "");
  const cleaned = withoutTld.replace(/[-_]+/g, " ").trim();

  if (!cleaned) return "Yritys";

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function splitTitleCandidates(title: string): string[] {
  return unique(
    title
      .split(/\s[\|\-–—]\s/)
      .map((part) => sanitizeText(part))
      .filter(Boolean)
  );
}

function looksLikeCompanyName(value: string): boolean {
  if (!value) return false;
  if (looksGarbage(value)) return false;
  if (GENERIC_HEADINGS.test(value)) return false;
  if (value.length > 60) return false;
  if (value.split(" ").length > 8) return false;
  if (/^(tervetuloa|welcome|ratkaisut|solutions|palvelut|services)\b/i.test(value)) return false;
  return true;
}

function resolveCompanyNameCandidate(input: {
  domain: string;
  pageTitle: string;
  h1: string;
  siteName: string;
}): string {
  const titleCandidates = splitTitleCandidates(input.pageTitle);
  const titleBrand = titleCandidates.find(looksLikeCompanyName);

  if (titleBrand) return titleBrand;

  const cleanSiteName = sanitizeText(input.siteName);
  if (looksLikeCompanyName(cleanSiteName)) return cleanSiteName;

  const cleanH1 = sanitizeText(input.h1);
  if (looksLikeCompanyName(cleanH1)) return cleanH1;

  return domainToCompanyName(input.domain);
}

function buildIndustrySignalText(input: {
  domain: string;
  pageTitle: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  navItems: string[];
  ctaTexts: string[];
  bodyText: string;
  siteName: string;
  paragraphTexts: string[];
}): string {
  return [
    input.domain,
    input.siteName,
    input.pageTitle,
    input.metaDescription,
    input.h1,
    ...input.h2s.slice(0, 6),
    ...input.navItems.slice(0, 8),
    ...input.ctaTexts.slice(0, 6),
    ...input.paragraphTexts.slice(0, 6),
    input.bodyText.slice(0, 1500)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function buildUsableTextSummary(input: {
  pageTitle: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  siteName: string;
}): string {
  return [
    input.siteName,
    input.pageTitle,
    input.metaDescription,
    input.h1,
    ...input.h2s.slice(0, 4)
  ]
    .filter(Boolean)
    .join(" — ");
}

export function normalizeSourceSnapshot(
  snapshot: SourceSnapshot
): NormalizedSourceSnapshot {
  const pageTitle = sanitizeText(snapshot.pageTitle);
  const metaDescription = sanitizeText(snapshot.metaDescription);
  const h1 = sanitizeText(snapshot.h1);
  const h2s = filterH2s(snapshot.h2s);
  const navItems = filterNavItems(snapshot.navItems);
  const ctaTexts = filterCtas(snapshot.ctaTexts);
  const bodyText = normalizeBodyText(snapshot.bodyText);
  const paragraphTexts = normalizeParagraphTexts(snapshot.paragraphTexts);
  const siteName = sanitizeText(snapshot.siteName);
  const themeColor = sanitizeText(snapshot.themeColor);
  const ogImageUrl = sanitizeUrl(snapshot.ogImageUrl);
  const iconUrl = sanitizeUrl(snapshot.iconUrl);
  const imageUrls = normalizeImageUrls(snapshot.imageUrls);
  const phoneNumbers = normalizeContactList(snapshot.phoneNumbers);
  const emailAddresses = normalizeContactList(snapshot.emailAddresses);

  const companyNameCandidate = resolveCompanyNameCandidate({
    domain: snapshot.domain,
    pageTitle,
    h1,
    siteName
  });

  const industrySignalText = buildIndustrySignalText({
    domain: snapshot.domain,
    pageTitle,
    metaDescription,
    h1,
    h2s,
    navItems,
    ctaTexts,
    bodyText,
    siteName,
    paragraphTexts
  });

  const usableTextSummary = buildUsableTextSummary({
    pageTitle,
    metaDescription,
    h1,
    h2s,
    siteName
  });

  return {
    sourceUrl: snapshot.sourceUrl,
    domain: snapshot.domain,
    fetchStatus: snapshot.fetchStatus,
    pageTitle,
    metaDescription,
    h1,
    h2s,
    navItems,
    ctaTexts,
    bodyText,
    paragraphTexts,
    companyNameCandidate,
    industrySignalText,
    usableTextSummary,
    siteName,
    themeColor,
    ogImageUrl,
    iconUrl,
    imageUrls,
    phoneNumbers,
    emailAddresses
  };
}
