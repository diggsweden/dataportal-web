import { gql } from "@apollo/client";
import { FORM_ELEMENT_FRAGMENT, CHOICE_FRAGMENT } from "./fragments";

export const FORM_DATA_FRAGMENT = gql`
  fragment FormData on dataportal_Digg_Form {
    id
    identifier
    elements {
      ...FormElement
    }
  }
`;

export const FORM_QUERY = gql`
  query Form($identifier: String!, $locale: String) {
    dataportal_Digg_Form(identifier: $identifier, locale: $locale) {
      ...FormData
    }
  }
  ${FORM_ELEMENT_FRAGMENT}
  ${CHOICE_FRAGMENT}
  ${FORM_DATA_FRAGMENT}
`;
