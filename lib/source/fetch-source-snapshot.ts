import "server-only";
import type { SourceSnapshot } from "./source-snapshot";

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "tuntematon.fi";
  }
}

function toAbsoluteUrl(baseUrl: string, maybeRelative: string): string {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return "";
  }
}

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
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanText(value: string): string {
  return decodeHtml(value)
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ");
}

function extractFirst(html: string, regex: RegExp): string {
  const match = html.match(regex);
  return match?.[1] ? cleanText(stripTags(match[1])) : "";
}

function extractMetaContent(html: string, names: string[]): string {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(
        `<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([\\s\\S]*?)["'][^>]*>`,
        "i"
      ),
      new RegExp(
        `<meta[^>]+content=["']([\\s\\S]*?)["'][^>]+(?:name|property)=["']${escaped}["'][^>]*>`,
        "i"
      )
    ];

    for (const pattern of patterns) {
      const value = extractFirst(html, pattern);
      if (value) return value;
    }
  }

  return "";
}

function extractLinkHref(
  html: string,
  relMatchers: string[],
  baseUrl: string
): string {
  const linkRegex = /<link[^>]*>/gi;

  for (const tag of html.match(linkRegex) ?? []) {
    const rel = extractFirst(tag, /rel=["']([\s\S]*?)["']/i).toLowerCase();
    const href = extractFirst(tag, /href=["']([\s\S]*?)["']/i);

    if (!rel || !href) continue;

    if (relMatchers.some((matcher) => rel.includes(matcher))) {
      return toAbsoluteUrl(baseUrl, href);
    }
  }

  return "";
}

function extractAll(html: string, regex: RegExp, maxItems = 8): string[] {
  const results: string[] = [];
  for (const match of html.matchAll(regex)) {
    const raw = match[2] || match[1] || "";
    const value = cleanText(stripTags(raw));
    if (!value) continue;
    if (results.includes(value)) continue;
    results.push(value);
    if (results.length >= maxItems) break;
  }
  return results;
}

function extractImageUrls(html: string, baseUrl: string, maxItems = 24): string[] {
  const results: string[] = [];
  const regex = /<img[^>]+src=["']([\s\S]*?)["'][^>]*>/gi;

  for (const match of html.matchAll(regex)) {
    const raw = cleanText(match[1] || "");
    if (!raw) continue;
    if (raw.startsWith("data:")) continue;

    const absolute = toAbsoluteUrl(baseUrl, raw);
    if (!absolute) continue;
    if (results.includes(absolute)) continue;

    results.push(absolute);
    if (results.length >= maxItems) break;
  }

  return results;
}

function stripHtmlToText(html: string): string {
  return cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
}

function extractParagraphTexts(html: string, maxItems = 24): string[] {
  const blocks = extractAll(html, /<(p|li|td|div)[^>]*>([\s\S]*?)<\/\1>/gi, maxItems * 3);
  return [...new Set(
    blocks.filter((item) => item.length >= 30 && item.length <= 1400)
  )].slice(0, maxItems);
}

function extractPhoneNumbers(text: string): string[] {
  const matches = text.match(/(?:\+358\s?|0)(?:[\s-]?\d){6,14}/g) ?? [];
  return [...new Set(
    matches.map((item) => item.replace(/\s+/g, " ").trim())
  )].slice(0, 12);
}

function extractEmailAddresses(text: string): string[] {
  const normalized = text
    .replace(/\(@\)/g, "@")
    .replace(/\(at\)/gi, "@")
    .replace(/\s*\[\s*at\s*\]\s*/gi, "@")
    .replace(/\s*\[\s*dot\s*\]\s*/gi, ".")
    .replace(/\s*\(\s*dot\s*\)\s*/gi, ".");

  const matches = normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  return [...new Set(matches)].slice(0, 12);
}

function pickCtas(buttons: string[], links: string[]): string[] {
  const keywordRegex =
    /(contact|quote|demo|book|call|talk|start|request|pricing|trial|tarjous|yhteys|ota yhteyttä|varaa|aloita|pyydä tarjous)/i;

  const prioritized = [...buttons, ...links].filter((item) => keywordRegex.test(item));
  const fallback = [...buttons, ...links].filter((item) => !/facebook/i.test(item));

  return [...new Set(prioritized.length > 0 ? prioritized : fallback)].slice(0, 8);
}

function pickNavItems(links: string[]): string[] {
  return links
    .filter((item) => item.length >= 2 && item.length <= 40)
    .slice(0, 12);
}

function detectCharsetFromHtml(htmlHead: string): string {
  const fromMetaCharset = htmlHead.match(/<meta[^>]+charset=["']?([a-zA-Z0-9._-]+)["']?/i)?.[1];
  if (fromMetaCharset) return fromMetaCharset.toLowerCase();

  const fromContentType = htmlHead.match(
    /<meta[^>]+http-equiv=["']content-type["'][^>]+content=["'][^"']*charset=([a-zA-Z0-9._-]+)[^"']*["']/i
  )?.[1];

  if (fromContentType) return fromContentType.toLowerCase();

  return "utf-8";
}

async function decodeResponseHtml(response: Response): Promise<string> {
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const utf8Text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  const head = utf8Text.slice(0, 2500);
  const detected = detectCharsetFromHtml(head);

  if (detected.includes("iso-8859-1") || detected.includes("latin1") || detected.includes("windows-1252")) {
    try {
      return new TextDecoder("windows-1252", { fatal: false }).decode(bytes);
    } catch {
      return utf8Text;
    }
  }

  return utf8Text;
}

function fallbackSnapshot(url: string): SourceSnapshot {
  return {
    sourceUrl: url,
    domain: extractDomain(url),
    fetchStatus: "fallback",
    pageTitle: "",
    metaDescription: "",
    h1: "",
    h2s: [],
    navItems: [],
    ctaTexts: [],
    bodyText: "",
    paragraphTexts: [],
    siteName: "",
    themeColor: "",
    ogImageUrl: "",
    iconUrl: "",
    imageUrls: [],
    phoneNumbers: [],
    emailAddresses: []
  };
}

export async function fetchSourceSnapshot(url: string): Promise<SourceSnapshot> {
  const domain = extractDomain(url);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SivutMinttiinBot/1.0; +https://example.com/bot)"
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return fallbackSnapshot(url);
    }

    const html = await decodeResponseHtml(response);

    const pageTitle = extractFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaDescription = extractMetaContent(html, ["description", "og:description"]);
    const h1 = extractFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h2s = extractAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 12);
    const buttonTexts = extractAll(html, /<button[^>]*>([\s\S]*?)<\/button>/gi, 16);
    const linkTexts = extractAll(html, /<a[^>]*>([\s\S]*?)<\/a>/gi, 40);
    const paragraphTexts = extractParagraphTexts(html, 24);
    const bodyText = stripHtmlToText(html).slice(0, 12000);

    const siteName =
      extractMetaContent(html, ["og:site_name", "application-name"]) || pageTitle;

    const themeColor = extractMetaContent(html, ["theme-color", "msapplication-TileColor"]);

    const ogImageRaw = extractMetaContent(html, ["og:image", "twitter:image"]);
    const ogImageUrl = ogImageRaw ? toAbsoluteUrl(url, ogImageRaw) : "";

    const iconUrl =
      extractLinkHref(html, ["icon", "shortcut icon", "apple-touch-icon"], url) || "";

    const imageUrls = extractImageUrls(html, url, 40);

    return {
      sourceUrl: url,
      domain,
      fetchStatus: "live",
      pageTitle,
      metaDescription,
      h1,
      h2s,
      navItems: pickNavItems(linkTexts),
      ctaTexts: pickCtas(buttonTexts, linkTexts),
      bodyText,
      paragraphTexts,
      siteName,
      themeColor,
      ogImageUrl,
      iconUrl,
      imageUrls,
      phoneNumbers: extractPhoneNumbers(bodyText),
      emailAddresses: extractEmailAddresses(bodyText)
    };
  } catch {
    return fallbackSnapshot(url);
  }
}
