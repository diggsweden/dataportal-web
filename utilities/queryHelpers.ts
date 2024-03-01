import {
  browserclient,
  client,
  CONTAINER_MULTI_QUERY,
  RELATED_CONTAINER_QUERY,
} from "@/graphql";
import { ROOT_AGGREGATE_QUERY } from "@/graphql/aggregateQuery";
import { FORM_QUERY } from "@/graphql/formQuery";
import { MODULE_QUERY } from "@/graphql/moduleQuery";
import { PUBLICATION_QUERY } from "@/graphql/publicationQuery";
import { TOOL_QUERY } from "@/graphql/toolQuery";
import { SEARCH_QUERY } from "@/graphql/searchQuery";
import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import {
  CategoryFragment,
  ContainerData_Dataportal_Digg_Container_Fragment,
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
  PublicationDataFragment,
  PublicationQuery,
  PublicationQueryVariables,
  RelatedContainerFragment,
  RelatedQuery,
  RelatedQueryVariables,
  RootAggregateQuery,
  RootAggregateQueryVariables,
  SearchQueryVariables,
  SeoDataFragment,
  ToolDataFragment,
  ToolQuery,
  ToolQueryVariables,
} from "@/graphql/__generated__/operations";

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

const getRelatedContainers = async (
  category: CategoryFragment,
  locale: string,
) => {
  if (category) {
    const result = await client.query<RelatedQuery, RelatedQueryVariables>({
      query: RELATED_CONTAINER_QUERY,
      variables: {
        filter: {
          category: { locale, slug: category.slug, limit: 50 },
        },
      },
      fetchPolicy: "no-cache",
    });

    if (result.error || result.errors) return null;

    return result.data.containers || [];
  } else {
    return null;
  }
};

/* #endregion */

/* #region types */
export interface MultiContainerResponse {
  type: "MultiContainer";
  container?: ContainerData_Dataportal_Digg_Container_Fragment;
  related?: RelatedContainerFragment[];
  parent?: ParentFragment;
}

export interface PublicationResponse extends PublicationDataFragment {
  type: "Publication";
  related?: PublicationDataFragment[];
}

export interface PublicationListResponse {
  type?: "PublicationList";
  heading: string;
  listItems: PublicationDataFragment[];
  seo?: SeoDataFragment;
  basePath?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
}

export interface ToolListResponse {
  type?: "ToolList";
  listItems: ToolDataFragment[];
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
}

export interface RootAggregateResponse
  extends ContainerData_Dataportal_Digg_Container_Fragment {
  type: "RootAggregate";
  news?: PublicationDataFragment;
  examples?: PublicationDataFragment;
  events?: PublicationDataFragment;
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
    | PublicationDataFragment
    | ContainerData_Dataportal_Digg_Container_Fragment
    | null;
  nrOfHits: number;
}

export interface QueryOptions {
  state?: Dataportal_ContainerState;
  secret?: string;
  revalidate: boolean;
}

export interface PublicationListOptions {
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
        category: { slug: slugs[0], locale },
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
    const related = container
      ? await getRelatedContainers(
          container.category as CategoryFragment,
          locale,
        )
      : null;

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
        related,
      },
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error: any) {
    logGqlErrors(error);
    return notFound(revalidate);
  }
};

/**
 * Get a list of publications from strapi
 *
 * @param {Array<String>} slug
 * @param {string} locale
 * @returns {PublicationListResponse} nextjs staticprops
 */
