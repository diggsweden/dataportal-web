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

export const PARENT_FRAGMENT = gql`
  fragment Parent on dataportal_Digg_Parent {
    heading
    preamble
    slug
    name
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
    landingPage
    blocks {
      ...BlockData
      ... on dataportal_Digg_ModuleList {
        ...ModuleListData
      }
    }
    parent {
      ...Parent
    }
    containerGroup {
      ...Parent
    }
    seo {
      ...SeoData
    }
  }
  ${PARENT_FRAGMENT}
  ${MODULE_LIST_DATA_FRAGMENT}
`;

export const GOOD_EXAMPLE_FRAGMENT = gql`
  fragment GoodExampleData on dataportal_Digg_IGood_Example {
    id
    name
    locale
    heading
    preamble
    publisher
    link
    reuse
    image {
      ...MediaType
    }
    updatedAt
    createdAt
    slug
    blocks {
      ...BlockData
      ... on dataportal_Digg_ModuleList {
        ...ModuleListData
      }
    }
    seo {
      ...SeoData
    }
    keywords {
      value
      id
    }
    category
    typeOfReuse
    benefit
    entity
    apiAndDataset {
      title
      link
    }
    publishedAt
  }
  ${MODULE_LIST_DATA_FRAGMENT}
`;

export const NEWS_ITEM_FRAGMENT = gql`
  fragment NewsItemData on dataportal_Digg_INews_Item {
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
    blocks {
      ...BlockData
      ... on dataportal_Digg_ModuleList {
        ...ModuleListData
      }
    }
    seo {
      ...SeoData
    }
    keywords {
      value
      id
    }
    publishedAt
  }
  ${MODULE_LIST_DATA_FRAGMENT}
`;

export const START_PAGE_FRAGMENT = gql`
  fragment StartPageData on dataportal_Digg_IStart_Page {
    id
    locale
    heading
    preamble
    image {
      ...MediaType
    }
    updatedAt
    createdAt
    blocks {
      ...BlockData
    }
    seo {
      ...SeoData
    }
  }
`;

export const NAVIGATION_FRAGMENT = gql`
  fragment NavigationData on dataportal_Digg_INavigation {
    id
    locale
    mainMenu {
      name
      link
    }
    footerMenu {
      title
      links {
        name
        link
      }
    }
    serviceMenu {
      icon
      link
      name
    }
    sidebarMenu {
      ... on dataportal_Digg_MenuLinkIcon {
        icon
        link
        name
      }
      ... on dataportal_Digg_SubLink {
        title
        icon
        links {
          name
          link
        }
      }
    }
  }
`;

export const TOOL_FRAGMENT = gql`
  fragment ToolData on dataportal_Digg_ITool {
    heading
    preamble
    link
    domainLabel
    description
    keywords {
      value
      id
    }
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
        items {
          value
          popup
        }
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

// Video
export const VIDEO_FRAGMENT = gql`
  fragment Video on dataportal_Digg_Video {
    heading
    description
    video_id
  }
`;

// Union
export const MEDIA_TYPE_FRAGMENT = gql`
  fragment MediaType on dataportal_Digg_MediaType {
    ... on dataportal_Digg_Image {
      ...Image
    }
    ... on dataportal_Digg_File {
      ...MediaBase
    }
  }
`;

export const MENU_LINK_FRAGMENT = gql`
  fragment MenuLink on dataportal_Digg_MenuLink {
    name
    link
  }
`;

export const MENU_LINK_ICON_FRAGMENT = gql`
  fragment MenuLinkIcon on dataportal_Digg_MenuLinkIcon {
    name
    link
    icon
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
    customPreamble
    showPreamble
    image {
      ...MediaType
    }
  }
