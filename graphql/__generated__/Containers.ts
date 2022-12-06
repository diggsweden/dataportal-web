/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_QueryContainerArgs, dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Containers
// ====================================================

export interface Containers_dataportal_Digg_Containers_image {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface Containers_dataportal_Digg_Containers_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface Containers_dataportal_Digg_Containers_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface Containers_dataportal_Digg_Containers_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Text_text;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Faq_answer;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_heroText | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero_media;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules[];
}

export type Containers_dataportal_Digg_Containers_blocks = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Text | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Faq | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Hero | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_RelatedContent | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList;

export interface Containers_dataportal_Digg_Containers_seo_image {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface Containers_dataportal_Digg_Containers_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: Containers_dataportal_Digg_Containers_seo_image | null;
  /**
   * Allow robots to crawl this content
   */
  robotsFollow: boolean | null;
  /**
   * Allow robots to index this content
   */
  robotsIndex: boolean | null;
  lang: string | null;
}

export interface Containers_dataportal_Digg_Containers {
  __typename: "dataportal_Digg_Container";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: Containers_dataportal_Digg_Containers_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: Containers_dataportal_Digg_Containers_domains[];
  categories: Containers_dataportal_Digg_Containers_categories[];
  tags: Containers_dataportal_Digg_Containers_tags[];
  blocks: Containers_dataportal_Digg_Containers_blocks[];
  seo: Containers_dataportal_Digg_Containers_seo | null;
}

export interface Containers {
  dataportal_Digg_Containers: (Containers_dataportal_Digg_Containers | null)[];
}

export interface ContainersVariables {
  filter?: dataportal_QueryContainerArgs | null;
}
