import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { generateBriefFromUrl } from "@/lib/briefs/generate-brief-from-url";
import { mapBriefToListItem } from "@/lib/briefs/brief-list-items";
import { BriefCopyButton } from "@/components/briefs/brief-copy-button";
import { SaveGeneratedBriefClient } from "@/components/briefs/save-generated-brief-client";
import { GenerateProjectForm } from "@/components/projects/generate-project-form";

type SearchParams = Promise<{
  url?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

export default async function GeneratedBriefPage({ searchParams }: Props) {
  const params = await searchParams;
  const url = params.url?.trim() ?? "";

  if (!url) {
    notFound();
  }

  const brief = await generateBriefFromUrl(url);
  const briefText = JSON.stringify(brief, null, 2);

  const href = `/briefs/generated?url=${encodeURIComponent(url)}`;
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
            {brief.source.companyName}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-white/65 md:text-base">
            Tämä on rakenteinen brief, jonka voit kopioida suoraan ChatGPT:lle tai Claudeen uuden
            etusivun rakentamista varten.
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
                  {brief.source.domain}
                </p>
                <p>
                  <span className="font-semibold text-white">Hero angle:</span>{" "}
                  {brief.redesign.heroAngle}
                </p>
                <p>
                  <span className="font-semibold text-white">Primary CTA:</span>{" "}
                  {brief.redesign.primaryCTA}
                </p>
              </div>
            </div>

            <GenerateProjectForm defaultUrl={url} />
          </div>
        </section>
      </div>
    </main>
  );
}
