import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { STYLE_PRESETS } from "@/lib/mock/style-presets";

type NewProjectPageProps = {
  searchParams: Promise<{
    url?: string;
    stylePreset?: string;
  }>;
};

export default async function NewProjectPage({
  searchParams
}: NewProjectPageProps) {
  const { url, stylePreset } = await searchParams;
  const sourceUrl = url || "https://example-company.fi";
  const resolvedStylePreset =
    stylePreset && stylePreset in STYLE_PRESETS ? stylePreset : "premium-dark";
  const preset = STYLE_PRESETS[resolvedStylePreset];

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:px-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Mock generation flow
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Uuden projektin valmistelu
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
            Tämä näkymä simuloi vaihetta, jossa käyttäjän antama URL haettaisiin,
            jäsennettäisiin ja muutettaisiin auditiksi sekä redesign-ehdotukseksi.
            Tässä MVP-vaiheessa emme vielä tee oikeaa fetch/parsing/analyysi-putkea.
          </p>
        </section>

        <section className="grid gap-4">
          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              Source URL
            </p>
            <p className="mt-3 break-all text-lg font-semibold text-white">
              {sourceUrl}
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              Selected style preset
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              {preset.label}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
              {preset.description}
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">What the real pipeline will do</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                "Fetch the source page HTML",
                "Extract visible structure and copy",
                "Detect weak messaging and UX issues",
                "Generate a clearer homepage structure",
                "Write stronger replacement copy",
                "Render a client-facing concept preview"
              ].map((step) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-white/80"
                >
                  {step}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Current MVP status</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
              Oikea uusi projekti luotaisiin tähän vaiheeseen vasta sen jälkeen, kun
              URL-fetch, HTML parsing ja schema-pohjainen output on toteutettu.
              Tällä hetkellä jatkoreitti ohjaa generoituihin mock-näkymiin, jotta koko
              käyttövirta voidaan testata jo ennen backend-työtä.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/projects/generated?url=${encodeURIComponent(sourceUrl)}&stylePreset=${encodeURIComponent(resolvedStylePreset)}`}
                className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Avaa generoitu projekti
              </Link>

              <Link
                href={`/projects/generated/preview?url=${encodeURIComponent(sourceUrl)}&stylePreset=${encodeURIComponent(resolvedStylePreset)}`}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Avaa preview suoraan
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
