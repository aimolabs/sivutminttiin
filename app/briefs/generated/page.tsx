import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { generateBriefFromUrls } from "@/lib/briefs/generate-brief-from-urls";
import { mapBriefToListItem } from "@/lib/briefs/brief-list-items";
import { BriefCopyButton } from "@/components/briefs/brief-copy-button";
import { SaveGeneratedBriefClient } from "@/components/briefs/save-generated-brief-client";
import { GenerateProjectForm } from "@/components/projects/generate-project-form";

type SearchParams = Promise<{
  primaryUrl?: string;
  additionalUrl?: string | string[];
}>;

type Props = {
  searchParams: SearchParams;
};

function normalizeAdditionalUrls(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value])
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 14);
}

export default async function GeneratedBriefPage({ searchParams }: Props) {
  const params = await searchParams;
  const primaryUrl = params.primaryUrl?.trim() ?? "";
  const additionalUrls = normalizeAdditionalUrls(params.additionalUrl);

  if (!primaryUrl) {
    notFound();
  }

  const brief = await generateBriefFromUrls({
    primaryUrl,
    additionalUrls
  });

  const briefText = JSON.stringify(brief, null, 2);

  const hrefParams = new URLSearchParams();
  hrefParams.set("primaryUrl", primaryUrl);
  additionalUrls.forEach((url) => hrefParams.append("additionalUrl", url));

  const href = `/briefs/generated?${hrefParams.toString()}`;
  const listItem = mapBriefToListItem(brief, href);

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14">
        <SaveGeneratedBriefClient item={listItem} />

        <section className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Structured redesign brief
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {brief.site.companyName}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-white/65 md:text-base">
            Tämä brief yhdistää pää-URL:n ja lisä-URLit yhdeksi rakenteiseksi syötteeksi,
            jonka voit kopioida suoraan ChatGPT:lle tai Claudeen uuden sivuston rakentamista varten.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <BriefCopyButton text={briefText} label="Kopioi koko brief" />
            </div>

            <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-black/20 p-5">
              <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-white/85">
                {briefText}
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.18em] text-white/40">
                Summary
              </p>

              <div className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                <p>
                  <span className="font-semibold text-white">Domain:</span>{" "}
                  {brief.site.domain}
                </p>
                <p>
                  <span className="font-semibold text-white">Primary URL:</span>{" "}
                  {brief.site.primaryUrl}
                </p>
                <p>
                  <span className="font-semibold text-white">Additional URLs:</span>{" "}
                  {brief.site.additionalUrls.length}
                </p>
                <p>
                  <span className="font-semibold text-white">Core offer:</span>{" "}
                  {brief.business.coreOffer || "-"}
                </p>
              </div>
            </div>

            <GenerateProjectForm
              defaultPrimaryUrl={primaryUrl}
              defaultAdditionalUrls={additionalUrls}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
