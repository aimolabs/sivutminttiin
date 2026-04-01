import Link from "next/link";

export function MockGenerateActions() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/projects/demo"
        className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
      >
        Open existing demo instead
      </Link>
    </div>
  );
}
