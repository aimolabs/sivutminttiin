"use client";

import { useState } from "react";

type Props = {
  text: string;
  label?: string;
};

export function BriefCopyButton({ text, label = "Kopioi brief" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
    >
      {copied ? "Kopioitu" : label}
    </button>
  );
}
