import { ApplicationProfilePage } from "@/app/[locale]/(entryscape)/_components/application-profile-page";
import { renderEntryStoreResourcePage } from "@/app/[locale]/(entryscape)/_server/render-resource-page";

import "@/styles/entryscape-ap.css";

interface PageProps {
  params: Promise<{ locale: string; spec: string; param: string }>;
}

export default async function ApplicationProfileParam({ params }: PageProps) {
  const { locale, spec, param } = await params;

  return renderEntryStoreResourcePage({
    locale,
    pageType: "specification",
    providerPageType: "application-profile",
    param: spec,
    secondParam: param,
    pathSuffix: "/ap",
    body: <ApplicationProfilePage />,
  });
}
