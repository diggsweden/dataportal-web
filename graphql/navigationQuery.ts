import { gql } from "@apollo/client";

import { NAVIGATION_FRAGMENT } from "./fragments";

export const NAVIGATION_QUERY = gql`
  query Navigation($filter: dataportal_QueryLocaleArgs) {
    dataportal_Digg_Navigation(filter: $filter) {
      ...NavigationData
    }
  }

  ${NAVIGATION_FRAGMENT}
`;
