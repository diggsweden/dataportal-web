import { ConceptPage } from "@/app/[locale]/(entryscape)/_components/concept-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; term: string; param: string }>;
}

export default async function TerminologyParam({ params }: PageProps) {
  const { locale, term, param } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "terminology",
    config: {
      pathPrefix: "/concepts",
      redirectPath: "/terminology",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
      param: term,
      secondParam: param,
    },
    body: <ConceptPage />,
  });
}
