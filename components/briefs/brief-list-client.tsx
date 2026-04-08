"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BriefCopyButton } from "./brief-copy-button";
import type { BriefListItem } from "@/lib/briefs/brief-list-items";
import {
  getRecentBriefs,
  removeRecentBrief
} from "@/lib/briefs/recent-brief-storage";

type SortMode = "newest" | "oldest" | "az";

export function BriefListClient() {
  const [items, setItems] = useState<BriefListItem[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  useEffect(() => {
    setItems(getRecentBriefs());
  }, []);

  const sortedItems = useMemo(() => {
    const next = [...items];

    switch (sortMode) {
      case "oldest":
        return next.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      case "az":
        return next.sort((a, b) => a.companyName.localeCompare(b.companyName, "fi"));
      case "newest":
      default:
        return next.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }, [items, sortMode]);

  function handleRemove(id: string) {
    removeRecentBrief(id);
    setItems(getRecentBriefs());
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">
            Generated briefs
          </p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Tallennetut redesign briefit
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-white/65 md:text-base">
            Tästä voit avata tai kopioida aiemmin luodun briefin uudelleen ChatGPT:lle tai Claudeen.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSortMode("newest")}
            className={
              sortMode === "newest"
                ? "rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950"
                : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
            }
          >
            Uusin ensin
          </button>
          <button
            type="button"
            onClick={() => setSortMode("oldest")}
            className={
              sortMode === "oldest"
                ? "rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950"
                : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
            }
          >
            Vanhin ensin
          </button>
          <button
            type="button"
            onClick={() => setSortMode("az")}
            className={
              sortMode === "az"
                ? "rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950"
                : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
            }
          >
            A–Ö
          </button>
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm leading-6 text-white/65">
          Ei vielä tallennettuja briefejä. Luo ensimmäinen syöttämällä URL yllä olevaan kenttään.
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    {item.domain}
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {item.companyName}
                  </h3>
                  <p className="max-w-3xl text-sm leading-6 text-white/65">
                    {item.summary}
                  </p>
                  <p className="text-xs text-white/35">
                    {new Date(item.createdAt).toLocaleString("fi-FI")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={item.href}
                    className="rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    Avaa
                  </Link>
                  <BriefCopyButton text={item.briefText} />
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
                  >
                    Poista
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
