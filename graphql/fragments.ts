import { gql } from '@apollo/client';

/* #region interfaces, unions and types */

// Interface
export const MEDIA_BASE_FRAGMENT = gql`
  fragment MediaBase on dataportal_Digg_IMediaBase {
    __typename
    url
    alt
    name
    description
    mime
    ext
  }
`;

export const CONTAINER_FRAGMENT = gql`
  fragment ContainerData on dataportal_Digg_IContainer {
    id
    name
    locale
    heading
    preamble
    image {
      ...MediaType
    }
    updatedAt
    createdAt
    slug
    domains {
      name
      slug
    }
    categories {
      name
      slug
    }
    tags {
      value
    }
    blocks {
      ...BlockData
      ... on dataportal_Digg_ModuleList {
        __typename
        id
        modules {
          ...Module
        }
      }
    }
    seo {
      ...SeoData
    }
  }
`;

export const PUBLICATION_FRAGMENT = gql`
  fragment PublicationData on dataportal_Digg_IPublication {
    ...ContainerData
    publishedAt
    startDate
    endDate
  }
  ${CONTAINER_FRAGMENT}
`;

export const CATEGORY_FRAGMENT = gql`
  fragment Category on dataportal_Digg_ICategory {
    id
    name
    slug
    taxonomy
    updatedAt
    locale
  }
`;

// Type
export const IMAGE_FRAGMENT = gql`
  fragment Image on dataportal_Digg_Image {
    ...MediaBase
    width
    height
  }
`;

// Union
export const MEDIA_TYPE_FRAGMENT = gql`
  fragment MediaType on dataportal_Digg_MediaType {
    ... on dataportal_Digg_Image {
      ...Image
    }

    ... on dataportal_Digg_Video {
      ...MediaBase
    }

    ... on dataportal_Digg_File {
      ...MediaBase
    }
  }
`;
/* #endregion */

/* #region Components */
export const LINK_FRAGMENT = gql`
  fragment Link on dataportal_Digg_Link {
    slug
    title
    description
    linktype
  }
`;
/* #endregion */

/* #region Blocks */

export const FAQ_FRAGMENT = gql`
  fragment Faq on dataportal_Digg_IFaq {
    question
    answer {
      markdown
    }
  }
`;

export const MEDIA_FRAGMENT = gql`
  fragment Media on dataportal_Digg_IMedia {
    heading
    description
    media {
      ...MediaType
    }
  }
`;

export const HERO_FRAGMENT = gql`
  fragment Hero on dataportal_Digg_IHero {
    heading
    heroText: text {
      markdown
    }
    media {
      ...MediaType
    }
  }
`;

export const TEXT_FRAGMENT = gql`
  fragment Text on dataportal_Digg_IText {
    heading
    text: body {
      markdown
    }
  }
`;

export const RELATED_CONTENT_FRAGMENT = gql`
  fragment RelatedContent on dataportal_Digg_IRelatedContent {
    links {
      ...Link
    }
  }
`;

export const MODULE_FRAGMENT = gql`
  fragment Module on dataportal_Digg_Module {
    identifier
    blocks {
      ...BlockData
    }
  }
`;
/* #endregion */

/* #region Collections */
export const SEO_FRAGMENT = gql`
  fragment SeoData on dataportal_Digg_SEO {
    title
    description
    image {
      ...Image
    }
    robotsFollow
    robotsIndex
    lang
  }
`;
/* #endregion */

export const BLOCK_FRAGMENT = gql`
  fragment BlockData on dataportal_Digg_IBlock {
    __typename
    id

    ... on dataportal_Digg_Text {
      ...Text
    }

    ... on dataportal_Digg_Faq {
      ...Faq
    }

    ... on dataportal_Digg_Media {
      ...Media
    }

    ... on dataportal_Digg_Hero {
      ...Hero
    }

    ... on dataportal_Digg_RelatedContent {
      ...RelatedContent
    }
  }
  ${LINK_FRAGMENT}
  ${FAQ_FRAGMENT}
  ${HERO_FRAGMENT}
  ${TEXT_FRAGMENT}
  ${RELATED_CONTENT_FRAGMENT}
  ${MEDIA_FRAGMENT}
  ${MEDIA_BASE_FRAGMENT}
  ${MEDIA_TYPE_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;
