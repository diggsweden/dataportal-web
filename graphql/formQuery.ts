import { gql } from '@apollo/client';
import { FORM_ELEMENT_FRAGMENT, CHOICE_FRAGMENT } from './fragments';

export const FORM_QUERY = gql`
  query Form($identifier: String!, $locale: String) {
    dataportal_Digg_Form(identifier: $identifier, locale: $locale) {
      id
      identifier
      elements {
        ...FormElement
      }
    }
  }
  ${FORM_ELEMENT_FRAGMENT}
  ${CHOICE_FRAGMENT}
`;
