import { gql } from "@apollo/client";

/**
 * Slim fragments dedicated to the search result list. Search hits are
 * reconstructed from the Meilisearch index and cannot resolve deep relational
 * fields (e.g. `parent.pageNavigation`), which the full `ContainerData` /
 * `NewsItemData` / `GoodExampleData` fragments request. Selecting only the
 * fields the result list actually renders (see `getSearchHit`) avoids those
 * subgraph errors — which the fetcher treats as fatal — and shrinks the
 * payload considerably.
 */
export const SEARCH_CONTAINER_FRAGMENT = gql`
  fragment SearchContainer on dataportal_Digg_IContainer {
    __typename
    heading
    name
    slug
  }
`;

export const SEARCH_NEWS_ITEM_FRAGMENT = gql`
  fragment SearchNewsItem on dataportal_Digg_INews_Item {
    __typename
    heading
    name
    slug
  }
`;

export const SEARCH_GOOD_EXAMPLE_FRAGMENT = gql`
  fragment SearchGoodExample on dataportal_Digg_IGood_Example {
    __typename
    heading
    name
    slug
  }
`;

export const SEARCH_HIT_FRAGMENT = gql`
  fragment SearchHit on dataportal_Digg_SearchHit {
    highlights {
      name
      value
    }
    hit {
      ...SearchContainer
      ...SearchNewsItem
      ...SearchGoodExample
    }
  }
  ${SEARCH_CONTAINER_FRAGMENT}
  ${SEARCH_NEWS_ITEM_FRAGMENT}
  ${SEARCH_GOOD_EXAMPLE_FRAGMENT}
`;

export const SEARCH_QUERY = gql`
  query Search($filter: dataportal_QuerySearchArgs) {
    dataportal_Digg_Search(filter: $filter) {
      totalNrOfHits
      hits {
        ...SearchHit
      }
    }
  }
  ${SEARCH_HIT_FRAGMENT}
`;
