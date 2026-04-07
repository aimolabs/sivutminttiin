"use client";

import { useEffect } from "react";
import type { ProjectListItem } from "@/lib/projects/project-list-items";
import { upsertRecentGeneratedProject } from "@/lib/projects/recent-generated-storage";

type Props = {
  item: ProjectListItem;
};

export function SaveGeneratedProjectClient({ item }: Props) {
  useEffect(() => {
    upsertRecentGeneratedProject(item);
  }, [item]);

  return null;
}
