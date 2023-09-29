export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  dataportal_DateTime: { input: any; output: any; }
  dataportal_JSON: { input: any; output: any; }
}

export interface Query {
  __typename: 'Query';
  _service: Dataportal__Service;
  dataportal_Digg_Categories: Array<Dataportal_Digg_Category>;
  dataportal_Digg_Containers: Array<Maybe<Dataportal_Digg_Container>>;
  dataportal_Digg_Domains: Array<Dataportal_Digg_Domain>;
  dataportal_Digg_Form: Dataportal_Digg_Form;
  dataportal_Digg_Module: Dataportal_Digg_Module;
  dataportal_Digg_Publications: Array<Maybe<Dataportal_Digg_Publication>>;
  dataportal_Digg_Search: Dataportal_Digg_SearchResult;
}


export interface QueryDataportal_Digg_CategoriesArgs {
  filter?: InputMaybe<Dataportal_QueryCategoryArgs>;
}


export interface QueryDataportal_Digg_ContainersArgs {
  filter?: InputMaybe<Dataportal_QueryContainerArgs>;
}


export interface QueryDataportal_Digg_DomainsArgs {
  filter?: InputMaybe<Dataportal_QueryDomainArgs>;
}


export interface QueryDataportal_Digg_FormArgs {
  identifier: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryDataportal_Digg_ModuleArgs {
  identifier: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryDataportal_Digg_PublicationsArgs {
  filter?: InputMaybe<Dataportal_QueryContainerArgs>;
}


export interface QueryDataportal_Digg_SearchArgs {
  filter?: InputMaybe<Dataportal_QuerySearchArgs>;
}

/** The publicationstate of a container, either preview or live */
export enum Dataportal_ContainerState {
  Live = 'live',
  Preview = 'preview'
}

export interface Dataportal_Digg_Category extends Dataportal_Digg_ICategory, Dataportal_Digg_IEntity {
  __typename: 'dataportal_Digg_Category';
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** A unique identifier for this category */
  slug: Scalars['String']['output'];
  /** Category belongs to this taxonomy */
  taxonomy?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_Container extends Dataportal_Digg_IContainer, Dataportal_Digg_IEntity {
  __typename: 'dataportal_Digg_Container';
  blocks: Array<Dataportal_Digg_IBlock>;
  categories: Array<Dataportal_Digg_ICategory>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  domains: Array<Dataportal_Digg_IDomain>;
  heading?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Dataportal_Digg_Image>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  preamble?: Maybe<Scalars['String']['output']>;
  seo?: Maybe<Dataportal_Digg_Seo>;
  slug: Scalars['String']['output'];
  tags: Array<Dataportal_Digg_Tag>;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_Domain extends Dataportal_Digg_IDomain, Dataportal_Digg_IEntity {
  __typename: 'dataportal_Digg_Domain';
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  taxonomies: Array<Dataportal_Digg_ITaxonomy>;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_Faq extends Dataportal_Digg_IBlock, Dataportal_Digg_IEntity {
  __typename: 'dataportal_Digg_Faq';
  answer: Dataportal_Digg_RichText;
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  question: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_File extends Dataportal_Digg_IMediaBase {
  __typename: 'dataportal_Digg_File';
  alt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  mime: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Data from screen9 media */
  screen9?: Maybe<Scalars['dataportal_JSON']['output']>;
  url: Scalars['String']['output'];
}

export interface Dataportal_Digg_Form extends Dataportal_Digg_IEntity, Dataportal_Digg_IForm {
  __typename: 'dataportal_Digg_Form';
  createdAt: Scalars['dataportal_DateTime']['output'];
  /** The building blocks of the form */
  elements: Array<Dataportal_Digg_IFormElement>;
  id: Scalars['ID']['output'];
  /** A unique identifier */
  identifier: Scalars['String']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_FormBlock extends Dataportal_Digg_IBlock, Dataportal_Digg_IEntity {
  __typename: 'dataportal_Digg_FormBlock';
  createdAt: Scalars['dataportal_DateTime']['output'];
  elements: Array<Dataportal_Digg_IFormElement>;
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_FormCheckbox extends Dataportal_Digg_IEntity, Dataportal_Digg_IFormElement, Dataportal_Digg_IFormInput {
  __typename: 'dataportal_Digg_FormCheckbox';
  choices: Array<Dataportal_Digg_FormChoice>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Info about the specific input field */
  info?: Maybe<Scalars['String']['output']>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  /** If the specific input field should be required or not */
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_FormChoice {
  __typename: 'dataportal_Digg_FormChoice';
  label: Scalars['String']['output'];
  /** Text corresponding to if the choice is active */
  popup?: Maybe<Scalars['String']['output']>;
}

export interface Dataportal_Digg_FormDescription extends Dataportal_Digg_IEntity, Dataportal_Digg_IFormElement {
  __typename: 'dataportal_Digg_FormDescription';
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  text: Dataportal_Digg_RichText;
  title: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_FormDropdown extends Dataportal_Digg_IEntity, Dataportal_Digg_IFormElement, Dataportal_Digg_IFormInput {
  __typename: 'dataportal_Digg_FormDropdown';
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Info about the specific input field */
  info?: Maybe<Scalars['String']['output']>;
  items: Array<Scalars['String']['output']>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  /** If the specific input field should be required or not */
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_FormPageBreak extends Dataportal_Digg_IEntity, Dataportal_Digg_IFormElement {
  __typename: 'dataportal_Digg_FormPageBreak';
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_FormRadio extends Dataportal_Digg_IEntity, Dataportal_Digg_IFormElement, Dataportal_Digg_IFormInput {
  __typename: 'dataportal_Digg_FormRadio';
  choices: Array<Dataportal_Digg_FormChoice>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Info about the specific input field */
  info?: Maybe<Scalars['String']['output']>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  /** If the specific input field should be required or not */
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_FormText extends Dataportal_Digg_IEntity, Dataportal_Digg_IFormElement, Dataportal_Digg_IFormInput {
  __typename: 'dataportal_Digg_FormText';
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Info about the specific input field */
  info?: Maybe<Scalars['String']['output']>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  /** If the specific input field should be required or not */
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_FormTextArea extends Dataportal_Digg_IEntity, Dataportal_Digg_IFormElement, Dataportal_Digg_IFormInput {
  __typename: 'dataportal_Digg_FormTextArea';
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Info about the specific input field */
  info?: Maybe<Scalars['String']['output']>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  /** If the specific input field should be required or not */
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_IBlock {
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_ICategory {
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** A unique identifier for this category */
  slug: Scalars['String']['output'];
  /** Category belongs to this taxonomy */
  taxonomy?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_IContainer {
  blocks: Array<Dataportal_Digg_IBlock>;
  categories: Array<Dataportal_Digg_ICategory>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  domains: Array<Dataportal_Digg_IDomain>;
  heading?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Dataportal_Digg_Image>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  preamble?: Maybe<Scalars['String']['output']>;
  seo?: Maybe<Dataportal_Digg_Seo>;
  slug: Scalars['String']['output'];
  tags: Array<Dataportal_Digg_Tag>;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_IDomain {
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  taxonomies: Array<Dataportal_Digg_ITaxonomy>;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_IEntity {
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_IForm {
  createdAt: Scalars['dataportal_DateTime']['output'];
  /** The building blocks of the form */
  elements: Array<Dataportal_Digg_IFormElement>;
  id: Scalars['ID']['output'];
  /** A unique identifier */
  identifier: Scalars['String']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_IFormElement {
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_IFormInput {
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Info about the specific input field */
  info?: Maybe<Scalars['String']['output']>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  /** If the specific input field should be required or not */
  required: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_IMediaBase {
  alt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  mime: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Data from screen9 media */
  screen9?: Maybe<Scalars['dataportal_JSON']['output']>;
  url: Scalars['String']['output'];
}

export interface Dataportal_Digg_IModule {
  blocks: Array<Dataportal_Digg_IBlock>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_IPublication {
  blocks: Array<Dataportal_Digg_IBlock>;
  categories: Array<Dataportal_Digg_ICategory>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  domains: Array<Dataportal_Digg_IDomain>;
  endDate?: Maybe<Scalars['dataportal_DateTime']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Dataportal_Digg_Image>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  preamble?: Maybe<Scalars['String']['output']>;
  publishedAt: Scalars['dataportal_DateTime']['output'];
  seo?: Maybe<Dataportal_Digg_Seo>;
  slug: Scalars['String']['output'];
  startDate?: Maybe<Scalars['dataportal_DateTime']['output']>;
  tags: Array<Dataportal_Digg_Tag>;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_ITaxonomy {
  categories: Array<Dataportal_Digg_ICategory>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_Image extends Dataportal_Digg_IMediaBase {
  __typename: 'dataportal_Digg_Image';
  alt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  mime: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Data from screen9 media */
  screen9?: Maybe<Scalars['dataportal_JSON']['output']>;
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
}

export interface Dataportal_Digg_Link {
  __typename: 'dataportal_Digg_Link';
  description?: Maybe<Scalars['String']['output']>;
  linktype: Dataportal_LinkType;
  slug: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
}

export interface Dataportal_Digg_Media extends Dataportal_Digg_IBlock, Dataportal_Digg_IEntity {
  __typename: 'dataportal_Digg_Media';
  createdAt: Scalars['dataportal_DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  media: Dataportal_Digg_MediaType;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

/** A mediatype of image, video or file */
export type Dataportal_Digg_MediaType = Dataportal_Digg_File | Dataportal_Digg_Image | Dataportal_Digg_Video;

export interface Dataportal_Digg_Module extends Dataportal_Digg_IEntity, Dataportal_Digg_IModule {
  __typename: 'dataportal_Digg_Module';
  blocks: Array<Dataportal_Digg_IBlock>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_ModuleList extends Dataportal_Digg_IBlock, Dataportal_Digg_IEntity {
  __typename: 'dataportal_Digg_ModuleList';
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  modules: Array<Dataportal_Digg_IModule>;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_Publication extends Dataportal_Digg_IContainer, Dataportal_Digg_IEntity, Dataportal_Digg_IPublication {
  __typename: 'dataportal_Digg_Publication';
  blocks: Array<Dataportal_Digg_IBlock>;
  categories: Array<Dataportal_Digg_ICategory>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  domains: Array<Dataportal_Digg_IDomain>;
  endDate?: Maybe<Scalars['dataportal_DateTime']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Dataportal_Digg_Image>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  preamble?: Maybe<Scalars['String']['output']>;
  publishedAt: Scalars['dataportal_DateTime']['output'];
  seo?: Maybe<Dataportal_Digg_Seo>;
  slug: Scalars['String']['output'];
  startDate?: Maybe<Scalars['dataportal_DateTime']['output']>;
  tags: Array<Dataportal_Digg_Tag>;
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_RelatedContent extends Dataportal_Digg_IBlock, Dataportal_Digg_IEntity {
  __typename: 'dataportal_Digg_RelatedContent';
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  links: Array<Dataportal_Digg_Link>;
  /** two-letter lang */
  locale: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_RichText {
  __typename: 'dataportal_Digg_RichText';
  html?: Maybe<Scalars['String']['output']>;
  markdown?: Maybe<Scalars['String']['output']>;
  /** AST JSON */
  raw?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
}

export interface Dataportal_Digg_Seo {
  __typename: 'dataportal_Digg_SEO';
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Dataportal_Digg_Image>;
  lang?: Maybe<Scalars['String']['output']>;
  /** Allow robots to crawl this content */
  robotsFollow?: Maybe<Scalars['Boolean']['output']>;
  /** Allow robots to index this content */
  robotsIndex?: Maybe<Scalars['Boolean']['output']>;
  title?: Maybe<Scalars['String']['output']>;
}

export interface Dataportal_Digg_SearchHighlight {
  __typename: 'dataportal_Digg_SearchHighlight';
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
}

export interface Dataportal_Digg_SearchHit {
  __typename: 'dataportal_Digg_SearchHit';
  highlights?: Maybe<Array<Maybe<Dataportal_Digg_SearchHighlight>>>;
  hit?: Maybe<Dataportal_Digg_SearchableTypes>;
}

export interface Dataportal_Digg_SearchResult {
  __typename: 'dataportal_Digg_SearchResult';
  hits?: Maybe<Array<Maybe<Dataportal_Digg_SearchHit>>>;
  totalNrOfHits?: Maybe<Scalars['Int']['output']>;
}

/** A type enumerating all types from a search result */
export type Dataportal_Digg_SearchableTypes = Dataportal_Digg_Container | Dataportal_Digg_Publication;

export interface Dataportal_Digg_Tag {
  __typename: 'dataportal_Digg_Tag';
  value: Scalars['String']['output'];
}

export interface Dataportal_Digg_Taxonomy extends Dataportal_Digg_IEntity, Dataportal_Digg_ITaxonomy {
  __typename: 'dataportal_Digg_Taxonomy';
  categories: Array<Dataportal_Digg_ICategory>;
  createdAt: Scalars['dataportal_DateTime']['output'];
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_Text extends Dataportal_Digg_IBlock, Dataportal_Digg_IEntity {
  __typename: 'dataportal_Digg_Text';
  body: Dataportal_Digg_RichText;
  createdAt: Scalars['dataportal_DateTime']['output'];
  heading?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** two-letter lang */
  locale: Scalars['String']['output'];
  updatedAt: Scalars['dataportal_DateTime']['output'];
}

export interface Dataportal_Digg_Video extends Dataportal_Digg_IMediaBase {
  __typename: 'dataportal_Digg_Video';
  alt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  mime: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** Data from screen9 media */
  screen9?: Maybe<Scalars['dataportal_JSON']['output']>;
  url: Scalars['String']['output'];
}

export interface Dataportal_Error {
  __typename: 'dataportal_Error';
  code: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
}

export enum Dataportal_LinkType {
  Document = 'DOCUMENT',
  External = 'EXTERNAL',
  Internal = 'INTERNAL'
}

export interface Dataportal_QueryCategoryArgs {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  taxonomy?: InputMaybe<Scalars['String']['input']>;
}

export interface Dataportal_QueryContainerArgs {
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  domains?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  /** secret to be able to access containers that are in preview state */
  previewSecret?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Dataportal_ContainerState>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
}

export interface Dataportal_QueryDomainArgs {
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
}

export interface Dataportal_QuerySearchArgs {
  getHighlights?: InputMaybe<Scalars['Boolean']['input']>;
  highlightPostText?: InputMaybe<Scalars['String']['input']>;
  highlightPreText?: InputMaybe<Scalars['String']['input']>;
  highlightsLength?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
}

export interface Dataportal__Service {
  __typename: 'dataportal__Service';
  /** The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied */
  sdl?: Maybe<Scalars['String']['output']>;
}
