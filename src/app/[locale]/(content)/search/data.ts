import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import { graphql } from "@/graphql/gql";

graphql(`
  fragment SearchHit on dataportal_Digg_SearchHit {
    highlights {
      name
      value
    }
    hit {
      ...ContainerData
      ...NewsItemData
      ...GoodExampleData
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
