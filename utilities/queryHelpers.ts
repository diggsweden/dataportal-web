import { IPuff } from '../components';
import { client, CONTAINER_MULTI_QUERY, RELATED_CONTAINER_QUERY } from '../graphql';
import { DOMAIN_AGGREGATE_QUERY, ROOT_AGGREGATE_QUERY } from '../graphql/aggregateQuery';
import { PUBLICATION_QUERY } from '../graphql/publicationQuery';
import {
  Containers_dataportal_Digg_Containers,
  Containers_dataportal_Digg_Containers_categories,
} from '../graphql/__generated__/Containers';
import {
  DomainAggregate,
  DomainAggregateVariables,
  DomainAggregate_rootContainer,
} from '../graphql/__generated__/DomainAggregate';
import { dataportal_ContainerState } from '../graphql/__generated__/globalTypes';
import {
  MultiContainers,
  MultiContainersVariables,
  MultiContainers_category,
  MultiContainers_category_categories,
  MultiContainers_container,
} from '../graphql/__generated__/MultiContainers';
import {
  Publication,
  PublicationVariables,
  Publication_dataportal_Digg_Publications,
} from '../graphql/__generated__/Publication';
import { Related, RelatedVariables, Related_containers } from '../graphql/__generated__/Related';
import {
  RootAggregate,
  RootAggregateVariables,
  RootAggregate_container,
  RootAggregate_events,
  RootAggregate_examples,
  RootAggregate_news,
} from '../graphql/__generated__/RootAggregate';
import { SeoData } from '../graphql/__generated__/SeoData';
import { populatePuffs } from './areasAndThemesHelper';

/**
 * ? Better comments: https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments
 * ? Folding regions: https://marketplace.visualstudio.com/items?itemName=maptz.regionfolder
 */

