"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function ApplicationProfilePage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const params = useParams<{ spec: string; param?: string }>();
  const specificationsPath = t("routes.specifications.path");
  const specHref = params.param
    ? `/${specificationsPath}/${params.spec}/${params.param}`
    : `/${specificationsPath}/${params.spec}`;

  return (
    <EntryscapeResourcePage
      containerSize="full"
      breadcrumb={buildBreadcrumb(
        t("pages.specification_page.application_profile"),
        [
          {
            name: t("routes.specifications.title"),
            link: `/${specificationsPath}?q=&f=`,
          },
          {
            name: entry.title,
            link: specHref,
          },
        ],
      )}
      title={entry.title}
      main={null}
      sidebar={null}
    />
  );
}
