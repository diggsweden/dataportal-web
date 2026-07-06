import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import {
  ContainerDataFragment,
  ParentFragment,
  ParentSimplifiedFragment,
} from "@/graphql/fragments";
import { getFragmentData, graphql } from "@/graphql/gql";
import type {
  ContainerDataFragment as ContainerData,
  Dataportal_ContainerState,
  ParentFragment as Parent,
  ParentSimplifiedFragment as ParentSimplified,
} from "@/graphql/gql/graphql";

export interface QueryOptions {
  state?: Dataportal_ContainerState;
  secret?: string;
}

export interface MultiContainerResponse {
  type: "MultiContainer";
  container?: ContainerData;
  related?: ParentSimplified[];
  parent?: Parent | null;
}

export const ContainersDocument = graphql(`
  query Containers($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_Containers(filter: $filter) {
      ...ContainerData
    }
  }
`);

export const MultiContainersDocument = graphql(`
  query MultiContainers($container: dataportal_QueryContainerArgs) {
    container: dataportal_Digg_Containers(filter: $container) {
      ...ContainerData
    }
  }
`);

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
    const data = await gqlFetch(
      ContainersDocument,
      {
        filter: {
          slug,
          locale,
          ...(secret ? { previewSecret: secret } : {}),
          ...(state ? { state } : {}),
        },
      },
      { revalidate: 120 },
    );

    const rawContainer = data.dataportal_Digg_Containers[0];

    if (!rawContainer) {
      console.warn(`No container found for: ${slug}`);
      return null;
    }

    const container = getFragmentData(ContainerDataFragment, rawContainer);

    // Use pageNavigation from the container itself, or fall back to parent's
    let related: ParentSimplified[] = [];
    const pageNavigation = container.pageNavigation;
    if (pageNavigation && pageNavigation.length > 0) {
      related = getFragmentData(ParentSimplifiedFragment, pageNavigation);
    } else if (container.parent) {
      const parent = getFragmentData(ParentFragment, container.parent);
      if (parent.pageNavigation && parent.pageNavigation.length > 0) {
        related = getFragmentData(
          ParentSimplifiedFragment,
          parent.pageNavigation,
        );
      }
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
