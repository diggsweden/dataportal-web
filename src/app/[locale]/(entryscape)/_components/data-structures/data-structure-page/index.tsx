"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { EntryscapeResourcePage } from "@/app/[locale]/(entryscape)/_components/entryscape-resource-page";
import { Badge } from "@/components/badge";
import { LabelLink } from "@/components/label-link";
import { SidebarSection } from "@/components/sidebar-section";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

interface DataStructurePageProps {
  pageType: "class" | "property";
}

const SPECIFICATION_RELATIONS = [
  {
    relation: "inspec:introduces",
    heading: "pages.data-structures.introduced-in-specification",
    placeholder: "pages.data-structures.no-introduced-in-specification",
  },
  {
    relation: "inspec:reuses",
    heading: "pages.data-structures.reused-in-specification",
    placeholder: "pages.data-structures.no-reused-in-specification",
  },
] as const;

function SpecificationSection({
  relation,
  heading,
  placeholder,
}: (typeof SPECIFICATION_RELATIONS)[number]) {
  const t = useTranslations();
  return (
    <section className="mb-lg">
      <Heading level={2} size="md" className="mb-sm">
        {t(heading)}
      </Heading>
      <div
        data-entryscape="listStandard"
        data-entryscape-relationinverse={relation}
        data-entryscape-listplaceholder={t(placeholder)}
        data-entryscape-rowhead="{{specificationLink}}"
        data-entryscape-limit={15}
        className="flex flex-col gap-lg"
      />
    </section>
  );
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
      title={entry.title}
      columnsLayout="rowSpaced"
      mainLayout="content"
      sidebarLayout="panelRaised"
      sidebarTestId="about-section"
      intro={
        <Badge
          text={t(`pages.data-structures.types.${pageType}`)}
          color="dark-green"
        />
      }
      main={
        <>
          <p
            className="mb-lg empty:mb-none text-textSecondary whitespace-pre-line"
            data-test-id="description"
            data-entryscape="text"
            data-entryscape-property="rdfs:comment"
          />

          <LabelLink
            value={entry.relatedResource}
            size="large"
            className="mb-lg block break-words"
          />

          {SPECIFICATION_RELATIONS.map((r) => (
            <SpecificationSection key={r.relation} {...r} />
          ))}
        </>
      }
      sidebar={
        <>
          <Heading
            level={2}
            size="sm"
            className="mb-sm font-strong text-textSecondary md:mb-md"
          >
            {t("pages.data-structures.details")}
          </Heading>
          <div className="space-y-lg">
            <div
              className="text-sm"
              data-entryscape="view"
              data-entryscape-onecol="true"
              data-entryscape-filterpredicates="rdfs:comment"
            />

            <SidebarSection
              heading={t("pages.datasetpage.download_link")}
              items={entry.downloadFormats ?? []}
              testId="download-formats"
            />
          </div>
        </>
      }
    />
  );
}
