import type { EnvSettings } from "@/env/env-settings";
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
  env: EnvSettings;
  lang: string;
  t: Translate;
  pageType: string;
  context: string;
  esId: string;
}

export const createBlocksConfig = ({
  entrystoreBase,
  env,
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
    },
  };

  switch (pageType) {
    case "specification":
      return [
        {
          ...baseConfig,
          itemstore: {
            bundles: [
              `https://${
                env.ENTRYSCAPE_SPECS_PATH.includes("sandbox")
                  ? "sandbox.admin.dataportal.se"
                  : "editera.dataportal.se"
              }/theme/templates/adms.json`,
            ],
          },
        },
      ];
    case "concept":
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
    case "terminology":
      return [
        {
          ...baseConfig,
          collections: [
            {
              type: "facet",
              name: "terminology",
              label: "Terminologier",
              property: "skos:inScheme",
              nodetype: "uri",
              limit: 10,
            },
          ],
          blocks: [conceptLink(lang)],
        },
      ];
    case "dataset":
    case "dataset-series":
      return [
        {
          ...baseConfig,
          clicks: {
            "dataservice-link": `/${lang}/dataservice/\${context}_\${entry}`,
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
            exploreApi: `${includeLangInPath(lang)}/datasets/${context}_${esId}/apiexplore/\${entry}`,
          },
          blocks: [exploreApiLink(context, t)],
        },
      ];
    case "apiexplore":
      return [
        {
          ...baseConfig,
          clicks: {
            "dataservice-link": `/${lang}/dataservice/\${context}_\${entry}`,
          },
        },
      ];
    case "mqa":
      return [
        {
          ...baseConfig,
          clicks: {
            katalog:
              includeLangInPath(lang) +
              "/metadatakvalitet/katalog/${entry}/${context}",
          },
        },
      ];
    default:
      return [baseConfig];
  }
};
