import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect, useMemo } from "react";

import { Badge } from "@/components/badge";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { createSearchProviderSettings } from "@/features/search/search-page/search-page-entryscape/search-page-provider-settings";
import { SearchResults } from "@/features/search/search-results";
import { EntrystoreContext } from "@/providers/entrystore-provider";
import SearchProvider, { SearchContext } from "@/providers/search-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const DatasetSeriesPage: FC = () => {
  const { pathname } = useRouter() || {};
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { t, lang } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    setBreadcrumb?.({
      name: entry.title,
      crumbs: [
        { name: "start", link: { ...linkBase, link: "/" } },
        {
          name: t("routes|datasets$title"),
          link: { ...linkBase, link: `/${t("routes|datasets$path")}?q=&f=` },
        },
      ],
    });
  }, [pathname, entry]);

  useEffect(() => {
    // Check if there are no query parameters or if they're empty
    if (!router.query.q && !router.query.f) {
      // Update URL with default query parameters
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, q: "", f: "" },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [router.isReady]);

  const searchProviderSettings = useMemo(
    () => createSearchProviderSettings(env, lang),
    [env, lang],
  );

  return (
    <div>
      <div className="py-lg">
        <Container className="space-y-lg">
          <Badge text={t("pages|dataset-series$data-serie")} />
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
              <div className="text-sm font-strong">{entry.publisher}</div>
            )}
          </div>
        </Container>
      </div>

      <SearchProvider
        router={router}
        {...searchProviderSettings["datasets-series"]}
        entry={entry.entry}
      >
        <SearchContext.Consumer>
          {(search) => (
            <div className="mt-xl bg-white py-xl">
              <Container>
                <div
                  className={
                    search.result.hits && search.result.hits.length === 0
                      ? "min-h-[800px]"
                      : " "
                  }
                >
                  <SearchResults
                    showSorting={false}
                    search={search}
                    searchMode={"datasets-series"}
                  />
                </div>
              </Container>
            </div>
          )}
        </SearchContext.Consumer>
      </SearchProvider>
    </div>
  );
};
