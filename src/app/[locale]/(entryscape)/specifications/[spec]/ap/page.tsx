import { ApplicationProfilePage } from "@/app/[locale]/(entryscape)/_components/application-profile-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

interface PageProps {
  params: Promise<{ locale: string; spec: string }>;
}

export default async function ApplicationProfile({ params }: PageProps) {
  const { locale, spec } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "specification",
    providerPageType: "application-profile",
    param: spec,
    pathSuffix: "/ap",
    body: <ApplicationProfilePage />,
  });
}
