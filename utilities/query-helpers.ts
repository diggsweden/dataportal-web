import { browserclient, client, CONTAINER_MULTI_QUERY } from "@/graphql";
import {
  FormDataFragment,
  FormQuery,
  FormQueryVariables,
  ImageFragment,
  ModuleDataFragment,
  ModuleQuery,
  ModuleQueryVariables,
  MultiContainersQuery,
  MultiContainersQueryVariables,
  ParentFragment,
  NewsItemDataFragment,
  NewsItemQuery,
  NewsItemQueryVariables,
  GoodExampleDataFragment,
  GoodExampleQuery,
  GoodExampleQueryVariables,
  RootAggregateQuery,
  RootAggregateQueryVariables,
  SearchQueryVariables,
  SeoDataFragment,
  ToolDataFragment,
  ToolQuery,
  ToolQueryVariables,
  ContainerDataFragment,
  StartPageDataFragment,
  StartPageQuery,
  StartPageQueryVariables,
  NewsBlockItemFragment,
  GoodExampleBlockItemFragment,
  NavigationQuery,
  NavigationQueryVariables,
  NavigationDataFragment,
} from "@/graphql/__generated__/operations";
import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import { ROOT_AGGREGATE_QUERY } from "@/graphql/aggregateQuery";
import { FORM_QUERY } from "@/graphql/formQuery";
import { MODULE_QUERY } from "@/graphql/moduleQuery";
import { NAVIGATION_QUERY } from "@/graphql/navigationQuery";
import {
  GOOD_EXAMPLE_QUERY,
  NEWS_ITEM_QUERY,
} from "@/graphql/publicationQuery";
import { SEARCH_QUERY } from "@/graphql/searchQuery";
import { START_PAGE_QUERY } from "@/graphql/startpageQuery";
import { TOOL_QUERY } from "@/graphql/toolQuery";

/**
 * ? Better comments: https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments
 * ? Folding regions: https://marketplace.visualstudio.com/items?itemName=maptz.regionfolder
 */

