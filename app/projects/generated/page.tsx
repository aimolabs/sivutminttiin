import { redirect } from "next/navigation";

type SearchParams = Promise<{
  url?: string;
  primaryUrl?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

export default async function LegacyGeneratedProjectPage({ searchParams }: Props) {
  const params = await searchParams;
  const primaryUrl = params.primaryUrl?.trim() || params.url?.trim();

  if (primaryUrl) {
    redirect(`/briefs/generated?primaryUrl=${encodeURIComponent(primaryUrl)}`);
  }

  redirect("/");
}
