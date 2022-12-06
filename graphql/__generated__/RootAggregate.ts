/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_ContainerState, dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: RootAggregate
// ====================================================

export interface RootAggregate_container_image {
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

export interface RootAggregate_container_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface RootAggregate_container_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface RootAggregate_container_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface RootAggregate_container_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_container_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: RootAggregate_container_blocks_dataportal_Digg_Text_text;
}

export interface RootAggregate_container_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_container_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: RootAggregate_container_blocks_dataportal_Digg_Faq_answer;
}

export interface RootAggregate_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface RootAggregate_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_container_blocks_dataportal_Digg_Media_media = RootAggregate_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | RootAggregate_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | RootAggregate_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface RootAggregate_container_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: RootAggregate_container_blocks_dataportal_Digg_Media_media;
}

export interface RootAggregate_container_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface RootAggregate_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_container_blocks_dataportal_Digg_Hero_media = RootAggregate_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | RootAggregate_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | RootAggregate_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface RootAggregate_container_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: RootAggregate_container_blocks_dataportal_Digg_Hero_heroText | null;
  media: RootAggregate_container_blocks_dataportal_Digg_Hero_media;
}

export interface RootAggregate_container_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface RootAggregate_container_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: RootAggregate_container_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export type RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks = RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent;

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface RootAggregate_container_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: RootAggregate_container_blocks_dataportal_Digg_ModuleList_modules[];
}

export type RootAggregate_container_blocks = RootAggregate_container_blocks_dataportal_Digg_Text | RootAggregate_container_blocks_dataportal_Digg_Faq | RootAggregate_container_blocks_dataportal_Digg_Media | RootAggregate_container_blocks_dataportal_Digg_Hero | RootAggregate_container_blocks_dataportal_Digg_RelatedContent | RootAggregate_container_blocks_dataportal_Digg_ModuleList;

export interface RootAggregate_container_seo_image {
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

export interface RootAggregate_container_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: RootAggregate_container_seo_image | null;
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

export interface RootAggregate_container {
  __typename: "dataportal_Digg_Container";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: RootAggregate_container_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: RootAggregate_container_domains[];
  categories: RootAggregate_container_categories[];
  tags: RootAggregate_container_tags[];
  blocks: RootAggregate_container_blocks[];
  seo: RootAggregate_container_seo | null;
}

export interface RootAggregate_news_image {
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

export interface RootAggregate_news_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface RootAggregate_news_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface RootAggregate_news_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface RootAggregate_news_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_news_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: RootAggregate_news_blocks_dataportal_Digg_Text_text;
}

export interface RootAggregate_news_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_news_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: RootAggregate_news_blocks_dataportal_Digg_Faq_answer;
}

export interface RootAggregate_news_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface RootAggregate_news_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_news_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_news_blocks_dataportal_Digg_Media_media = RootAggregate_news_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | RootAggregate_news_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | RootAggregate_news_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface RootAggregate_news_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: RootAggregate_news_blocks_dataportal_Digg_Media_media;
}

export interface RootAggregate_news_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_news_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface RootAggregate_news_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_news_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_news_blocks_dataportal_Digg_Hero_media = RootAggregate_news_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | RootAggregate_news_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | RootAggregate_news_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface RootAggregate_news_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: RootAggregate_news_blocks_dataportal_Digg_Hero_heroText | null;
  media: RootAggregate_news_blocks_dataportal_Digg_Hero_media;
}

export interface RootAggregate_news_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface RootAggregate_news_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: RootAggregate_news_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export type RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks = RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent;

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface RootAggregate_news_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: RootAggregate_news_blocks_dataportal_Digg_ModuleList_modules[];
}

export type RootAggregate_news_blocks = RootAggregate_news_blocks_dataportal_Digg_Text | RootAggregate_news_blocks_dataportal_Digg_Faq | RootAggregate_news_blocks_dataportal_Digg_Media | RootAggregate_news_blocks_dataportal_Digg_Hero | RootAggregate_news_blocks_dataportal_Digg_RelatedContent | RootAggregate_news_blocks_dataportal_Digg_ModuleList;

