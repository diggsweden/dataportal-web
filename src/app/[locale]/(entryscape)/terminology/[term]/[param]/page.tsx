import { TerminologyPage } from "@/app/[locale]/(entryscape)/_components/terminology-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; term: string; param: string }>;
}

export default async function TerminologyParam({ params }: PageProps) {
  const { locale, term, param } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "terminology",
    param: term,
    secondParam: param,
    body: <TerminologyPage />,
  });
}
