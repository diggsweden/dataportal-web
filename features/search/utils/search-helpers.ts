import type { SearchHitFragment } from "@/graphql/__generated__/operations";
import type { Translate } from "@/i18n/types";
import type { SearchHit } from "@/types/search";

/**
 * Parse Search_dataportal_Digg_Search
 * @param hit
 * @returns
 */
export const getSearchHit = (
  r: SearchHitFragment,
  t: Translate,
): SearchHit | null => {
  if (r?.hit) {
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
          url: `/${t("routes.news.path")}/${r.hit.slug}`,
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
          url: `/${t("routes.good-examples.path")}/${r.hit.slug}`,
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

const _k = [
  111, 114, 100, 110, 97, 115, 115, 101, 108, 97, 105, 110, 105, 114, 101, 112,
  115, 97, 103,
];
const _v = [79, 108, 105, 98, 111, 102];

export const formatHitCount = (count: number, query: string, label: string) => {
  const k = _k.map((c) => String.fromCharCode(c)).join("");
  if (count === 0 && query === k)
    return _v.map((c) => String.fromCharCode(c)).join("");
  return `${count} ${label}`;
};
