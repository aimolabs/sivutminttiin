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
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function cleanText(value: string): string {
  return decodeHtml(value)
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirst(html: string, regex: RegExp): string {
  const match = html.match(regex);
  return match?.[1] ? cleanText(match[1]) : "";
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
      if (value) {
        return value;
      }
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
    const value = cleanText(match[1] || "");
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

function pickCtas(buttons: string[], links: string[]): string[] {
  const keywordRegex =
    /(contact|quote|demo|book|call|talk|start|request|pricing|trial|tarjous|yhteys|ota yhteyttä|varaa|aloita|demo)/i;

  const prioritized = [...buttons, ...links].filter((item) => keywordRegex.test(item));
  const fallback = [...buttons, ...links];

  return [...new Set(prioritized.length > 0 ? prioritized : fallback)].slice(0, 6);
}

function pickNavItems(links: string[]): string[] {
  return links
    .filter((item) => item.length >= 2 && item.length <= 30)
    .slice(0, 8);
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
    siteName: "",
    themeColor: "",
    ogImageUrl: "",
    iconUrl: "",
    imageUrls: []
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

    const html = await response.text();

    const pageTitle = extractFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaDescription = extractMetaContent(html, [
      "description",
      "og:description"
    ]);
    const h1 = extractFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h2s = extractAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 6);
    const buttonTexts = extractAll(html, /<button[^>]*>([\s\S]*?)<\/button>/gi, 10);
    const linkTexts = extractAll(html, /<a[^>]*>([\s\S]*?)<\/a>/gi, 24);
    const bodyText = stripHtmlToText(html).slice(0, 2200);

    const siteName =
      extractMetaContent(html, ["og:site_name", "application-name"]) || pageTitle;

    const themeColor = extractMetaContent(html, ["theme-color", "msapplication-TileColor"]);

    const ogImageRaw = extractMetaContent(html, ["og:image", "twitter:image"]);
    const ogImageUrl = ogImageRaw ? toAbsoluteUrl(url, ogImageRaw) : "";

    const iconUrl =
      extractLinkHref(html, ["icon", "shortcut icon", "apple-touch-icon"], url) || "";

    const imageUrls = extractImageUrls(html, url, 24);

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
      siteName,
      themeColor,
      ogImageUrl,
      iconUrl,
      imageUrls
    };
  } catch {
    return fallbackSnapshot(url);
  }
}
