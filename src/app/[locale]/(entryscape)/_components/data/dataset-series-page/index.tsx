"use client";

import type { Entry } from "@entryscape/entrystore-js";
import { useLocale, useTranslations } from "next-intl";
import { useContext, useEffect, useMemo } from "react";
import { createSearchProviderSettings } from "@/app/[locale]/(entryscape)/_search/search-page/search-page-provider-settings";
import { SearchResults } from "@/app/[locale]/(entryscape)/_search/search-results";
import { Badge } from "@/components/badge";
import { LabelLink } from "@/components/label-link";
import { Container } from "@/components/layout/container";
import { BreadcrumbSetter } from "@/components/navigation/breadcrumbs/breadcrumb-setter";
import { SidebarSection } from "@/components/sidebar-section";
import { Heading } from "@/components/typography/heading";
import { EntrystoreContext } from "@/lib/entrystore/provider";
import SearchProvider, {
  SearchContext,
  type SearchContextData,
} from "@/providers/search-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { buildBreadcrumb } from "@/utilities/breadcrumb-helpers";

function SearchTrigger({
  search,
  entry,
}: {
  search: SearchContextData;
  entry: Entry;
}) {
  useEffect(() => {
    if (!search) return;

    // Perform initial search
    search
      .set({
        page: 0,
        query: "",
        fetchFacets: true,
      })
      .then(() => search.doSearch(false, false, false, false));
  }, [entry]);

  return null;
}

export function DatasetSeriesPage() {
  const { env } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const lang = useLocale();

  const searchProviderSettings = useMemo(
    () => createSearchProviderSettings(lang),
    [lang],
  );

  return (
    <div>
      <BreadcrumbSetter
        {...buildBreadcrumb(entry.title, [
          {
            name: t("routes.datasets.title"),
            link: `/${t("routes.datasets.path")}?q=&f=`,
          },
        ])}
      />
      <div className="py-lg">
        <Container className="space-y-lg">
          <Badge
            data-test-id="datasetseries-badge"
            text={t("pages.dataset-series.data-serie")}
          />
          <Heading level={1} size="lg" className="mb-none">
            {entry.title}
          </Heading>

          <p
            data-test-id="description"
            data-entryscape="text"
            data-entryscape-property="dcterms:description"
            className="text-textSecondary whitespace-pre-line mb-lg"
          />

          <LabelLink
            testId="publisher"
            value={entry.relatedResource}
            size="small"
            color="primary"
            className="font-strong"
          />
        </Container>
      </div>

      <SearchProvider
        {...searchProviderSettings["datasets-series"]}
        env={env}
        entry={entry.entry}
      >
        <SearchContext.Consumer>
          {(search) => (
            <div className="mt-xl bg-white py-xl">
              <SearchTrigger search={search} entry={entry.entry} />
              <Container>
                <div className="mb-lg gap-2xl md:mb-xl lg:flex">
                  {/* Left column - Search results */}
                  <div className="mb-lg flex w-full flex-col gap-lg lg:mb-xl lg:max-w-md">
                    <div
                      className={
                        search.result.hits && search.result.hits.length === 0
                          ? "min-h-[800px]"
                          : ""
                      }
                    >
                      <SearchResults
                        showSorting={false}
                        search={search}
                        searchMode={"datasets-series"}
                      />
                    </div>
                  </div>

                  {/* Right column - About and Catalog */}
                  <div className="mb-lg w-full max-w-md space-y-lg bg-white pt-none lg:mb-none lg:max-w-[18.5rem]">
                    {/* About dataset series - wrapper */}
                    <div
                      data-test-id="about-section"
                      className="box-border w-full p-md"
                    >
                      <Heading
                        level={2}
                        size={"sm"}
                        className="mb-md font-strong text-textSecondary md:mb-lg"
                      >
                        {t("pages.dataset-series.about-dataset-serie")}
                      </Heading>

                      <div className="space-y-lg">
                        {/* About dataset series */}
                        <div
                          data-entryscape="view"
                          data-entryscape-onecol="true"
                          data-entryscape-rdformsid="dcat:DatasetSeries"
                          data-entryscape-filterpredicates="dcterms:title,dcterms:description"
                        />
                      </div>
                    </div>

                    {/* Catalog information wrapper */}
                    <div
                      data-test-id="catalog-information"
                      className="box-border w-full p-md"
                    >
                      <Heading
                        level={2}
                        size={"sm"}
                        className="mb-sm font-strong text-textSecondary md:mb-md"
                      >
                        {t("pages.datasetpage.catalog")}
                      </Heading>
                      <div className="space-y-lg">
                        <SidebarSection
                          heading={t("pages.datasetpage.mqa-catalog")}
                          items={[entry.mqaCatalog]}
                        />

                        {/* Catalog */}
                        <div
                          data-entryscape="view"
                          data-entryscape-onecol="true"
                          data-entryscape-rdformsid="dcat:Catalog"
                          data-entryscape-relationinverse="dcat:inSeries"
                          data-entryscape-filterpredicates="dcterms:title,dcterms:description,dcterms:publisher"
                        />

                        {/* Download formats */}
                        <SidebarSection
                          heading={t("pages.datasetpage.download_link")}
                          items={entry.downloadFormats ?? []}
                          testId="download-formats"
                        />
                      </div>
                    </div>
                  </div>
                  {/* End right column */}
                </div>
              </Container>
            </div>
          )}
        </SearchContext.Consumer>
      </SearchProvider>
    </div>
  );
}
