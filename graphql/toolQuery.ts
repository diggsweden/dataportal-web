import { gql } from "@apollo/client";

import { TOOL_FRAGMENT } from "./fragments";

export const TOOL_QUERY = gql`
  query Tool($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_Tools(filter: $filter) {
      ...ToolData
    }
  }
  ${TOOL_FRAGMENT}
`;
