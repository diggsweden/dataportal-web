import { DataStructurePage } from "@/app/[locale]/(entryscape)/_components/data-structure-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; property: string }>;
}

export default async function Property({ params }: PageProps) {
  const { locale, property } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "property",
    config: {
      pathPrefix: "/concepts",
      redirectPath: "/property",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
      param: property,
    },
    body: <DataStructurePage pageType="property" />,
  });
}
