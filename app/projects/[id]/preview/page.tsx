import { notFound } from "next/navigation";
import { PreviewSectionRenderer } from "@/components/projects/preview-section-renderer";
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
            <h1 className="mt-1 text-lg font-semibold">{project.siteProfile.companyName}</h1>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/75">
            Ehdotusversio asiakkaalle
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10 md:px-10">
        {project.redesign.sections.map((section, index) => (
          <PreviewSectionRenderer
            key={`${section.type}-${index}`}
            section={section}
            index={index}
            project={project}
          />
        ))}
      </div>
    </main>
  );
}