import { useTranslations } from "next-intl";
import CrossIcon from "@/assets/icons/cross.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import { Button } from "@/components/button";
import { useResourceLabel } from "@/i18n/use-resource-label";
import type { SearchContextData } from "@/providers/search-provider";
import type { SearchFacetValue } from "@/types/search";
import { clearCurrentScrollPos } from "@/utilities/scroll-helper";

interface SearchActiveFiltersProps {
  search: SearchContextData;
  query: string;
}

export function ClearFiltersButton({
  search,
  className,
}: {
  search: SearchContextData;
  className?: string;
}) {
  const t = useTranslations();

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
            esRdfTypes: search.defaultEsRdfTypes,
          })
          .then(() => search.doSearch());
      }}
      label={t("common.clear-filters")}
      className={`whitespace-nowrap p-xs pr-sm ${className ?? ""}`}
    />
  );
}

export function SearchActiveFilters({
  search,
  query,
}: SearchActiveFiltersProps) {
  const t = useTranslations();
  const tResource = useResourceLabel();

  // The link's own title is only as good as its builder; prefer the fetched one.
  const facetTitle = (facetValue: SearchFacetValue) =>
    Object.values(search.allFacets || {})
      .find((facet) => facet.predicate === facetValue.facet)
      ?.facetValues?.find((value) => value.resource === facetValue.resource)
      ?.title;

  // Create an array of active special search filters
  const activecustomSearchFilters = Object.entries(search.allFacets || {})
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, facet]) =>
        facet.customSearch &&
        facet.customSearch.length === search.request.esRdfTypes?.length &&
        facet.customSearch.every((type) =>
          search.request.esRdfTypes?.includes(type),
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
        {t("common.active-filters")}:
      </span>
      <div className="flex flex-col gap-lg">
        <div
          data-test-id="search-active-filters-list"
          className="flex flex-row flex-wrap gap-md md:items-center"
        >
          {search.request.facetValues?.map((facetValue: SearchFacetValue) => {
            const label =
              !facetValue.customFilter && !facetValue.customSearch
                ? facetTitle(facetValue) ||
                  facetValue.title ||
                  facetValue.resource
                : tResource(facetValue.customLabel || facetValue.facet);

            return (
              <Button
                variant="filter"
                size="md"
                key={`${facetValue.facet}-${facetValue.resource}`}
                label={label}
                aria-label={`${t("common.clear-filters")} ${label}`}
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
          })}

          {activecustomSearchFilters.map((filter) => (
            <Button
              variant="filter"
              size="md"
              key={filter.facet}
              label={tResource(filter.facet)}
              aria-label={`${t("common.clear-filters")} ${tResource(filter.facet)}`}
              icon={CrossIcon}
              iconPosition="right"
              className="w-fit justify-between py-xs text-left font-strong"
              onClick={() => {
                clearCurrentScrollPos();
                search
                  .set({
                    esRdfTypes: search.defaultEsRdfTypes,
                    query: query,
                  })
                  .then(() => search.doSearch());
              }}
            />
          ))}
          {/* Desktop clear filters button */}
          {search.request.facetValues &&
            search.request.facetValues.length >= 2 && (
              <ClearFiltersButton search={search} className="hidden md:flex" />
            )}
        </div>
        {/* Mobile clear filters button */}
        {search.request.facetValues &&
          search.request.facetValues.length >= 2 && (
            <ClearFiltersButton search={search} className="md:hidden" />
          )}
      </div>
    </div>
  );
}
