import {
  browserclient,
  client,
  CONTAINER_MULTI_QUERY,
  RELATED_CONTAINER_QUERY,
} from "@/graphql";
import {
  DOMAIN_AGGREGATE_QUERY,
  ROOT_AGGREGATE_QUERY,
} from "@/graphql/aggregateQuery";
import { FORM_QUERY } from "@/graphql/formQuery";
import { MODULE_QUERY } from "@/graphql/moduleQuery";
import { PUBLICATION_QUERY } from "@/graphql/publicationQuery";
import { SEARCH_QUERY } from "@/graphql/searchQuery";
import { Dataportal_ContainerState } from "@/graphql/__generated__/types";
import {
  CategoryFragment,
  ContainerData_Dataportal_Digg_Container_Fragment,
  DomainAggregateQuery,
  DomainAggregateQueryVariables,
  FormDataFragment,
  FormQuery,
  FormQueryVariables,
  ModuleDataFragment,
  ModuleQuery,
  ModuleQueryVariables,
  MultiContainersQuery,
  MultiContainersQueryVariables,
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
} from "@/graphql/__generated__/operations";
import { PromoProps } from "@/components/content/Promo";

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

/**
 * Build filters from slugs for ContainerQuery
 * @param {String[]} slugs
 * @returns {ContainersVariables[]}
 */
export const containerArgsFromSlugs = (
  slugs: string[],
  locale: string,
  domain?: DiggDomain,
  state?: Dataportal_ContainerState,
  secret?: string,
): MultiContainersQueryVariables => {
  const defaultVars = {
    category: {
      ...(domain ? { domains: [domain] } : {}),
      categories: [slugs[0]],
      locale,
    },
    container: {
      ...(domain ? { domains: [domain] } : {}),
      slug: `/${slugs.join("/")}`,
      locale,
      ...(secret ? { previewSecret: secret } : {}),
      ...(state ? { state } : {}),
    },
  };

  switch (slugs.length) {
    //one level /category
    //one level /slug
    case 1:
      return {
        category: {
          ...(domain ? { domains: [domain] } : {}),
          categories: [slugs[0]],
          locale,
        },
        container: {
          ...(domain ? { domains: [domain] } : {}),
          slug: `/${slugs[0]}`,
          limit: 1,
          locale,
          ...(secret ? { previewSecret: secret } : {}),
          ...(state ? { state } : {}),
        },
      };

    default:
      return defaultVars;
  }
};

const hasIdendicalSibling = (slugs: string[], domain?: DiggDomain) => {
  const arr = domain ? [domain, ...slugs] : slugs;
  return arr.some((slug, index) => slug === arr[index - 1]);
};

