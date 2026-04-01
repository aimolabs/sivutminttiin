import type { RedesignSection } from "./projects";
import type { StylePresetId } from "./style-presets";

type SectionMap = {
  hero: Extract<RedesignSection, { type: "hero" }>;
  services: Extract<RedesignSection, { type: "services" }>;
  about: Extract<RedesignSection, { type: "about" }>;
  testimonials: Extract<RedesignSection, { type: "testimonials" }>;
  cta: Extract<RedesignSection, { type: "cta" }>;
};

export function buildSectionPlan(
  stylePreset: StylePresetId,
  sections: SectionMap
): RedesignSection[] {
  switch (stylePreset) {
    case "premium-dark":
      return [
        sections.hero,
        sections.testimonials,
        sections.services,
        sections.about,
        sections.cta
      ];

    case "bold-modern":
      return [
        sections.hero,
        sections.services,
        sections.cta,
        sections.about,
        sections.testimonials
      ];

    case "editorial-clean":
      return [
        sections.hero,
        sections.about,
        sections.services,
        sections.testimonials,
        sections.cta
      ];

    case "minimal-trust":
      return [
        sections.hero,
        sections.about,
        sections.testimonials,
        sections.services,
        sections.cta
      ];

    default:
      return [
        sections.hero,
        sections.services,
        sections.about,
        sections.testimonials,
        sections.cta
      ];
  }
}
