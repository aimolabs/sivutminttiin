"use client";

import { useMemo, useState } from "react";
import { Project } from "@/lib/mock/projects";
import { PreviewSectionRenderer } from "@/components/projects/preview-section-renderer";

type Props = {
  project: Project;
};

export function ProjectPreview({ project }: Props) {
  const defaultPageId =
    project.sitemap.find((item) => item.isPrimary)?.pageId ??
    project.pages[0]?.pageId ??
    "";

  const [activePageId, setActivePageId] = useState(defaultPageId);

  const activePage = useMemo(() => {
    return (
      project.pages.find((page) => page.pageId === activePageId) ??
      project.pages[0] ??
      null
    );
  }, [activePageId, project.pages]);

  if (!activePage) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Client-facing preview
        </p>

        <div className="flex flex-wrap gap-2">
          {project.sitemap.map((item) => {
            const isActive = item.pageId === activePage.pageId;

            return (
              <button
                key={item.pageId}
                type="button"
                onClick={() => setActivePageId(item.pageId)}
                className={
                  isActive
                    ? "rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
                    : "rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700"
                }
              >
                {item.navigationLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              {activePage.pageType}
            </p>
            <h2 className="text-2xl font-semibold text-neutral-950">
              {activePage.title}
            </h2>
            <p className="max-w-2xl text-sm text-neutral-600">
              {activePage.purpose}
            </p>
          </div>

          <div className="min-w-[260px] rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
            <p className="font-medium text-neutral-900">SEO snapshot</p>
            <div className="mt-3 space-y-2 text-neutral-600">
              <p>
                <span className="font-medium text-neutral-900">Slug:</span>{" "}
                {activePage.slug}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Title:</span>{" "}
                {activePage.pageSEO.title}
              </p>
              <p>
                <span className="font-medium text-neutral-900">H1:</span>{" "}
                {activePage.pageSEO.h1}
              </p>
            </div>
          </div>
        </div>

        <PreviewSectionRenderer project={project} pageId={activePage.pageId} />
      </div>
    </section>
  );
}
