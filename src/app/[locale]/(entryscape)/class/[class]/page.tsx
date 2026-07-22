import { DataStructurePage } from "@/app/[locale]/(entryscape)/_components/data-structure-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; class: string }>;
}

export default async function Class({ params }: PageProps) {
  const { locale, class: classId } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "class",
    config: {
      pathPrefix: "/concepts",
      redirectPath: "/class",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
      param: classId,
    },
    body: <DataStructurePage pageType="class" />,
  });
}
