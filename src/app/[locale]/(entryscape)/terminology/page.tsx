import { notFound } from "next/navigation";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ esc_uri?: string }>;
}

export default async function TerminologyByUri({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { esc_uri } = await searchParams;
  if (!esc_uri) notFound();

  return renderEntryStoreResourcePage({
    locale,
    pageType: "terminology",
    resourceUri: esc_uri,
    body: null,
  });
}
