export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">
              Internal MVP
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
              sivutminttiin
            </h1>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            GitHub + Vercel MVP
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
              Website redesign proposal tool
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              Syötä yrityksen sivu. Luo siitä parempi ehdotus.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              Ensimmäinen versio keskittyy yhteen asiaan:
              URL-pohjainen redesign-konsepti, joka voidaan näyttää asiakkaalle
              selkeänä ehdotuksena.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/projects/demo"
                className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Avaa demo-projekti
              </a>

              <a
                href="#next-steps"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Katso seuraavat askeleet
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-white">Phase 1 scope</p>

            <div className="mt-5 space-y-4">
              {[
                "Etusivu",
                "Sisäinen dashboard",
                "Yksi mock-projekti",
                "Yksi client preview -sivu"
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

        <section
          id="next-steps"
          className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-3"
        >
          {[
            {
              title: "1. Rakenne",
              text: "Luodaan projektilista, yksittäinen projektisivu ja asiakaspreview."
            },
            {
              title: "2. Mock-data",
              text: "Rakennetaan ensimmäinen demoprojekti staattisella datalla."
            },
            {
              title: "3. Deploy",
              text: "Kytketään repo Verceliin vasta kun runko on kunnossa."
            }
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-white/10 bg-black/10 p-5"
            >
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">{card.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}