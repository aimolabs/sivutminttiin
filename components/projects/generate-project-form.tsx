"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getIndustryOptions } from "@/lib/mock/industry-profiles";

type Props = {
  defaultUrl?: string;
  defaultIndustryId?: string;
  defaultStylePreset?: string;
};

export function GenerateProjectForm({
  defaultUrl = "",
  defaultIndustryId = "contractor",
  defaultStylePreset = "premium-dark"
}: Props) {
  const router = useRouter();
  const [url, setUrl] = useState(defaultUrl);
  const [industryId, setIndustryId] = useState(defaultIndustryId);
  const [stylePreset, setStylePreset] = useState(defaultStylePreset);

  const industryOptions = getIndustryOptions();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    params.set("url", url);
    params.set("industryId", industryId);
    params.set("stylePreset", stylePreset);

    router.push(`/projects/generated?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
          New project
        </p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Luo uusi redesign-projekti
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-white/65 md:text-base">
          Syötä yrityksen URL, valitse industry ja style direction. Tämä on workstationin
          varsinainen entry point.
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

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="industryId" className="text-sm font-medium text-white/85">
            Industry
          </label>
          <select
            id="industryId"
            value={industryId}
            onChange={(event) => setIndustryId(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-white outline-none"
          >
            {industryOptions.map((option) => (
              <option key={option.id} value={option.id} className="text-black">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="stylePreset" className="text-sm font-medium text-white/85">
            Style preset
          </label>
          <select
            id="stylePreset"
            value={stylePreset}
            onChange={(event) => setStylePreset(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-white outline-none"
          >
            <option value="premium-dark" className="text-black">Premium Dark</option>
            <option value="minimal-trust" className="text-black">Minimal Trust</option>
            <option value="bold-modern" className="text-black">Bold Modern</option>
            <option value="editorial-clean" className="text-black">Editorial Clean</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
          Input → Project model → Render
        </p>

        <button
          type="submit"
          className="rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
        >
          Generate project
        </button>
      </div>
    </form>
  );
}
