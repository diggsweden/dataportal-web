import {
  ContainerDataFragment,
  GoodExampleDataFragment,
  NewsItemDataFragment,
} from "@/graphql/fragments";
import { getFragmentData } from "@/graphql/gql";
import type { SearchHitFragment } from "@/graphql/gql/graphql";
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
    const description = r.highlights?.map((c) => c?.value).join(" ");

    switch (r.hit.__typename) {
      case "dataportal_Digg_Container": {
        const hit = getFragmentData(ContainerDataFragment, r.hit);
        return {
          url: `/${hit.slug}`,
          title: hit.heading ?? hit.name,
          description,
          descriptionLang: description,
        } as SearchHit;
      }
      case "dataportal_Digg_News_Item": {
        const hit = getFragmentData(NewsItemDataFragment, r.hit);
        return {
          url: `/${t("routes.news.path")}/${hit.slug}`,
          title: hit.heading ?? hit.name,
          description,
          descriptionLang: description,
        } as SearchHit;
      }
      case "dataportal_Digg_Good_Example": {
        const hit = getFragmentData(GoodExampleDataFragment, r.hit);
        return {
          url: `/${t("routes.good-examples.path")}/${hit.slug}`,
          title: hit.heading ?? hit.name,
          description,
          descriptionLang: description,
        } as SearchHit;
      }
    }
  }
  return null;
};

export const formatHitCount = (
  count: number,
  _query: string,
  label: string,
) => {
  return `${count} ${label}`;
};
