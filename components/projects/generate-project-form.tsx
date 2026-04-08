"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  defaultPrimaryUrl?: string;
  defaultAdditionalUrls?: string[];
};

function parseAdditionalUrls(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 14);
}

export function GenerateProjectForm({
  defaultPrimaryUrl = "",
  defaultAdditionalUrls = []
}: Props) {
  const router = useRouter();
  const [primaryUrl, setPrimaryUrl] = useState(defaultPrimaryUrl);
  const [additionalUrlsText, setAdditionalUrlsText] = useState(
    defaultAdditionalUrls.join("\n")
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const additionalUrls = parseAdditionalUrls(additionalUrlsText);

    const params = new URLSearchParams();
    params.set("primaryUrl", primaryUrl);

    additionalUrls.forEach((url) => {
      params.append("additionalUrl", url);
    });

    router.push(`/briefs/generated?${params.toString()}`);
  }

  const additionalCount = parseAdditionalUrls(additionalUrlsText).length;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
          Multi-page redesign brief generator
        </p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Luo redesign brief koko sivuston pohjalta
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-white/65 md:text-base">
          Syötä ensin pää-URL ja sen jälkeen halutessasi enintään 14 lisä-URLia, yksi per rivi.
          Työkalu kokoaa niistä yhden rakenteisen briefin tekoälyä varten.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="primaryUrl" className="text-sm font-medium text-white/85">
          Pää-URL
        </label>
        <input
          id="primaryUrl"
          type="url"
          value={primaryUrl}
          onChange={(event) => setPrimaryUrl(event.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-white outline-none placeholder:text-white/30"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="additionalUrls" className="text-sm font-medium text-white/85">
          Lisä-URLit (max 14, yksi per rivi)
        </label>
        <textarea
          id="additionalUrls"
          value={additionalUrlsText}
          onChange={(event) => setAdditionalUrlsText(event.target.value)}
          placeholder={
            "https://example.com/palvelut\nhttps://example.com/meista\nhttps://example.com/yhteystiedot"
          }
          rows={8}
          className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-4 text-sm text-white outline-none placeholder:text-white/30"
        />
        <p className="text-xs text-white/40">
          Lisä-URLeja mukana: {additionalCount}/14
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
          URLs → Source capture → Structured site brief
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
