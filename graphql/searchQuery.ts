import { gql } from '@apollo/client';
import { BLOCK_FRAGMENT, PUBLICATION_FRAGMENT, SEO_FRAGMENT, MODULE_FRAGMENT, CONTAINER_FRAGMENT } from './fragments';

export const SEARCH_QUERY = gql`
  query Search($filter: dataportal_QuerySearchArgs) {
    dataportal_Digg_Search(filter: $filter) {
      totalNrOfHits
      hits {
        highlights {
          name        
          value
        }
        hit {
          ...ContainerData
          ...PublicationData
        }
      }
    }
  }
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
  ${PUBLICATION_FRAGMENT}
  ${CONTAINER_FRAGMENT}
`;
