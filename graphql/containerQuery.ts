import { gql } from '@apollo/client';
import { BLOCK_FRAGMENT, LINK_FRAGMENT, SEO_FRAGMENT, SHARED_CONTENT_FRAGMENT } from './fragments';

export const CONTAINER_QUERY = gql`
  query Containers($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_Containers(filter: $filter) {
      name
      locale
      updatedAt
      heading
      preamble
      slug
      order
      uiHints
      breadcrumb {
        name
        link {
          link
          linktype
        }
      }
      blocks {
        ...BlockData
        ... on dataportal_Digg_SharedContentContainer {
          __typename
          id
          contents {
            ...SharedContentData
          }
        }
      }
      seo {
        ...SeoData
      }
    }
  }
  ${LINK_FRAGMENT}
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${SHARED_CONTENT_FRAGMENT}
`;
