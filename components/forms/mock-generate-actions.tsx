import Link from "next/link";

type MockGenerateActionsProps = {
  url: string;
  isValid: boolean;
};

export function MockGenerateActions({
  url,
  isValid
}: MockGenerateActionsProps) {
  const trimmedUrl = url.trim();
  const generatedHref = isValid
    ? `/projects/new?url=${encodeURIComponent(trimmedUrl)}`
    : "#";

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href={generatedHref}
        aria-disabled={!isValid}
        className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
          isValid
            ? "bg-sky-300 text-slate-950 hover:opacity-90"
            : "cursor-not-allowed bg-white/10 text-white/40 pointer-events-none"
        }`}
      >
        Continue to mock generation
      </Link>

      <Link
        href="/projects/demo"
        className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
      >
        Open existing demo instead
      </Link>
    </div>
  );
}
