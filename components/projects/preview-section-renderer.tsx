import { Project, RedesignSection } from "@/lib/mock/projects";

type Props = {
  project: Project;
};

export function PreviewSectionRenderer({ project }: Props) {
  return (
    <div className="space-y-16">
      {project.redesign.sections.map((section, index) => {
        switch (section.type) {
          case "hero":
            return (
              <section key={index} className="space-y-6">
                <p className="text-sm text-neutral-500">
                  {project.siteProfile.industry}
                </p>

                <h1 className="text-4xl font-semibold leading-tight">
                  {section.headline.replace(
                    "Uudellamaalla",
                    project.siteProfile.audience
                  )}
                </h1>

                <p className="text-lg text-neutral-600 max-w-xl">
                  {section.subheadline}
                </p>

                <div className="flex gap-3">
                  <button className="px-5 py-3 bg-black text-white rounded-full text-sm">
                    {section.primaryCta}
                  </button>
                  <button className="px-5 py-3 border rounded-full text-sm">
                    {section.secondaryCta}
                  </button>
                </div>

                <p className="text-xs text-neutral-400 pt-2">
                  Konsepti suunniteltu yritykselle:{" "}
                  <strong>{project.siteProfile.companyName}</strong>
                </p>
              </section>
            );

          case "services":
            return (
              <section key={index} className="space-y-6">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 border rounded-xl space-y-2"
                    >
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "about":
            return (
              <section key={index} className="space-y-4 max-w-2xl">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="text-neutral-700">{section.body}</p>
              </section>
            );

          case "testimonials":
            return (
              <section key={index} className="space-y-6">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 border rounded-xl space-y-2"
                    >
                      <p className="text-sm">“{item.quote}”</p>
                      <p className="text-xs text-neutral-500">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "cta":
            return (
              <section
                key={index}
                className="p-8 bg-neutral-100 rounded-2xl space-y-4"
              >
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="text-neutral-700">{section.body}</p>
                <button className="px-5 py-3 bg-black text-white rounded-full text-sm">
                  {section.button}
                </button>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
