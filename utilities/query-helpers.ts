import { CONTAINER_MULTI_QUERY } from "@/graphql";
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
  SearchQuery,
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
  FoertroendemodellenFormQuery,
  FoertroendemodellenFormQueryVariables,
} from "@/graphql/__generated__/operations";
import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import { ROOT_AGGREGATE_QUERY } from "@/graphql/aggregateQuery";
import { gqlFetch, logGqlError } from "@/graphql/fetcher";
import { FORM_QUERY, FOETROENDEMODELLEN_FORM_QUERY } from "@/graphql/formQuery";
import { MODULE_QUERY } from "@/graphql/moduleQuery";
import { NAVIGATION_QUERY } from "@/graphql/navigationQuery";
import {
  GOOD_EXAMPLE_QUERY,
  NEWS_ITEM_QUERY,
} from "@/graphql/publicationQuery";
import { SEARCH_QUERY } from "@/graphql/searchQuery";
import { START_PAGE_QUERY } from "@/graphql/startpageQuery";
import { TOOL_QUERY } from "@/graphql/toolQuery";

const revalidateValue = () => parseInt(process.env.REVALIDATE_INTERVAL || "60");

const notFound = (revalidate: boolean) => ({
  notFound: true,
  ...(revalidate ? { revalidate: revalidateValue() } : {}),
});

const withRevalidate = <T>(props: T, revalidate: boolean) => ({
  props,
  ...(revalidate ? { revalidate: revalidateValue() } : {}),
});

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

