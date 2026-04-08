"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  defaultUrl?: string;
};

export function GenerateProjectForm({
  defaultUrl = ""
}: Props) {
  const router = useRouter();
  const [url, setUrl] = useState(defaultUrl);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    params.set("url", url);

    router.push(`/briefs/generated?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
          Redesign brief generator
        </p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Luo uusi redesign brief
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-white/65 md:text-base">
          Syötä yrityksen URL. Työkalu lukee sivun olennaiset signaalit ja muodostaa rakenteisen briefin,
          jonka voit kopioida suoraan ChatGPT:lle tai Claudeen.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium text-white/85">
          Yrityksen URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-white outline-none placeholder:text-white/30"
          required
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
          URL → Source capture → Structured redesign brief
        </p>

        <button
          type="submit"
          className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
        >
          Luo brief
        </button>
      </div>
    </form>
  );
}
