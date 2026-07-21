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

const CONCEPT_RELATIONS = [
  {
    relation: "skos:broader",
    heading: "pages.concept_page.superior_concept",
    placeholder: "pages.concept_page.no_superior_concept",
  },
  {
    relation: "skos:narrower",
    heading: "pages.concept_page.subordinate_concepts",
    placeholder: "pages.concept_page.no_subordinate_concepts",
  },
  {
    relation: "skos:related",
    heading: "pages.concept_page.related_concepts",
    placeholder: "pages.concept_page.no_related_concepts",
  },
] as const;

/**
 * SKOS documentation notes shown (each only when present) below the concept's
 * definition. `heading` is an app i18n key; the value is rendered by the block.
 */
const CONCEPT_NOTES = [
  { property: "skos:example", heading: "pages.concept_page.example" },
  {
    property: "skos:historyNote",
    heading: "pages.concept_page.historical_note",
  },
  {
    property: "skos:editorialNote",
    heading: "pages.concept_page.editorial_note",
  },
  { property: "skos:note", heading: "pages.concept_page.note" },
] as const;

function RelationSection({
  relation,
  heading,
  placeholder,
}: (typeof CONCEPT_RELATIONS)[number]) {
  const t = useTranslations();

  return (
    <section className="mb-lg">
      <Heading level={2} size="md" className="mb-sm">
        {t(heading)}
      </Heading>
      <div
        data-entryscape="listStandard"
        data-entryscape-relation={relation}
        data-entryscape-listplaceholder={t(placeholder)}
        data-entryscape-rowhead="{{conceptLink}}"
        data-entryscape-limit={15}
      />
    </section>
  );
}

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
      title={entry.title}
      columnsLayout="rowSpaced"
      mainLayout="content"
      sidebarLayout="panelRaised"
      sidebarTestId="about-section"
      main={
        <>
          <LabelLink
            value={entry.relatedResource}
            testId="related-term"
            size="large"
            className="mb-xl"
          />

          <Badge
            color="dark-green"
            className="w-fit mb-lg"
            text={t("pages.data-structures.types.concept")}
          />

          <p
            className="mb-lg text-textSecondary whitespace-pre-line"
            data-test-id="description"
            data-entryscape="text"
            data-entryscape-property="skos:definition"
          />

          <div
            data-entryscape="template"
            data-entryscape-template={`{{#ifprop "skos:altLabel"}}
              <h2>{{nls "concept.altLabel"}}</h2>
              <p>{{#eachprop "skos:altLabel" separator=", "}}{{value}}{{separator}}{{/eachprop}}</p>
              {{/ifprop}}`}
          />

          {CONCEPT_RELATIONS.map((r) => (
            <RelationSection key={r.relation} {...r} />
          ))}

          {CONCEPT_NOTES.map(({ property, heading }) => (
            <div
              key={property}
              data-entryscape="template"
              data-entryscape-template={`{{#ifprop "${property}"}}
              <h2>${t(heading)}</h2>
              <p>{{prop "${property}"}}</p>{{/ifprop}}`}
            />
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
            {t("pages.concept_page.about_concept")}
          </Heading>
          <div className="space-y-lg">
            <SidebarSection
              heading={t("pages.concept_page.concept_adress")}
              items={[{ title: entry.address, url: entry.address }]}
              testId="address"
            />
            <SidebarSection
              heading={t("pages.datasetpage.related_specifications")}
              items={entry.relatedSpecifications ?? []}
            />
            <SidebarSection
              heading={t("pages.concept_page.terminology_concept")}
              items={[entry.relatedResource]}
              testId="related-terminology"
            />
            <SidebarSection
              heading={t("pages.datasetpage.download_link")}
              items={(entry.downloadFormats ?? []).map(
                ({ title, url }, idx) => ({
                  title,
                  url: idx === 0 ? url : `${url}&recursive=conceptscheme`,
                }),
              )}
              testId="download-formats"
            />
          </div>
        </>
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
