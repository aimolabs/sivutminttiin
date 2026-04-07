import { SiteHeader } from "@/components/layout/site-header";
import { GenerateProjectForm } from "@/components/projects/generate-project-form";
import { ProjectListClient } from "@/components/projects/project-list-client";
import { mockProjects } from "@/lib/mock/projects";
import { mapProjectToListItem } from "@/lib/projects/project-list-items";

export default function HomePage() {
  const baseItems = mockProjects.map(mapProjectToListItem);

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14">
        <section className="flex justify-center">
          <div className="w-full max-w-3xl">
            <GenerateProjectForm />
          </div>
        </section>

        <ProjectListClient baseItems={baseItems} />
      </div>
    </main>
  );
}
