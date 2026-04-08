"use client";

import { useMemo, useState } from "react";
import type { RedesignBrief } from "@/lib/briefs/redesign-brief";
import { BriefCopyButton } from "./brief-copy-button";

type Props = {
  brief: RedesignBrief;
};

export function GeneratedBriefWorkspaceClient({ brief }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    brief.assets.detectedImages.filter((image) => image.selected).map((image) => image.id)
  );

  function toggleImage(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  const effectiveBrief = useMemo<RedesignBrief>(() => {
    const detectedImages = brief.assets.detectedImages.map((image) => ({
      ...image,
      selected: selectedIds.includes(image.id)
    }));

    const selectedImages = detectedImages.filter((image) => image.selected);

    return {
      ...brief,
      assets: {
        ...brief.assets,
        detectedImages,
        heroImageCandidates: selectedImages
          .filter((image) => image.kind === "hero" || image.kind === "gallery")
          .map((image) => image.url),
        logoCandidates: selectedImages
          .filter((image) => image.kind === "logo")
          .map((image) => image.url),
        galleryImages: selectedImages
          .filter((image) => image.kind === "gallery" || image.kind === "service" || image.kind === "other")
          .map((image) => image.url),
        pageImages: brief.assets.pageImages.filter((image) =>
          selectedImages.some((selected) => selected.url === image.url)
        )
      }
    };
  }, [brief, selectedIds]);

  const briefText = JSON.stringify(effectiveBrief, null, 2);

  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.18em] text-white/40">
                Asset selection
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Valitse käytettävät kuvat
              </h2>
            </div>

            <p className="text-sm text-white/50">
              Valittu {selectedIds.length}/{brief.assets.detectedImages.length}
            </p>
          </div>

          {brief.assets.detectedImages.length === 0 ? (
            <p className="mt-4 text-sm leading-6 text-white/60">
              Kuvia ei löytynyt tästä lähteestä.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {brief.assets.detectedImages.map((image) => {
                const checked = selectedIds.includes(image.id);

                return (
                  <label
                    key={image.id}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20"
                  >
                    <div className="aspect-[4/3] bg-black/30">
                      <img
                        src={image.url}
                        alt={image.label || image.id}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-3 p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleImage(image.id)}
                          className="mt-1 h-4 w-4"
                        />

                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-medium text-white">
                            {image.label || "Detected image"}
                          </p>
                          <p className="text-xs uppercase tracking-[0.12em] text-white/40">
                            {image.kind || "other"}
                          </p>
                          <p className="break-all text-xs leading-5 text-white/35">
                            {image.url}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <BriefCopyButton text={briefText} label="Kopioi brief valituilla kuvilla" />
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-black/20 p-5">
          <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-white/85">
            {briefText}
          </pre>
        </div>
      </div>
    </section>
  );
}
