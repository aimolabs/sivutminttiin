import { fetchSourceSnapshot } from "../source/fetch-source-snapshot";
import { buildRedesignBrief } from "./build-redesign-brief";

type GenerateBriefFromUrlsInput = {
  primaryUrl: string;
  additionalUrls: string[];
};

export async function generateBriefFromUrls({
  primaryUrl,
  additionalUrls
}: GenerateBriefFromUrlsInput) {
  const allUrls = [primaryUrl, ...additionalUrls].slice(0, 15);
  const snapshots = await Promise.all(allUrls.map((url) => fetchSourceSnapshot(url)));

  return buildRedesignBrief({
    primaryUrl,
    additionalUrls,
    snapshots
  });
}
