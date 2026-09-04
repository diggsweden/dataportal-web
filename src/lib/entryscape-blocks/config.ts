import type { Translate } from "@/i18n/types";
import { includeLangInPath } from "@/utilities/check-lang";

import { accessServiceCustom, exploreApiLink } from "./global";

const SKOS_IN_SCHEME = "http://www.w3.org/2004/02/skos/core#inScheme";
const RDFS_IS_DEFINED_BY = "http://www.w3.org/2000/01/rdf-schema#isDefinedBy";

/**
 * Data-structures search filtered to the current terminology / data vocabulary,
 * mirroring `buildFacetSearchLink`. `f` must be the six-part facet the search
 * provider parses — a bare URI is dropped and only `rt` applies. Pre-encoded
 * because `esb:` interpolates verbatim; `${uri}` also stands in for the chip
 * label, since the engine exposes no title.
 */
const dataStructureSearch = (
  predicate: string,
  rdfType: string,
  label: string,
) => {
  const facet = [
    encodeURIComponent(predicate),
    "${uri}",
    "false",
    "uri",
    encodeURIComponent(label),
    "${uri}",
  ].join("%7C%7C");

  return `/data-structures?q=&f=${facet}&rt=${rdfType}`;
};

interface CreateBlocksConfigProps {
  entrystoreBase: string;
  lang: string;
  t: Translate;
  pageType: string;
  context: string;
  esId: string;
}

export const createBlocksConfig = ({
  entrystoreBase,
  lang,
  context,
  esId,
  t,
  pageType,
}: CreateBlocksConfigProps) => {
  const baseConfig = {
    block: "config",
    page_language: lang,
    spa: true,
    entrystore: entrystoreBase || "https://admin.dataportal.se/store",
    ...(context !== "" && { context }),
    ...(esId !== "" && { entry: esId }),
    clicks: {
      concept: `${includeLangInPath(lang)}/concepts/\${context}_\${entry}`,
      class: `${includeLangInPath(lang)}/class/\${context}_\${entry}`,
      property: `${includeLangInPath(lang)}/property/\${context}_\${entry}`,
      datavoc: `${includeLangInPath(lang)}/data-vocabulary/\${context}_\${entry}`,
      terminology: `${includeLangInPath(lang)}/terminology/\${context}_\${entry}`,
      organization: `${includeLangInPath(lang)}/organisations/\${context}_\${entry}`,
      dataset: `${includeLangInPath(lang)}/datasets/\${context}_\${entry}`,
      spec: `${includeLangInPath(lang)}/specifications/\${context}_\${entry}`,
      ap: `${includeLangInPath(lang)}/specifications/\${context}_\${entry}/ap`,
      "dataservice-link": `${includeLangInPath(lang)}/dataservice/\${context}_\${entry}`,
      katalog: `${includeLangInPath(lang)}/metadatakvalitet/katalog/\${entry}/\${context}`,
      conceptSearch: `esb:${includeLangInPath(lang)}${dataStructureSearch(SKOS_IN_SCHEME, "term", t("pages.terminology.terminology"))}`,
      classSearch: `esb:${includeLangInPath(lang)}${dataStructureSearch(RDFS_IS_DEFINED_BY, "term_class", t("pages.data-vocabulary.data-vocabulary"))}`,
      propertySearch: `esb:${includeLangInPath(lang)}${dataStructureSearch(RDFS_IS_DEFINED_BY, "term_property", t("pages.data-vocabulary.data-vocabulary"))}`,
      classLookup: `${includeLangInPath(lang)}/class/`,
      propertyLookup: `${includeLangInPath(lang)}/property/`,
      terminologyLookup: `${includeLangInPath(lang)}/terminology/`,
    },
  };

  switch (pageType) {
    case "dataset":
    case "dataset-series":
      return [
        {
          ...baseConfig,
          clicks: {
            ...baseConfig.clicks,
            exploreApi: `${includeLangInPath(lang)}/datasets/${context}_${esId}/apiexplore/\${entry}`,
          },
          blocks: [
            exploreApiLink(context, t, "mt-md md:mt-none md:ml-md"),
            accessServiceCustom(t),
          ],
        },
      ];
    case "dataservice":
      return [
        {
          ...baseConfig,
          clicks: {
            ...baseConfig.clicks,
            exploreApi: `${includeLangInPath(lang)}/datasets/${context}_${esId}/apiexplore/\${entry}`,
          },
          blocks: [exploreApiLink(context, t)],
        },
      ];
    default:
      return [baseConfig];
  }
};
