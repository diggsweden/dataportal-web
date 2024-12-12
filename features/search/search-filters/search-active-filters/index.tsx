import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

import CrossIcon from "@/assets/icons/cross.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import { Button } from "@/components/button";
import { SearchContextData } from "@/providers/search-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { ESRdfType } from "@/types/entrystore-core";
import { SearchFacetValue } from "@/types/search";
import { clearCurrentScrollPos } from "@/utilities/scroll-helper";

import { SearchMode } from "../index";

interface SearchActiveFiltersProps {
  search: SearchContextData;
  query: string;
  searchMode: SearchMode;
}

export function SearchActiveFilters({
  search,
  query,
  searchMode,
}: SearchActiveFiltersProps) {
  const { t } = useTranslation();
  const { iconSize } = useContext(SettingsContext);

  // Create an array of active special search filters
  const activeSpecialSearchFilters = Object.entries(search.allFacets || {})
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, facet]) =>
        facet.specialSearch &&
        facet.specialSearch.length === search.request.esRdfTypes?.length &&
        facet.specialSearch.every(
          (type) => search.request.esRdfTypes?.includes(type),
        ),
    )
    .map(([key, facet]) => ({
      facet: key,
      title: facet.title,
      specialSearch: facet.specialSearch,
    }));

  const hasActiveFilters =
    (search.request.facetValues && search.request.facetValues.length > 0) ||
    activeSpecialSearchFilters.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mt-lg flex flex-col gap-md md:flex-row md:items-center">
      <span className="w-[7.5rem] text-textSecondary">
        {t("common|active-filters")}:
      </span>
      <div className="flex flex-row flex-wrap gap-md md:items-center">
        {search.request.facetValues?.map(
          (facetValue: SearchFacetValue, index: number) => {
            if (!facetValue.specialFilter && !facetValue.specialSearch) {
              return (
                <Button
                  variant="filter"
                  size="xs"
                  key={index}
                  label={facetValue.title || facetValue.resource}
                  aria-label={`${t("common|clear-filters")} ${
                    facetValue.title || facetValue.resource
                  }`}
                  icon={CrossIcon}
                  iconPosition="right"
                  className="w-fit justify-between py-xs text-left font-strong md:py-[2px]"
                  onClick={() => {
                    clearCurrentScrollPos();
                    search.toggleFacet(facetValue).then(() => {
                      search.doSearch();
                    });
                  }}
                />
              );
            } else if (facetValue.specialFilter) {
              return (
                <Button
                  variant="filter"
                  size="xs"
                  key={index}
                  label={t(`resources|${facetValue.facet}`)}
                  aria-label={`${t("common|clear-filters")} ${t(
                    `resources|${facetValue.facet}`,
                  )}`}
                  icon={CrossIcon}
                  iconPosition="right"
                  className="w-fit justify-between py-xs text-left font-strong md:py-[2px]"
                  onClick={() => {
                    clearCurrentScrollPos();
                    search.toggleFacet(facetValue).then(() => {
                      search.doSearch();
                    });
                  }}
                />
              );
            }
          },
        )}

        {activeSpecialSearchFilters.map((filter, index) => (
          <Button
            variant="filter"
            size="xs"
            key={`special-search-${index}`}
            label={t(`resources|${filter.facet}`)}
            aria-label={`${t("common|clear-filters")} ${t(
              `resources|${filter.facet}`,
            )}`}
            icon={CrossIcon}
            iconPosition="right"
            className="w-fit justify-between py-xs text-left font-strong md:py-[2px]"
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

        {search.request.facetValues &&
          search.request.facetValues.length >= 2 && (
            <Button
              variant="plain"
              size="xs"
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
              className="whitespace-nowrap"
              iconSize={iconSize * 1.5}
            />
          )}
      </div>
    </div>
  );
}
