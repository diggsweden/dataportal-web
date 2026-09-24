"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { ContactPublisherBlock } from "@/app/[locale]/(entryscape)/_components/contact-publisher-block";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Box } from "@/components/box";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";
import { SpecificationImage } from "./image";

export function SpecificationPage() {
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();

  return (
    <EntryscapeResourcePage
      breadcrumb={buildBreadcrumb(entry.title, [
        {
          name: t("routes.specifications.title"),
          link: `/${t("routes.specifications.path")}?q=&f=`,
        },
      ])}
      intro={
        <span
          data-attribute="specification-header"
          data-entryscape="specHeader"
        />
      }
      main={
        <>
          <SpecificationImage />

          <div
            data-entryscape="specMain"
            data-entryscape-introduced-limit="20"
            data-entryscape-reused-limit="20"
          />
          <ContactPublisherBlock />
        </>
      }
      sidebar={
        <>
          <Box
            testId="related-datasets"
            color="white"
            padding="xl"
            rounded={true}
            className="mb-lg md:mb-xl"
          >
            <div data-entryscape="specVanity" />
          </Box>

          <Box testId="about-section" color="white" padding="xl" rounded={true}>
            <div
              data-entryscape="specInfobox"
              data-entryscape-keyword-limit="4"
            />
          </Box>
        </>
      }
    />
  );
}
