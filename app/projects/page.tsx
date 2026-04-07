import { SiteHeader } from "@/components/layout/site-header";
import { ProjectListClient } from "@/components/projects/project-list-client";
import { mockProjects } from "@/lib/mock/projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14">
        <section className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Project workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Projektit
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-white/65 md:text-base">
            Tämä näkymä näyttää kaikki redesign-projektit samassa rakenteessa kuin
            etusivun dashboard. Järjestys, tila ja yrityskohtainen konteksti pitää
            olla nopeasti hahmotettavissa.
          </p>
        </section>

        <ProjectListClient projects={mockProjects} />
      </div>
    </main>
  );
}
