import { MockGenerateActions } from "@/components/forms/mock-generate-actions";

type UrlInputCardProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  mockUrl?: string;
};

export function UrlInputCard({
  title = "Luo uusi redesign-projekti",
  description = "Syötä yrityksen nettisivun osoite. Tässä vaiheessa URL:stä muodostetaan mock-konsepti, jotta koko flow voidaan testata ennen oikeaa scrapingia ja analyysiä.",
  buttonLabel = "Generate concept",
  mockUrl = "https://www.rakennuslaine.fi"
}: UrlInputCardProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
          New project
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
          {description}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <input
          type="url"
          defaultValue={mockUrl}
          placeholder="https://yritys.fi"
          className="min-h-13 w-full rounded-full border border-white/10 bg-black/20 px-5 text-sm text-white outline-none placeholder:text-white/35"
        />

        <button
          type="button"
          className="min-h-13 shrink-0 rounded-full bg-sky-300 px-6 text-sm font-semibold text-slate-950 transition hover:opacity-90"
        >
          {buttonLabel}
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-xs leading-6 text-white/55">
        Tämä ei vielä tee oikeaa sivuanalyysiä. Seuraava vaihe rakentaa annetusta
        URL:stä uskottavan mock-projektin ja asiakkaalle näytettävän preview’n.
      </div>

      <MockGenerateActions url={mockUrl} />
    </section>
  );
}
