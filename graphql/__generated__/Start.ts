/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Start
// ====================================================

export interface Start_dataportal_Digg_Start_image {
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

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: Start_dataportal_Digg_Start_blocks_dataportal_Digg_TextBlock_text;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_FaqBlock_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock";
  id: string;
  question: string;
  answer: Start_dataportal_Digg_Start_blocks_dataportal_Digg_FaqBlock_answer;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image {
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

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock_media = Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image | Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video | Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_File;

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock {
  __typename: "dataportal_Digg_MediaBlock";
  id: string;
  heading: string | null;
  description: string | null;
  media: Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock_media;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_body {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock" | "dataportal_Digg_GroupBlock" | "dataportal_Digg_HeroBlock" | "dataportal_Digg_MediaBlock" | "dataportal_Digg_PuffBlock" | "dataportal_Digg_LinksBlock" | "dataportal_Digg_SharedContentContainer";
  id: string;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text;
}

export type Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_blocks = Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock;

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock {
  __typename: "dataportal_Digg_GroupBlock";
  id: string;
  heading: string | null;
  body: Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_body | null;
  blocks: (Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock_blocks | null)[];
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image {
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

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_media = Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image | Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video | Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_File;

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock {
  __typename: "dataportal_Digg_HeroBlock";
  id: string;
  heading: string | null;
  heroText: Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_heroText | null;
  media: Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock_media;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock_puffs_link {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock_puffs_container_image {
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

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock_puffs_container {
  __typename: "dataportal_Digg_ContainerMeta";
  id: string;
  /**
   * two-letter lang
   */
  locale: string;
  updatedAt: any;
  createdAt: any;
  slug: string;
  title: string;
  description: string;
  image: Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock_puffs_container_image | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock_puffs {
  __typename: "dataportal_Digg_Puff";
  heading: string | null;
  description: string | null;
  link: Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock_puffs_link | null;
  theme: string | null;
  type: string;
  buttonText: string | null;
  container: Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock_puffs_container | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock {
  __typename: "dataportal_Digg_PuffBlock";
  id: string;
  heading: string | null;
  description: string | null;
  puffs: Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock_puffs[] | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_LinksBlock_links {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_LinksBlock {
  __typename: "dataportal_Digg_LinksBlock";
  id: string;
  links: Start_dataportal_Digg_Start_blocks_dataportal_Digg_LinksBlock_links[] | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_SharedContentContainer {
  __typename: "dataportal_Digg_SharedContentContainer";
  id: string;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_TextBlock_text;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_FaqBlock_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock";
  id: string;
  question: string;
  answer: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_FaqBlock_answer;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image {
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

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media = Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_File;

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock {
  __typename: "dataportal_Digg_MediaBlock";
  id: string;
  heading: string | null;
  description: string | null;
  media: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_body {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock" | "dataportal_Digg_GroupBlock" | "dataportal_Digg_HeroBlock" | "dataportal_Digg_MediaBlock" | "dataportal_Digg_PuffBlock" | "dataportal_Digg_LinksBlock" | "dataportal_Digg_SharedContentContainer";
  id: string;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text;
}

export type Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks = Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock;

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock {
  __typename: "dataportal_Digg_GroupBlock";
  id: string;
  heading: string | null;
  body: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_body | null;
  blocks: (Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks | null)[];
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image {
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

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media = Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_File;

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock {
  __typename: "dataportal_Digg_HeroBlock";
  id: string;
  heading: string | null;
  heroText: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_heroText | null;
  media: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_link {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_container_image {
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

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_container {
  __typename: "dataportal_Digg_ContainerMeta";
  id: string;
  /**
   * two-letter lang
   */
  locale: string;
  updatedAt: any;
  createdAt: any;
  slug: string;
  title: string;
  description: string;
  image: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_container_image | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs {
  __typename: "dataportal_Digg_Puff";
  heading: string | null;
  description: string | null;
  link: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_link | null;
  theme: string | null;
  type: string;
  buttonText: string | null;
  container: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_container | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock {
  __typename: "dataportal_Digg_PuffBlock";
  id: string;
  heading: string | null;
  description: string | null;
  puffs: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs[] | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_LinksBlock_links {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_LinksBlock {
  __typename: "dataportal_Digg_LinksBlock";
  id: string;
  links: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_LinksBlock_links[] | null;
}

export type Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks = Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_SharedContentContainer | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_TextBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_FaqBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_LinksBlock;

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents {
  __typename: "dataportal_Digg_SharedContent";
  identifier: string;
  blocks: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents_blocks[] | null;
}

export interface Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer {
  __typename: "dataportal_Digg_SharedContentContainer";
  id: string;
  contents: Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer_contents[] | null;
}

export type Start_dataportal_Digg_Start_blocks = Start_dataportal_Digg_Start_blocks_dataportal_Digg_TextBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_FaqBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_MediaBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_GroupBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_HeroBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_PuffBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_LinksBlock | Start_dataportal_Digg_Start_blocks_dataportal_Digg_SharedContentContainer;

export interface Start_dataportal_Digg_Start_seo_image {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Start_dataportal_Digg_Start_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: Start_dataportal_Digg_Start_seo_image | null;
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

export interface Start_dataportal_Digg_Start {
  __typename: "dataportal_Digg_Start";
  heading: string | null;
  preamble: string | null;
  image: Start_dataportal_Digg_Start_image | null;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
  blocks: (Start_dataportal_Digg_Start_blocks | null)[];
  seo: Start_dataportal_Digg_Start_seo | null;
}

export interface Start {
  dataportal_Digg_Start: Start_dataportal_Digg_Start | null;
}

export interface StartVariables {
  locale?: string | null;
}
