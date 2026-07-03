import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";
import { ConceptPage } from "@/app/[locale]/(entryscape)/components/concept-page";

interface PageProps {
  params: Promise<{ locale: string; concept: string }>;
}

export default async function Concept({ params }: PageProps) {
  const { locale, concept } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "concept",
    config: {
      pathPrefix: "/concepts",
      redirectPath: "/concepts",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
      param: concept,
    },
    body: <ConceptPage />,
  });
}
