import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";
import { SpecificationPage } from "@/app/[locale]/(entryscape)/components/specification-page";

interface PageProps {
  params: Promise<{ locale: string; spec: string }>;
}

export default async function Specification({ params }: PageProps) {
  const { locale, spec } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "specification",
    config: {
      pathPrefix: "/specifications",
      redirectPath: "/specifications",
      entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
      param: spec,
    },
    body: <SpecificationPage />,
  });
}
