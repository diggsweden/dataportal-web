"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Box } from "@/components/box";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function DataVocabularyPage() {
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
      intro={<span data-entryscape="datavocHeader" />}
      main={
        <div
          data-entryscape="datavocMain"
          data-entryscape-class-limit="4"
          data-entryscape-property-limit="4"
        />
      }
      sidebar={
        <>
          <Box testId="about-section" color="white" padding="xl" rounded={true}>
            <div data-entryscape="datavocVanity" />
          </Box>
          <Box testId="about-section" color="white" padding="xl" rounded={true}>
            <div data-entryscape="datavocInfobox" />
          </Box>
        </>
      }
    />
  );
}