export const getPublicationsList = async (
  tags: string[],
  locale: string,
  opts?: PublicationListOptions,
) => {
  // If nextjs should check for changes on the server
  const revalidate = true;
  const { seo, basePath, heading, preamble, heroImage } = opts || {};

  try {
    const { data, error } = await client.query<
      PublicationQuery,
      PublicationQueryVariables
    >({
      query: PUBLICATION_QUERY,
      variables: {
        filter: {
          locale,
          state: Dataportal_ContainerState.Live,
          tags: tags,
          limit: 1000,
        },
      },
      fetchPolicy: "no-cache",
    });

    const publications = data?.dataportal_Digg_Publications;

    if (error) {
      console.error(error);
    }

    if (!publications) {
      console.warn(`No publications found with tags: '${tags.join(",")}'`);
    }

    return {
      props: {
        type: "PublicationList",
        listItems: Array.isArray(publications) ? publications : [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        preamble: preamble || null,
        heroImage: heroImage || null,
      } as PublicationListResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error: any) {
    logGqlErrors(error);
    return {
      props: {
        type: "PublicationList",
        listItems: [],
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || "",
        heroImage: heroImage || null,
      } as PublicationListResponse,
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
 * @returns {PublicationListResponse} nextjs staticprops
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
        listItems: Array.isArray(tools) ? tools : [],
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
  } catch (error: any) {
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
export const getPublication = async (
  slug: string,
  locale: string,
  opts: PublicationQueryOptions = { revalidate: true },
) => {
  const { state, secret, revalidate, tags } = opts;
  try {
    const mainPublicationResult = await client.query<
      PublicationQuery,
      PublicationQueryVariables
    >({
      query: PUBLICATION_QUERY,
      variables: {
        filter: {
          slug,
          limit: 1,
          locale,
          tags: tags || [],
          ...(secret ? { previewSecret: secret } : {}),
          ...(state ? { state } : {}),
        },
      },
      fetchPolicy: "no-cache",
    });

    const publication =
      mainPublicationResult && mainPublicationResult.data
        ? mainPublicationResult.data.dataportal_Digg_Publications[0]
        : undefined;

    if (mainPublicationResult && mainPublicationResult.error) {
      console.error(mainPublicationResult.error);
    }

    if (!publication) {
      console.warn(`No publication found with slug: '${slug}'`);
      return notFound(revalidate);
    }

    const relatedTags = publication.tags.map((tag) => tag?.value || "");

    const relatedPublicationResult = await client.query<
      PublicationQuery,
      PublicationQueryVariables
    >({
      query: PUBLICATION_QUERY,
      variables: { filter: { limit: 3, locale, tags: relatedTags } },
      fetchPolicy: "no-cache",
    });

    // console.log(relatedPublicationResult.data.dataportal_Digg_Publications);

    return {
      props: {
        type: "Publication",
        ...publication,
        related:
          relatedPublicationResult?.data?.dataportal_Digg_Publications.filter(
            (pub) => pub?.id !== publication.id,
          ) || [],
      } as PublicationResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error: any) {
    logGqlErrors(error);
    return notFound(revalidate);
  }
};

export const getRootAggregate = async (
  locale: string,
  opts: QueryOptions = { revalidate: true },
) => {
  const { state, secret, revalidate } = opts;
  // todo - add localization to translate files
  const getLocalizedVariables = (locale: string) => {
    const swedishVars = {
      newsTag: ["Nyhet"],
      examplesTag: ["Goda exempel"],
      eventsTag: ["Event"],
    };

    switch (locale) {
      case "sv":
        return swedishVars;
      case "en":
        return {
          newsTag: ["News"],
          examplesTag: ["Good examples"],
          eventsTag: ["Event"],
        };
      default:
        return swedishVars;
    }
  };

  const { newsTag, examplesTag, eventsTag } = getLocalizedVariables(locale);

  try {
    const { data, error } = await client.query<
      RootAggregateQuery,
      RootAggregateQueryVariables
    >({
      query: ROOT_AGGREGATE_QUERY,
      variables: {
        locale,
        newsTag,
        examplesTag,
        eventsTag,
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
    const event = data.events[0] || null;

    // The value of the `props` key will be
    //  passed to the `Page` component
    return {
      props: {
        ...container,
        type: "RootAggregate",
        news,
        example,
        event,
      },
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error: any) {
    logGqlErrors(error);
    return {
      props: {
        type: "RootAggregate",
      } as RootAggregateResponse,
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
    let cl = clientQuery ? browserclient : client;

    const searchResult = await cl.query<
      | ContainerData_Dataportal_Digg_Container_Fragment
      | PublicationDataFragment,
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
