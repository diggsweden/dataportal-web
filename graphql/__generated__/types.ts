/** THIS FILE IS AUTO-GENERATED **/
/** DO NOT EDIT **/
/* eslint-disable */
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

/** The publicationstate of a container, either preview or live */
export enum Dataportal_ContainerState {
  Live = 'live',
  Preview = 'preview'
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
}

export interface Dataportal_QueryContainerArgs {
  category?: InputMaybe<Dataportal_QueryCategoryArgs>;
  id?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  /** secret to be able to access containers that are in preview state */
  previewSecret?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Dataportal_ContainerState>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
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