const getRelatedContainers = async (
  categories: CategoryFragment[],
  locale: string,
  domain?: DiggDomain,
) => {
  const relatedCategories = categories.map((c) => c.slug);

  if (categories.length > 0) {
    const result = await client.query<RelatedQuery, RelatedQueryVariables>({
      query: RELATED_CONTAINER_QUERY,
      variables: {
        filter: {
          ...(domain ? { domains: [domain] } : {}),
          locale,
          categories: relatedCategories,
          limit: 50,
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
  category?: ContainerData_Dataportal_Digg_Container_Fragment;
  container?: ContainerData_Dataportal_Digg_Container_Fragment;
  related?: RelatedContainerFragment[];
  categoryContainers?:
    | PublicationDataFragment[]
    | ContainerData_Dataportal_Digg_Container_Fragment[];
  domain?: DiggDomain;
}

export interface PublicationResponse extends PublicationDataFragment {
  type: "Publication";
  related?: PublicationDataFragment[];
}

export interface PublicationListResponse {
  type?: "PublicationList";
  publications:
    | PublicationDataFragment[]
    | ContainerData_Dataportal_Digg_Container_Fragment[];
  category?: ContainerData_Dataportal_Digg_Container_Fragment;
  domain?: DiggDomain;
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
}

export interface DomainAggregateResponse
  extends ContainerData_Dataportal_Digg_Container_Fragment {
  type: "DomainAggregate";
  areas?: PromoProps[];
  themes?: PromoProps[];
  domain: DiggDomain;
}

export interface RootAggregateResponse
  extends ContainerData_Dataportal_Digg_Container_Fragment {
  type: "RootAggregate";
  areas?: PromoProps[];
  themes?: PromoProps[];
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
}

export interface PublicationQueryOptions extends QueryOptions {
  domain?: DiggDomain;
  tags?: string[];
}

export interface ModuleOptions {
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
}
/* #endregion */

/**
 * Divides every slug from each container into string parts
 * @param {Array<Containers_dataportal_Digg_Containers>} containers
 * @returns {Array<String[]>} An array with stringarrays based on all containerslugs
 */
export const extractSlugs = (
  containers: (ContainerData_Dataportal_Digg_Container_Fragment | null)[],
) => {
  const slugsArray: Array<string[]> = [];
  containers.map((page) => {
    const slugs = page?.slug?.split("/") || [];
    slugs.length > 0 && slugs[0] === "" && slugs.shift();
    slugsArray.push(slugs);
  });

  return slugsArray;
};

/**
 * @param {Array<string>} slugs
 * @returns
 */
export const getMultiContainer = async (
  slugs: string[],
  locale: string,
  domain?: DiggDomain,
  opts: QueryOptions = { revalidate: true },
) => {
  const { state, secret, revalidate } = opts;
  if (hasIdendicalSibling(slugs, domain)) {
    console.warn(
      `Cannot have identicall slugs after another: '${
        domain ? `/${domain}/` : ""
      }${slugs.join("/")}'`,
    );
    return notFound(revalidate);
  }

  const slug = "/" + slugs.join("/");

  try {
    // Get external data from the file system, API, DB, etc.
    const { error, errors, data } = await client.query<
      MultiContainersQuery,
      MultiContainersQueryVariables
    >({
      query: CONTAINER_MULTI_QUERY,
      variables: containerArgsFromSlugs(slugs, locale, domain, state, secret),
      fetchPolicy: "no-cache",
    });

    if (error || errors) {
      console.error({ error, errors });
    }

    const container = data.container[0] || null;
    const categoryContainers = data.category;
    const category =
      categoryContainers[0]?.categories?.find((c) => c?.slug === slugs[0]) ||
      null;
    const related = container
      ? await getRelatedContainers(container.categories, locale, domain)
      : null;

    if (!container && !category) {
      console.warn(`No container or category found for: ${slug}`);
      return notFound(revalidate);
    }

    // The value of the `props` key will be
    //  passed to the `Page` component
    return {
      props: {
        type: "MultiContainer",
        container,
        related,
        category,
        categoryContainers,
        domain: domain || null,
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
 * @param {Array<DiggDomain>} domains
 * @param {Array<String>} slug
 * @param {string} locale
 * @returns {PublicationListResponse} nextjs staticprops
 */
export const getPublicationsList = async (
  domains: DiggDomain[],
  tags: string[],
  locale: string,
  opts?: PublicationListOptions,
) => {
  // If nextjs should check for changes on the server
  const revalidate = true;
  const { seo, basePath, heading } = opts || {};

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
          domains,
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
      console.warn(
        `No publications found${
          domains.length > 0 ? ` in domain(s) ${domains.join(",")}` : ""
        } with tags: '${tags.join(",")}'`,
      );
    }

    return {
      props: {
        type: "PublicationList",
        publications: Array.isArray(publications) ? publications : [],
        domain: domains[0] || null,
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
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
        publications: [],
        domain: domains[0] || null,
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
      } as PublicationListResponse,
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
  const { state, secret, revalidate, domain, tags } = opts;
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
          domains: domain ? [domain] : [],
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

    const domains = publication.domains.map((dom) => dom?.slug || "");
    const relatedTags = publication.tags.map((tag) => tag?.value || "");
    // console.log({ domains, tags });

    const relatedPublicationResult = await client.query<
      PublicationQuery,
      PublicationQueryVariables
    >({
      query: PUBLICATION_QUERY,
      variables: { filter: { limit: 4, locale, domains, tags: relatedTags } },
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

/**
 * Get domain container and corresponding data from strapi
 * @param {DiggDomain} domainSlug
 * @param {string} locale
 * @returns nextjs static props
 */
export const getDomainAggregate = async (
  domainSlug: string,
  locale: string,
  opts: QueryOptions = { revalidate: true },
) => {
  const { state, secret, revalidate } = opts;
  const sharedVariables = {
    limit: 1,
    locale,
  };
  try {
    const result = await client.query<
      DomainAggregateQuery,
      DomainAggregateQueryVariables
    >({
      query: DOMAIN_AGGREGATE_QUERY,
      variables: {
        domain: { ...sharedVariables, slug: domainSlug || "" },
        root: {
          ...sharedVariables,
          ...(secret ? { previewSecret: secret } : {}),
          state: state || Dataportal_ContainerState.Live,
          slug: "/" + (domainSlug || ""),
        },
      },
      fetchPolicy: "no-cache",
    });

    if (result && result.error) {
      console.error(result.error);
    }

    const container =
      result && result.data ? result.data.rootContainer[0] : undefined;

    if (!container) {
      console.warn(`No container found with slug: '${domainSlug}'`);
    }

    const domain = result.data.domain[0];

    const areaTaxonomy =
      domain.taxonomies.find((t) => t.slug === "dataomraden") || null;
    const themeTaxonomy =
      domain.taxonomies.find((t) => t.slug === "teman") || null;
    const areas = areaTaxonomy
      ? areaTaxonomy.categories.map((category) => ({
          title: category.name,
          slug: category.slug,
        }))
      : null;
    const themes = themeTaxonomy
      ? themeTaxonomy.categories.map((category) => ({
          title: category.name,
          slug: category.slug,
        }))
      : null;

    // The value of the `props` key will be
    //  passed to the `Page` component
    return {
      props: {
        ...container,
        type: "DomainAggregate",
        areas,
        themes,
        domain: domainSlug,
      } as DomainAggregateResponse,
      ...(revalidate
        ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60") }
        : {}),
    };
  } catch (error: any) {
    logGqlErrors(error);
    return {
      props: {
        type: "DomainAggregate",
        domain: domainSlug,
      } as DomainAggregateResponse,
      revalidate: parseInt(process.env.REVALIDATE_INTERVAL || "60"),
    };
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
        areaSlug: "dataomraden", // todo - translate
        themeSlug: "teman", // todo - translate
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
    const areas = data.areas
      ? data.areas.map((area) => ({
          title: area.name,
          slug: area.slug,
        }))
      : null;
    const themes = data.themes
      ? data.themes.map((theme) => ({
          title: theme.name,
          slug: theme.slug,
        }))
      : null;

    // The value of the `props` key will be
    //  passed to the `Page` component
    return {
      props: {
        ...container,
        type: "RootAggregate",
        news,
        example,
        event,
        areas,
        themes,
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
