import { SpecificationPage } from "@/app/[locale]/(entryscape)/_components/specification-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; spec: string; param: string }>;
}

export default async function SpecificationParam({ params }: PageProps) {
  const { locale, spec, param } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "specification",
    param: spec,
    secondParam: param,
    body: <SpecificationPage />,
  });
}