`;

export const CHOICE_FRAGMENT = gql`
  fragment Choice on dataportal_Digg_FormChoice {
    popup
    label
    exploratory
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

export const QUOTE_FRAGMENT = gql`
  fragment Quote on dataportal_Digg_Quote {
    quote
    author
    image {
      ...Image
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
    heading
    showMoreLink
    links {
      ...Link
    }
  }
`;

export const PROMOTED_CONTENT_FRAGMENT = gql`
  fragment PromotedContent on dataportal_Digg_PromotedContent {
    id
    heading
    preamble
    externalLink
    buttonText
    image {
      ...Image
    }
    container {
      slug
      title
      preamble
      image {
        ...Image
      }
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

export const NEWS_BLOCK_ITEM_FRAGMENT = gql`
  fragment NewsBlockItem on dataportal_Digg_NewsItem_Preview {
    heading
    publishedAt
    slug
    keywords {
      value
      id
    }
    image {
      ...Image
    }
  }
  ${IMAGE_FRAGMENT}
`;

export const NEWS_BLOCK_FRAGMENT = gql`
  fragment NewsBlock on dataportal_Digg_NewsBlock {
    id
    heading
    items {
      ... on dataportal_Digg_NewsItem_Preview {
        ...NewsBlockItem
      }
    }
  }
  ${NEWS_BLOCK_ITEM_FRAGMENT}
`;

export const GOOD_EXAMPLE_BLOCK_ITEM_FRAGMENT = gql`
  fragment GoodExampleBlockItem on dataportal_Digg_GoodExample_Preview {
    heading
    publishedAt
    slug
    reuse
    keywords {
      value
      id
    }
    image {
      ...Image
    }
  }
  ${IMAGE_FRAGMENT}
`;

export const GOOD_EXAMPLE_BLOCK_FRAGMENT = gql`
  fragment GoodExampleBlock on dataportal_Digg_GoodExampleBlock {
    id
    heading
    items {
      ... on dataportal_Digg_GoodExample_Preview {
        ...GoodExampleBlockItem
      }
    }
  }
  ${GOOD_EXAMPLE_BLOCK_ITEM_FRAGMENT}
`;

export const CTA_CARD_BLOCK_FRAGMENT = gql`
  fragment CtaCardBlock on dataportal_Digg_CTACardBlock {
    heading
    description
    ctaLinks {
      ...MenuLink
    }
  }
  ${MENU_LINK_FRAGMENT}
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

export const FOETROENDEMODELLEN_FRAGMENT_BLOCK = gql`
  fragment FoertroendemodellenBlock on dataportal_Digg_FoertroendemodellenBlock {
    __typename
    id
  }
`;

export const FOETROENDEMODELLEN_FORM_ELEMENTS = gql`
  fragment FoertroendemodellenFormElements on dataportal_Digg_IFormElement {
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
        items {
          value
          popup
        }
      }
    }
  }
  ${FORM_INPUT_FRAGMENT}
  ${CHOICE_FRAGMENT}
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

    ... on dataportal_Digg_Video {
      ...Video
    }
    ... on dataportal_Digg_RelatedContent {
      ...RelatedContent
    }

    ... on dataportal_Digg_PromotedContent {
      ...PromotedContent
    }

    ... on dataportal_Digg_FormBlock {
      ...FormBlock
    }

    ... on dataportal_Digg_Quote {
      ...Quote
    }

    ... on dataportal_Digg_GoodExampleBlock {
      ...GoodExampleBlock
    }

    ... on dataportal_Digg_NewsBlock {
      ...NewsBlock
    }

    ... on dataportal_Digg_CTACardBlock {
      ...CtaCardBlock
    }

    ... on dataportal_Digg_FoertroendemodellenBlock {
      ...FoertroendemodellenBlock
    }
  }
  ${LINK_FRAGMENT}
  ${FAQ_FRAGMENT}
  ${FOETROENDEMODELLEN_FRAGMENT_BLOCK}
  ${TEXT_FRAGMENT}
  ${RELATED_CONTENT_FRAGMENT}
  ${PROMOTED_CONTENT_FRAGMENT}
  ${MEDIA_FRAGMENT}
  ${MEDIA_BASE_FRAGMENT}
  ${MEDIA_TYPE_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VIDEO_FRAGMENT}
  ${FORM_BLOCK_FRAGMENT}
  ${FORM_ELEMENT_FRAGMENT}
  ${CHOICE_FRAGMENT}
  ${QUOTE_FRAGMENT}
  ${GOOD_EXAMPLE_BLOCK_FRAGMENT}
  ${NEWS_BLOCK_FRAGMENT}
  ${CTA_CARD_BLOCK_FRAGMENT}
`;

export const FOETROENDEMODELLEN_FORM_FRAGMENT_FORM = gql`
  fragment FoertroendemodellenForm on dataportal_Digg_FoertroendemodellenForm {
    __typename
    id
    elements {
      ...FoertroendemodellenFormElements
    }
    resultPageInfo
    blocks {
      ...BlockData
    }
  }
  ${FOETROENDEMODELLEN_FORM_ELEMENTS}
  ${BLOCK_FRAGMENT}
`;
