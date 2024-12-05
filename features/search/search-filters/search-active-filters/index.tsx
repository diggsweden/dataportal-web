import useTranslation from "next-translate/useTranslation";

import CrossIcon from "@/assets/icons/cross.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import { Button } from "@/components/button";
import { SearchContextData } from "@/providers/search-provider";
import { SearchFacetValue } from "@/types/search";
import { ESRdfType } from "@/utilities/entryscape/entryscape";

import { SearchMode } from "../index";

interface SearchActiveFiltersProps {
  search: SearchContextData;
  query: string;
  searchMode: SearchMode;
  activeCheckboxFilters: Array<{
    id: string;
    label: string;
    facetValue?: SearchFacetValue;
    isApiFilter?: boolean;
  }>;
}

export function SearchActiveFilters({
  search,
  query,
  searchMode,
  activeCheckboxFilters,
}: SearchActiveFiltersProps) {
  const { t } = useTranslation();

  const clearCurrentScrollPos = () => {
    if (typeof localStorage != "undefined" && typeof location != "undefined") {
      localStorage.setItem(`ScrollposY_${location.search}`, "0");
    }
  };

  const hasActiveFilters = () => {
    return (
      (search.request.facetValues && search.request.facetValues.length > 0) ||
      activeCheckboxFilters.length > 0
    );
  };

  if (!hasActiveFilters()) return null;

  return (
    <div className="mt-lg flex flex-col gap-md md:flex-row md:items-center">
      <span className="w-[7.5rem] text-textSecondary">
        {t("common|active-filters")}:
      </span>
      <div className="flex flex-row flex-wrap gap-md md:items-center">
        {search.request.facetValues?.map(
          (facetValue: SearchFacetValue, index: number) =>
            facetValue.facet !==
              "http://data.europa.eu/r5r/applicableLegislation" &&
            facetValue.facet !== "http://purl.org/dc/terms/subject" && (
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
            ),
        )}

        {activeCheckboxFilters.map((filter) => (
          <Button
            key={filter.id}
            variant="filter"
            size="xs"
            label={filter.label}
            aria-label={`${t("common|clear-filters")} ${filter.label}`}
            icon={CrossIcon}
            iconPosition="right"
            className="w-fit justify-between py-xs text-left font-strong md:py-[2px]"
            onClick={() => {
              clearCurrentScrollPos();
              if (filter.isApiFilter) {
                search
                  .set({
                    esRdfTypes: [
                      ESRdfType.dataset,
                      ESRdfType.esterms_IndependentDataService,
                      ESRdfType.esterms_ServedByDataService,
                    ],
                    query: query,
                  })
                  .then(() => search.doSearch());
              } else if (filter.facetValue) {
                search.toggleFacet(filter.facetValue).then(() => {
                  search.doSearch();
                });
              }
            }}
          />
        ))}
      </div>

      {((search.request.facetValues &&
        search.request.facetValues.length >= 2) ||
        activeCheckboxFilters.length >= 2) && (
        <div className="mt-lg block whitespace-nowrap md:mt-none">
          <Button
            variant="plain"
            size="sm"
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
                          ESRdfType.esterms_IndependentDataService,
                          ESRdfType.esterms_ServedByDataService,
                        ]
                      : search.request.esRdfTypes,
                })
                .then(() => search.doSearch());
            }}
            label={t("common|clear-filters")}
            className="[&_svg]:h-[1.5rem] [&_svg]:w-[1.5rem]"
          />
        </div>
      )}
    </div>
  );
}
