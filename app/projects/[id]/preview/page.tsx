import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/mock/projects";

type PreviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300/80">
              Concept preview
            </p>
            <h1 className="mt-1 text-lg font-semibold">{project.companyName}</h1>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/75">
            Ehdotusversio asiakkaalle
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 md:px-10">
        {project.redesign.sections.map((section, index) => {
          if (section.type === "hero") {
            return (
              <section
                key={`${section.type}-${index}`}
                className="grid gap-8 border-b border-white/10 py-16 md:grid-cols-[1.2fr_0.8fr]"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
                    {section.eyebrow}
                  </p>

                  <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
                    {section.headline}
                  </h2>

                  <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                    {section.subheadline}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950">
                      {section.primaryCta}
                    </button>
                    <button className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90">
                      {section.secondaryCta}
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
                    Preview note
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/70">
                    Tämä on konseptiversio, jonka tarkoitus on näyttää miten
                    yrityksen verkkosivun rakenne, hierarkia ja yleisilme voidaan
                    nostaa uskottavammalle tasolle.
                  </p>
                </div>
              </section>
            );
          }

          if (section.type === "services") {
            return (
              <section
                key={`${section.type}-${index}`}
                className="border-b border-white/10 py-16"
              >
                <h2 className="text-3xl font-semibold md:text-4xl">{section.title}</h2>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {section.items.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="mt-4 text-sm leading-6 text-white/70">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === "about") {
            return (
              <section
                key={`${section.type}-${index}`}
                className="border-b border-white/10 py-16"
              >
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-semibold md:text-4xl">{section.title}</h2>
                  <p className="mt-6 text-base leading-8 text-white/70">
                    {section.body}
                  </p>
                </div>
              </section>
            );
          }

          if (section.type === "testimonials") {
            return (
              <section
                key={`${section.type}-${index}`}
                className="border-b border-white/10 py-16"
              >
                <h2 className="text-3xl font-semibold md:text-4xl">{section.title}</h2>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {section.items.map((item) => (
                    <article
                      key={item.name}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                      <p className="text-base leading-7 text-white/80">“{item.quote}”</p>
                      <p className="mt-4 text-sm font-medium text-sky-300/80">
                        {item.name}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === "cta") {
            return (
              <section key={`${section.type}-${index}`} className="py-16">
                <div className="rounded-[2rem] border border-white/10 bg-sky-300/10 p-8 md:p-10">
                  <h2 className="text-3xl font-semibold md:text-4xl">{section.title}</h2>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
                    {section.body}
                  </p>
                  <button className="mt-8 rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950">
                    {section.button}
                  </button>
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </main>
  );
}