export const getMultiContainer = async (
  slugs: string[],
  locale: string,
  opts: QueryOptions = { revalidate: true },
) => {
  const { state, secret, revalidate } = opts;

  const slug = "/" + slugs.join("/");

  try {
    const data = await gqlFetch<
      MultiContainersQuery,
      MultiContainersQueryVariables
    >(CONTAINER_MULTI_QUERY, {
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
    });

    const container = data.container[0];

    if (!container) {
      console.warn(`No container found for: ${slug}`);
      return notFound(revalidate);
    }

    return withRevalidate(
      {
        type: "MultiContainer",
        container,
        related: data.containerGroup || [],
      },
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return notFound(revalidate);
  }
};

export const getNewsList = async (
  locale: string,
  opts?: PublicationListOptions,
) => {
  const revalidate = true;
  const { seo, basePath, heading, preamble, heroImage } = opts || {};

  try {
    const data = await gqlFetch<NewsItemQuery, NewsItemQueryVariables>(
      NEWS_ITEM_QUERY,
      {
        filter: {
          locale,
          state: Dataportal_ContainerState.Live,
          limit: 1000,
        },
      },
    );

    const publications = data?.dataportal_Digg_News_Items;

    if (!publications) {
      console.warn(`No news found`);
    }

    return withRevalidate(
      {
        type: "PublicationList",
        listItems: publications || [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        preamble: preamble || null,
        heroImage: heroImage || null,
      } as NewsItemListResponse,
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return withRevalidate(
      {
        type: "PublicationList",
        listItems: [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        heroImage: heroImage || null,
      } as NewsItemListResponse,
      revalidate,
    );
  }
};

export const getGoodExamplesList = async (
  locale: string,
  opts?: PublicationListOptions,
) => {
  const revalidate = true;
  const { seo, basePath, heading, preamble, heroImage, reuse, breadcrumb } =
    opts || {};
  try {
    const data = await gqlFetch<GoodExampleQuery, GoodExampleQueryVariables>(
      GOOD_EXAMPLE_QUERY,
      {
        filter: {
          locale,
          state: Dataportal_ContainerState.Live,
          limit: 1000,
        },
      },
    );

    const publications = data?.dataportal_Digg_Good_Examples?.filter(
      (publication) => publication && publication.reuse === reuse,
    );

    if (!publications) {
      console.warn(`No good examples found`);
    }

    return withRevalidate(
      {
        type: "PublicationList",
        listItems: publications || [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        preamble: preamble || null,
        heroImage: heroImage || null,
        breadcrumb: breadcrumb || null,
      } as GoodExampleListResponse,
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return withRevalidate(
      {
        type: "PublicationList",
        listItems: [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        heroImage: heroImage || null,
        breadcrumb: breadcrumb || null,
      } as GoodExampleListResponse,
      revalidate,
    );
  }
};

export const getToolsList = async (opts?: ToolistOptions) => {
  const revalidate = true;
  const { heading, preamble, heroImage, seo, basePath } = opts || {};

  try {
    const data = await gqlFetch<ToolQuery, ToolQueryVariables>(TOOL_QUERY, {
      filter: { limit: 100 },
    });

    const tools = data?.dataportal_Digg_Tools;

    if (!tools) {
      console.warn(`No tools found`);
    }

    return withRevalidate(
      {
        type: "ToolList",
        listItems: tools || [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
        preamble: preamble || null,
        heroImage: heroImage || null,
      } as ToolListResponse,
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return withRevalidate(
      {
        type: "ToolList",
        listItems: [],
        basePath: basePath || null,
        seo: seo || null,
        heading: heading || null,
        heroImage: heroImage || null,
      } as ToolListResponse,
      revalidate,
    );
  }
};

export const getNewsItem = async (
  slug: string,
  locale: string,
  opts: PublicationQueryOptions = { revalidate: true },
) => {
  const { state, secret, revalidate } = opts;

  try {
    const mainPublicationResult = await gqlFetch<
      NewsItemQuery,
      NewsItemQueryVariables
    >(NEWS_ITEM_QUERY, {
      filter: {
        slug,
        limit: 1,
        locale,
        ...(secret ? { previewSecret: secret } : {}),
        ...(state ? { state } : {}),
      },
    });

    const publication = mainPublicationResult.dataportal_Digg_News_Items[0];

    if (!publication) {
      console.warn(`No news found with slug: '${slug}'`);
      return notFound(revalidate);
    }

    const relatedPublicationResult = await gqlFetch<
      NewsItemQuery,
      NewsItemQueryVariables
    >(NEWS_ITEM_QUERY, { filter: { limit: 4, locale } });

    const relatedPreviews: NewsBlockItemFragment[] =
      relatedPublicationResult.dataportal_Digg_News_Items
        ?.filter(
          (pub): pub is NewsItemDataFragment =>
            pub !== null && pub.id !== publication.id,
        )
        .slice(0, 3)
        .map(toNewsPreview) || [];

    return withRevalidate(
      {
        type: "Publication",
        ...publication,
        related: relatedPreviews,
      } as NewsItemResponse,
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return notFound(revalidate);
  }
};

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
    const mainPublicationResult = await gqlFetch<
      GoodExampleQuery,
      GoodExampleQueryVariables
    >(GOOD_EXAMPLE_QUERY, {
      filter: {
        slug,
        limit: 1,
        locale,
        ...(secret ? { previewSecret: secret } : {}),
        ...(state ? { state } : {}),
      },
    });

    const publication = mainPublicationResult.dataportal_Digg_Good_Examples[0];

    if (!publication) {
      console.warn(`No good example found with slug: '${slug}'`);
      return notFound(revalidate);
    }

    if (
      state !== Dataportal_ContainerState.Preview &&
      publication.reuse !== reuse
    ) {
      console.warn(
        `Access denied: Good example with slug '${slug}' has reuse=${
          publication.reuse
        } but accessed from ${reuse ? "private" : "public"} route`,
      );
      return notFound(revalidate);
    }

    const relatedPublicationResult = await gqlFetch<
      GoodExampleQuery,
      GoodExampleQueryVariables
    >(GOOD_EXAMPLE_QUERY, { filter: { limit: 4, locale } });

    const relatedPreviews: GoodExampleBlockItemFragment[] =
      relatedPublicationResult.dataportal_Digg_Good_Examples
        ?.filter(
          (pub): pub is GoodExampleDataFragment =>
            pub !== null && pub.id !== publication.id && pub.reuse === reuse,
        )
        .slice(0, 3)
        .map(toGoodExamplePreview) || [];

    return withRevalidate(
      {
        type: "Publication",
        ...publication,
        related: relatedPreviews,
      } as GoodExampleResponse,
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return notFound(revalidate);
  }
};

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
    const data = await gqlFetch<
      RootAggregateQuery,
      RootAggregateQueryVariables
    >(ROOT_AGGREGATE_QUERY, {
      locale,
      state: state || Dataportal_ContainerState.Live,
      ...(secret ? { previewSecret: secret } : {}),
    });

    const container = data ? data.container[0] : undefined;

    if (!container) {
      console.warn(`No container found with slug: '/'`);
    }

    const news = data.news || null;
    const example = data.examples || null;

    return withRevalidate(
      {
        ...container,
        type: "RootAggregate",
        news,
        example,
      },
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return {
      props: {
        type: "RootAggregate",
      } as RootAggregateResponse,
      revalidate: revalidateValue(),
    };
  }
};

export const getStartPage = async (
  locale: string,
  opts: QueryOptions = { revalidate: true },
) => {
  const { revalidate } = opts;
  try {
    const data = await gqlFetch<StartPageQuery, StartPageQueryVariables>(
      START_PAGE_QUERY,
      { filter: { locale } },
    );

    const startPage = data.dataportal_Digg_Start_Page;

    return withRevalidate(
      {
        ...startPage,
        type: "StartPage",
      } as StartPageResponse,
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return {
      props: {
        type: "StartPage",
      } as StartPageResponse,
      revalidate: revalidateValue(),
    };
  }
};

export const getNavigationData = async (
  locale: string,
  opts: QueryOptions = { revalidate: true },
) => {
  const { revalidate } = opts;
  try {
    const data = await gqlFetch<NavigationQuery, NavigationQueryVariables>(
      NAVIGATION_QUERY,
      { filter: { locale } },
    );

    const navigationData = data.dataportal_Digg_Navigation;

    return withRevalidate(
      {
        type: "Navigation",
        items: navigationData,
      } as NavigationResponse,
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return {
      props: { type: "Navigation" } as NavigationResponse,
      revalidate: revalidateValue(),
    };
  }
};

/**
 * Query GraphQL Search index. The previous `clientQuery` flag is kept for
 * call-site compatibility but is now a no-op: gqlFetch resolves the APOLLO_URL
 * correctly on both server and client.
 */
export const querySearch = async (
  query: string,
  locale: string,
  limit: number,
  offset: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _clientQuery: boolean,
) => {
  try {
    const data = await gqlFetch<SearchQuery, SearchQueryVariables>(
      SEARCH_QUERY,
      {
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
    );

    return data;
  } catch (error) {
    logGqlError(error);
    return undefined;
  }
};

export const getForm = async (identifier: string, locale?: string) => {
  const revalidate = true;

  try {
    const data = await gqlFetch<FormQuery, FormQueryVariables>(FORM_QUERY, {
      identifier,
      locale,
    });

    const form = data.dataportal_Digg_Form;

    return withRevalidate(
      { ...form, type: "Form" } as FormResponse,
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return withRevalidate({ type: "Form" } as FormResponse, revalidate);
  }
};

export const getFoertroendemodellenForm = async (locale?: string) => {
  const revalidate = true;

  try {
    const data = await gqlFetch<
      FoertroendemodellenFormQuery,
      FoertroendemodellenFormQueryVariables
    >(FOETROENDEMODELLEN_FORM_QUERY, { filter: { locale } });

    const formData = data?.dataportal_Digg_FoertroendemodellenForm;

    if (!formData) {
      console.error("No form data returned from GraphQL");
      throw new Error("No form data returned");
    }

    return withRevalidate(
      { ...formData, type: "FörtroendemodellenForm" },
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return withRevalidate({ type: "FörtroendemodellenForm" }, revalidate);
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
    const data = await gqlFetch<ModuleQuery, ModuleQueryVariables>(
      MODULE_QUERY,
      { identifier, locale },
    );

    const mod = data.dataportal_Digg_Module;

    return withRevalidate(
      {
        ...mod,
        type: "Module",
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
      } as ModuleResponse,
      revalidate,
    );
  } catch (error) {
    logGqlError(error);
    return withRevalidate(
      {
        ...emptyModule,
        type: "Module",
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
      } as ModuleResponse,
      revalidate,
    );
  }
};
