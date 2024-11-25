import { Button } from "@/components/global/Button";
import { ESRdfType } from "@/utilities/entryScape";
import useTranslation from "next-translate/useTranslation";
import CloseIcon from "@/assets/icons/closeCross.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import { SearchContextData } from "@/providers/SearchProvider";
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
    <div className="mt-lg flex min-h-xl flex-col gap-md md:flex-row md:items-center">
      <div className="flex flex-col flex-wrap gap-sm md:flex-row md:items-center md:gap-md">
        <span className="text-textSecondary">
          {t("common|active-filters")}:
        </span>

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
                icon={CloseIcon}
                iconPosition="right"
                className="w-full justify-between py-md text-left font-strong md:w-auto md:py-[2px]"
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
            icon={CloseIcon}
            iconPosition="right"
            className="w-full justify-between py-md text-left font-strong md:w-auto md:py-[2px]"
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
        activeCheckboxFilters.length > 2) && (
        <div className="block whitespace-nowrap">
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
          />
        </div>
      )}
    </div>
  );
}
