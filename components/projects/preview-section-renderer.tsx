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

function getPrimaryCta(project: Project, section?: ProjectSection) {
  if (!section) return null;
  return resolveCtas(project, section)[0] ?? null;
}

function getSecondaryCta(project: Project, section?: ProjectSection) {
  if (!section) return null;
  return resolveCtas(project, section)[1] ?? null;
}

function renderPrimaryButton(label: string, primaryButtonClasses: string) {
  return <span className={primaryButtonClasses}>{label}</span>;
}

function renderSecondaryButton(label: string, secondaryButtonClasses: string) {
  return <span className={secondaryButtonClasses}>{label}</span>;
}

function BrandVisual({
  project,
  subtleClasses,
  surfaceClasses,
  sectionBorderClasses
}: {
  project: Project;
  subtleClasses: string;
  surfaceClasses: string;
  sectionBorderClasses: string;
}) {
  const imageUrl = project.sourceBrand?.ogImageUrl;
  const iconUrl = project.sourceBrand?.iconUrl;
  const siteName =
    project.sourceBrand?.siteName || project.siteProfile.companyName;
  const themeColor = project.sourceBrand?.themeColor || "#1d4ed8";

  if (imageUrl) {
    return (
      <div className="space-y-4">
        <div
          className={`overflow-hidden rounded-[2rem] p-2 ${surfaceClasses}`}
          style={{
            boxShadow: `0 0 0 1px ${themeColor}22, 0 24px 80px ${themeColor}18`
          }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
            <img
              src={imageUrl}
              alt={siteName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
        </div>

        <div className={`rounded-[1.5rem] p-5 ${surfaceClasses}`}>
          <div className="flex items-center gap-3">
            {iconUrl ? (
              <img
                src={iconUrl}
                alt=""
                className="h-10 w-10 rounded-xl bg-white object-contain p-1"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-xl"
                style={{ backgroundColor: themeColor }}
              />
            )}

            <div className="space-y-1">
              <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
                Source brand
              </p>
              <p className="text-sm font-medium">{siteName}</p>
            </div>
          </div>

          <div className={`mt-4 border-t pt-4 ${sectionBorderClasses}`}>
            <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>
              Hero visual preserved from source
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[2rem] p-6 md:p-7 ${surfaceClasses}`}
      style={{
        background:
          `radial-gradient(circle at top right, ${themeColor}22, transparent 55%)`
      }}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
            Miksi tämä toimii
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Luotettava ensivaikutelma heti
          </h2>
          <p className="text-sm leading-6 text-inherit/70">
            Rakennus- ja remonttisivun tärkein tehtävä on tehdä palvelu,
            luotettavuus ja tarjouspyynnön helppous näkyviksi ilman epävarmuutta.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContractorHomeLayout({
  project,
  heroSection,
  servicesSection,
  proofSection,
  finalCtaSection,
  bodyMutedClasses,
  subtleClasses,
  surfaceClasses,
  sectionBorderClasses,
  primaryButtonClasses,
  secondaryButtonClasses
}: {
  project: Project;
  heroSection?: ProjectSection;
  servicesSection?: ProjectSection;
  proofSection?: ProjectSection;
  finalCtaSection?: ProjectSection;
  bodyMutedClasses: string;
  subtleClasses: string;
  surfaceClasses: string;
  sectionBorderClasses: string;
  primaryButtonClasses: string;
  secondaryButtonClasses: string;
}) {
  const primaryCta = getPrimaryCta(project, heroSection);
  const secondaryCta = getSecondaryCta(project, heroSection);
  const trustItems = proofSection ? resolveTrustItems(project, proofSection) : [];

  return (
    <div className="space-y-20 md:space-y-24">
      {heroSection ? (
        <section className="grid gap-10 md:grid-cols-[1.02fr_0.98fr] md:items-center">
          <div className="space-y-6">
            {heroSection.eyebrow ? (
              <p className={`text-sm uppercase tracking-[0.22em] ${subtleClasses}`}>
                {heroSection.eyebrow}
              </p>
            ) : null}

            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.04] tracking-tight md:text-6xl">
              {heroSection.heading}
            </h1>

            {heroSection.body ? (
              <p className={`max-w-2xl text-base leading-7 md:text-lg ${bodyMutedClasses}`}>
                {heroSection.body}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              {primaryCta ? renderPrimaryButton(primaryCta.label, primaryButtonClasses) : null}
              {secondaryCta ? renderSecondaryButton(secondaryCta.label, secondaryButtonClasses) : null}
            </div>
          </div>

          <BrandVisual
            project={project}
            subtleClasses={subtleClasses}
            surfaceClasses={surfaceClasses}
            sectionBorderClasses={sectionBorderClasses}
          />
        </section>
      ) : null}

      {servicesSection?.items?.length ? (
        <section className="space-y-8">
          <div className="space-y-3">
            <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
              Services
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {servicesSection.heading}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {servicesSection.items.map((item) => (
              <div
                key={item.id}
                className={`rounded-[1.75rem] p-6 ${surfaceClasses}`}
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                  {item.body ? (
                    <p className={`text-sm leading-6 ${bodyMutedClasses}`}>{item.body}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className={`rounded-[1.75rem] p-6 ${surfaceClasses}`}>
          <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>Luottamus</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">
            Selkeä toimintatapa
          </h3>
          <p className={`mt-3 text-sm leading-6 ${bodyMutedClasses}`}>
            Sivun pitää tehdä yhteistyön alku, eteneminen ja yhteydenotto näkyviksi ilman kitkaa.
          </p>
        </div>

        <div className={`rounded-[1.75rem] p-6 ${surfaceClasses}`}>
          <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>Uskottavuus</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">
            Palvelut nopeasti näkyviin
          </h3>
          <p className={`mt-3 text-sm leading-6 ${bodyMutedClasses}`}>
            Tarjonnan pitää olla heti hahmotettava, jotta kävijä tunnistaa oikean palvelun nopeasti.
          </p>
        </div>

        <div className={`rounded-[1.75rem] p-6 ${surfaceClasses}`}>
          <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>Konversio</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">
            Tarjouspyyntö ilman epävarmuutta
          </h3>
          <p className={`mt-3 text-sm leading-6 ${bodyMutedClasses}`}>
            Kiinnostuneen kävijän pitää nähdä nopeasti miten tarjous tai yhteydenotto tapahtuu.
          </p>
        </div>
      </section>

      {proofSection ? (
        <section className={`grid gap-8 border-t pt-16 md:grid-cols-[0.9fr_1.1fr] ${sectionBorderClasses}`}>
          <div className="space-y-3">
            <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
              Trust
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {proofSection.heading}
            </h2>
          </div>

          <div className="grid gap-4">
            {(trustItems.length > 0
              ? trustItems
              : [
                  {
                    id: "fallback-1",
                    title: "Luotettava toteutus",
                    body:
                      project.companyBrief?.trustStrategy ??
                      "Luottamus rakennetaan selkeän toimintatavan ja matalan yhteydenottokynnyksen varaan."
                  }
                ]).map((item) => (
              <div key={item.id} className={`rounded-[1.5rem] p-6 ${surfaceClasses}`}>
                {item.body ? (
                  <p className={`text-base leading-7 ${bodyMutedClasses}`}>{item.body}</p>
                ) : null}
                {item.title ? (
                  <p className={`mt-4 text-sm font-medium ${subtleClasses}`}>{item.title}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {finalCtaSection ? (
        <section>
          <div className={`rounded-[2rem] p-7 md:p-10 ${surfaceClasses}`}>
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
              <div className="space-y-4">
                <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
                  Next step
                </p>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {finalCtaSection.heading}
                </h2>
                {finalCtaSection.body ? (
                  <p className={`max-w-2xl text-base leading-7 ${bodyMutedClasses}`}>
                    {finalCtaSection.body}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3 md:justify-end">
                {getPrimaryCta(project, finalCtaSection)
                  ? renderPrimaryButton(
                      getPrimaryCta(project, finalCtaSection)!.label,
                      primaryButtonClasses
                    )
                  : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function TrustedAdvisorHomeLayout({
  project,
  heroSection,
  servicesSection,
  aboutSection,
  finalCtaSection,
  bodyMutedClasses,
  subtleClasses,
  surfaceClasses,
  sectionBorderClasses,
  primaryButtonClasses,
  secondaryButtonClasses
}: {
  project: Project;
  heroSection?: ProjectSection;
  servicesSection?: ProjectSection;
  aboutSection?: ProjectSection;
  finalCtaSection?: ProjectSection;
  bodyMutedClasses: string;
  subtleClasses: string;
  surfaceClasses: string;
  sectionBorderClasses: string;
  primaryButtonClasses: string;
  secondaryButtonClasses: string;
}) {
  const primaryCta = getPrimaryCta(project, heroSection);
  const secondaryCta = getSecondaryCta(project, heroSection);

  return (
    <div className="space-y-20 md:space-y-24">
      {heroSection ? (
        <section className="grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <div className={`rounded-[2rem] p-6 md:p-7 ${surfaceClasses}`}>
            <div className="space-y-4">
              {heroSection.eyebrow ? (
                <p className={`text-sm uppercase tracking-[0.22em] ${subtleClasses}`}>
                  {heroSection.eyebrow}
                </p>
              ) : null}

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
                {heroSection.heading}
              </h1>

              {heroSection.body ? (
                <p className={`text-base leading-7 ${bodyMutedClasses}`}>
                  {heroSection.body}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-8 pt-1">
            <div className="space-y-4">
              <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
                Asiantuntijavaikutelma
              </p>
              <p className={`max-w-2xl text-lg leading-8 ${bodyMutedClasses}`}>
                Lakipalvelun tai asiantuntijasivun pitää tuntua rauhalliselta,
                selkeältä ja turvalliselta. Sivun on tehtävä nopeasti näkyväksi
                missä tilanteissa apua saa ja miksi yhteydenotto on matalariskinen.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {primaryCta ? renderPrimaryButton(primaryCta.label, primaryButtonClasses) : null}
              {secondaryCta ? renderSecondaryButton(secondaryCta.label, secondaryButtonClasses) : null}
            </div>

            <div className={`grid gap-4 border-t pt-6 ${sectionBorderClasses}`}>
              <div className="grid gap-1">
                <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>
                  Audience
                </p>
                <p className="text-sm font-medium">{project.siteProfile.audience}</p>
              </div>

              <div className="grid gap-1">
                <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>
                  Focus
                </p>
                <p className="text-sm font-medium">
                  {project.companyBrief?.coreOffer.title ?? project.pages[0]?.pageSEO.primaryTopic}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {servicesSection?.items?.length ? (
        <section className={`grid gap-8 border-t pt-16 md:grid-cols-[0.8fr_1.2fr] ${sectionBorderClasses}`}>
          <div className="space-y-3">
            <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
              Expertise
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {servicesSection.heading}
            </h2>
          </div>

          <div className="grid gap-4">
            {servicesSection.items.map((item) => (
              <div key={item.id} className={`rounded-[1.5rem] p-6 ${surfaceClasses}`}>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                  {item.body ? (
                    <p className={`text-sm leading-6 ${bodyMutedClasses}`}>{item.body}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {aboutSection ? (
        <section className="grid gap-8 md:grid-cols-2">
          <div className={`rounded-[1.75rem] p-7 ${surfaceClasses}`}>
            <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>
              Luottamus
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              Asiantuntijuus ensin
            </h3>
            <p className={`mt-4 text-base leading-7 ${bodyMutedClasses}`}>
              {aboutSection.body}
            </p>
          </div>

          <div className={`rounded-[1.75rem] p-7 ${surfaceClasses}`}>
            <p className={`text-xs uppercase tracking-[0.16em] ${subtleClasses}`}>
              Ensikontakti
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              Yhteydenoton pitää tuntua turvalliselta
            </h3>
            <p className={`mt-4 text-base leading-7 ${bodyMutedClasses}`}>
              Ensimmäinen yhteydenotto ei saa tuntua liian suurelta sitoumukselta.
              Siksi selkeys, rauhallinen viestintä ja helposti ymmärrettävä rakenne
              ovat tässä archetypessa tärkeämpiä kuin aggressiivinen myyntitunnelma.
            </p>
          </div>
        </section>
      ) : null}

      {finalCtaSection ? (
        <section>
          <div className={`rounded-[2rem] p-7 md:p-10 ${surfaceClasses}`}>
            <div className="space-y-4">
              <p className={`text-xs uppercase tracking-[0.18em] ${subtleClasses}`}>
                Next step
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {finalCtaSection.heading}
              </h2>
              {finalCtaSection.body ? (
                <p className={`max-w-3xl text-base leading-7 ${bodyMutedClasses}`}>
                  {finalCtaSection.body}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2">
                {getPrimaryCta(project, finalCtaSection)
                  ? renderPrimaryButton(
                      getPrimaryCta(project, finalCtaSection)!.label,
                      primaryButtonClasses
                    )
                  : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function GenericHomeLayout({
  project,
  sections,
  bodyMutedClasses,
  subtleClasses,
  surfaceClasses,
  sectionBorderClasses,
  primaryButtonClasses,
  secondaryButtonClasses
}: {
  project: Project;
  sections: ProjectSection[];
  bodyMutedClasses: string;
  subtleClasses: string;
  surfaceClasses: string;
  sectionBorderClasses: string;
  primaryButtonClasses: string;
  secondaryButtonClasses: string;
}) {
  return (
    <div className="space-y-20 md:space-y-24">
      {sections.map((section, index) => {
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
                      {ctas[0] ? renderPrimaryButton(ctas[0].label, primaryButtonClasses) : null}
                      {ctas[1] ? renderSecondaryButton(ctas[1].label, secondaryButtonClasses) : null}
                    </div>
                  ) : null}
                </div>

                <div className={`rounded-[2rem] p-6 md:p-7 ${surfaceClasses}`}>
                  <div className="space-y-5">
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
                          <h3 className="text-xl font-semibold tracking-tight">
                            {item.title}
                          </h3>
                          {item.body ? (
                            <p className={`text-sm leading-6 ${bodyMutedClasses}`}>
                              {item.body}
                            </p>
                          ) : null}
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

                          {item.title ? (
                            <p className={`text-sm font-medium ${subtleClasses}`}>
                              {item.title}
                            </p>
                          ) : null}
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
                <div className={`rounded-[2rem] p-7 md:p-10 ${surfaceClasses}`}>
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
                      {ctas[0] ? renderPrimaryButton(ctas[0].label, primaryButtonClasses) : null}
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
  );
}

export function PreviewSectionRenderer({ project, pageId }: Props) {
  const page = getPage(project, pageId);

  if (!page) {
    return null;
  }

  const stylePresetId = project.input.stylePreset as StylePresetId;
  const preset = STYLE_PRESETS[stylePresetId];
  const isDark = preset.visual.theme === "dark";

  const themeColor = project.sourceBrand?.themeColor || "#2563eb";

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
        ? "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-black"
        : "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white";

  const secondaryButtonClasses = isDark
    ? "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white"
    : "inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900";

  const navItems = getNavItems(project);
  const isHomePage = page.pageType === "home";
  const archetypeId = project.companyBrief?.archetypeId ?? "generic-service";

  const heroSection = page.sections.find((section) => section.type === "hero");
  const servicesSection = page.sections.find((section) => section.type === "services");
  const aboutSection = page.sections.find((section) => section.type === "about");
  const proofSection =
    page.sections.find((section) => section.type === "testimonials") ??
    page.sections.find((section) => section.sectionRole === "trust-building");
  const finalCtaSection = [...page.sections]
    .reverse()
    .find((section) => section.type === "cta");

  return (
    <div
      className={shellClasses}
      style={{
        backgroundImage: isDark
          ? `radial-gradient(circle at top right, ${themeColor}22, transparent 35%)`
          : undefined
      }}
    >
      <div className={topBarClasses}>
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-8">
          <div className="space-y-1">
            <p className={`text-xs uppercase tracking-[0.24em] ${subtleClasses}`}>
              {project.siteProfile.industry}
            </p>
            <div className="flex items-center gap-3">
              {project.sourceBrand?.iconUrl ? (
                <img
                  src={project.sourceBrand.iconUrl}
                  alt=""
                  className="h-7 w-7 rounded-md bg-white object-contain p-1"
                />
              ) : null}
              <p className="text-lg font-semibold tracking-tight">
                {project.sourceBrand?.siteName || project.siteProfile.companyName}
              </p>
            </div>
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
        {isHomePage && archetypeId === "local-contractor" ? (
          <ContractorHomeLayout
            project={project}
            heroSection={heroSection}
            servicesSection={servicesSection}
            proofSection={proofSection}
            finalCtaSection={finalCtaSection}
            bodyMutedClasses={bodyMutedClasses}
            subtleClasses={subtleClasses}
            surfaceClasses={surfaceClasses}
            sectionBorderClasses={sectionBorderClasses}
            primaryButtonClasses={primaryButtonClasses}
            secondaryButtonClasses={secondaryButtonClasses}
          />
        ) : isHomePage && archetypeId === "trusted-advisor" ? (
          <TrustedAdvisorHomeLayout
            project={project}
            heroSection={heroSection}
            servicesSection={servicesSection}
            aboutSection={aboutSection}
            finalCtaSection={finalCtaSection}
            bodyMutedClasses={bodyMutedClasses}
            subtleClasses={subtleClasses}
            surfaceClasses={surfaceClasses}
            sectionBorderClasses={sectionBorderClasses}
            primaryButtonClasses={primaryButtonClasses}
            secondaryButtonClasses={secondaryButtonClasses}
          />
        ) : (
          <GenericHomeLayout
            project={project}
            sections={page.sections}
            bodyMutedClasses={bodyMutedClasses}
            subtleClasses={subtleClasses}
            surfaceClasses={surfaceClasses}
            sectionBorderClasses={sectionBorderClasses}
            primaryButtonClasses={primaryButtonClasses}
            secondaryButtonClasses={secondaryButtonClasses}
          />
        )}
      </div>
    </div>
  );
}
