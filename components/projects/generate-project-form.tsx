"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  defaultPrimaryUrl?: string;
  defaultAdditionalUrls?: string[];
};

const MAX_ADDITIONAL_URLS = 14;

function buildInitialAdditionalUrls(defaultAdditionalUrls: string[]): string[] {
  const values = [...defaultAdditionalUrls.slice(0, MAX_ADDITIONAL_URLS)];

  while (values.length < MAX_ADDITIONAL_URLS) {
    values.push("");
  }

  return values;
}

export function GenerateProjectForm({
  defaultPrimaryUrl = "",
  defaultAdditionalUrls = []
}: Props) {
  const router = useRouter();
  const [primaryUrl, setPrimaryUrl] = useState(defaultPrimaryUrl);
  const [additionalUrls, setAdditionalUrls] = useState(
    buildInitialAdditionalUrls(defaultAdditionalUrls)
  );

  const filledAdditionalUrls = useMemo(
    () => additionalUrls.map((url) => url.trim()).filter(Boolean).slice(0, MAX_ADDITIONAL_URLS),
    [additionalUrls]
  );

  function updateAdditionalUrl(index: number, value: string) {
    setAdditionalUrls((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    params.set("primaryUrl", primaryUrl);

    filledAdditionalUrls.forEach((url) => {
      params.append("additionalUrl", url);
    });

    router.push(`/briefs/generated?${params.toString()}`);
  }

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
          Syötä pää-URL ja halutessasi enintään 14 lisä-URLia omiin kenttiinsä.
          Työkalu yhdistää ne yhdeksi rakenteiseksi briefiksi.
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

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/85">
            Lisä-URLit
          </p>
          <p className="text-xs text-white/45">
            Täytä vain ne kentät joita haluat käyttää. Maksimi 14 lisä-URLia.
          </p>
        </div>

        <div className="grid gap-3">
          {additionalUrls.map((value, index) => (
            <div key={index} className="space-y-1">
              <label
                htmlFor={`additionalUrl-${index}`}
                className="text-xs uppercase tracking-[0.14em] text-white/35"
              >
                Lisä-URL {index + 1}
              </label>
              <input
                id={`additionalUrl-${index}`}
                type="url"
                value={value}
                onChange={(event) => updateAdditionalUrl(index, event.target.value)}
                placeholder={`https://example.com/page-${index + 1}`}
                className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-white/40">
          Täytettyjä lisä-URLeja: {filledAdditionalUrls.length}/{MAX_ADDITIONAL_URLS}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
          URLs → Source capture → Image selection → Structured site brief
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
