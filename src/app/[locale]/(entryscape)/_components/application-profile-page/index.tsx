"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

interface ApplicationProfilePageProps {
  spec: string;
  specTitle: string;
}

export function ApplicationProfilePage({
  spec,
  specTitle,
}: ApplicationProfilePageProps) {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const specificationsPath = t("routes.specifications.path");

  return (
    <EntryscapeResourcePage
      containerSize="full"
      breadcrumb={buildBreadcrumb(entry.title, [
        {
          name: t("routes.specifications.title"),
          link: `/${specificationsPath}?q=&f=`,
        },
        {
          name: specTitle,
          link: `/${specificationsPath}/${spec}`,
        },
      ])}
      title={entry.title}
      main={null}
      sidebar={null}
    />
  );
}
