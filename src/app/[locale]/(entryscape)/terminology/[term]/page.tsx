import { ConceptPage } from "@/app/[locale]/(entryscape)/_components/concept-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; term: string }>;
}

export default async function Terminology({ params }: PageProps) {
  const { locale, term } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "terminology",
    config: {
      pathPrefix: "/concepts",
      redirectPath: "/terminology",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
      param: term,
    },
    body: <ConceptPage />,
  });
}
