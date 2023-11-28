import { gql } from "@apollo/client";
import { CATEGORY_FRAGMENT } from "./fragments";

export const CATEGORY_QUERY = gql`
  query Categories($filter: dataportal_QueryCategoryArgs) {
    categories: dataportal_Digg_Categories(filter: $filter) {
      ...Category
    }
  }
  ${CATEGORY_FRAGMENT}
`;
