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
  ${PARENT_FRAGMENT}
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
    }
  }
  ${PARENT_FRAGMENT}
  ${CONTAINER_FRAGMENT}
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
`;
