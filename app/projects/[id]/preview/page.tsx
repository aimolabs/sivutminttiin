import { getProjectById } from "@/lib/mock/projects";
import { notFound } from "next/navigation";
import { PreviewSectionRenderer } from "@/components/projects/preview-section-renderer";

type Props = {
  params: { id: string };
};

export default function PreviewPage({ params }: Props) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-lg font-semibold">
            {project.siteProfile.companyName}
          </h1>
          <p className="text-sm text-neutral-500">
            Konseptin esikatselu
          </p>
        </div>

        <PreviewSectionRenderer project={project} />
      </div>
    </div>
  );
}
