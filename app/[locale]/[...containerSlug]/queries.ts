import { gql } from "graphql-tag";

import {
  ContainersDocument,
  type ParentSimplifiedFragment,
} from "@/graphql/__generated__/operations";
import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import {
  BLOCK_FRAGMENT,
  CONTAINER_FRAGMENT,
  MODULE_FRAGMENT,
  PARENT_FRAGMENT,
  SEO_FRAGMENT,
} from "@/graphql/fragments";
import type {
  MultiContainerResponse,
  QueryOptions,
} from "@/utilities/query-helpers";

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
  query MultiContainers($container: dataportal_QueryContainerArgs) {
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

/**
 * Fetches a container by its (multi-segment) slug for the
 * `[...containerSlug]` route. Colocated with the route that owns it; the
 * drafts/preview route imports it from here.
 */
export const getMultiContainer = async (
  slugs: string[],
  locale: string,
  opts: QueryOptions = {},
): Promise<MultiContainerResponse | null> => {
  const { state, secret } = opts;

  const slug = `/${slugs.join("/")}`;

  try {
    const data = await gqlFetch(ContainersDocument, {
      filter: {
        slug,
        locale,
        ...(secret ? { previewSecret: secret } : {}),
        ...(state ? { state } : {}),
      },
    });

    const container = data.dataportal_Digg_Containers[0];

    if (!container) {
      console.warn(`No container found for: ${slug}`);
      return null;
    }

    // Use pageNavigation from the container itself, or fall back to parent's
    let related: ParentSimplifiedFragment[] = [];
    if (container.pageNavigation && container.pageNavigation.length > 0) {
      related = container.pageNavigation;
    } else if (
      container.parent?.pageNavigation &&
      container.parent.pageNavigation.length > 0
    ) {
      related = container.parent.pageNavigation;
    }

    return {
      type: "MultiContainer",
      container,
      related,
    };
  } catch (error) {
    logGqlError(error);
    return null;
  }
};
