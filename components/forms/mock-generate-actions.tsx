import Link from "next/link";

type MockGenerateActionsProps = {
  url?: string;
};

export function MockGenerateActions({
  url = "https://example-company.fi"
}: MockGenerateActionsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href={`/projects/new?url=${encodeURIComponent(url)}`}
        className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
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