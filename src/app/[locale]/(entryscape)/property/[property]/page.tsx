import { DataStructurePage } from "@/app/[locale]/(entryscape)/_components/data-structures/data-structure-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; property: string }>;
}

export default async function Property({ params }: PageProps) {
  const { locale, property } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "property",
    param: property,
    body: <DataStructurePage pageType="property" />,
  });
}
