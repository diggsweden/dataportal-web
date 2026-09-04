"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import { Container } from "@/components/layout/container";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

/**
 * Cannot reuse EntryscapeResourcePage as this constricts the page
 * layout too much.
 */
export function ApplicationProfilePage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const params = useParams<{ spec: string; param?: string }>();
  const specificationsPath = t("routes.specifications.path");
  const specHref = params.param
    ? `/${specificationsPath}/${params.spec}/${params.param}`
    : `/${specificationsPath}/${params.spec}`;
  const containerSize = "full";
  const breadcrumb = buildBreadcrumb(
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
  );

  return (
    <Container size={containerSize}>
      <BreadcrumbSetter {...breadcrumb} />
      <div data-entryscape="apView"></div>
    </Container>
  );
}
