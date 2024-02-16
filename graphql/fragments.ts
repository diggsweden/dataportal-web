import { gql } from "@apollo/client";

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
    screen9
  }
`;

export const MODULE_LIST_DATA_FRAGMENT = gql`
  fragment ModuleListData on dataportal_Digg_ModuleList {
    __typename
    id
    modules {
      ...ModuleData
    }
  }
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
      ...Category
    }
    tags {
      value
    }
    blocks {
      ...BlockData
      ... on dataportal_Digg_ModuleList {
        ...ModuleListData
      }
    }
    seo {
      ...SeoData
    }
  }
  ${MODULE_LIST_DATA_FRAGMENT}
  ${CATEGORY_FRAGMENT}
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

export const TOOL_FRAGMENT = gql`
  fragment ToolData on dataportal_Digg_ITool {
    heading
    preamble
    link
    domainLabel
    description
  }
`;

export const FORM_INPUT_FRAGMENT = gql`
  fragment Input on dataportal_Digg_IFormInput {
    info
    required
  }
`;

export const FORM_ELEMENT_FRAGMENT = gql`
  fragment FormElement on dataportal_Digg_IFormElement {
    __typename
    title

    ... on dataportal_Digg_FormDescription {
      text {
        markdown
      }
    }

    ... on dataportal_Digg_IFormInput {
      ...Input
      ... on dataportal_Digg_FormRadio {
        choices {
          ...Choice
        }
      }
      ... on dataportal_Digg_FormCheckbox {
        choices {
          ...Choice
        }
      }
      ... on dataportal_Digg_FormDropdown {
        items
      }
    }
  }
  ${FORM_INPUT_FRAGMENT}
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

export const CHOICE_FRAGMENT = gql`
  fragment Choice on dataportal_Digg_FormChoice {
    popup
    label
  }
`;
/* #endregion */

/* #region Blocks */
export const FAQ_FRAGMENT = gql`
  fragment Faq on dataportal_Digg_Faq {
    question
    answer {
      markdown
    }
  }
`;

export const MEDIA_FRAGMENT = gql`
  fragment Media on dataportal_Digg_Media {
    heading
    description
    media {
      ...MediaType
    }
  }
`;

export const TEXT_FRAGMENT = gql`
  fragment Text on dataportal_Digg_Text {
    heading
    text: body {
      markdown
    }
  }
`;

export const RELATED_CONTENT_FRAGMENT = gql`
  fragment RelatedContent on dataportal_Digg_RelatedContent {
    id
    links {
      ...Link
    }
  }
`;

export const FORM_BLOCK_FRAGMENT = gql`
  fragment FormBlock on dataportal_Digg_FormBlock {
    elements {
      ...FormElement
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

export const MODULE_FRAGMENT = gql`
  fragment ModuleData on dataportal_Digg_Module {
    __typename
    identifier
    blocks {
      ...BlockData
    }
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

    ... on dataportal_Digg_RelatedContent {
      ...RelatedContent
    }

    ... on dataportal_Digg_FormBlock {
      ...FormBlock
    }
  }
  ${LINK_FRAGMENT}
  ${FAQ_FRAGMENT}
  ${TEXT_FRAGMENT}
  ${RELATED_CONTENT_FRAGMENT}
  ${MEDIA_FRAGMENT}
  ${MEDIA_BASE_FRAGMENT}
  ${MEDIA_TYPE_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${FORM_BLOCK_FRAGMENT}
  ${FORM_ELEMENT_FRAGMENT}
  ${CHOICE_FRAGMENT}
`;
