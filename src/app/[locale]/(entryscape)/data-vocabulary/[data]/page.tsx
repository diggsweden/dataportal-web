import { DataVocabularyPage } from "@/app/[locale]/(entryscape)/_components/data-structures/data-vocabulary-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; data: string }>;
}

export default async function DataVocabulary({ params }: PageProps) {
  const { locale, data } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "data-vocabulary",
    param: data,
    body: <DataVocabularyPage />,
  });
}
