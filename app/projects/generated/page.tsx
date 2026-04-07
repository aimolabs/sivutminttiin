import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { StatusBadge } from "@/components/projects/status-badge";
import { ProjectAuditGrid } from "@/components/projects/project-audit-grid";
import { ProjectSummaryCard } from "@/components/projects/project-summary-card";
import { STYLE_PRESETS, type StylePresetId } from "@/lib/mock/style-presets";
import { buildProjectFromSourceSnapshot } from "@/lib/mock/generate-from-url";
import { fetchSourceSnapshot } from "@/lib/source/fetch-source-snapshot";
import { normalizeSourceSnapshot } from "@/lib/source/normalize-source-snapshot";

type GeneratedProjectPageProps = {
  searchParams: Promise<{
    url?: string;
    stylePreset?: string;
  }>;
};

const PRESET_ORDER: StylePresetId[] = [
  "premium-dark",
  "minimal-trust",
  "bold-modern",
  "editorial-clean"
];

export default async function GeneratedProjectPage({
  searchParams
}: GeneratedProjectPageProps) {
  const { url, stylePreset } = await searchParams;

  if (!url) {
    notFound();
  }

  const rawSnapshot = await fetchSourceSnapshot(url);
  const normalizedSnapshot = normalizeSourceSnapshot(rawSnapshot);
  const project = buildProjectFromSourceSnapshot(rawSnapshot, { stylePreset });
  const activeStylePreset = STYLE_PRESETS[project.styleDirection.stylePresetId as StylePresetId];

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
                Generated concept project
              </p>

              <div className="mt-3 flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  {project.siteProfile.companyName}
                </h1>
                <StatusBadge status={project.status} />
              </div>

              <p className="mt-4 break-all text-sm text-sky-300/80">
                {project.sourceUrl}
              </p>

              <p className="mt-5 text-base leading-7 text-white/75">
                {project.businessSummary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/projects/generated/preview?url=${encodeURIComponent(url)}&stylePreset=${project.styleDirection.stylePresetId}`}
                className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Avaa client preview
              </Link>

              <Link
                href="/projects"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Takaisin projekteihin
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Choose style direction
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {PRESET_ORDER.map((presetId) => {
              const preset = STYLE_PRESETS[presetId];
              const isActive = presetId === project.styleDirection.stylePresetId;

              return (
                <Link
                  key={preset.id}
                  href={`/projects/generated?url=${encodeURIComponent(url)}&stylePreset=${preset.id}`}
                  className={
                    isActive
                      ? "rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950"
                      : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
                  }
                >
                  {preset.label}
                </Link>
              );
            })}
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            Valittu suunta:{" "}
            <span className="font-semibold text-white">
              {activeStylePreset.label}
            </span>
            . Tämä vaikuttaa sekä previewn visuaaliseen tunnelmaan että generoitujen
            tekstien sävyyn.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              Source snapshot status
            </p>
            <p className="mt-3 text-sm leading-7 text-white/70">
              {normalizedSnapshot.fetchStatus === "live"
                ? "Sivun oikea HTML haettiin onnistuneesti ja konsepti rakennettiin puhdistettujen source-signaalien pohjalta."
                : "Livenä haettavaa sivudataa ei saatu. Konsepti rakennettiin fallback-logiikalla URL:n pohjalta."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              Why this matters
            </p>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Nyt järjestelmä ei enää nojaa pelkkään domain-arvaukseen eikä myöskään
              suoraan likaiseen HTML-raakadataan, vaan käyttää puhdistettuja signaaleja
              konseptin muodostamiseen.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Generated sitemap
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {project.sitemap.map((page) => (
              <div
                key={page.pageId}
                className="rounded-2xl border border-white/10 bg-black/10 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  {page.pageType}
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {page.title}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {page.slug}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  {page.purpose}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            SEO foundation
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Site name
              </p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {project.siteSEO.siteName}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Canonical domain
              </p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {project.siteSEO.canonicalDomain}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {project.pages.map((page) => (
              <div
                key={page.pageId}
                className="rounded-2xl border border-white/10 bg-black/10 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  {page.pageType}
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {page.pageSEO.title}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {page.pageSEO.slug}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/80">
                  {page.pageSEO.metaDescription}
                </p>
                <p className="mt-2 text-sm text-white/60">
                  H1: {page.pageSEO.h1}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Observed signals
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Company name candidate
              </p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {normalizedSnapshot.companyNameCandidate || "Ei löytynyt"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Page title
              </p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {normalizedSnapshot.pageTitle || "Ei löytynyt"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                Meta description
              </p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {normalizedSnapshot.metaDescription || "Ei löytynyt"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                H1
              </p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {normalizedSnapshot.h1 || "Ei löytynyt"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              CTA signals
            </p>
            <p className="mt-3 text-sm leading-7 text-white/80">
              {normalizedSnapshot.ctaTexts.length > 0
                ? normalizedSnapshot.ctaTexts.join(" · ")
                : "Ei löytynyt"}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              H2 headings
            </p>
            <p className="mt-3 text-sm leading-7 text-white/80">
              {normalizedSnapshot.h2s.length > 0
                ? normalizedSnapshot.h2s.join(" · ")
                : "Ei löytynyt"}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              Usable text summary
            </p>
            <p className="mt-3 text-sm leading-7 text-white/80">
              {normalizedSnapshot.usableTextSummary || "Ei löytynyt"}
            </p>
          </div>
        </section>

        <ProjectSummaryCard project={project} />
        <ProjectAuditGrid project={project} />

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Style direction
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            {activeStylePreset.description}
          </p>
        </section>
      </div>
    </main>
  );
}
