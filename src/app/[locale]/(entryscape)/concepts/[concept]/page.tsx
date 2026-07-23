import { ConceptPage } from "@/app/[locale]/(entryscape)/_components/concept-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; concept: string }>;
}

export default async function Concept({ params }: PageProps) {
  const { locale, concept } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "concept",
    param: concept,
    body: <ConceptPage />,
  });
}
