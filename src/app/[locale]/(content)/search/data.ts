import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import { graphql } from "@/graphql/gql";

/**
 * Slim fragments dedicated to the search result list. Search hits are
 * reconstructed from the Meilisearch index and cannot resolve deep relational
 * fields (e.g. `parent.pageNavigation`), which the full `ContainerData` /
 * `NewsItemData` / `GoodExampleData` fragments request. Selecting only the
 * fields the result list actually renders (see `getSearchHit`) avoids those
 * subgraph errors — which the fetcher treats as fatal — and shrinks the
 * payload considerably.
 */
export const SearchContainerFragment = graphql(`
  fragment SearchContainer on dataportal_Digg_IContainer {
    __typename
    heading
    name
    slug
  }
`);

export const SearchNewsItemFragment = graphql(`
  fragment SearchNewsItem on dataportal_Digg_INews_Item {
    __typename
    heading
    name
    slug
  }
`);

export const SearchGoodExampleFragment = graphql(`
  fragment SearchGoodExample on dataportal_Digg_IGood_Example {
    __typename
    heading
    name
    slug
  }
`);

graphql(`
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
`);

const SearchDocument = graphql(`
  query Search($filter: dataportal_QuerySearchArgs) {
    dataportal_Digg_Search(filter: $filter) {
      totalNrOfHits
      hits {
        ...SearchHit
      }
    }
  }
`);

/**
 * Query GraphQL Search index. The previous `clientQuery` flag is kept for
 * call-site compatibility but is now a no-op: gqlFetch resolves the APOLLO_URL
 * correctly on both server and client.
 */
export const querySearch = async (
  query: string,
  locale: string,
  limit: number,
  offset: number,
  _clientQuery: boolean,
) => {
  try {
    const data = await gqlFetch(SearchDocument, {
      filter: {
        highlightPreText: "**",
        highlightPostText: "**",
        highlightsLength: 10,
        getHighlights: true,
        query: query,
        limit: limit || 10,
        offset: offset || 0,
        locale,
      },
    });

    return data;
  } catch (error) {
    logGqlError(error);
    return undefined;
  }
};
