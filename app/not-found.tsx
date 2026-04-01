import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Sivua ei löytynyt</h1>
        <p className="mt-4 text-sm leading-6 text-white/70">
          Pyydettyä projektia tai näkymää ei ole olemassa tässä demoversiossa.
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-flex rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Takaisin projekteihin
        </Link>
      </div>
    </main>
  );
}