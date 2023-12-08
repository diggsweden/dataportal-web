import { gql } from "@apollo/client";
import {
  BLOCK_FRAGMENT,
  CATEGORY_FRAGMENT,
  CONTAINER_FRAGMENT,
  MODULE_FRAGMENT,
  PUBLICATION_FRAGMENT,
  SEO_FRAGMENT,
} from "./fragments";

export const DOMAIN_AGGREGATE_QUERY = gql`
  query DomainAggregate(
    $domain: dataportal_QueryDomainArgs
    $root: dataportal_QueryContainerArgs
  ) {
    domain: dataportal_Digg_Domains(filter: $domain) {
      id
      name
      slug
      taxonomies {
        id
        name
        slug
        categories {
          ...Category
        }
      }
    }
    rootContainer: dataportal_Digg_Containers(filter: $root) {
      ...ContainerData
    }
  }
  ${CATEGORY_FRAGMENT}
  ${CONTAINER_FRAGMENT}
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
`;

export const ROOT_AGGREGATE_QUERY = gql`
  query RootAggregate(
    $locale: String!
    $newsTag: [String!]!
    $eventsTag: [String!]!
    $examplesTag: [String!]!
    $areaSlug: String!
    $themeSlug: String!
    $state: dataportal_ContainerState!
  ) {
    container: dataportal_Digg_Containers(
      filter: { limit: 1, slug: "/", locale: $locale, state: $state }
    ) {
      ...ContainerData
    }
    news: dataportal_Digg_Publications(
      filter: { limit: 3, locale: $locale, state: $state, tags: $newsTag }
    ) {
      ...PublicationData
    }
    examples: dataportal_Digg_Publications(
      filter: { limit: 3, locale: $locale, state: $state, tags: $examplesTag }
    ) {
      ...PublicationData
    }
    events: dataportal_Digg_Publications(
      filter: { limit: 1, locale: $locale, state: $state, tags: $eventsTag }
    ) {
      ...PublicationData
    }
    areas: dataportal_Digg_Categories(filter: { taxonomy: $areaSlug }) {
      ...Category
    }
    themes: dataportal_Digg_Categories(filter: { taxonomy: $themeSlug }) {
      ...Category
    }
  }
  ${CATEGORY_FRAGMENT}
  ${PUBLICATION_FRAGMENT}
  ${CONTAINER_FRAGMENT}
  ${BLOCK_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MODULE_FRAGMENT}
`;
