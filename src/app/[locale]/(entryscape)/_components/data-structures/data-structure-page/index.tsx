"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Box } from "@/components/box";

import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

interface DataStructurePageProps {
  pageType: "class" | "property";
}

/**
 * Landing page for a Klass (rdfs:Class) or Egenskap (rdf:Property). The React
 * shell owns the breadcrumb, title, badge, description, data-vocabulary line and
 * the "Detaljer" sidebar (with RDF downloads). The two specification listings
 * use MetaSolutions blocks (introducedInSpecViaInspec / reusedInSpecViaInspec)
 * so they get the engine's built-in pagination for many reused specs. All React
 * data is fetched server-side in the provider's class/property case.
 */
export function DataStructurePage({ pageType }: DataStructurePageProps) {
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
      intro={<span data-entryscape={`${pageType}Header`} />}
      main={<div data-entryscape={`${pageType}Main`} />}
      sidebar={
        <Box testId="about-section" color="white" padding="xl" rounded={true}>
          <div data-entryscape={`${pageType}Infobox`} />
        </Box>
      }
    />
  );
}
