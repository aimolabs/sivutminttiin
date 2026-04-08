"use client";

import { useEffect } from "react";
import type { BriefListItem } from "@/lib/briefs/brief-list-items";
import { upsertRecentBrief } from "@/lib/briefs/recent-brief-storage";

type Props = {
  item: BriefListItem;
};

export function SaveGeneratedBriefClient({ item }: Props) {
  useEffect(() => {
    upsertRecentBrief(item);
  }, [item]);

  return null;
}
