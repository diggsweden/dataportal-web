import { gql } from "@apollo/client";

import {
  FORM_ELEMENT_FRAGMENT,
  CHOICE_FRAGMENT,
  FOETROENDEMODELLEN_FORM_FRAGMENT_FORM,
} from "./fragments";

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

export const FOETROENDEMODELLEN_FORM_QUERY = gql`
  query FoertroendemodellenForm($filter: dataportal_QueryLocaleArgs) {
    dataportal_Digg_FoertroendemodellenForm(filter: $filter) {
      ...FoertroendemodellenForm
    }
  }
  ${FOETROENDEMODELLEN_FORM_FRAGMENT_FORM}
`;

export const FOETROENDEMODELLEN_FORM_CLIENT_QUERY = gql`
  query FoertroendemodellenFormClient($locale: String) {
    dataportal_Digg_FoertroendemodellenForm(filter: { locale: $locale }) {
      ...FoertroendemodellenForm
    }
  }
  ${FOETROENDEMODELLEN_FORM_FRAGMENT_FORM}
`;
