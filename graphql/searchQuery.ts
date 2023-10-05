import { gql } from "@apollo/client";
import {
  BLOCK_FRAGMENT,
  CONTAINER_FRAGMENT,
  MODULE_FRAGMENT,
  PUBLICATION_FRAGMENT,
  SEO_FRAGMENT,
} from "./fragments";

export const SEARCH_HIT_FRAGMENT = gql`
  fragment SearchHit on dataportal_Digg_SearchHit {
    highlights {
      name
      value
    }
    hit {
      ...ContainerData
      ...PublicationData
    }
  }
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
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
  ${PUBLICATION_FRAGMENT}
  ${CONTAINER_FRAGMENT}
  ${SEARCH_HIT_FRAGMENT}
`;
