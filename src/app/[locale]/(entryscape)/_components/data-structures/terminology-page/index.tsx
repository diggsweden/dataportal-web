"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Box } from "@/components/box";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function TerminologyPage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title, [
        {
          name: t("routes.data-structures.title"),
          link: `/${t("routes.data-structures.path")}?q=&f=`,
        },
      ])}
      intro={<span data-entryscape="terminologyHeader" />}
      main={
        <div
          data-entryscape="terminologyMain"
          data-entryscape-concept-limit="4"
        />
      }
      sidebar={
        <>
          <Box testId="about-section" color="white" padding="xl" rounded={true}>
            <div data-entryscape="terminologyVanity" />
          </Box>
          <Box testId="about-section" color="white" padding="xl" rounded={true}>
            <div data-entryscape="terminologyInfobox" />
          </Box>
        </>
      }
    />
  );
}
