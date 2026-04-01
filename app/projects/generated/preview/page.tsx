import { notFound } from "next/navigation";
import { PreviewSectionRenderer } from "@/components/projects/preview-section-renderer";
import { generateProjectFromUrl } from "@/lib/mock/generate-from-url";

type GeneratedPreviewPageProps = {
  searchParams: Promise<{
    url?: string;
  }>;
};

export default async function GeneratedPreviewPage({
  searchParams
}: GeneratedPreviewPageProps) {
  const { url } = await searchParams;

  if (!url) {
    notFound();
  }

  const project = generateProjectFromUrl(url);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 md:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-sky-300/80">
                Client concept preview
              </p>
              <h1 className="mt-1 text-lg font-semibold">{project.siteProfile.companyName}</h1>
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/75">
              Ehdotusversio asiakkaalle
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Prepared for
              </p>
              <p className="mt-2 text-2xl font-semibold">{project.siteProfile.companyName}</p>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Tämä konsepti on rakennettu URL:n perusteella demoksi siitä, miltä
                yrityksen etusivu voisi näyttää selkeämpänä, uskottavampana ja
                paremmin konversiota tukevana versiona.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Source URL
              </p>
              <p className="mt-2 break-all text-sm text-sky-300/90">
                {project.sourceUrl}
              </p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Audit summary
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Pääviesti, toimintakehotteet ja luottamuselementit pitää nostaa
                  näkyvämmäksi, jotta sivu toimii paremmin myynnin tukena eikä jää
                  pelkäksi olemassaolon todisteeksi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 md:px-10">
        <PreviewSectionRenderer project={project} />
      </div>
    </main>
  );
}
