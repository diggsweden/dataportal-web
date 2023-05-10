import { gql } from '@apollo/client';
import { MEDIA_FRAGMENT } from './fragments';

export const FOOTER_QUERY = gql`
  query Footer($locale: String) {
    dataportal_v1_Digg_Footer(locale: $locale) {
      logo {
        ...Media
      }
      columns {
        title
        text {
          markdown
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;
