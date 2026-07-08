/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query GoodExample($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_Good_Examples(filter: $filter) {\n      ...GoodExampleData\n    }\n  }\n": types.GoodExampleDocument,
    "\n  query NewsItem($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_News_Items(filter: $filter) {\n      ...NewsItemData\n    }\n  }\n": types.NewsItemDocument,
    "\n  query Tool($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_Tools(filter: $filter) {\n      ...ToolData\n    }\n  }\n": types.ToolDocument,
    "\n  query Containers($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_Containers(filter: $filter) {\n      ...ContainerData\n    }\n  }\n": types.ContainersDocument,
    "\n  query MultiContainers($container: dataportal_QueryContainerArgs) {\n    container: dataportal_Digg_Containers(filter: $container) {\n      ...ContainerData\n    }\n  }\n": types.MultiContainersDocument,
    "\n  query RootAggregate($locale: String!, $state: dataportal_ContainerState!) {\n    container: dataportal_Digg_Containers(\n      filter: { limit: 1, slug: \"/\", locale: $locale, state: $state }\n    ) {\n      ...ContainerData\n    }\n    news: dataportal_Digg_News_Items(\n      filter: { limit: 3, locale: $locale, state: $state }\n    ) {\n      ...NewsItemData\n    }\n    examples: dataportal_Digg_Good_Examples(\n      filter: { limit: 3, locale: $locale, state: $state }\n    ) {\n      ...GoodExampleData\n    }\n  }\n": types.RootAggregateDocument,
    "\n  fragment FormData on dataportal_Digg_Form {\n    id\n    identifier\n    elements {\n      ...FormElement\n    }\n  }\n": types.FormDataFragmentDoc,
    "\n  query Form($identifier: String!, $locale: String) {\n    dataportal_Digg_Form(identifier: $identifier, locale: $locale) {\n      ...FormData\n    }\n  }\n": types.FormDocument,
    "\n  query Module($identifier: String!, $locale: String) {\n    dataportal_Digg_Module(identifier: $identifier, locale: $locale) {\n      ...ModuleData\n    }\n  }\n": types.ModuleDocument,
    "\n  fragment SearchContainer on dataportal_Digg_IContainer {\n    __typename\n    heading\n    name\n    slug\n  }\n": types.SearchContainerFragmentDoc,
    "\n  fragment SearchNewsItem on dataportal_Digg_INews_Item {\n    __typename\n    heading\n    name\n    slug\n  }\n": types.SearchNewsItemFragmentDoc,
    "\n  fragment SearchGoodExample on dataportal_Digg_IGood_Example {\n    __typename\n    heading\n    name\n    slug\n  }\n": types.SearchGoodExampleFragmentDoc,
    "\n  fragment SearchHit on dataportal_Digg_SearchHit {\n    highlights {\n      name\n      value\n    }\n    hit {\n      ...SearchContainer\n      ...SearchNewsItem\n      ...SearchGoodExample\n    }\n  }\n": types.SearchHitFragmentDoc,
    "\n  query Search($filter: dataportal_QuerySearchArgs) {\n    dataportal_Digg_Search(filter: $filter) {\n      totalNrOfHits\n      hits {\n        ...SearchHit\n      }\n    }\n  }\n": types.SearchDocument,
    "\n  query Navigation($filter: dataportal_QueryLocaleArgs) {\n    dataportal_Digg_Navigation(filter: $filter) {\n      ...NavigationData\n    }\n  }\n": types.NavigationDocument,
    "\n  query StartPage($filter: dataportal_QueryLocaleArgs) {\n    dataportal_Digg_Start_Page(filter: $filter) {\n      ...StartPageData\n    }\n  }\n": types.StartPageDocument,
    "\n  fragment Faq on dataportal_Digg_Faq {\n    question\n    answer {\n      markdown\n    }\n  }\n": types.FaqFragmentDoc,
    "\n  fragment CtaCardBlock on dataportal_Digg_CTACardBlock {\n    heading\n    description\n    ctaLinks {\n      ...MenuLink\n    }\n  }\n": types.CtaCardBlockFragmentDoc,
    "\n  fragment Media on dataportal_Digg_Media {\n    heading\n    description\n    media {\n      ...MediaType\n    }\n  }\n": types.MediaFragmentDoc,
    "\n  fragment PromotedContent on dataportal_Digg_PromotedContent {\n    id\n    heading\n    preamble\n    externalLink\n    buttonText\n    image {\n      ...Image\n    }\n    container {\n      slug\n      title\n      preamble\n      image {\n        ...Image\n      }\n    }\n  }\n": types.PromotedContentFragmentDoc,
    "\n  fragment Quote on dataportal_Digg_Quote {\n    quote\n    author\n    image {\n      ...Image\n    }\n  }\n": types.QuoteFragmentDoc,
    "\n  fragment RelatedContent on dataportal_Digg_RelatedContent {\n    id\n    heading\n    showMoreLink\n    links {\n      ...Link\n    }\n  }\n": types.RelatedContentFragmentDoc,
    "\n  fragment Text on dataportal_Digg_Text {\n    heading\n    text: body {\n      markdown\n    }\n  }\n": types.TextFragmentDoc,
    "\n  fragment Video on dataportal_Digg_Video {\n    heading\n    description\n    video_id\n  }\n": types.VideoFragmentDoc,
    "\n  fragment Link on dataportal_Digg_Link {\n    slug\n    title\n    description\n    linktype\n    customPreamble\n    showPreamble\n    image {\n      ...MediaType\n    }\n  }\n": types.LinkFragmentDoc,
    "\n  fragment Image on dataportal_Digg_Image {\n    __typename\n    url\n    alt\n    name\n    description\n    mime\n    ext\n    screen9\n    width\n    height\n  }\n": types.ImageFragmentDoc,
    "\n  fragment SeoData on dataportal_Digg_SEO {\n    title\n    description\n    image {\n      ...Image\n    }\n    robotsFollow\n    robotsIndex\n    lang\n  }\n": types.SeoDataFragmentDoc,
    "\n  fragment ModuleListData on dataportal_Digg_ModuleList {\n    __typename\n    id\n    modules {\n      ...ModuleData\n    }\n  }\n": types.ModuleListDataFragmentDoc,
    "\n  fragment ParentSimplified on dataportal_Digg_Parent_Simplified {\n    slug\n    name\n    heading\n  }\n": types.ParentSimplifiedFragmentDoc,
    "\n  fragment Parent on dataportal_Digg_Parent {\n    heading\n    preamble\n    slug\n    name\n    pageNavigation {\n      ...ParentSimplified\n    }\n  }\n": types.ParentFragmentDoc,
    "\n  fragment ContainerData on dataportal_Digg_IContainer {\n    id\n    name\n    locale\n    heading\n    preamble\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    slug\n    landingPage\n    blocks {\n      ...BlockData\n      ... on dataportal_Digg_ModuleList {\n        ...ModuleListData\n      }\n    }\n    parent {\n      ...Parent\n    }\n    pageNavigation {\n      ...ParentSimplified\n    }\n    seo {\n      ...SeoData\n    }\n  }\n": types.ContainerDataFragmentDoc,
    "\n  fragment GoodExampleData on dataportal_Digg_IGood_Example {\n    id\n    name\n    locale\n    heading\n    preamble\n    publisher\n    link\n    reuse\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    slug\n    blocks {\n      ...BlockData\n      ... on dataportal_Digg_ModuleList {\n        ...ModuleListData\n      }\n    }\n    seo {\n      ...SeoData\n    }\n    keywords {\n      value\n      id\n    }\n    category\n    typeOfReuse\n    benefit\n    entity\n    apiAndDataset {\n      title\n      link\n    }\n    publishedAt\n  }\n": types.GoodExampleDataFragmentDoc,
    "\n  fragment NewsItemData on dataportal_Digg_INews_Item {\n    id\n    name\n    locale\n    heading\n    preamble\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    slug\n    blocks {\n      ...BlockData\n      ... on dataportal_Digg_ModuleList {\n        ...ModuleListData\n      }\n    }\n    seo {\n      ...SeoData\n    }\n    keywords {\n      value\n      id\n    }\n    publishedAt\n  }\n": types.NewsItemDataFragmentDoc,
    "\n  fragment StartPageData on dataportal_Digg_IStart_Page {\n    id\n    locale\n    heading\n    preamble\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    blocks {\n      ...BlockData\n    }\n    seo {\n      ...SeoData\n    }\n  }\n": types.StartPageDataFragmentDoc,
    "\n  fragment NavigationData on dataportal_Digg_INavigation {\n    id\n    locale\n    mainMenu {\n      name\n      link\n    }\n    footerMenu {\n      title\n      links {\n        name\n        link\n      }\n    }\n    serviceMenu {\n      icon\n      link\n      name\n    }\n    sidebarMenu {\n      ... on dataportal_Digg_MenuLinkIcon {\n        icon\n        link\n        name\n      }\n      ... on dataportal_Digg_SubLink {\n        title\n        icon\n        links {\n          name\n          link\n        }\n      }\n    }\n  }\n": types.NavigationDataFragmentDoc,
    "\n  fragment ToolData on dataportal_Digg_ITool {\n    heading\n    preamble\n    link\n    domainLabel\n    description\n    keywords {\n      value\n      id\n    }\n  }\n": types.ToolDataFragmentDoc,
    "\n  fragment FormElement on dataportal_Digg_IFormElement {\n    __typename\n    title\n\n    ... on dataportal_Digg_FormDescription {\n      text {\n        markdown\n      }\n    }\n\n    ... on dataportal_Digg_IFormInput {\n      info\n      required\n      ... on dataportal_Digg_FormRadio {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormCheckbox {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormDropdown {\n        items {\n          value\n          popup\n        }\n      }\n    }\n  }\n": types.FormElementFragmentDoc,
    "\n  fragment MediaType on dataportal_Digg_MediaType {\n    ... on dataportal_Digg_Image {\n      ...Image\n    }\n    ... on dataportal_Digg_File {\n      __typename\n      url\n      alt\n      name\n      description\n      mime\n      ext\n      screen9\n    }\n  }\n": types.MediaTypeFragmentDoc,
    "\n  fragment MenuLink on dataportal_Digg_MenuLink {\n    name\n    link\n  }\n": types.MenuLinkFragmentDoc,
    "\n  fragment MenuLinkIcon on dataportal_Digg_MenuLinkIcon {\n    name\n    link\n    icon\n  }\n": types.MenuLinkIconFragmentDoc,
    "\n  fragment Choice on dataportal_Digg_FormChoice {\n    popup\n    label\n    exploratory\n  }\n": types.ChoiceFragmentDoc,
    "\n  fragment FormBlock on dataportal_Digg_FormBlock {\n    elements {\n      ...FormElement\n    }\n  }\n": types.FormBlockFragmentDoc,
    "\n  fragment NewsBlockItem on dataportal_Digg_NewsItem_Preview {\n    heading\n    publishedAt\n    slug\n    keywords {\n      value\n      id\n    }\n    image {\n      ...Image\n    }\n  }\n": types.NewsBlockItemFragmentDoc,
    "\n  fragment NewsBlock on dataportal_Digg_NewsBlock {\n    id\n    heading\n    items {\n      ... on dataportal_Digg_NewsItem_Preview {\n        ...NewsBlockItem\n      }\n    }\n  }\n": types.NewsBlockFragmentDoc,
    "\n  fragment GoodExampleBlockItem on dataportal_Digg_GoodExample_Preview {\n    heading\n    publishedAt\n    slug\n    reuse\n    keywords {\n      value\n      id\n    }\n    image {\n      ...Image\n    }\n  }\n": types.GoodExampleBlockItemFragmentDoc,
    "\n  fragment GoodExampleBlock on dataportal_Digg_GoodExampleBlock {\n    id\n    heading\n    items {\n      ... on dataportal_Digg_GoodExample_Preview {\n        ...GoodExampleBlockItem\n      }\n    }\n  }\n": types.GoodExampleBlockFragmentDoc,
    "\n  fragment ModuleData on dataportal_Digg_Module {\n    __typename\n    identifier\n    blocks {\n      ...BlockData\n    }\n  }\n": types.ModuleDataFragmentDoc,
    "\n  fragment FoertroendemodellenBlock on dataportal_Digg_FoertroendemodellenBlock {\n    __typename\n    id\n  }\n": types.FoertroendemodellenBlockFragmentDoc,
    "\n  fragment FoertroendemodellenFormElements on dataportal_Digg_IFormElement {\n    __typename\n    title\n    ... on dataportal_Digg_FormDescription {\n      text {\n        markdown\n      }\n    }\n    ... on dataportal_Digg_IFormInput {\n      info\n      required\n      ... on dataportal_Digg_FormRadio {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormCheckbox {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormDropdown {\n        items {\n          value\n          popup\n        }\n      }\n    }\n  }\n": types.FoertroendemodellenFormElementsFragmentDoc,
    "\n  fragment BlockData on dataportal_Digg_IBlock {\n    __typename\n    id\n\n    ... on dataportal_Digg_Text {\n      ...Text\n    }\n\n    ... on dataportal_Digg_Faq {\n      ...Faq\n    }\n\n    ... on dataportal_Digg_Media {\n      ...Media\n    }\n\n    ... on dataportal_Digg_Video {\n      ...Video\n    }\n    ... on dataportal_Digg_RelatedContent {\n      ...RelatedContent\n    }\n\n    ... on dataportal_Digg_PromotedContent {\n      ...PromotedContent\n    }\n\n    ... on dataportal_Digg_FormBlock {\n      ...FormBlock\n    }\n\n    ... on dataportal_Digg_Quote {\n      ...Quote\n    }\n\n    ... on dataportal_Digg_GoodExampleBlock {\n      ...GoodExampleBlock\n    }\n\n    ... on dataportal_Digg_NewsBlock {\n      ...NewsBlock\n    }\n\n    ... on dataportal_Digg_CTACardBlock {\n      ...CtaCardBlock\n    }\n\n    ... on dataportal_Digg_FoertroendemodellenBlock {\n      ...FoertroendemodellenBlock\n    }\n  }\n": types.BlockDataFragmentDoc,
    "\n  fragment FoertroendemodellenForm on dataportal_Digg_FoertroendemodellenForm {\n    __typename\n    id\n    elements {\n      ...FoertroendemodellenFormElements\n    }\n    resultPageInfo\n    blocks {\n      ...BlockData\n    }\n  }\n": types.FoertroendemodellenFormFragmentDoc,
    "\n  query FoertroendemodellenFormClient($locale: String) {\n    dataportal_Digg_FoertroendemodellenForm(filter: { locale: $locale }) {\n      ...FoertroendemodellenForm\n    }\n  }\n": types.FoertroendemodellenFormClientDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GoodExample($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_Good_Examples(filter: $filter) {\n      ...GoodExampleData\n    }\n  }\n"): (typeof documents)["\n  query GoodExample($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_Good_Examples(filter: $filter) {\n      ...GoodExampleData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NewsItem($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_News_Items(filter: $filter) {\n      ...NewsItemData\n    }\n  }\n"): (typeof documents)["\n  query NewsItem($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_News_Items(filter: $filter) {\n      ...NewsItemData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Tool($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_Tools(filter: $filter) {\n      ...ToolData\n    }\n  }\n"): (typeof documents)["\n  query Tool($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_Tools(filter: $filter) {\n      ...ToolData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Containers($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_Containers(filter: $filter) {\n      ...ContainerData\n    }\n  }\n"): (typeof documents)["\n  query Containers($filter: dataportal_QueryContainerArgs) {\n    dataportal_Digg_Containers(filter: $filter) {\n      ...ContainerData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MultiContainers($container: dataportal_QueryContainerArgs) {\n    container: dataportal_Digg_Containers(filter: $container) {\n      ...ContainerData\n    }\n  }\n"): (typeof documents)["\n  query MultiContainers($container: dataportal_QueryContainerArgs) {\n    container: dataportal_Digg_Containers(filter: $container) {\n      ...ContainerData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RootAggregate($locale: String!, $state: dataportal_ContainerState!) {\n    container: dataportal_Digg_Containers(\n      filter: { limit: 1, slug: \"/\", locale: $locale, state: $state }\n    ) {\n      ...ContainerData\n    }\n    news: dataportal_Digg_News_Items(\n      filter: { limit: 3, locale: $locale, state: $state }\n    ) {\n      ...NewsItemData\n    }\n    examples: dataportal_Digg_Good_Examples(\n      filter: { limit: 3, locale: $locale, state: $state }\n    ) {\n      ...GoodExampleData\n    }\n  }\n"): (typeof documents)["\n  query RootAggregate($locale: String!, $state: dataportal_ContainerState!) {\n    container: dataportal_Digg_Containers(\n      filter: { limit: 1, slug: \"/\", locale: $locale, state: $state }\n    ) {\n      ...ContainerData\n    }\n    news: dataportal_Digg_News_Items(\n      filter: { limit: 3, locale: $locale, state: $state }\n    ) {\n      ...NewsItemData\n    }\n    examples: dataportal_Digg_Good_Examples(\n      filter: { limit: 3, locale: $locale, state: $state }\n    ) {\n      ...GoodExampleData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FormData on dataportal_Digg_Form {\n    id\n    identifier\n    elements {\n      ...FormElement\n    }\n  }\n"): (typeof documents)["\n  fragment FormData on dataportal_Digg_Form {\n    id\n    identifier\n    elements {\n      ...FormElement\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Form($identifier: String!, $locale: String) {\n    dataportal_Digg_Form(identifier: $identifier, locale: $locale) {\n      ...FormData\n    }\n  }\n"): (typeof documents)["\n  query Form($identifier: String!, $locale: String) {\n    dataportal_Digg_Form(identifier: $identifier, locale: $locale) {\n      ...FormData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Module($identifier: String!, $locale: String) {\n    dataportal_Digg_Module(identifier: $identifier, locale: $locale) {\n      ...ModuleData\n    }\n  }\n"): (typeof documents)["\n  query Module($identifier: String!, $locale: String) {\n    dataportal_Digg_Module(identifier: $identifier, locale: $locale) {\n      ...ModuleData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SearchContainer on dataportal_Digg_IContainer {\n    __typename\n    heading\n    name\n    slug\n  }\n"): (typeof documents)["\n  fragment SearchContainer on dataportal_Digg_IContainer {\n    __typename\n    heading\n    name\n    slug\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SearchNewsItem on dataportal_Digg_INews_Item {\n    __typename\n    heading\n    name\n    slug\n  }\n"): (typeof documents)["\n  fragment SearchNewsItem on dataportal_Digg_INews_Item {\n    __typename\n    heading\n    name\n    slug\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SearchGoodExample on dataportal_Digg_IGood_Example {\n    __typename\n    heading\n    name\n    slug\n  }\n"): (typeof documents)["\n  fragment SearchGoodExample on dataportal_Digg_IGood_Example {\n    __typename\n    heading\n    name\n    slug\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SearchHit on dataportal_Digg_SearchHit {\n    highlights {\n      name\n      value\n    }\n    hit {\n      ...SearchContainer\n      ...SearchNewsItem\n      ...SearchGoodExample\n    }\n  }\n"): (typeof documents)["\n  fragment SearchHit on dataportal_Digg_SearchHit {\n    highlights {\n      name\n      value\n    }\n    hit {\n      ...SearchContainer\n      ...SearchNewsItem\n      ...SearchGoodExample\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Search($filter: dataportal_QuerySearchArgs) {\n    dataportal_Digg_Search(filter: $filter) {\n      totalNrOfHits\n      hits {\n        ...SearchHit\n      }\n    }\n  }\n"): (typeof documents)["\n  query Search($filter: dataportal_QuerySearchArgs) {\n    dataportal_Digg_Search(filter: $filter) {\n      totalNrOfHits\n      hits {\n        ...SearchHit\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Navigation($filter: dataportal_QueryLocaleArgs) {\n    dataportal_Digg_Navigation(filter: $filter) {\n      ...NavigationData\n    }\n  }\n"): (typeof documents)["\n  query Navigation($filter: dataportal_QueryLocaleArgs) {\n    dataportal_Digg_Navigation(filter: $filter) {\n      ...NavigationData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query StartPage($filter: dataportal_QueryLocaleArgs) {\n    dataportal_Digg_Start_Page(filter: $filter) {\n      ...StartPageData\n    }\n  }\n"): (typeof documents)["\n  query StartPage($filter: dataportal_QueryLocaleArgs) {\n    dataportal_Digg_Start_Page(filter: $filter) {\n      ...StartPageData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Faq on dataportal_Digg_Faq {\n    question\n    answer {\n      markdown\n    }\n  }\n"): (typeof documents)["\n  fragment Faq on dataportal_Digg_Faq {\n    question\n    answer {\n      markdown\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CtaCardBlock on dataportal_Digg_CTACardBlock {\n    heading\n    description\n    ctaLinks {\n      ...MenuLink\n    }\n  }\n"): (typeof documents)["\n  fragment CtaCardBlock on dataportal_Digg_CTACardBlock {\n    heading\n    description\n    ctaLinks {\n      ...MenuLink\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Media on dataportal_Digg_Media {\n    heading\n    description\n    media {\n      ...MediaType\n    }\n  }\n"): (typeof documents)["\n  fragment Media on dataportal_Digg_Media {\n    heading\n    description\n    media {\n      ...MediaType\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PromotedContent on dataportal_Digg_PromotedContent {\n    id\n    heading\n    preamble\n    externalLink\n    buttonText\n    image {\n      ...Image\n    }\n    container {\n      slug\n      title\n      preamble\n      image {\n        ...Image\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment PromotedContent on dataportal_Digg_PromotedContent {\n    id\n    heading\n    preamble\n    externalLink\n    buttonText\n    image {\n      ...Image\n    }\n    container {\n      slug\n      title\n      preamble\n      image {\n        ...Image\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Quote on dataportal_Digg_Quote {\n    quote\n    author\n    image {\n      ...Image\n    }\n  }\n"): (typeof documents)["\n  fragment Quote on dataportal_Digg_Quote {\n    quote\n    author\n    image {\n      ...Image\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RelatedContent on dataportal_Digg_RelatedContent {\n    id\n    heading\n    showMoreLink\n    links {\n      ...Link\n    }\n  }\n"): (typeof documents)["\n  fragment RelatedContent on dataportal_Digg_RelatedContent {\n    id\n    heading\n    showMoreLink\n    links {\n      ...Link\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Text on dataportal_Digg_Text {\n    heading\n    text: body {\n      markdown\n    }\n  }\n"): (typeof documents)["\n  fragment Text on dataportal_Digg_Text {\n    heading\n    text: body {\n      markdown\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Video on dataportal_Digg_Video {\n    heading\n    description\n    video_id\n  }\n"): (typeof documents)["\n  fragment Video on dataportal_Digg_Video {\n    heading\n    description\n    video_id\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Link on dataportal_Digg_Link {\n    slug\n    title\n    description\n    linktype\n    customPreamble\n    showPreamble\n    image {\n      ...MediaType\n    }\n  }\n"): (typeof documents)["\n  fragment Link on dataportal_Digg_Link {\n    slug\n    title\n    description\n    linktype\n    customPreamble\n    showPreamble\n    image {\n      ...MediaType\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Image on dataportal_Digg_Image {\n    __typename\n    url\n    alt\n    name\n    description\n    mime\n    ext\n    screen9\n    width\n    height\n  }\n"): (typeof documents)["\n  fragment Image on dataportal_Digg_Image {\n    __typename\n    url\n    alt\n    name\n    description\n    mime\n    ext\n    screen9\n    width\n    height\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SeoData on dataportal_Digg_SEO {\n    title\n    description\n    image {\n      ...Image\n    }\n    robotsFollow\n    robotsIndex\n    lang\n  }\n"): (typeof documents)["\n  fragment SeoData on dataportal_Digg_SEO {\n    title\n    description\n    image {\n      ...Image\n    }\n    robotsFollow\n    robotsIndex\n    lang\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ModuleListData on dataportal_Digg_ModuleList {\n    __typename\n    id\n    modules {\n      ...ModuleData\n    }\n  }\n"): (typeof documents)["\n  fragment ModuleListData on dataportal_Digg_ModuleList {\n    __typename\n    id\n    modules {\n      ...ModuleData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ParentSimplified on dataportal_Digg_Parent_Simplified {\n    slug\n    name\n    heading\n  }\n"): (typeof documents)["\n  fragment ParentSimplified on dataportal_Digg_Parent_Simplified {\n    slug\n    name\n    heading\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Parent on dataportal_Digg_Parent {\n    heading\n    preamble\n    slug\n    name\n    pageNavigation {\n      ...ParentSimplified\n    }\n  }\n"): (typeof documents)["\n  fragment Parent on dataportal_Digg_Parent {\n    heading\n    preamble\n    slug\n    name\n    pageNavigation {\n      ...ParentSimplified\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ContainerData on dataportal_Digg_IContainer {\n    id\n    name\n    locale\n    heading\n    preamble\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    slug\n    landingPage\n    blocks {\n      ...BlockData\n      ... on dataportal_Digg_ModuleList {\n        ...ModuleListData\n      }\n    }\n    parent {\n      ...Parent\n    }\n    pageNavigation {\n      ...ParentSimplified\n    }\n    seo {\n      ...SeoData\n    }\n  }\n"): (typeof documents)["\n  fragment ContainerData on dataportal_Digg_IContainer {\n    id\n    name\n    locale\n    heading\n    preamble\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    slug\n    landingPage\n    blocks {\n      ...BlockData\n      ... on dataportal_Digg_ModuleList {\n        ...ModuleListData\n      }\n    }\n    parent {\n      ...Parent\n    }\n    pageNavigation {\n      ...ParentSimplified\n    }\n    seo {\n      ...SeoData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GoodExampleData on dataportal_Digg_IGood_Example {\n    id\n    name\n    locale\n    heading\n    preamble\n    publisher\n    link\n    reuse\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    slug\n    blocks {\n      ...BlockData\n      ... on dataportal_Digg_ModuleList {\n        ...ModuleListData\n      }\n    }\n    seo {\n      ...SeoData\n    }\n    keywords {\n      value\n      id\n    }\n    category\n    typeOfReuse\n    benefit\n    entity\n    apiAndDataset {\n      title\n      link\n    }\n    publishedAt\n  }\n"): (typeof documents)["\n  fragment GoodExampleData on dataportal_Digg_IGood_Example {\n    id\n    name\n    locale\n    heading\n    preamble\n    publisher\n    link\n    reuse\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    slug\n    blocks {\n      ...BlockData\n      ... on dataportal_Digg_ModuleList {\n        ...ModuleListData\n      }\n    }\n    seo {\n      ...SeoData\n    }\n    keywords {\n      value\n      id\n    }\n    category\n    typeOfReuse\n    benefit\n    entity\n    apiAndDataset {\n      title\n      link\n    }\n    publishedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NewsItemData on dataportal_Digg_INews_Item {\n    id\n    name\n    locale\n    heading\n    preamble\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    slug\n    blocks {\n      ...BlockData\n      ... on dataportal_Digg_ModuleList {\n        ...ModuleListData\n      }\n    }\n    seo {\n      ...SeoData\n    }\n    keywords {\n      value\n      id\n    }\n    publishedAt\n  }\n"): (typeof documents)["\n  fragment NewsItemData on dataportal_Digg_INews_Item {\n    id\n    name\n    locale\n    heading\n    preamble\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    slug\n    blocks {\n      ...BlockData\n      ... on dataportal_Digg_ModuleList {\n        ...ModuleListData\n      }\n    }\n    seo {\n      ...SeoData\n    }\n    keywords {\n      value\n      id\n    }\n    publishedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment StartPageData on dataportal_Digg_IStart_Page {\n    id\n    locale\n    heading\n    preamble\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    blocks {\n      ...BlockData\n    }\n    seo {\n      ...SeoData\n    }\n  }\n"): (typeof documents)["\n  fragment StartPageData on dataportal_Digg_IStart_Page {\n    id\n    locale\n    heading\n    preamble\n    image {\n      ...MediaType\n    }\n    updatedAt\n    createdAt\n    blocks {\n      ...BlockData\n    }\n    seo {\n      ...SeoData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NavigationData on dataportal_Digg_INavigation {\n    id\n    locale\n    mainMenu {\n      name\n      link\n    }\n    footerMenu {\n      title\n      links {\n        name\n        link\n      }\n    }\n    serviceMenu {\n      icon\n      link\n      name\n    }\n    sidebarMenu {\n      ... on dataportal_Digg_MenuLinkIcon {\n        icon\n        link\n        name\n      }\n      ... on dataportal_Digg_SubLink {\n        title\n        icon\n        links {\n          name\n          link\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment NavigationData on dataportal_Digg_INavigation {\n    id\n    locale\n    mainMenu {\n      name\n      link\n    }\n    footerMenu {\n      title\n      links {\n        name\n        link\n      }\n    }\n    serviceMenu {\n      icon\n      link\n      name\n    }\n    sidebarMenu {\n      ... on dataportal_Digg_MenuLinkIcon {\n        icon\n        link\n        name\n      }\n      ... on dataportal_Digg_SubLink {\n        title\n        icon\n        links {\n          name\n          link\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ToolData on dataportal_Digg_ITool {\n    heading\n    preamble\n    link\n    domainLabel\n    description\n    keywords {\n      value\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment ToolData on dataportal_Digg_ITool {\n    heading\n    preamble\n    link\n    domainLabel\n    description\n    keywords {\n      value\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FormElement on dataportal_Digg_IFormElement {\n    __typename\n    title\n\n    ... on dataportal_Digg_FormDescription {\n      text {\n        markdown\n      }\n    }\n\n    ... on dataportal_Digg_IFormInput {\n      info\n      required\n      ... on dataportal_Digg_FormRadio {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormCheckbox {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormDropdown {\n        items {\n          value\n          popup\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment FormElement on dataportal_Digg_IFormElement {\n    __typename\n    title\n\n    ... on dataportal_Digg_FormDescription {\n      text {\n        markdown\n      }\n    }\n\n    ... on dataportal_Digg_IFormInput {\n      info\n      required\n      ... on dataportal_Digg_FormRadio {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormCheckbox {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormDropdown {\n        items {\n          value\n          popup\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MediaType on dataportal_Digg_MediaType {\n    ... on dataportal_Digg_Image {\n      ...Image\n    }\n    ... on dataportal_Digg_File {\n      __typename\n      url\n      alt\n      name\n      description\n      mime\n      ext\n      screen9\n    }\n  }\n"): (typeof documents)["\n  fragment MediaType on dataportal_Digg_MediaType {\n    ... on dataportal_Digg_Image {\n      ...Image\n    }\n    ... on dataportal_Digg_File {\n      __typename\n      url\n      alt\n      name\n      description\n      mime\n      ext\n      screen9\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MenuLink on dataportal_Digg_MenuLink {\n    name\n    link\n  }\n"): (typeof documents)["\n  fragment MenuLink on dataportal_Digg_MenuLink {\n    name\n    link\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MenuLinkIcon on dataportal_Digg_MenuLinkIcon {\n    name\n    link\n    icon\n  }\n"): (typeof documents)["\n  fragment MenuLinkIcon on dataportal_Digg_MenuLinkIcon {\n    name\n    link\n    icon\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Choice on dataportal_Digg_FormChoice {\n    popup\n    label\n    exploratory\n  }\n"): (typeof documents)["\n  fragment Choice on dataportal_Digg_FormChoice {\n    popup\n    label\n    exploratory\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FormBlock on dataportal_Digg_FormBlock {\n    elements {\n      ...FormElement\n    }\n  }\n"): (typeof documents)["\n  fragment FormBlock on dataportal_Digg_FormBlock {\n    elements {\n      ...FormElement\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NewsBlockItem on dataportal_Digg_NewsItem_Preview {\n    heading\n    publishedAt\n    slug\n    keywords {\n      value\n      id\n    }\n    image {\n      ...Image\n    }\n  }\n"): (typeof documents)["\n  fragment NewsBlockItem on dataportal_Digg_NewsItem_Preview {\n    heading\n    publishedAt\n    slug\n    keywords {\n      value\n      id\n    }\n    image {\n      ...Image\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NewsBlock on dataportal_Digg_NewsBlock {\n    id\n    heading\n    items {\n      ... on dataportal_Digg_NewsItem_Preview {\n        ...NewsBlockItem\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment NewsBlock on dataportal_Digg_NewsBlock {\n    id\n    heading\n    items {\n      ... on dataportal_Digg_NewsItem_Preview {\n        ...NewsBlockItem\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GoodExampleBlockItem on dataportal_Digg_GoodExample_Preview {\n    heading\n    publishedAt\n    slug\n    reuse\n    keywords {\n      value\n      id\n    }\n    image {\n      ...Image\n    }\n  }\n"): (typeof documents)["\n  fragment GoodExampleBlockItem on dataportal_Digg_GoodExample_Preview {\n    heading\n    publishedAt\n    slug\n    reuse\n    keywords {\n      value\n      id\n    }\n    image {\n      ...Image\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GoodExampleBlock on dataportal_Digg_GoodExampleBlock {\n    id\n    heading\n    items {\n      ... on dataportal_Digg_GoodExample_Preview {\n        ...GoodExampleBlockItem\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment GoodExampleBlock on dataportal_Digg_GoodExampleBlock {\n    id\n    heading\n    items {\n      ... on dataportal_Digg_GoodExample_Preview {\n        ...GoodExampleBlockItem\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ModuleData on dataportal_Digg_Module {\n    __typename\n    identifier\n    blocks {\n      ...BlockData\n    }\n  }\n"): (typeof documents)["\n  fragment ModuleData on dataportal_Digg_Module {\n    __typename\n    identifier\n    blocks {\n      ...BlockData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FoertroendemodellenBlock on dataportal_Digg_FoertroendemodellenBlock {\n    __typename\n    id\n  }\n"): (typeof documents)["\n  fragment FoertroendemodellenBlock on dataportal_Digg_FoertroendemodellenBlock {\n    __typename\n    id\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FoertroendemodellenFormElements on dataportal_Digg_IFormElement {\n    __typename\n    title\n    ... on dataportal_Digg_FormDescription {\n      text {\n        markdown\n      }\n    }\n    ... on dataportal_Digg_IFormInput {\n      info\n      required\n      ... on dataportal_Digg_FormRadio {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormCheckbox {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormDropdown {\n        items {\n          value\n          popup\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment FoertroendemodellenFormElements on dataportal_Digg_IFormElement {\n    __typename\n    title\n    ... on dataportal_Digg_FormDescription {\n      text {\n        markdown\n      }\n    }\n    ... on dataportal_Digg_IFormInput {\n      info\n      required\n      ... on dataportal_Digg_FormRadio {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormCheckbox {\n        choices {\n          ...Choice\n        }\n      }\n      ... on dataportal_Digg_FormDropdown {\n        items {\n          value\n          popup\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BlockData on dataportal_Digg_IBlock {\n    __typename\n    id\n\n    ... on dataportal_Digg_Text {\n      ...Text\n    }\n\n    ... on dataportal_Digg_Faq {\n      ...Faq\n    }\n\n    ... on dataportal_Digg_Media {\n      ...Media\n    }\n\n    ... on dataportal_Digg_Video {\n      ...Video\n    }\n    ... on dataportal_Digg_RelatedContent {\n      ...RelatedContent\n    }\n\n    ... on dataportal_Digg_PromotedContent {\n      ...PromotedContent\n    }\n\n    ... on dataportal_Digg_FormBlock {\n      ...FormBlock\n    }\n\n    ... on dataportal_Digg_Quote {\n      ...Quote\n    }\n\n    ... on dataportal_Digg_GoodExampleBlock {\n      ...GoodExampleBlock\n    }\n\n    ... on dataportal_Digg_NewsBlock {\n      ...NewsBlock\n    }\n\n    ... on dataportal_Digg_CTACardBlock {\n      ...CtaCardBlock\n    }\n\n    ... on dataportal_Digg_FoertroendemodellenBlock {\n      ...FoertroendemodellenBlock\n    }\n  }\n"): (typeof documents)["\n  fragment BlockData on dataportal_Digg_IBlock {\n    __typename\n    id\n\n    ... on dataportal_Digg_Text {\n      ...Text\n    }\n\n    ... on dataportal_Digg_Faq {\n      ...Faq\n    }\n\n    ... on dataportal_Digg_Media {\n      ...Media\n    }\n\n    ... on dataportal_Digg_Video {\n      ...Video\n    }\n    ... on dataportal_Digg_RelatedContent {\n      ...RelatedContent\n    }\n\n    ... on dataportal_Digg_PromotedContent {\n      ...PromotedContent\n    }\n\n    ... on dataportal_Digg_FormBlock {\n      ...FormBlock\n    }\n\n    ... on dataportal_Digg_Quote {\n      ...Quote\n    }\n\n    ... on dataportal_Digg_GoodExampleBlock {\n      ...GoodExampleBlock\n    }\n\n    ... on dataportal_Digg_NewsBlock {\n      ...NewsBlock\n    }\n\n    ... on dataportal_Digg_CTACardBlock {\n      ...CtaCardBlock\n    }\n\n    ... on dataportal_Digg_FoertroendemodellenBlock {\n      ...FoertroendemodellenBlock\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FoertroendemodellenForm on dataportal_Digg_FoertroendemodellenForm {\n    __typename\n    id\n    elements {\n      ...FoertroendemodellenFormElements\n    }\n    resultPageInfo\n    blocks {\n      ...BlockData\n    }\n  }\n"): (typeof documents)["\n  fragment FoertroendemodellenForm on dataportal_Digg_FoertroendemodellenForm {\n    __typename\n    id\n    elements {\n      ...FoertroendemodellenFormElements\n    }\n    resultPageInfo\n    blocks {\n      ...BlockData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FoertroendemodellenFormClient($locale: String) {\n    dataportal_Digg_FoertroendemodellenForm(filter: { locale: $locale }) {\n      ...FoertroendemodellenForm\n    }\n  }\n"): (typeof documents)["\n  query FoertroendemodellenFormClient($locale: String) {\n    dataportal_Digg_FoertroendemodellenForm(filter: { locale: $locale }) {\n      ...FoertroendemodellenForm\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;