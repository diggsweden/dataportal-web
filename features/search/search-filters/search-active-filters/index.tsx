import useTranslation from "next-translate/useTranslation";

import CrossIcon from "@/assets/icons/cross.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import { Button } from "@/components/button";
import { SearchContextData } from "@/providers/search-provider";
import { ESRdfType } from "@/types/entrystore-core";
import { SearchFacetValue } from "@/types/search";
import { clearCurrentScrollPos } from "@/utilities/scroll-helper";

import { SearchMode } from "../index";

interface SearchActiveFiltersProps {
  search: SearchContextData;
  query: string;
  searchMode: SearchMode;
}

export function ClearFiltersButton({
  search,
  searchMode,
  className,
}: {
  search: SearchContextData;
  searchMode: SearchMode;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <Button
      variant="plain"
      size="md"
      icon={TrashIcon}
      iconPosition="left"
      onClick={() => {
        clearCurrentScrollPos();
        search
          .set({
            facetValues: [],
            esRdfTypes:
              searchMode === "datasets"
                ? [
                    ESRdfType.dataset,
                    ESRdfType.data_service,
                    ESRdfType.dataset_series,
                  ]
                : search.request.esRdfTypes,
          })
          .then(() => search.doSearch());
      }}
      label={t("common|clear-filters")}
      className={`whitespace-nowrap p-xs pr-sm ${className ?? ""}`}
    />
  );
}

export function SearchActiveFilters({
  search,
  query,
  searchMode,
}: SearchActiveFiltersProps) {
  const { t } = useTranslation();

  // Create an array of active special search filters
  const activecustomSearchFilters = Object.entries(search.allFacets || {})
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, facet]) =>
        facet.customSearch &&
        facet.customSearch.length === search.request.esRdfTypes?.length &&
        facet.customSearch.every(
          (type) => search.request.esRdfTypes?.includes(type),
        ),
    )
    .map(([key, facet]) => ({
      facet: key,
      title: facet.title,
      customSearch: facet.customSearch,
    }));

  const hasActiveFilters =
    (search.request.facetValues && search.request.facetValues.length > 0) ||
    activecustomSearchFilters.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div
      data-test-id="search-active-filters"
      className="flex flex-col gap-md md:mt-lg md:flex-row md:items-center"
    >
      <span className="w-[6.25rem] flex-shrink-0 text-textSecondary md:mb-auto md:mt-xs">
        {t("common|active-filters")}:
      </span>
      <div className="flex flex-col gap-lg">
        <div
          data-test-id="search-active-filters-list"
          className="flex flex-row flex-wrap gap-md md:items-center"
        >
          {search.request.facetValues?.map(
            (facetValue: SearchFacetValue, index: number) => {
              const label =
                !facetValue.customFilter && !facetValue.customSearch
                  ? facetValue.title || facetValue.resource
                  : t(
                      `resources|${facetValue.customLabel || facetValue.facet}`,
                    );

              return (
                <Button
                  variant="filter"
                  size="md"
                  key={index}
                  label={label}
                  aria-label={`${t("common|clear-filters")} ${label}`}
                  icon={CrossIcon}
                  iconPosition="right"
                  className="w-fit justify-between py-xs text-left font-strong"
                  onClick={() => {
                    clearCurrentScrollPos();
                    search.toggleFacet(facetValue).then(() => {
                      search.doSearch();
                    });
                  }}
                />
              );
            },
          )}

          {activecustomSearchFilters.map((filter, index) => (
            <Button
              variant="filter"
              size="md"
              key={`special-search-${index}`}
              label={t(`resources|${filter.facet}`)}
              aria-label={`${t("common|clear-filters")} ${t(
                `resources|${filter.facet}`,
              )}`}
              icon={CrossIcon}
              iconPosition="right"
              className="w-fit justify-between py-xs text-left font-strong"
              onClick={() => {
                clearCurrentScrollPos();
                search
                  .set({
                    esRdfTypes: [
                      ESRdfType.dataset,
                      ESRdfType.data_service,
                      ESRdfType.dataset_series,
                    ],
                    query: query,
                  })
                  .then(() => search.doSearch());
              }}
            />
          ))}
          {/* Desktop clear filters button */}
          {search.request.facetValues &&
            search.request.facetValues.length >= 2 && (
              <ClearFiltersButton
                search={search}
                searchMode={searchMode}
                className="hidden md:flex"
              />
            )}
        </div>
        {/* Mobile clear filters button */}
        {search.request.facetValues &&
          search.request.facetValues.length >= 2 && (
            <ClearFiltersButton
              search={search}
              searchMode={searchMode}
              className="md:hidden"
            />
          )}
      </div>
    </div>
  );
}
