import { Translate } from "next-translate";
import { Search_dataportal_Digg_Search_hits } from "../graphql/__generated__/Search";

/**
 * Parse Search_dataportal_Digg_Search
 * @param hit
 * @returns
 */
export const getSearchHit = (
  r: Search_dataportal_Digg_Search_hits,
  t: Translate
): SearchHit | null => {
  if (r && r.hit) {
    switch (r.hit.__typename) {
      case "dataportal_Digg_Container":
        return {
          url: `/${r.hit.slug}`,
          title: r.hit?.heading ?? r.hit?.name,
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
      case "dataportal_Digg_Publication":
        return {
          url: `/${t("routes|publications$path")}/${r.hit.slug}`,
          title: r.hit?.heading ?? r.hit?.name,
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
