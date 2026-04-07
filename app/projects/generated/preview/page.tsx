import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewSectionRenderer } from "@/components/projects/preview-section-renderer";
import { buildProjectFromSourceSnapshot } from "@/lib/mock/generate-from-url";
import { fetchSourceSnapshot } from "@/lib/source/fetch-source-snapshot";

type GeneratedPreviewPageProps = {
  searchParams: Promise<{
    url?: string;
    stylePreset?: string;
  }>;
};

export default async function GeneratedPreviewPage({
  searchParams
}: GeneratedPreviewPageProps) {
  const { url, stylePreset } = await searchParams;

  if (!url) {
    notFound();
  }

  const snapshot = await fetchSourceSnapshot(url);
  const project = buildProjectFromSourceSnapshot(snapshot, { stylePreset });

  return (
    <main className="min-h-screen bg-[#0b1020] px-6 py-10 text-white md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky-300/75">
              Client preview
            </p>
            <h1 className="mt-1 text-lg font-semibold">
              {project.siteProfile.companyName}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/projects/generated?url=${encodeURIComponent(url)}&stylePreset=${project.styleDirection.stylePresetId}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
            >
              Takaisin projektiin
            </Link>
          </div>
        </div>

        <PreviewSectionRenderer project={project} />
      </div>
    </main>
  );
}
