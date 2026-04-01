import { Project } from "@/lib/mock/projects";
import { STYLE_PRESETS } from "@/lib/mock/style-presets";

type Props = {
  project: Project;
};

export function PreviewSectionRenderer({ project }: Props) {
  const preset = STYLE_PRESETS[project.redesign.stylePreset];

  const isDark = preset.visual.theme === "dark";

  const pageClasses = isDark
    ? "space-y-16 rounded-[2rem] bg-neutral-950 text-white p-8 md:p-12"
    : "space-y-16 rounded-[2rem] bg-white text-neutral-950 p-8 md:p-12";

  const mutedTextClasses = isDark ? "text-neutral-400" : "text-neutral-600";

  const subtleTextClasses = isDark ? "text-neutral-500" : "text-neutral-500";

  const cardClasses = isDark
    ? "rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2"
    : "rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-2";

  const secondaryButtonClasses = isDark
    ? "px-5 py-3 rounded-full text-sm border border-white/15 bg-white/5 text-white"
    : "px-5 py-3 rounded-full text-sm border border-neutral-300 text-neutral-900";

  const primaryButtonClasses =
    preset.copy.ctaStyle === "aggressive"
      ? "px-5 py-3 rounded-full text-sm bg-blue-600 text-white"
      : isDark
        ? "px-5 py-3 rounded-full text-sm bg-white text-black"
        : "px-5 py-3 rounded-full text-sm bg-black text-white";

  const ctaSectionClasses = isDark
    ? "rounded-[2rem] border border-white/10 bg-white/5 p-8 space-y-4"
    : "rounded-[2rem] bg-neutral-100 p-8 space-y-4";

  return (
    <div className={pageClasses}>
      {project.redesign.sections.map((section, index) => {
        switch (section.type) {
          case "hero":
            return (
              <section key={index} className="space-y-6">
                <div className="space-y-3">
                  <p className={`text-sm ${mutedTextClasses}`}>
                    {project.siteProfile.industry}
                  </p>

                  <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
                    {section.headline.replace(
                      "Uudellamaalla",
                      project.siteProfile.audience
                    )}
                  </h1>

                  <p className={`max-w-2xl text-lg ${mutedTextClasses}`}>
                    {section.subheadline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className={primaryButtonClasses}>
                    {section.primaryCta}
                  </button>
                  <button className={secondaryButtonClasses}>
                    {section.secondaryCta}
                  </button>
                </div>

                <p className={`pt-2 text-xs ${subtleTextClasses}`}>
                  Konsepti suunniteltu yritykselle{" "}
                  <span className="font-semibold">
                    {project.siteProfile.companyName}
                  </span>
                </p>
              </section>
            );

          case "services":
            return (
              <section key={index} className="space-y-6">
                <h2 className="text-2xl font-semibold md:text-3xl">
                  {section.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {section.items.map((item, i) => (
                    <div key={i} className={cardClasses}>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className={`text-sm ${mutedTextClasses}`}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "about":
            return (
              <section key={index} className="max-w-3xl space-y-4">
                <h2 className="text-2xl font-semibold md:text-3xl">
                  {section.title}
                </h2>
                <p className={mutedTextClasses}>{section.body}</p>
              </section>
            );

          case "testimonials":
            return (
              <section key={index} className="space-y-6">
                <h2 className="text-2xl font-semibold md:text-3xl">
                  {section.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {section.items.map((item, i) => (
                    <div key={i} className={cardClasses}>
                      <p className="text-sm leading-6">“{item.quote}”</p>
                      <p className={`text-xs ${subtleTextClasses}`}>
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "cta":
            return (
              <section key={index} className={ctaSectionClasses}>
                <h2 className="text-2xl font-semibold md:text-3xl">
                  {section.title}
                </h2>
                <p className={mutedTextClasses}>{section.body}</p>
                <div>
                  <button className={primaryButtonClasses}>
                    {section.button}
                  </button>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