export interface RootAggregate_news_seo_image {
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

export interface RootAggregate_news_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: RootAggregate_news_seo_image | null;
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

export interface RootAggregate_news {
  __typename: "dataportal_Digg_Publication";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: RootAggregate_news_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: RootAggregate_news_domains[];
  categories: RootAggregate_news_categories[];
  tags: RootAggregate_news_tags[];
  blocks: RootAggregate_news_blocks[];
  seo: RootAggregate_news_seo | null;
  publishedAt: any;
  startDate: any | null;
  endDate: any | null;
}

export interface RootAggregate_examples_image {
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

export interface RootAggregate_examples_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface RootAggregate_examples_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface RootAggregate_examples_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: RootAggregate_examples_blocks_dataportal_Digg_Text_text;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: RootAggregate_examples_blocks_dataportal_Digg_Faq_answer;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface RootAggregate_examples_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_examples_blocks_dataportal_Digg_Media_media = RootAggregate_examples_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | RootAggregate_examples_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | RootAggregate_examples_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface RootAggregate_examples_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: RootAggregate_examples_blocks_dataportal_Digg_Media_media;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface RootAggregate_examples_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_examples_blocks_dataportal_Digg_Hero_media = RootAggregate_examples_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | RootAggregate_examples_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | RootAggregate_examples_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface RootAggregate_examples_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: RootAggregate_examples_blocks_dataportal_Digg_Hero_heroText | null;
  media: RootAggregate_examples_blocks_dataportal_Digg_Hero_media;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: RootAggregate_examples_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export type RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks = RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent;

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface RootAggregate_examples_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: RootAggregate_examples_blocks_dataportal_Digg_ModuleList_modules[];
}

export type RootAggregate_examples_blocks = RootAggregate_examples_blocks_dataportal_Digg_Text | RootAggregate_examples_blocks_dataportal_Digg_Faq | RootAggregate_examples_blocks_dataportal_Digg_Media | RootAggregate_examples_blocks_dataportal_Digg_Hero | RootAggregate_examples_blocks_dataportal_Digg_RelatedContent | RootAggregate_examples_blocks_dataportal_Digg_ModuleList;

export interface RootAggregate_examples_seo_image {
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

export interface RootAggregate_examples_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: RootAggregate_examples_seo_image | null;
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

export interface RootAggregate_examples {
  __typename: "dataportal_Digg_Publication";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: RootAggregate_examples_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: RootAggregate_examples_domains[];
  categories: RootAggregate_examples_categories[];
  tags: RootAggregate_examples_tags[];
  blocks: RootAggregate_examples_blocks[];
  seo: RootAggregate_examples_seo | null;
  publishedAt: any;
  startDate: any | null;
  endDate: any | null;
}

export interface RootAggregate_events_image {
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

export interface RootAggregate_events_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface RootAggregate_events_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface RootAggregate_events_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface RootAggregate_events_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_events_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: RootAggregate_events_blocks_dataportal_Digg_Text_text;
}

export interface RootAggregate_events_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_events_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: RootAggregate_events_blocks_dataportal_Digg_Faq_answer;
}

export interface RootAggregate_events_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface RootAggregate_events_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_events_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_events_blocks_dataportal_Digg_Media_media = RootAggregate_events_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | RootAggregate_events_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | RootAggregate_events_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface RootAggregate_events_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: RootAggregate_events_blocks_dataportal_Digg_Media_media;
}

export interface RootAggregate_events_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_events_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface RootAggregate_events_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_events_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_events_blocks_dataportal_Digg_Hero_media = RootAggregate_events_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | RootAggregate_events_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | RootAggregate_events_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface RootAggregate_events_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: RootAggregate_events_blocks_dataportal_Digg_Hero_heroText | null;
  media: RootAggregate_events_blocks_dataportal_Digg_Hero_media;
}

export interface RootAggregate_events_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface RootAggregate_events_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: RootAggregate_events_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export type RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks = RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent;

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface RootAggregate_events_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: RootAggregate_events_blocks_dataportal_Digg_ModuleList_modules[];
}

export type RootAggregate_events_blocks = RootAggregate_events_blocks_dataportal_Digg_Text | RootAggregate_events_blocks_dataportal_Digg_Faq | RootAggregate_events_blocks_dataportal_Digg_Media | RootAggregate_events_blocks_dataportal_Digg_Hero | RootAggregate_events_blocks_dataportal_Digg_RelatedContent | RootAggregate_events_blocks_dataportal_Digg_ModuleList;

export interface RootAggregate_events_seo_image {
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

export interface RootAggregate_events_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: RootAggregate_events_seo_image | null;
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

export interface RootAggregate_events {
  __typename: "dataportal_Digg_Publication";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: RootAggregate_events_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: RootAggregate_events_domains[];
  categories: RootAggregate_events_categories[];
  tags: RootAggregate_events_tags[];
  blocks: RootAggregate_events_blocks[];
  seo: RootAggregate_events_seo | null;
  publishedAt: any;
  startDate: any | null;
  endDate: any | null;
}

export interface RootAggregate_areas {
  __typename: "dataportal_Digg_Category";
  id: string;
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
  /**
   * Category belongs to this taxonomy
   */
  taxonomy: string | null;
  updatedAt: any;
  /**
   * two-letter lang
   */
  locale: string;
}

export interface RootAggregate_themes {
  __typename: "dataportal_Digg_Category";
  id: string;
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
  /**
   * Category belongs to this taxonomy
   */
  taxonomy: string | null;
  updatedAt: any;
  /**
   * two-letter lang
   */
  locale: string;
}

export interface RootAggregate {
  container: (RootAggregate_container | null)[];
  news: (RootAggregate_news | null)[];
  examples: (RootAggregate_examples | null)[];
  events: (RootAggregate_events | null)[];
  areas: RootAggregate_areas[];
  themes: RootAggregate_themes[];
}

export interface RootAggregateVariables {
  locale: string;
  newsTag: string[];
  eventsTag: string[];
  examplesTag: string[];
  areaSlug: string;
  themeSlug: string;
  state: dataportal_ContainerState;
}
