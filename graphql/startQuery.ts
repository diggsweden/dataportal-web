import { gql } from '@apollo/client';
import { SEO_FRAGMENT, BLOCK_FRAGMENT, SHARED_CONTENT_FRAGMENT, IMAGE_FRAGMENT } from './fragments';

export const START_QUERY = gql`
  query Start($locale: String) {
    dataportal_v1_Digg_Start(locale: $locale) {
      heading
      preamble
      image {
        ...Image
      }
      uiHints
      blocks {
        ...BlockData
        ... on dataportal_v1_Digg_SharedContentContainer {
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
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${SHARED_CONTENT_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;
