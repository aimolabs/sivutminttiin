import { redirect } from "next/navigation";

type SearchParams = Promise<{
  url?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

export default async function LegacyGeneratedProjectPage({ searchParams }: Props) {
  const params = await searchParams;
  const url = params.url?.trim();

  if (url) {
    redirect(`/briefs/generated?url=${encodeURIComponent(url)}`);
  }

  redirect("/");
}
