import { Translate } from "next-translate";

import { SearchHitFragment } from "@/graphql/__generated__/operations";
import { SearchHit } from "@/types/search";

/**
 * Parse Search_dataportal_Digg_Search
 * @param hit
 * @returns
 */
export const getSearchHit = (
  r: SearchHitFragment,
  t: Translate,
): SearchHit | null => {
  if (r && r.hit) {
    switch (r.hit.__typename) {
      case "dataportal_Digg_Container":
        return {
          url: `/${r.hit.slug}`,
          title: r.hit.heading ?? r.hit.name,
          description: r.highlights
            ?.map((c) => {
              return c?.value;
            })
            .join(" "),
          descriptionLang: r.highlights
            ?.map((c) => {
              return c?.value;
            })
            .join(" "),
        } as SearchHit;
      case "dataportal_Digg_News_Item":
        return {
          url: `/${t("routes|news$path")}/${r.hit.slug}`,
          title: r.hit?.heading ?? r.hit.name,
          description: r.highlights
            ?.map((c) => {
              return c?.value;
            })
            .join(" "),
          descriptionLang: r.highlights
            ?.map((c) => {
              return c?.value;
            })
            .join(" "),
        } as SearchHit;
      case "dataportal_Digg_Good_Example":
        return {
          url: `/${t("routes|good-examples$path")}/${r.hit.slug}`,
          title: r.hit?.heading ?? r.hit.name,
          description: r.highlights
            ?.map((c) => {
              return c?.value;
            })
            .join(" "),
          descriptionLang: r.highlights
            ?.map((c) => {
              return c?.value;
            })
            .join(" "),
        } as SearchHit;
    }
  }
  return null;
};
