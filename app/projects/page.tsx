import Link from "next/link";
import { mockProjects } from "@/lib/mock/projects";

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Projektit</h1>

      <div className="grid gap-4">
        {mockProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block border rounded-xl p-5 hover:bg-neutral-50"
          >
            <h2 className="text-2xl font-semibold">
              {project.siteProfile.companyName}
            </h2>

            <p className="text-sm text-neutral-600 mt-1">
              {project.businessSummary}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
