import type { Translate } from "@/i18n/types";
import { includeLangInPath } from "@/utilities/check-lang";

import {
  accessServiceCustom,
  conceptLink,
  exploreApiLink,
  specificationLink,
} from "./global";

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
      "dataservice-link": `${includeLangInPath(lang)}/dataservice/\${context}_\${entry}`,
      katalog: `${includeLangInPath(lang)}/metadatakvalitet/katalog/\${entry}/\${context}`,
    },
  };

  switch (pageType) {
    case "concept":
    case "terminology":
      return [
        {
          ...baseConfig,
          blocks: [conceptLink(lang)],
        },
      ];
    case "class":
    case "property":
      return [
        {
          ...baseConfig,
          blocks: [specificationLink(lang)],
        },
      ];
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
