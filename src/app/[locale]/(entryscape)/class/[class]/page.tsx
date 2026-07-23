import { DataStructurePage } from "@/app/[locale]/(entryscape)/_components/data-structures/data-structure-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; class: string }>;
}

export default async function Class({ params }: PageProps) {
  const { locale, class: classId } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "class",
    param: classId,
    body: <DataStructurePage pageType="class" />,
  });
}
