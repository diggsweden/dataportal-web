import { type FragmentType, getFragmentData, graphql } from "@/graphql/gql";

/* #region interfaces, unions and types */

export const ImageFragment = graphql(`
  fragment Image on dataportal_Digg_Image {
    __typename
    url
    alt
    name
    description
    mime
    ext
    screen9
    width
    height
  }
`);

export const SeoDataFragment = graphql(`
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
`);

export const ModuleListDataFragment = graphql(`
  fragment ModuleListData on dataportal_Digg_ModuleList {
    __typename
    id
    modules {
      ...ModuleData
    }
  }
`);

export const ParentSimplifiedFragment = graphql(`
  fragment ParentSimplified on dataportal_Digg_Parent_Simplified {
    slug
    name
    heading
  }
`);

export const ParentFragment = graphql(`
  fragment Parent on dataportal_Digg_Parent {
    heading
    preamble
    slug
    name
    pageNavigation {
      ...ParentSimplified
    }
  }
`);

export const ContainerDataFragment = graphql(`
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
    pageNavigation {
      ...ParentSimplified
    }
    seo {
      ...SeoData
    }
  }
`);

export const GoodExampleDataFragment = graphql(`
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
`);

export const NewsItemDataFragment = graphql(`
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
`);

export const StartPageDataFragment = graphql(`
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
`);

export const NavigationDataFragment = graphql(`
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
`);

export const ToolDataFragment = graphql(`
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
`);

export const FormElementFragment = graphql(`
  fragment FormElement on dataportal_Digg_IFormElement {
    __typename
    title

    ... on dataportal_Digg_FormDescription {
      text {
        markdown
      }
    }

    ... on dataportal_Digg_IFormInput {
      info
      required
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
`);

// Union
export const MediaTypeFragment = graphql(`
  fragment MediaType on dataportal_Digg_MediaType {
    ... on dataportal_Digg_Image {
      ...Image
    }
    ... on dataportal_Digg_File {
      __typename
      url
      alt
      name
      description
      mime
      ext
      screen9
    }
  }
`);

export const MenuLinkFragment = graphql(`
  fragment MenuLink on dataportal_Digg_MenuLink {
    name
    link
  }
`);

export const MenuLinkIconFragment = graphql(`
  fragment MenuLinkIcon on dataportal_Digg_MenuLinkIcon {
    name
    link
    icon
  }
`);

/* #endregion */

/* #region Components */
export const ChoiceFragment = graphql(`
  fragment Choice on dataportal_Digg_FormChoice {
    popup
    label
    exploratory
  }
`);
/* #endregion */

/* #region Blocks */
export const FormBlockFragment = graphql(`
  fragment FormBlock on dataportal_Digg_FormBlock {
    elements {
      ...FormElement
    }
  }
`);

export const NewsBlockItemFragment = graphql(`
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
`);

export const NewsBlockFragment = graphql(`
  fragment NewsBlock on dataportal_Digg_NewsBlock {
    id
    heading
    items {
      ... on dataportal_Digg_NewsItem_Preview {
        ...NewsBlockItem
      }
    }
  }
`);

export const GoodExampleBlockItemFragment = graphql(`
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
`);

export const GoodExampleBlockFragment = graphql(`
  fragment GoodExampleBlock on dataportal_Digg_GoodExampleBlock {
    id
    heading
    items {
      ... on dataportal_Digg_GoodExample_Preview {
        ...GoodExampleBlockItem
      }
    }
  }
`);

/* #endregion */

/* #region Collections */
export const ModuleDataFragment = graphql(`
  fragment ModuleData on dataportal_Digg_Module {
    __typename
    identifier
    blocks {
      ...BlockData
    }
  }
`);

export const FoertroendemodellenBlockFragment = graphql(`
  fragment FoertroendemodellenBlock on dataportal_Digg_FoertroendemodellenBlock {
    __typename
    id
  }
`);

export const FoertroendemodellenFormElementsFragment = graphql(`
  fragment FoertroendemodellenFormElements on dataportal_Digg_IFormElement {
    __typename
    title
    ... on dataportal_Digg_FormDescription {
      text {
        markdown
      }
    }
    ... on dataportal_Digg_IFormInput {
      info
      required
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
`);

/* #endregion */

export const BlockDataFragment = graphql(`
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
`);

export const FoertroendemodellenFormFragment = graphql(`
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
`);

/**
 * Narrows a masked `MediaType` union down to its `Image` variant (which
 * carries the `Image` fragment ref), or `null` for files / no media.
 * Lets image consumers pass CMS media straight into `CustomImage`.
 */
export const mediaTypeToImage = (
  media?: FragmentType<typeof MediaTypeFragment> | null,
): FragmentType<typeof ImageFragment> | null => {
  const data = getFragmentData(MediaTypeFragment, media);
  return data && data.__typename === "dataportal_Digg_Image" ? data : null;
};
