import { fetchSourceSnapshot } from "../source/fetch-source-snapshot";
import { buildRedesignBrief } from "./build-redesign-brief";

export async function generateBriefFromUrl(url: string) {
  const snapshot = await fetchSourceSnapshot(url);
  return buildRedesignBrief(snapshot);
}
