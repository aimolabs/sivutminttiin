import "server-only";
import type { SourceSnapshot } from "./source-snapshot";

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "tuntematon.fi";
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
    bodyText: ""
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
    const metaDescription = extractFirst(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i
    );
    const h1 = extractFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h2s = extractAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 6);
    const buttonTexts = extractAll(html, /<button[^>]*>([\s\S]*?)<\/button>/gi, 10);
    const linkTexts = extractAll(html, /<a[^>]*>([\s\S]*?)<\/a>/gi, 24);
    const bodyText = stripHtmlToText(html).slice(0, 2200);

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
      bodyText
    };
  } catch {
    return fallbackSnapshot(url);
  }
}