/* #region private */
const notFound = (revalidate: boolean) => ({
  notFound: true,
  ...(revalidate
    ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
    : {}),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logGqlErrors = (error: any) => {
  const { networkError, graphQLErrors, clientErrors } = error || {};
  if (networkError?.result?.errors) {
    console.error("networkError", error.networkError.result.errors);
  }
  if (graphQLErrors?.length > 0) {
    console.error("graphqlError", error.graphQLErrors);
  }
  if (clientErrors?.length > 0) {
    console.error("clientError", error.clientErrors);
  }
};

/* #region types */
export interface MultiContainerResponse {
  type: "MultiContainer";
  container?: ContainerDataFragment;
  related?: ContainerDataFragment[];
  parent?: ParentFragment | null;
}

export interface NewsItemResponse extends NewsItemDataFragment {
  type: "Publication";
  related?: NewsBlockItemFragment[];
}

export interface GoodExampleResponse extends GoodExampleDataFragment {
  type: "Publication";
  related?: GoodExampleBlockItemFragment[];
  reuse: boolean;
}
export interface NewsItemListResponse {
  type: "PublicationList";
  heading: string;
  listItems: NewsItemDataFragment[] | GoodExampleDataFragment[];
  seo?: SeoDataFragment;
  basePath?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
}

export interface GoodExampleListResponse {
  type: "PublicationList";
  heading: string;
  breadcrumb?: string;
  listItems: GoodExampleDataFragment[];
  seo?: SeoDataFragment;
  basePath?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
}

export interface ToolListResponse {
  type: "ToolList";
  listItems: ToolDataFragment[];
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
}

export interface RootAggregateResponse extends ContainerDataFragment {
  type: "RootAggregate";
  news?: NewsItemDataFragment;
  examples?: GoodExampleDataFragment;
  // events?: PublicationDataFragment;
}

export interface StartPageResponse extends StartPageDataFragment {
  type: "StartPage";
}

export interface NavigationResponse {
  type: "Navigation";
  items: NavigationDataFragment[];
}

export interface FormResponse extends FormDataFragment {
  type: "Form";
}

export interface ModuleResponse extends ModuleDataFragment {
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
  type: "Module";
}

export interface ContentSearchResponse {
  entries:
    | NewsItemDataFragment
    | GoodExampleDataFragment
    | ContainerDataFragment
    | null;
  nrOfHits: number;
}

export interface QueryOptions {
  state?: Dataportal_ContainerState;
  secret?: string;
  revalidate: boolean;
}

export interface PublicationListOptions {
  reuse?: boolean;
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
  breadcrumb?: string;
}

export interface ToolistOptions {
  heading: string;
  basePath?: string;
  preamble: string;
  seo?: SeoDataFragment;
  heroImage?: ImageFragment | null;
}

export interface PublicationQueryOptions extends QueryOptions {
  tags?: string[];
}

export interface ModuleOptions {
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
}
/* #endregion */

/**
 * @param {Array<string>} slugs
 * @returns
 */
export const getMultiContainer = async (
  slugs: string[],
  locale: string,
  opts: QueryOptions = { revalidate: true },
) => {
  const { state, secret, revalidate } = opts;

  const slug = "/" + slugs.join("/");

  try {
    // Get external data from the file system, API, DB, etc.
    const { error, errors, data } = await client.query<
      MultiContainersQuery,
      MultiContainersQueryVariables
    >({
      query: CONTAINER_MULTI_QUERY,
      variables: {
        containerGroup: {
          containerGroup: { slug: `/${slugs[0]}` },
          locale,
          limit: 50,
        },
        container: {
          slug,
          locale,
          ...(secret ? { previewSecret: secret } : {}),
          ...(state ? { state } : {}),
        },
      },
      fetchPolicy: "no-cache",
    });
    if (error || errors) {
      console.error({ error, errors });
    }

    const container = data.container[0];

    if (!container) {
      console.warn(`No container found for: ${slug}`);
      return notFound(revalidate);
    }

    // The value of the `props` key will be
    //  passed to the `Page` component
    return {
      props: {
        type: "MultiContainer",
        container,
        related: data.containerGroup || [],
      },
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return notFound(revalidate);
  }
};

/**
 * Get a list of publications from strapi
 *
 * @param {Array<String>} slug
 * @param {string} locale
 * @returns {NewsItemListResponse} nextjs staticprops
 */
export const getNewsList = async (
  locale: string,
  opts?: PublicationListOptions,
) => {
  // If nextjs should check for changes on the server
  const revalidate = true;
  const { seo, basePath, heading, preamble, heroImage } = opts || {};

  try {
    const { data, error } = await client.query<
      NewsItemQuery,
      NewsItemQueryVariables
    >({
      query: NEWS_ITEM_QUERY,
      variables: {
        filter: {
          locale,
          state: Dataportal_ContainerState.Live,
          limit: 1000,
        },
      },
      fetchPolicy: "no-cache",
    });

    const publications = data?.dataportal_Digg_News_Items;

    if (error) {
      console.error(error);
    }

    if (!publications) {
      console.warn(`No news found`);
    }

    return {
      props: {
        type: "PublicationList",
        listItems: publications || [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        preamble: preamble || null,
        heroImage: heroImage || null,
      } as NewsItemListResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return {
      props: {
        type: "PublicationList",
        listItems: [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        heroImage: heroImage || null,
      } as NewsItemListResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  }
};

/**
 * Get a list of publications from strapi
 *
 * @param {Array<String>} slug
 * @param {string} locale
 * @returns {GoodExampleListResponse} nextjs staticprops
 */
export const getGoodExamplesList = async (
  locale: string,
  opts?: PublicationListOptions,
) => {
  // If nextjs should check for changes on the server
  const revalidate = true;
  const { seo, basePath, heading, preamble, heroImage, reuse, breadcrumb } =
    opts || {};
  try {
    const { data, error } = await client.query<
      GoodExampleQuery,
      GoodExampleQueryVariables
    >({
      query: GOOD_EXAMPLE_QUERY,
      variables: {
        filter: {
          locale,
          state: Dataportal_ContainerState.Live,
          limit: 1000,
        },
      },
      fetchPolicy: "no-cache",
    });

    const publications = data?.dataportal_Digg_Good_Examples?.filter(
      (publication) => publication && publication.reuse === reuse,
    );

    if (error) {
      console.error(error);
    }

    if (!publications) {
      console.warn(`No good examples found`);
    }

    return {
      props: {
        type: "PublicationList",
        listItems: publications || [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        preamble: preamble || null,
        heroImage: heroImage || null,
        breadcrumb: breadcrumb || null,
      } as GoodExampleListResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return {
      props: {
        type: "PublicationList",
        listItems: [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        heroImage: heroImage || null,
        breadcrumb: breadcrumb || null,
      } as GoodExampleListResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  }
};

/**
 * Get a list of publications from strapi
 *
 * @param {Array<String>} slug
 * @param {string} locale
 * @returns {ToolListResponse} nextjs staticprops
 */
export const getToolsList = async (opts?: ToolistOptions) => {
  // If nextjs should check for changes on the server
  const revalidate = true;
  const { heading, preamble, heroImage, seo, basePath } = opts || {};

  try {
    const { data, error } = await client.query<ToolQuery, ToolQueryVariables>({
      query: TOOL_QUERY,
      variables: {
        filter: {
          limit: 100,
        },
      },
      fetchPolicy: "no-cache",
    });

    const tools = data?.dataportal_Digg_Tools;

    if (error) {
      console.error(error);
    }

    if (!tools) {
      console.warn(`No tools found`);
    }

    return {
      props: {
        type: "ToolList",
        listItems: tools || [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
        preamble: preamble || null,
        heroImage: heroImage || null,
      } as ToolListResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return {
      props: {
        type: "ToolList",
        listItems: [],
        basePath: basePath || null,
        seo: seo || null,
        heading: heading || null,
        heroImage: heroImage || null,
      } as ToolListResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  }
};

/**
 * Get publication from strapi
 *
 * @param {string} slug
 * @param {string} locale
 * @returns nextjs staticprops
 */
export const getNewsItem = async (
  slug: string,
  locale: string,
  opts: PublicationQueryOptions = { revalidate: true },
) => {
  const { state, secret, revalidate } = opts;

  try {
    const mainPublicationResult = await client.query<
      NewsItemQuery,
      NewsItemQueryVariables
    >({
      query: NEWS_ITEM_QUERY,
      variables: {
        filter: {
          slug,
          limit: 1,
          locale,
          ...(secret ? { previewSecret: secret } : {}),
          ...(state ? { state } : {}),
        },
      },
      fetchPolicy: "no-cache",
    });

    const publication =
      mainPublicationResult && mainPublicationResult.data
        ? mainPublicationResult.data.dataportal_Digg_News_Items[0]
        : undefined;

    if (mainPublicationResult && mainPublicationResult.error) {
      console.error(mainPublicationResult.error);
    }

    if (!publication) {
      console.warn(`No news found with slug: '${slug}'`);
      return notFound(revalidate);
    }

    const relatedPublicationResult = await client.query<
      NewsItemQuery,
      NewsItemQueryVariables
    >({
      query: NEWS_ITEM_QUERY,
      variables: { filter: { limit: 4, locale } },
      fetchPolicy: "no-cache",
    });

    // Transform the related publications to match the preview type
    const relatedPreviews: NewsBlockItemFragment[] =
      relatedPublicationResult?.data?.dataportal_Digg_News_Items
        .filter(
          (pub): pub is NewsItemDataFragment =>
            pub !== null && pub.id !== publication.id,
        )
        .slice(0, 3)
        .map(toNewsPreview) || [];

    return {
      props: {
        type: "Publication",
        ...publication,
        related: relatedPreviews,
      } as NewsItemResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return notFound(revalidate);
  }
};

// Helper function to type check the preview transformation
export const toNewsPreview = (
  pub: NewsItemDataFragment,
): NewsBlockItemFragment => {
  if (!pub.heading || !pub.slug || !pub.publishedAt) {
    throw new Error(`Invalid publication data for preview: ${pub.id}`);
  }

  return {
    __typename: "dataportal_Digg_NewsItem_Preview",
    heading: pub.heading,
    slug: pub.slug,
    publishedAt: pub.publishedAt,
    image: pub.image,
    keywords: pub.keywords,
  };
};

export const getGoodExample = async (
  slug: string,
  locale: string,
  opts: PublicationQueryOptions = { revalidate: true },
  reuse: boolean = false,
) => {
  const { state, secret, revalidate } = opts;
  try {
    const mainPublicationResult = await client.query<
      GoodExampleQuery,
      GoodExampleQueryVariables
    >({
      query: GOOD_EXAMPLE_QUERY,
      variables: {
        filter: {
          slug,
          limit: 1,
          locale,
          ...(secret ? { previewSecret: secret } : {}),
          ...(state ? { state } : {}),
        },
      },
      fetchPolicy: "no-cache",
    });

    const publication =
      mainPublicationResult && mainPublicationResult.data
        ? mainPublicationResult.data.dataportal_Digg_Good_Examples[0]
        : undefined;

    if (mainPublicationResult && mainPublicationResult.error) {
      console.error(mainPublicationResult.error);
    }

    if (!publication) {
      console.warn(`No good example found with slug: '${slug}'`);
      return notFound(revalidate);
    }

    // Check if the reuse value matches the expected pattern
    if (publication.reuse !== reuse) {
      console.warn(
        `Access denied: Good example with slug '${slug}' has reuse=${
          publication.reuse
        } but accessed from ${reuse ? "private" : "public"} route`,
      );
      return notFound(revalidate);
    }

    const relatedPublicationResult = await client.query<
      GoodExampleQuery,
      GoodExampleQueryVariables
    >({
      query: GOOD_EXAMPLE_QUERY,
      variables: {
        filter: {
          limit: 4,
          locale,
        },
      },
      fetchPolicy: "no-cache",
    });

    const relatedPreviews: GoodExampleBlockItemFragment[] =
      relatedPublicationResult?.data?.dataportal_Digg_Good_Examples
        .filter(
          (pub): pub is GoodExampleDataFragment =>
            pub !== null && pub.id !== publication.id && pub.reuse === reuse,
        )
        .slice(0, 3)
        .map(toGoodExamplePreview) || [];

    return {
      props: {
        type: "Publication",
        ...publication,
        related: relatedPreviews,
      } as GoodExampleResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return notFound(revalidate);
  }
};

// Helper function to type check the preview transformation
export const toGoodExamplePreview = (
  pub: GoodExampleDataFragment,
): GoodExampleBlockItemFragment => {
  if (!pub.heading || !pub.slug || !pub.publishedAt) {
    throw new Error(`Invalid publication data for preview: ${pub.id}`);
  }

  return {
    __typename: "dataportal_Digg_GoodExample_Preview",
    heading: pub.heading,
    slug: pub.slug,
    publishedAt: pub.publishedAt,
    image: pub.image,
    keywords: pub.keywords,
    reuse: pub.reuse,
  };
};

export const getRootAggregate = async (
  locale: string,
  opts: QueryOptions = { revalidate: true },
) => {
  const { state, secret, revalidate } = opts;

  try {
    const { data, error } = await client.query<
      RootAggregateQuery,
      RootAggregateQueryVariables
    >({
      query: ROOT_AGGREGATE_QUERY,
      variables: {
        locale,
        state: state || Dataportal_ContainerState.Live,
        ...(secret ? { previewSecret: secret } : {}),
      },
      fetchPolicy: "no-cache",
    });

    if (error) {
      console.error(error);
    }

    const container = data ? data.container[0] : undefined;

    if (!container) {
      console.warn(`No container found with slug: '/'`);
    }

    const news = data.news || null;
    const example = data.examples || null;
    // const event = data.events[0] || null;

    // The value of the `props` key will be
    //  passed to the `Page` component
    return {
      props: {
        ...container,
        type: "RootAggregate",
        news,
        example,
        // event,
      },
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return {
      props: {
        type: "RootAggregate",
      } as RootAggregateResponse,
      revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60"),
    };
  }
};

export const getStartPage = async (
  locale: string,
  opts: QueryOptions = { revalidate: true },
) => {
  const { revalidate } = opts;
  try {
    const { data, error } = await client.query<
      StartPageQuery,
      StartPageQueryVariables
    >({
      query: START_PAGE_QUERY,
      variables: {
        filter: {
          locale,
        },
      },
      fetchPolicy: "no-cache",
    });

    if (error) {
      console.error(error);
    }

    const startPage = data.dataportal_Digg_Start_Page;

    return {
      props: {
        ...startPage,
        type: "StartPage",
      } as StartPageResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return {
      props: {
        type: "StartPage",
      } as StartPageResponse,
      revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60"),
    };
  }
};

export const getNavigationData = async (
  locale: string,
  opts: QueryOptions = { revalidate: true },
) => {
  const { revalidate } = opts;
  try {
    const { data, error } = await client.query<
      NavigationQuery,
      NavigationQueryVariables
    >({
      query: NAVIGATION_QUERY,
      variables: { filter: { locale } },
      fetchPolicy: "no-cache",
    });

    if (error) {
      console.error(error);
    }

    const navigationData = data.dataportal_Digg_Navigation;

    return {
      props: {
        type: "Navigation",
        items: navigationData,
      } as NavigationResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return {
      props: { type: "Navigation" } as NavigationResponse,
      revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60"),
    };
  }
};

/**
 * Query GraphQL Search index
 *
 * @param {string} query
 * @param {string} locale
 * @returns nextjs staticprops
 */
export const querySearch = async (
  query: string,
  locale: string,
  limit: number,
  offset: number,
  clientQuery: boolean,
) => {
  try {
    const cl = clientQuery ? browserclient : client;

    const searchResult = await cl.query<
      ContainerDataFragment | GoodExampleDataFragment | NewsItemDataFragment,
      SearchQueryVariables
    >({
      query: SEARCH_QUERY,
      variables: {
        filter: {
          highlightPreText: "**",
          highlightPostText: "**",
          highlightsLength: 10,
          getHighlights: true,
          query: query,
          limit: limit || 10,
          offset: offset || 0,
          locale,
        },
      },
      fetchPolicy: "no-cache",
    });

    const result =
      searchResult && searchResult.data ? searchResult.data : undefined;

    if (searchResult && searchResult.error) {
      console.error(searchResult.error);
    }

    return result;
  } catch (error) {
    logGqlErrors(error);
    return notFound;
  }
};

export const getForm = async (identifier: string, locale?: string) => {
  const revalidate = true;

  try {
    const { data } = await client.query<FormQuery, FormQueryVariables>({
      query: FORM_QUERY,
      variables: { identifier, locale },
      fetchPolicy: "no-cache",
    });

    const form = data.dataportal_Digg_Form;

    return {
      props: { ...form, type: "Form" } as FormResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return {
      props: { type: "Form" } as FormResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  }
};

export const getModule = async (
  identifier: string,
  locale?: string,
  opts?: ModuleOptions,
) => {
  const revalidate = true;
  const { seo, basePath, heading } = opts || {};

  const emptyModule: ModuleDataFragment = {
    __typename: "dataportal_Digg_Module",
    blocks: [],
    identifier: "",
  };

  try {
    const { data } = await client.query<ModuleQuery, ModuleQueryVariables>({
      query: MODULE_QUERY,
      variables: { identifier, locale },
      fetchPolicy: "no-cache",
    });

    const mod = data.dataportal_Digg_Module;

    return {
      props: {
        ...mod,
        type: "Module",
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
      } as ModuleResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error) {
    logGqlErrors(error);
    return {
      props: {
        ...emptyModule,
        type: "Module",
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
      } as ModuleResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  }
};
