import { SpecificationPage } from "@/app/[locale]/(entryscape)/_components/specification-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; spec: string }>;
}

export default async function Specification({ params }: PageProps) {
  const { locale, spec } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "specification",
    param: spec,
    body: <SpecificationPage />,
  });
}
