import { Project, ProjectSection } from "@/lib/mock/projects";
import { STYLE_PRESETS, type StylePresetId } from "@/lib/mock/style-presets";

type Props = {
  project: Project;
  pageId: string;
};

function resolveCtas(project: Project, section: ProjectSection) {
  return section.ctaIds
    .map((ctaId) => project.ctas.find((cta) => cta.id === ctaId))
    .filter((cta): cta is NonNullable<typeof cta> => Boolean(cta));
}

function resolveTrustItems(project: Project, section: ProjectSection) {
  return section.trustItemIds
    .map((trustId) => project.trustItems.find((item) => item.id === trustId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function getPage(project: Project, pageId: string) {
  return (
    project.pages.find((candidate) => candidate.pageId === pageId) ??
    project.pages[0] ??
    null
  );
}

function getNavItems(project: Project) {
  return project.sitemap.filter((item) => item.navVisible);
}

export function PreviewSectionRenderer({ project, pageId }: Props) {
  const page = getPage(project, pageId);

  if (!page) {
    return null;
  }

  const stylePresetId = project.input.stylePreset as StylePresetId;
  const preset = STYLE_PRESETS[stylePresetId];
  const isDark = preset.visual.theme === "dark";

  const shellClasses = isDark
    ? "overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-950 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
    : "overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white text-neutral-950 shadow-[0_20px_80px_rgba(0,0,0,0.08)]";

  const topBarClasses = isDark
    ? "border-b border-white/10 bg-neutral-950/95"
    : "border-b border-neutral-200 bg-white/95";

  const navLinkClasses = isDark
    ? "text-sm text-white/65"
    : "text-sm text-neutral-600";

  const bodyMutedClasses = isDark ? "text-white/68" : "text-neutral-600";
  const subtleClasses = isDark ? "text-white/45" : "text-neutral-500";

  const sectionBorderClasses = isDark
    ? "border-white/10"
    : "border-neutral-200";

  const surfaceClasses = isDark
    ? "border border-white/10 bg-white/[0.04]"
    : "border border-neutral-200 bg-neutral-50";

  const primaryButtonClasses =
    preset.copy.ctaStyle === "aggressive"
      ? "inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
      : isDark
        ? "inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
        : "inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white";

  const secondaryButtonClasses = isDark
    ? "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white"
    : "inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900";

  const navItems = getNavItems(project);
  const heroSection = page.sections.find((section) => section.type === "hero");

  return (
    <div className={shellClasses}>
      <div className={topBarClasses}>
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-8">
          <div className="space-y-1">
            <p className={`text-xs uppercase tracking-[0.24em] ${subtleClasses}`}>
              {project.siteProfile.industry}
            </p>
            <p className="text-lg font-semibold tracking-tight">
              {project.siteProfile.companyName}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 md:gap-6">
            {navItems.map((item) => (
              <span
                key={item.pageId}
                className={
                  item.pageId === page.pageId
                    ? "text-sm font-medium"
                    : navLinkClasses
                }
              >
                {item.navigationLabel}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="px-6 py-8 md:px-8 md:py-10">
        <div className="space-y-20 md:space-y-24">
          {page.sections.map((section, index) => {
            const ctas = resolveCtas(project, section);
            const trustItems = resolveTrustItems(project, section);

            switch (section.type) {
              case "hero":
                return (
                  <section
                    key={section.id}
                    className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end"
                  >
                    <div className="space-y-6">
                      {section.eyebrow ? (
                        <p className={`text-sm uppercase tracking-[0.22em] ${subtleClasses}`}>
                          {section.eyebrow}
                        </p>
                      ) : null}

                      <h1 className="max-w-4xl text-4xl font-semibold leading-[1.04] tracking-tight md:text-6xl">
                        {section.heading}
                      </h1>

                      {section.body ? (
                        <p className={`max-w-2xl text-base leading-7 md:text-lg ${bodyMutedClasses}`}>
                          {section.body}
                        </p>
                      ) : null}

                      {ctas.length > 0 ? (
                        <div className="flex flex-wrap gap-3 pt-2">
                          {ctas[0] ? (
                            <span className={primaryButtonClasses}>{ctas[0].label}</span>
                          ) : null}
                          {ctas[1] ? (
                            <span className={secondaryButtonClasses}>{ctas[1].label}</span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className={`rounded-[2rem] p-6 md:p-7 ${surfaceClasses}`}>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
                            Concept direction
                          </p>
                          <h2 className="text-2xl font-semibold tracking-tight">
                            {project.styleDirection.visualTone}
                          </h2>
                          <p className={`text-sm leading-6 ${bodyMutedClasses}`}>
                            Tämä preview näyttää miten yrityksen uusi sivu voi näyttää
                            uskottavalta, selkeältä ja kaupallisesti vahvemmalta.
                          </p>
                        </div>

                        <div className={`grid gap-3 border-t pt-5 ${sectionBorderClasses}`}>
                          <div className="grid gap-1">
                            <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>
                              Audience
                            </p>
                            <p className="text-sm font-medium">{project.siteProfile.audience}</p>
                          </div>

                          <div className="grid gap-1">
                            <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>
                              Primary topic
                            </p>
                            <p className="text-sm font-medium">{page.pageSEO.primaryTopic}</p>
                          </div>

                          <div className="grid gap-1">
                            <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>
                              Primary CTA
                            </p>
                            <p className="text-sm font-medium">
                              {project.ctas.find((cta) => cta.id === "cta-home-primary")?.label ??
                                "Ota yhteyttä"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );

              case "services":
                return (
                  <section key={section.id} className="space-y-8">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                      <div className="space-y-3">
                        <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
                          Section {index + 1}
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                          {section.heading}
                        </h2>
                        {section.body ? (
                          <p className={`max-w-2xl text-base leading-7 ${bodyMutedClasses}`}>
                            {section.body}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {section.items?.length ? (
                      <div className="grid gap-4 md:grid-cols-3">
                        {section.items.map((item) => (
                          <div
                            key={item.id}
                            className={`rounded-[1.75rem] p-6 ${surfaceClasses}`}
                          >
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h3 className="text-xl font-semibold tracking-tight">
                                  {item.title}
                                </h3>
                                {item.body ? (
                                  <p className={`text-sm leading-6 ${bodyMutedClasses}`}>
                                    {item.body}
                                  </p>
                                ) : null}
                              </div>

                              <div className={`border-t pt-4 ${sectionBorderClasses}`}>
                                <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>
                                  Service focus
                                </p>
                              </div>
                            </div>
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
                  <section
                    key={section.id}
                    className={`grid gap-8 border-t pt-16 md:grid-cols-[0.9fr_1.1fr] ${sectionBorderClasses}`}
                  >
                    <div className="space-y-3">
                      <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
                        Supporting section
                      </p>
                      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                        {section.heading}
                      </h2>
                    </div>

                    <div className={`rounded-[1.75rem] p-6 md:p-7 ${surfaceClasses}`}>
                      {section.body ? (
                        <p className={`text-base leading-7 md:text-lg ${bodyMutedClasses}`}>
                          {section.body}
                        </p>
                      ) : null}
                    </div>
                  </section>
                );

              case "testimonials":
                return (
                  <section key={section.id} className="space-y-8">
                    <div className="space-y-3">
                      <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
                        Trust
                      </p>
                      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                        {section.heading}
                      </h2>
                    </div>

                    {trustItems.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {trustItems.map((item) => (
                          <div
                            key={item.id}
                            className={`rounded-[1.75rem] p-6 md:p-7 ${surfaceClasses}`}
                          >
                            <div className="space-y-5">
                              {item.body ? (
                                <p className="text-base leading-7 md:text-lg">
                                  “{item.body}”
                                </p>
                              ) : null}

                              <div className={`border-t pt-4 ${sectionBorderClasses}`}>
                                <p className={`text-sm font-medium ${subtleClasses}`}>
                                  {item.title ?? "Luottamussignaali"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </section>
                );

              case "cta":
                return (
                  <section key={section.id}>
                    <div
                      className={`rounded-[2rem] p-7 md:p-10 ${surfaceClasses}`}
                    >
                      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
                        <div className="space-y-4">
                          <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
                            Next step
                          </p>
                          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                            {section.heading}
                          </h2>
                          {section.body ? (
                            <p className={`max-w-2xl text-base leading-7 ${bodyMutedClasses}`}>
                              {section.body}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-3 md:justify-end">
                          {ctas[0] ? (
                            <span className={primaryButtonClasses}>{ctas[0].label}</span>
                          ) : null}
                          {heroSection ? (
                            <span className={secondaryButtonClasses}>
                              Palaa sivun alkuun
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
