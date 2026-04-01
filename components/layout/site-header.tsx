import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          sivutminttiin
        </Link>

        <nav className="flex items-center gap-3 text-sm text-white/75">
          <Link
            href="/projects"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
          >
            Projektit
          </Link>

          <Link
            href="/projects/new"
            className="rounded-full bg-sky-300 px-4 py-2 font-semibold text-slate-950 transition hover:opacity-90"
          >
            Uusi projekti
          </Link>
        </nav>
      </div>
    </header>
  );
}