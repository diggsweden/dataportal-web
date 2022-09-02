import { gql } from '@apollo/client';
import { BLOCK_FRAGMENT, LINK_FRAGMENT, SEO_FRAGMENT, SHARED_CONTENT_FRAGMENT } from './fragments';

export const NEWS_QUERY = gql`
  query News($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_News(filter: $filter) {
      id
      locale
      updatedAt
      publishedAt
      heading
      preamble
      slug
      order
      uiHints
      image {
        ...Image
      }
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
