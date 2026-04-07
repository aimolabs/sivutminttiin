import { Project, ProjectSection } from "@/lib/mock/projects";
import { STYLE_PRESETS, type StylePresetId } from "@/lib/mock/style-presets";

type Props = {
  project: Project;
  pageId: string;
};

function resolveCtaLabels(project: Project, section: ProjectSection): string[] {
  return section.ctaIds
    .map((ctaId) => project.ctas.find((cta) => cta.id === ctaId)?.label)
    .filter((label): label is string => Boolean(label));
}

function resolveTrustItems(project: Project, section: ProjectSection) {
  return section.trustItemIds
    .map((trustId) => project.trustItems.find((item) => item.id === trustId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function PreviewSectionRenderer({ project, pageId }: Props) {
  const page =
    project.pages.find((candidate) => candidate.pageId === pageId) ??
    project.pages[0] ??
    null;

  if (!page) {
    return null;
  }

  const stylePresetId = project.input.stylePreset as StylePresetId;
  const preset = STYLE_PRESETS[stylePresetId];

  const isDark = preset.visual.theme === "dark";

  const pageClasses = isDark
    ? "space-y-16 rounded-[2rem] bg-neutral-950 p-8 text-white md:p-12"
    : "space-y-16 rounded-[2rem] bg-white p-8 text-neutral-950 md:p-12";

  const mutedTextClasses = isDark ? "text-neutral-400" : "text-neutral-600";
  const subtleTextClasses = isDark ? "text-neutral-500" : "text-neutral-500";

  const cardClasses = isDark
    ? "space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4"
    : "space-y-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4";

  const secondaryButtonClasses = isDark
    ? "rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white"
    : "rounded-full border border-neutral-300 px-5 py-3 text-sm text-neutral-900";

  const primaryButtonClasses =
    preset.copy.ctaStyle === "aggressive"
      ? "rounded-full bg-blue-600 px-5 py-3 text-sm text-white"
      : isDark
        ? "rounded-full bg-white px-5 py-3 text-sm text-black"
        : "rounded-full bg-black px-5 py-3 text-sm text-white";

  const ctaSectionClasses = isDark
    ? "space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-8"
    : "space-y-4 rounded-[2rem] bg-neutral-100 p-8";

  return (
    <div className={pageClasses}>
      {page.sections.map((section) => {
        const ctaLabels = resolveCtaLabels(project, section);
        const trustItems = resolveTrustItems(project, section);

        switch (section.type) {
          case "hero":
            return (
              <section key={section.id} className="space-y-6">
                <div className="space-y-4">
                  {section.eyebrow ? (
                    <p className={`text-sm ${mutedTextClasses}`}>{section.eyebrow}</p>
                  ) : null}

                  <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
                    {section.heading}
                  </h1>

                  {section.body ? (
                    <p className={`max-w-2xl text-lg ${mutedTextClasses}`}>
                      {section.body}
                    </p>
                  ) : null}
                </div>

                {ctaLabels.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {ctaLabels[0] ? (
                      <button className={primaryButtonClasses}>{ctaLabels[0]}</button>
                    ) : null}
                    {ctaLabels[1] ? (
                      <button className={secondaryButtonClasses}>{ctaLabels[1]}</button>
                    ) : null}
                  </div>
                ) : null}

                <p className={`pt-2 text-xs ${subtleTextClasses}`}>
                  Konsepti suunniteltu yritykselle{" "}
                  <span className="font-semibold">{project.siteProfile.companyName}</span>
                </p>
              </section>
            );

          case "services":
            return (
              <section key={section.id} className="space-y-6">
                <h2 className="text-2xl font-semibold md:text-3xl">{section.heading}</h2>

                {section.items?.length ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {section.items.map((item) => (
                      <div key={item.id} className={cardClasses}>
                        <h3 className="font-medium">{item.title}</h3>
                        {item.body ? (
                          <p className={`text-sm ${mutedTextClasses}`}>{item.body}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            );

          case "about":
          case "content":
          case "faq":
            return (
              <section key={section.id} className="max-w-3xl space-y-4">
                <h2 className="text-2xl font-semibold md:text-3xl">{section.heading}</h2>
                {section.body ? <p className={mutedTextClasses}>{section.body}</p> : null}
              </section>
            );

          case "testimonials":
            return (
              <section key={section.id} className="space-y-6">
                <h2 className="text-2xl font-semibold md:text-3xl">{section.heading}</h2>

                {trustItems.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {trustItems.map((item) => (
                      <div key={item.id} className={cardClasses}>
                        {item.body ? <p className="text-sm leading-6">"{item.body}"</p> : null}
                        {item.title ? (
                          <p className={`text-xs ${subtleTextClasses}`}>{item.title}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            );

          case "cta":
            return (
              <section key={section.id} className={ctaSectionClasses}>
                <h2 className="text-2xl font-semibold md:text-3xl">{section.heading}</h2>
                {section.body ? <p className={mutedTextClasses}>{section.body}</p> : null}

                {ctaLabels[0] ? (
                  <div>
                    <button className={primaryButtonClasses}>{ctaLabels[0]}</button>
                  </div>
                ) : null}
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
