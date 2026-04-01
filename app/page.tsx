import Link from "next/link";
import { UrlInputCard } from "@/components/forms/url-input-card";
import { SiteHeader } from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14">
        <section className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">
              Website redesign proposal tool
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Muuta heikot nettisivut vakuuttavaksi redesign-ehdotukseksi.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              Työkalu on tarkoitettu myyntikäyttöön. Syötetään yrityksen nykyinen
              sivu, muodostetaan siitä audit-ajattelu ja rakennetaan asiakasta varten
              selkeä preview-konsepti.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Avaa projektit
              </Link>

              <Link
                href="/projects/demo/preview"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Katso demo-preview
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
            <p className="text-sm font-semibold text-white">MVP scope</p>

            <div className="mt-5 space-y-4">
              {[
                "Homepage redesign only",
                "Internal dashboard workflow",
                "One client-facing concept preview",
                "Mock generation before real scraping",
                "Schema-style sections, not raw AI HTML"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <UrlInputCard />

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "1. Source page in",
              text: "Yrityksen nykyinen URL toimii lähtöpisteenä auditille ja uudelle konseptille."
            },
            {
              title: "2. Clearer structure out",
              text: "Työkalu muuttaa sekavan sivun ymmärrettävämmäksi viestinnäksi ja rakenteeksi."
            },
            {
              title: "3. Client preview ready",
              text: "Lopputulos on jaettava preview-linkki, jolla redesign voidaan näyttää asiakkaalle."
            }
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">{card.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}