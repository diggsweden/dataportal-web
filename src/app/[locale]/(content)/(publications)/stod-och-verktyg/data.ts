import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import { graphql } from "@/graphql/gql";
import type {
  ImageFragment,
  SeoDataFragment,
  ToolDataFragment,
} from "@/graphql/gql/graphql";

const ToolDocument = graphql(`
  query Tool($filter: dataportal_QueryContainerArgs) {
    dataportal_Digg_Tools(filter: $filter) {
      ...ToolData
    }
  }
`);

export interface ToolListResponse {
  type: "ToolList";
  listItems: ToolDataFragment[];
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
}

export interface ToolistOptions {
  heading: string;
  basePath?: string;
  preamble: string;
  seo?: SeoDataFragment;
  heroImage?: ImageFragment | null;
}

export const getToolsList = async (
  opts?: ToolistOptions,
): Promise<ToolListResponse> => {
  const { heading, preamble, heroImage, seo, basePath } = opts || {};

  try {
    const data = await gqlFetch(ToolDocument, {
      filter: { limit: 100 },
    });

    const tools = data?.dataportal_Digg_Tools;

    if (!tools) {
      console.warn(`No tools found`);
    }

    return {
      type: "ToolList",
      listItems: tools || [],
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || null,
      preamble: preamble || null,
      heroImage: heroImage || null,
    } as ToolListResponse;
  } catch (error) {
    logGqlError(error);
    return {
      type: "ToolList",
      listItems: [],
      basePath: basePath || null,
      seo: seo || null,
      heading: heading || null,
      heroImage: heroImage || null,
    } as ToolListResponse;
  }
};