/* #region private */
const notFound = (revalidate: boolean) => ({
  notFound: true,
  ...(revalidate ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60') } : {}),
});

const logGqlErrors = (error: any) => {
  const { networkError, graphQLErrors, clientErrors } = error || {};
  if (networkError?.result?.errors) {
    console.error('networkError', error.networkError.result.errors);
  }
  if (graphQLErrors?.length > 0) {
    console.error('graphqlError', error.graphQLErrors);
  }
  if (clientErrors?.length > 0) {
    console.error('clientError', error.clientErrors);
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
  state?: dataportal_ContainerState,
  secret?: string
): MultiContainersVariables => {
  const defaultVars = {
    category: {
      ...(domain ? { domains: [domain] } : {}),
      categories: [slugs[0]],
      locale,
    },
    container: {
      ...(domain ? { domains: [domain] } : {}),
      slug: `/${slugs.join('/')}`,
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
  categories: Containers_dataportal_Digg_Containers_categories[],
  locale: string,
  domain?: DiggDomain
) => {
  const relatedCategories = categories.map((c) => c.slug);

  if (categories.length > 0) {
    const result = await client.query<Related, RelatedVariables>({
      query: RELATED_CONTAINER_QUERY,
      variables: {
        filter: {
          ...(domain ? { domains: [domain] } : {}),
          locale,
          categories: relatedCategories,
          limit: 50,
        },
      },
      fetchPolicy: 'no-cache',
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
  type: 'MultiContainer';
  category?: MultiContainers_category_categories;
  container?: MultiContainers_container;
  related?: Related_containers[];
  categoryContainers?: MultiContainers_category[];
  domain?: DiggDomain;
}

export interface PublicationResponse extends Publication_dataportal_Digg_Publications {
  type: 'Publication';
  related?: Publication_dataportal_Digg_Publications[];
}

export interface PublicationListResponse {
  type: 'PublicationList';
  articles: Publication_dataportal_Digg_Publications[] | MultiContainers_category[];
  category?: MultiContainers_category_categories;
  domain?: DiggDomain;
  seo?: SeoData;
  basePath?: string;
  heading?: string;
}

export interface DomainAggregateResponse extends DomainAggregate_rootContainer {
  type: 'DomainAggregate';
  areas?: IPuff[];
  themes?: IPuff[];
  domain: DiggDomain;
}

export interface RootAggregateResponse extends RootAggregate_container {
  type: 'RootAggregate';
  areas?: IPuff[];
  themes?: IPuff[];
  news?: RootAggregate_news;
  example?: RootAggregate_examples;
  event?: RootAggregate_events;
}

export interface QueryOptions {
  state?: dataportal_ContainerState;
  secret?: string;
  revalidate: boolean;
}

export interface PublicationListOptions {
  seo?: SeoData;
  basePath?: string;
  heading?: string;
}

export interface PublicationQueryOptions extends QueryOptions {
  domain?: DiggDomain;
  tags?: string[];
}
/* #endregion */

/**
 * Divides every slug from each container into string parts
 * @param {Array<Containers_dataportal_Digg_Containers>} containers
 * @returns {Array<String[]>} An array with stringarrays based on all containerslugs
 */
export const extractSlugs = (containers: (Containers_dataportal_Digg_Containers | null)[]) => {
  const slugsArray: Array<string[]> = [];
  containers.map((page) => {
    const slugs = page?.slug?.split('/') || [];
    slugs.length > 0 && slugs[0] === '' && slugs.shift();
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
  opts: QueryOptions = { revalidate: true }
) => {
  const { state, secret, revalidate } = opts;
  if (hasIdendicalSibling(slugs, domain)) {
    console.warn(
      `Cannot have identicall slugs after another: '${domain ? `/${domain}/` : ''}${slugs.join(
        '/'
      )}'`
    );
    return notFound(revalidate);
  }

  const slug = '/' + slugs.join('/');

  try {
    // Get external data from the file system, API, DB, etc.
    const { error, errors, data } = await client.query<MultiContainers, MultiContainersVariables>({
      query: CONTAINER_MULTI_QUERY,
      variables: containerArgsFromSlugs(slugs, locale, domain, state, secret),
      fetchPolicy: 'no-cache',
    });

    if (error || errors) {
      console.error({ error, errors });
    }

    const container = data.container[0] || null;
    const categoryContainers = data.category;
    const category = categoryContainers[0]?.categories?.find((c) => c?.slug === slugs[0]) || null;
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
        type: 'MultiContainer',
        container,
        related,
        category,
        categoryContainers,
        domain: domain || null,
      } as MultiContainerResponse,
      ...(revalidate ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60') } : {}),
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
  opts?: PublicationListOptions
) => {
  // If nextjs should check for changes on the server
  const revalidate = true;
  const { seo, basePath, heading } = opts || {};

  try {
    const { data, error } = await client.query<Publication, PublicationVariables>({
      query: PUBLICATION_QUERY,
      variables: {
        filter: {
          locale,
          state: dataportal_ContainerState.live,
          tags,
          domains,
          limit: 1000,
        },
      },
      fetchPolicy: 'no-cache',
    });

    const publications = data?.dataportal_Digg_Publications;

    if (error) {
      console.error(error);
    }

    if (!publications) {
      console.warn(
        `No publications found${
          domains.length > 0 ? ` in domain(s) ${domains.join(',')}` : ''
        } with tags: '${tags.join(',')}'`
      );
    }

    return {
      props: {
        type: 'PublicationList',
        articles: Array.isArray(publications) ? publications : [],
        domain: domains[0] || null,
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
      } as PublicationListResponse,
      ...(revalidate ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60') } : {}),
    };
  } catch (error: any) {
    logGqlErrors(error);
    return {
      props: {
        type: 'PublicationList',
        articles: [],
        domain: domains[0] || null,
        seo: seo || null,
        basePath: basePath || null,
        heading: heading || null,
      } as PublicationListResponse,
      ...(revalidate ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60') } : {}),
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
  opts: PublicationQueryOptions = { revalidate: true }
) => {
  const { state, secret, revalidate, domain, tags } = opts;
  try {
    const mainPublicationResult = await client.query<Publication, PublicationVariables>({
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
      fetchPolicy: 'no-cache',
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

    const domains = publication.domains?.map((dom) => dom?.slug || '');
    const relatedTags = publication.tags?.map((tag) => tag?.value || '');
    // console.log({ domains, tags });

    const relatedPublicationResult = await client.query<Publication, PublicationVariables>({
      query: PUBLICATION_QUERY,
      variables: { filter: { limit: 4, locale, domains, tags: relatedTags } },
      fetchPolicy: 'no-cache',
    });

    // console.log(relatedPublicationResult.data.dataportal_Digg_Publications);

    return {
      props: {
        type: 'Publication',
        ...publication,
        related:
          relatedPublicationResult?.data?.dataportal_Digg_Publications.filter(
            (pub) => pub?.id !== publication.id
          ) || [],
      } as PublicationResponse,
      ...(revalidate ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60') } : {}),
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
  opts: QueryOptions = { revalidate: true }
) => {
  const { state, secret, revalidate } = opts;
  const sharedVariables = {
    limit: 1,
    locale,
  };
  try {
    const result = await client.query<DomainAggregate, DomainAggregateVariables>({
      query: DOMAIN_AGGREGATE_QUERY,
      variables: {
        domain: { ...sharedVariables, slug: domainSlug || '' },
        root: {
          ...sharedVariables,
          ...(secret ? { previewSecret: secret } : {}),
          state: state || dataportal_ContainerState.live,
          slug: '/' + (domainSlug || ''),
        },
      },
      fetchPolicy: 'no-cache',
    });

    if (result && result.error) {
      console.error(result.error);
    }

    const container = result && result.data ? result.data.rootContainer[0] : undefined;

    if (!container) {
      console.warn(`No container found with slug: '${domainSlug}'`);
    }

    const domain = result.data.domain[0];

    const areaTaxonomy = domain.taxonomies.find((t) => t.slug === 'dataomraden') || null;
    const themeTaxonomy = domain.taxonomies.find((t) => t.slug === 'teman') || null;
    const areas = areaTaxonomy ? populatePuffs(areaTaxonomy.categories, 'dataomraden') : null;
    const themes = themeTaxonomy ? populatePuffs(themeTaxonomy.categories, 'teman') : null;

    // The value of the `props` key will be
    //  passed to the `Page` component
    return {
      props: {
        ...container,
        type: 'DomainAggregate',
        areas,
        themes,
        domain: domainSlug,
      } as DomainAggregateResponse,
      ...(revalidate ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60') } : {}),
    };
  } catch (error: any) {
    logGqlErrors(error);
    return {
      props: {
        type: 'DomainAggregate',
        domain: domainSlug,
      } as DomainAggregateResponse,
      revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60'),
    };
  }
};

export const getRootAggregate = async (
  locale: string,
  opts: QueryOptions = { revalidate: true }
) => {
  const { state, secret, revalidate } = opts;
  // todo - add localization to translate files
  const getLocalizedVariables = (locale: string) => {
    const swedishVars = {
      newsTag: ['Nyhet'],
      examplesTag: ['Goda exempel'],
      eventsTag: ['Event'],
    };

    switch (locale) {
      case 'sv':
        return swedishVars;
      case 'en':
        return {
          newsTag: ['News'],
          examplesTag: ['Good examples'],
          eventsTag: ['Event'],
        };
      default:
        return swedishVars;
    }
  };

  const { newsTag, examplesTag, eventsTag } = getLocalizedVariables(locale);

  try {
    const { data, error } = await client.query<RootAggregate, RootAggregateVariables>({
      query: ROOT_AGGREGATE_QUERY,
      variables: {
        locale,
        newsTag,
        examplesTag,
        eventsTag,
        areaSlug: 'dataomraden', // todo - translate
        themeSlug: 'teman', // todo - translate
        state: state || dataportal_ContainerState.live,
        ...(secret ? { previewSecret: secret } : {}),
      },
      fetchPolicy: 'no-cache',
    });

    if (error) {
      console.error(error);
    }

    const container = data ? data.container[0] : undefined;

    if (!container) {
      console.warn(`No container found with slug: '/'`);
    }

    const news = data.news[0] || null;
    const example = data.examples[0] || null;
    const event = data.events[0] || null;
    const areas = data.areas ? populatePuffs(data.areas, 'dataomraden') : null;
    const themes = data.themes ? populatePuffs(data.themes, 'teman') : null;

    // The value of the `props` key will be
    //  passed to the `Page` component
    return {
      props: {
        ...container,
        type: 'RootAggregate',
        news,
        example,
        event,
        areas,
        themes,
      } as RootAggregateResponse,
      ...(revalidate ? { revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60') } : {}),
    };
  } catch (error: any) {
    logGqlErrors(error);
    return {
      props: {
        type: 'RootAggregate',
      } as RootAggregateResponse,
      revalidate: parseInt(process.env.REVALIDATE_INTERVAL || '60'),
    };
  }
};
