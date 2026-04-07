import { Project } from "@/lib/mock/projects";

type Props = {
  project: Project;
};

function Row({
  label,
  value
}: {
  label: string;
  value: string | string[] | undefined;
}) {
  const renderedValue = Array.isArray(value) ? value.join(", ") : value ?? "—";

  return (
    <div className="grid gap-1 border-b border-neutral-200 py-3 md:grid-cols-[220px_1fr]">
      <div className="text-sm font-medium text-neutral-500">{label}</div>
      <div className="text-sm text-neutral-900">{renderedValue}</div>
    </div>
  );
}

export function CompanyBriefDebug({ project }: Props) {
  const brief = project.companyBrief;

  if (!brief) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-[2rem] border border-neutral-200 bg-white p-6">
      <div className="space-y-1">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Company brief debug
        </p>
        <h2 className="text-2xl font-semibold text-neutral-950">
          Structured interpretation before project model
        </h2>
        <p className="text-sm text-neutral-600">
          Tämän paneelin tarkoitus on näyttää, mitä generaattori uskoo yrityksestä
          ennen kuin se rakentaa sivut.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <Row label="Company name" value={brief.companyName} />
        <Row label="Industry" value={brief.inferredIndustryId} />
        <Row label="Archetype" value={brief.archetypeId} />
        <Row label="Audience" value={brief.targetAudienceSummary} />
        <Row label="Positioning" value={brief.positioningSummary} />
        <Row label="Hero message" value={brief.heroMessage} />
        <Row label="Hero support" value={brief.heroSupport} />
        <Row label="Primary conversion goal" value={brief.primaryConversionGoal} />
        <Row label="Primary CTA" value={brief.primaryCTALabel} />
        <Row label="Secondary CTA" value={brief.secondaryCTALabel} />
        <Row label="Final CTA" value={brief.finalCTALabel} />
        <Row label="Trust strategy" value={brief.trustStrategy} />
        <Row label="Core offer" value={brief.coreOffer.title} />
        <Row
          label="Secondary offers"
          value={brief.secondaryOffers.map((offer) => offer.title)}
        />
        <Row
          label="Recommended pages"
          value={brief.recommendedPageSet.map(
            (page) => `${page.navigationLabel} (${page.slug})`
          )}
        />
        <Row
          label="Proof points"
          value={brief.proofPoints.map((point) => `${point.title}: ${point.body}`)}
        />
      </div>
    </section>
  );
}
