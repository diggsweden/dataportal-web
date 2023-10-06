import { gql } from "@apollo/client";
import { BLOCK_FRAGMENT, MODULE_FRAGMENT } from "./fragments";

export const MODULE_QUERY = gql`
  query Module($identifier: String!, $locale: String) {
    dataportal_Digg_Module(identifier: $identifier, locale: $locale) {
      ...ModuleData
    }
  }
  ${MODULE_FRAGMENT}
  ${BLOCK_FRAGMENT}
`;
