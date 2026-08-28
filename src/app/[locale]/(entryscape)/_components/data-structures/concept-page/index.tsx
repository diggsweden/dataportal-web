"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Box } from "@/components/box";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

export function ConceptPage() {
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
      intro={<span data-entryscape="conceptHeader" />}
      main={<div data-entryscape="conceptMain" />}
      sidebar={
        <Box testId="about-section" color="white" padding="xl" rounded={true}>
          <div data-entryscape="conceptInfobox" />
        </Box>
      }
      footer={
        <>
          <Heading level={2} size="md" className="mb-sm">
            {t("pages.concept_page.visualization_concepts")}
          </Heading>
          <div
            data-entryscape="hierarchy"
            data-entryscape-scale="1.7"
            className="concept_hierarchy bg-white py-md overflow-auto"
          />
        </>
      }
    />
  );
}
