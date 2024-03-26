import { gql } from "@apollo/client";
import {
  BLOCK_FRAGMENT,
  CONTAINER_FRAGMENT,
  MODULE_FRAGMENT,
  GOOD_EXAMPLE_FRAGMENT,
  NEWS_ITEM_FRAGMENT,
  SEO_FRAGMENT,
} from "./fragments";

export const ROOT_AGGREGATE_QUERY = gql`
  query RootAggregate($locale: String!, $state: dataportal_ContainerState!) {
    container: dataportal_Digg_Containers(
      filter: { limit: 1, slug: "/", locale: $locale, state: $state }
    ) {
      ...ContainerData
    }
    news: dataportal_Digg_News_Items(
      filter: { limit: 3, locale: $locale, state: $state }
    ) {
      ...NewsItemData
    }
    examples: dataportal_Digg_Good_Examples(
      filter: { limit: 3, locale: $locale, state: $state }
    ) {
      ...GoodExampleData
    }
  }
  ${NEWS_ITEM_FRAGMENT}
  ${GOOD_EXAMPLE_FRAGMENT}
  ${CONTAINER_FRAGMENT}
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
`;
