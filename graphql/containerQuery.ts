import { gql } from "@apollo/client";
import {
  BLOCK_FRAGMENT,
  CONTAINER_FRAGMENT,
  SEO_FRAGMENT,
  MODULE_FRAGMENT,
  PARENT_FRAGMENT,
} from "./fragments";

export const CONTAINER_QUERY = gql`
  query Containers($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_Containers(filter: $filter) {
      ...ContainerData
    }
  }
  ${CONTAINER_FRAGMENT}
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
`;

export const CONTAINER_MULTI_QUERY = gql`
  query MultiContainers(
    $containerGroup: dataportal_QueryContainerArgs
    $container: dataportal_QueryContainerArgs
  ) {
    containerGroup: dataportal_Digg_Containers(filter: $containerGroup) {
      ...ContainerData
    }
    container: dataportal_Digg_Containers(filter: $container) {
      ...ContainerData
      parent {
        ...Parent
      }
      containerGroup {
        ...Parent
      }
    }
  }
  ${CONTAINER_FRAGMENT}
  ${PARENT_FRAGMENT}
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
`;

export const RELATED_CONTAINER = gql`
  fragment RelatedContainer on dataportal_Digg_Container {
    name
    slug
  }
`;

export const RELATED_CONTAINER_QUERY = gql`
  query Related($filter: dataportal_QueryContainerArgs) {
    containers: dataportal_Digg_Containers(filter: $filter) {
      ...RelatedContainer
    }
  }
  ${RELATED_CONTAINER}
`;
