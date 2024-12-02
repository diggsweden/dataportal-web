import { gql } from "@apollo/client";
import {
  BLOCK_FRAGMENT,
  START_PAGE_FRAGMENT,
  SEO_FRAGMENT,
  IMAGE_FRAGMENT,
  NEWS_BLOCK_FRAGMENT,
  GOOD_EXAMPLE_BLOCK_FRAGMENT,
} from "./fragments";

export const START_PAGE_QUERY = gql`
  query StartPage($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_Start_Page(filter: $filter) {
      ...StartPageData
    }
  }

  ${START_PAGE_FRAGMENT}
  ${NEWS_BLOCK_FRAGMENT}
  ${GOOD_EXAMPLE_BLOCK_FRAGMENT}
  ${BLOCK_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
`;
