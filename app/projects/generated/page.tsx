import { generateProjectFromUrl } from "@/lib/mock/generate-from-url";
import { PreviewSectionRenderer } from "@/components/projects/preview-section-renderer";
import { CompanyBriefDebug } from "@/components/projects/company-brief-debug";
import { GenerateProjectForm } from "@/components/projects/generate-project-form";
import { SaveGeneratedProjectClient } from "@/components/projects/save-generated-project-client";
import type { ProjectListItem } from "@/lib/projects/project-list-items";

type SearchParams = Promise<{
  url?: string;
  industryId?: string;
  stylePreset?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

export default async function GeneratedPage({ searchParams }: Props) {
  const params = await searchParams;
  const url = params.url ?? "";
  const industryId = params.industryId ?? "contractor";
  const stylePreset = params.stylePreset ?? "premium-dark";

  if (!url) {
    return (
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Structured project generation
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Luo uusi redesign-projekti
          </h1>
          <p className="max-w-2xl text-neutral-600">
            Valitse URL, industry ja style preset. Industry on controlled input,
            ei automaattisen arvauksen varassa.
          </p>
        </div>

        <GenerateProjectForm
          defaultUrl=""
          defaultIndustryId={industryId}
          defaultStylePreset={stylePreset}
        />
      </div>
    );
  }

  const project = await generateProjectFromUrl(url, {
    stylePreset,
    industryId
  });

  const pageId =
    project.sitemap.find((item) => item.isPrimary)?.pageId ??
    project.pages[0]?.pageId ??
    "";

  const listItem: ProjectListItem = {
    id: `generated:${project.siteProfile.companyName}:${project.createdAt}`,
    companyName: project.siteProfile.companyName,
    industryLabel: project.siteProfile.industry,
    businessSummary: project.businessSummary,
    createdAt: project.createdAt,
    status: project.status,
    href: `/projects/generated?url=${encodeURIComponent(url)}&industryId=${encodeURIComponent(industryId)}&stylePreset=${encodeURIComponent(stylePreset)}`,
    source: "generated"
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:px-8 md:py-10">
      <SaveGeneratedProjectClient item={listItem} />

      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Client-facing redesign preview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          {project.siteProfile.companyName}
        </h1>
        <p className="max-w-3xl text-neutral-600">{project.businessSummary}</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              {project.pages[0]?.pageType ?? "page"}
            </p>
            <h2 className="text-2xl font-semibold text-neutral-950">
              {project.pages[0]?.title ?? "Preview"}
            </h2>
            <p className="max-w-2xl text-sm text-neutral-600">
              {project.pages[0]?.purpose ?? ""}
            </p>
          </div>

          <div className="min-w-[260px] rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
            <p className="font-medium text-neutral-900">SEO snapshot</p>
            <div className="mt-3 space-y-2 text-neutral-600">
              <p>
                <span className="font-medium text-neutral-900">Slug:</span>{" "}
                {project.pages[0]?.slug ?? ""}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Title:</span>{" "}
                {project.pages[0]?.pageSEO.title ?? ""}
              </p>
              <p>
                <span className="font-medium text-neutral-900">H1:</span>{" "}
                {project.pages[0]?.pageSEO.h1 ?? ""}
              </p>
            </div>
          </div>
        </div>

        <PreviewSectionRenderer project={project} pageId={pageId} />
      </div>

      <div className="grid gap-8 border-t border-neutral-200 pt-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Regenerate
            </p>
            <h3 className="text-2xl font-semibold tracking-tight">
              Vaihda inputteja ja generoi uudestaan
            </h3>
          </div>

          <GenerateProjectForm
            defaultUrl={url}
            defaultIndustryId={industryId}
            defaultStylePreset={stylePreset}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Structured interpretation
            </p>
            <h3 className="text-2xl font-semibold tracking-tight">
              Company brief debug
            </h3>
          </div>

          <CompanyBriefDebug project={project} />
        </div>
      </div>
    </div>
  );
}
