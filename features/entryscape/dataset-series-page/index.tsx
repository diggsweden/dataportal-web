"use client";

import type { Entry } from "@entryscape/entrystore-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type FC, useContext, useEffect, useMemo } from "react";

import { Badge } from "@/components/badge";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { createSearchProviderSettings } from "@/features/search/search-page/search-page-entryscape/search-page-provider-settings";
import { SearchResults } from "@/features/search/search-results";
import { useEntryScapeBlocks } from "@/hooks/use-entry-scape-blocks";
import { EntrystoreContext } from "@/providers/entrystore-provider";
import SearchProvider, {
  SearchContext,
  type SearchContextData,
} from "@/providers/search-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

const SearchTrigger: FC<{ search: SearchContextData; entry: Entry }> = ({
  search,
  entry,
}) => {
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
};

export const DatasetSeriesPage: FC = () => {
  const pathname = usePathname();
  const { env, setBreadcrumb, iconSize } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const t = useTranslations();
  const lang = useLocale();

  useEntryScapeBlocks({
    entrystoreBase: entry.entrystore.getBaseURI(),
    env: entry.env,
    lang,
    iconSize,
    pageType: "dataset",
    context: entry.context,
    esId: entry.esId,
  });

  useEffect(() => {
    setBreadcrumb?.({
      name: entry.title,
      crumbs: [
        { name: "start", link: { ...linkBase, link: "/" } },
        {
          name: t("routes.datasets.title"),
          link: { ...linkBase, link: `/${t("routes.datasets.path")}?q=&f=` },
        },
      ],
    });
  }, [pathname, entry]);

  const searchProviderSettings = useMemo(
    () => createSearchProviderSettings(env, lang),
    [env, lang],
  );

  return (
    <div>
      <div className="py-lg">
        <Container className="space-y-lg">
          <Badge
            data-test-id="datasetseries-badge"
            text={t("pages.dataset-series.data-serie")}
          />
          <Heading level={1} size="lg" className="mb-none">
            {entry.title}
          </Heading>
          <div className="space-y-md">
            {entry.description && (
              <div className="my-md text-md text-textSecondary">
                {entry.description}
              </div>
            )}
            {entry.publisher && (
              <div data-test-id="publisher" className="text-sm font-strong">
                {entry.publisher}
              </div>
            )}
          </div>
        </Container>
      </div>

      <SearchProvider
        {...searchProviderSettings["datasets-series"]}
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
                        <div data-entryscape="aboutDatasetSeries" />
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
                        {entry.mqaCatalog && (
                          <div>
                            <Heading
                              className="font-strong text-textSecondary"
                              level={3}
                              size={"xxs"}
                            >
                              {t("pages.datasetpage.mqa-catalog")}
                            </Heading>
                            <Link
                              className="text-sm text-green-600 underline-offset-2 hover:no-underline"
                              href={entry.mqaCatalog.url}
                            >
                              {entry.mqaCatalog.title}
                            </Link>
                          </div>
                        )}
                        <div />

                        {/* Catalog */}
                        <div data-entryscape="catalog" />

                        <div
                          data-entryscape="view"
                          data-entryscape-rdformsid="dcat:OnlyCatalog"
                          data-entryscape-relationinverse="dcat:datasetSeries"
                          data-entryscape-onecol="true"
                          data-entryscape-filterpredicates="dcterms:issued,dcterms:language,dcterms:modified,dcterms:spatial,dcterms:license,dcat:themeTaxonomi"
                        />

                        {/* Download formats */}
                        {entry.downloadFormats &&
                          entry.downloadFormats?.length > 0 && (
                            <div data-test-id="download-formats">
                              <Heading
                                className="font-strong text-textSecondary"
                                level={3}
                                size={"xxs"}
                              >
                                {t("pages.datasetpage.download_link")}
                              </Heading>
                              <div className="flex flex-col gap-xs">
                                {entry.downloadFormats.map(
                                  ({ title, url }, idx) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      className="text-sm text-green-600 hover:no-underline"
                                    >
                                      {title}
                                    </a>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
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
};
