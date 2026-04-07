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
      className="space-y-5 rounded-[2rem] border border-neutral-200 bg-white p-6"
    >
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium text-neutral-900">
          Yrityksen URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-0"
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="industryId" className="text-sm font-medium text-neutral-900">
            Industry
          </label>
          <select
            id="industryId"
            value={industryId}
            onChange={(event) => setIndustryId(event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-0"
          >
            {industryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="stylePreset" className="text-sm font-medium text-neutral-900">
            Style preset
          </label>
          <select
            id="stylePreset"
            value={stylePreset}
            onChange={(event) => setStylePreset(event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-0"
          >
            <option value="premium-dark">Premium Dark</option>
            <option value="minimal-trust">Minimal Trust</option>
            <option value="bold-modern">Bold Modern</option>
            <option value="editorial-clean">Editorial Clean</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
      >
        Generate project
      </button>
    </form>
  );
}
