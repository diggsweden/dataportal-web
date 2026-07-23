import { TerminologyPage } from "@/app/[locale]/(entryscape)/_components/terminology-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; term: string }>;
}

export default async function Terminology({ params }: PageProps) {
  const { locale, term } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "terminology",
    param: term,
    body: <TerminologyPage pageType="terminology" />,
  });
}
