import { ConceptPage } from "@/app/[locale]/(entryscape)/_components/concept-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; concept: string; param: string }>;
}

export default async function ConceptParam({ params }: PageProps) {
  const { locale, concept, param } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "concept",
    config: {
      pathPrefix: "/concepts",
      redirectPath: "/concepts",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
      param: concept,
      secondParam: param,
    },
    body: <ConceptPage />,
  });
}
