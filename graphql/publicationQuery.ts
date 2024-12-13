import { gql } from "@apollo/client";

import {
  BLOCK_FRAGMENT,
  MODULE_FRAGMENT,
  NEWS_ITEM_FRAGMENT,
  GOOD_EXAMPLE_FRAGMENT,
  SEO_FRAGMENT,
} from "./fragments";

export const GOOD_EXAMPLE_QUERY = gql`
  query GoodExample($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_Good_Examples(filter: $filter) {
      ...GoodExampleData
    }
  }
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
  ${GOOD_EXAMPLE_FRAGMENT}
`;

export const NEWS_ITEM_QUERY = gql`
  query NewsItem($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_News_Items(filter: $filter) {
      ...NewsItemData
    }
  }
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
  ${NEWS_ITEM_FRAGMENT}
`;
