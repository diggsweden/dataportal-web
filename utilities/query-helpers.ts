import type {
  ContainerDataFragment,
  FormDataFragment,
  GoodExampleBlockItemFragment,
  GoodExampleDataFragment,
  ImageFragment,
  ModuleDataFragment,
  NavigationDataFragment,
  NewsBlockItemFragment,
  NewsItemDataFragment,
  ParentFragment,
  ParentSimplifiedFragment,
  SeoDataFragment,
  StartPageDataFragment,
  ToolDataFragment,
} from "@/graphql/__generated__/operations";
import {
  FoertroendemodellenFormDocument,
  FormDocument,
  GoodExampleDocument,
  ModuleDocument,
  NavigationDocument,
  NewsItemDocument,
  RootAggregateDocument,
  SearchDocument,
  StartPageDocument,
  ToolDocument,
} from "@/graphql/__generated__/operations";
import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import { gqlFetch, logGqlError } from "@/graphql/fetcher";

export interface MultiContainerResponse {
  type: "MultiContainer";
  container?: ContainerDataFragment;
  related?: ParentSimplifiedFragment[];
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

export const getNewsList = async (
  locale: string,
  opts?: PublicationListOptions,
): Promise<NewsItemListResponse> => {
  const { seo, basePath, heading, preamble, heroImage } = opts || {};

  try {
    const data = await gqlFetch(NewsItemDocument, {
      filter: {
        locale,
        state: Dataportal_ContainerState.Live,
        limit: 1000,
      },
    });

    const publications = data?.dataportal_Digg_News_Items;

    if (!publications) {
      console.warn(`No news found`);
    }

    return {
      type: "PublicationList",
      listItems: publications || [],
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || "",
      preamble: preamble || null,
      heroImage: heroImage || null,
    } as NewsItemListResponse;
  } catch (error) {
    logGqlError(error);
    return {
      type: "PublicationList",
      listItems: [],
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || "",
      heroImage: heroImage || null,
    } as NewsItemListResponse;
  }
};

export const getGoodExamplesList = async (
  locale: string,
  opts?: PublicationListOptions,
): Promise<GoodExampleListResponse> => {
  const { seo, basePath, heading, preamble, heroImage, reuse, breadcrumb } =
    opts || {};
  try {
    const data = await gqlFetch(GoodExampleDocument, {
      filter: {
        locale,
        state: Dataportal_ContainerState.Live,
        limit: 1000,
      },
    });

    const publications = data?.dataportal_Digg_Good_Examples?.filter(
      (publication) => publication && publication.reuse === reuse,
    );

    if (!publications) {
      console.warn(`No good examples found`);
    }

    return {
      type: "PublicationList",
      listItems: publications || [],
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || "",
      preamble: preamble || null,
      heroImage: heroImage || null,
      breadcrumb: breadcrumb || null,
    } as GoodExampleListResponse;
  } catch (error) {
    logGqlError(error);
    return {
      type: "PublicationList",
      listItems: [],
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || "",
      heroImage: heroImage || null,
      breadcrumb: breadcrumb || null,
    } as GoodExampleListResponse;
  }
};

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

export const getNewsItem = async (
  slug: string,
  locale: string,
  opts: PublicationQueryOptions = {},
): Promise<NewsItemResponse | null> => {
  const { state, secret } = opts;

  try {
    const mainPublicationResult = await gqlFetch(NewsItemDocument, {
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
      return null;
    }

    const relatedPublicationResult = await gqlFetch(NewsItemDocument, {
      filter: { limit: 4, locale },
    });

    const relatedPreviews: NewsBlockItemFragment[] =
      relatedPublicationResult.dataportal_Digg_News_Items
        ?.filter(
          (pub): pub is NewsItemDataFragment =>
            pub !== null && pub.id !== publication.id,
        )
        .slice(0, 3)
        .map(toNewsPreview) || [];

    return {
      type: "Publication",
      ...publication,
      related: relatedPreviews,
    } as NewsItemResponse;
  } catch (error) {
    logGqlError(error);
    return null;
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
  opts: PublicationQueryOptions = {},
  reuse: boolean = false,
): Promise<GoodExampleResponse | null> => {
  const { state, secret } = opts;
  try {
    const mainPublicationResult = await gqlFetch(GoodExampleDocument, {
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
      return null;
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
      return null;
    }

    const relatedPublicationResult = await gqlFetch(GoodExampleDocument, {
      filter: { limit: 4, locale },
    });

    const relatedPreviews: GoodExampleBlockItemFragment[] =
      relatedPublicationResult.dataportal_Digg_Good_Examples
        ?.filter(
          (pub): pub is GoodExampleDataFragment =>
            pub !== null && pub.id !== publication.id && pub.reuse === reuse,
        )
        .slice(0, 3)
        .map(toGoodExamplePreview) || [];

    return {
      type: "Publication",
      ...publication,
      related: relatedPreviews,
    } as GoodExampleResponse;
  } catch (error) {
    logGqlError(error);
    return null;
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
  opts: QueryOptions = {},
): Promise<RootAggregateResponse> => {
  const { state, secret } = opts;

  try {
    const data = await gqlFetch(RootAggregateDocument, {
      locale,
      state: state || Dataportal_ContainerState.Live,
      ...(secret ? { previewSecret: secret } : {}),
    });

    const container = data ? data.container[0] : undefined;

    if (!container) {
      console.warn(`No container found with slug: '/'`);
    }

    const news = data.news?.[0] ?? undefined;
    const examples = data.examples?.[0] ?? undefined;

    return {
      ...container,
      type: "RootAggregate",
      news,
      examples,
    } as RootAggregateResponse;
  } catch (error) {
    logGqlError(error);
    return {
      type: "RootAggregate",
    } as RootAggregateResponse;
  }
};

export const getStartPage = async (
  locale: string,
): Promise<StartPageResponse> => {
  try {
    const data = await gqlFetch(StartPageDocument, { filter: { locale } });

    const startPage = data.dataportal_Digg_Start_Page;

    return {
      ...startPage,
      type: "StartPage",
    } as StartPageResponse;
  } catch (error) {
    logGqlError(error);
    return {
      type: "StartPage",
    } as StartPageResponse;
  }
};

export const getNavigationData = async (
  locale: string,
): Promise<NavigationResponse> => {
  try {
    const data = await gqlFetch(NavigationDocument, { filter: { locale } });

    const navigationData = data.dataportal_Digg_Navigation;

    return {
      type: "Navigation",
      items: navigationData,
    } as NavigationResponse;
  } catch (error) {
    logGqlError(error);
    return { type: "Navigation", items: [] } as NavigationResponse;
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
    const data = await gqlFetch(SearchDocument, {
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
    });

    return data;
  } catch (error) {
    logGqlError(error);
    return undefined;
  }
};

export const getForm = async (
  identifier: string,
  locale?: string,
): Promise<FormResponse> => {
  try {
    const data = await gqlFetch(FormDocument, {
      identifier,
      locale,
    });

    const form = data.dataportal_Digg_Form;

    return { ...form, type: "Form" } as FormResponse;
  } catch (error) {
    logGqlError(error);
    return { type: "Form" } as FormResponse;
  }
};

export const getFoertroendemodellenForm = async (locale?: string) => {
  try {
    const data = await gqlFetch(FoertroendemodellenFormDocument, {
      filter: { locale },
    });

    const formData = data?.dataportal_Digg_FoertroendemodellenForm;

    if (!formData) {
      console.error("No form data returned from GraphQL");
      throw new Error("No form data returned");
    }

    return { ...formData, type: "FörtroendemodellenForm" };
  } catch (error) {
    logGqlError(error);
    return { type: "FörtroendemodellenForm" };
  }
};

export const getModule = async (
  identifier: string,
  locale?: string,
  opts?: ModuleOptions,
): Promise<ModuleResponse> => {
  const { seo, basePath, heading } = opts || {};

  const emptyModule: ModuleDataFragment = {
    __typename: "dataportal_Digg_Module",
    blocks: [],
    identifier: "",
  };

  try {
    const data = await gqlFetch(ModuleDocument, { identifier, locale });

    const mod = data.dataportal_Digg_Module;

    return {
      ...mod,
      type: "Module",
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || null,
    } as ModuleResponse;
  } catch (error) {
    logGqlError(error);
    return {
      ...emptyModule,
      type: "Module",
      seo: seo || null,
      basePath: basePath || null,
      heading: heading || null,
    } as ModuleResponse;
  }
};
