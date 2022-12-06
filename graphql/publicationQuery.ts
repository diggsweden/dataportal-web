import { gql } from '@apollo/client';
import { BLOCK_FRAGMENT, PUBLICATION_FRAGMENT, SEO_FRAGMENT, MODULE_FRAGMENT } from './fragments';

export const PUBLICATION_QUERY = gql`
  query Publication($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_Publications(filter: $filter) {
      ...PublicationData
    }
  }
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
  ${PUBLICATION_FRAGMENT}
`;
