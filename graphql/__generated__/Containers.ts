/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_QueryContainerArgs, dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Containers
// ====================================================

export interface Containers_dataportal_Digg_Containers_breadcrumb_link {
  __typename: "dataportal_Digg_Link";
  link: string;
  linktype: dataportal_LinkType;
}

export interface Containers_dataportal_Digg_Containers_breadcrumb {
  __typename: "dataportal_Digg_Breadrumb";
  name: string;
  link: Containers_dataportal_Digg_Containers_breadcrumb_link;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_TextBlock_text;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FaqBlock_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock";
  id: string;
  question: string;
  answer: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FaqBlock_answer;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock {
  __typename: "dataportal_Digg_MediaBlock";
  id: string;
  heading: string | null;
  description: string | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock_media;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_body {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock" | "dataportal_Digg_GroupBlock" | "dataportal_Digg_HeroBlock" | "dataportal_Digg_MediaBlock" | "dataportal_Digg_PuffBlock" | "dataportal_Digg_LinksBlock" | "dataportal_Digg_SharedContentContainer";
  id: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_blocks = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock {
  __typename: "dataportal_Digg_GroupBlock";
  id: string;
  heading: string | null;
  body: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_body | null;
  blocks: (Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock_blocks | null)[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock {
  __typename: "dataportal_Digg_HeroBlock";
  id: string;
  heading: string | null;
  heroText: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_heroText | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock_media;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock_puffs_link {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock_puffs_container_image {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock_puffs_container {
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
  image: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock_puffs_container_image | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock_puffs {
  __typename: "dataportal_Digg_Puff";
  heading: string | null;
  description: string | null;
  link: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock_puffs_link | null;
  theme: string | null;
  type: string;
  buttonText: string | null;
  container: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock_puffs_container | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock {
  __typename: "dataportal_Digg_PuffBlock";
  id: string;
  heading: string | null;
  description: string | null;
  puffs: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock_puffs[] | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_LinksBlock_links {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_LinksBlock {
  __typename: "dataportal_Digg_LinksBlock";
  id: string;
  links: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_LinksBlock_links[] | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_SharedContentContainer {
  __typename: "dataportal_Digg_SharedContentContainer";
  id: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_TextBlock_text;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_FaqBlock_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock";
  id: string;
  question: string;
  answer: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_FaqBlock_answer;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock {
  __typename: "dataportal_Digg_MediaBlock";
  id: string;
  heading: string | null;
  description: string | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock_media;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_body {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock" | "dataportal_Digg_GroupBlock" | "dataportal_Digg_HeroBlock" | "dataportal_Digg_MediaBlock" | "dataportal_Digg_PuffBlock" | "dataportal_Digg_LinksBlock" | "dataportal_Digg_SharedContentContainer";
  id: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock {
  __typename: "dataportal_Digg_GroupBlock";
  id: string;
  heading: string | null;
  body: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_body | null;
  blocks: (Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock_blocks | null)[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock {
  __typename: "dataportal_Digg_HeroBlock";
  id: string;
  heading: string | null;
  heroText: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_heroText | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock_media;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_link {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_container_image {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_container {
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
  image: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_container_image | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs {
  __typename: "dataportal_Digg_Puff";
  heading: string | null;
  description: string | null;
  link: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_link | null;
  theme: string | null;
  type: string;
  buttonText: string | null;
  container: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs_container | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock {
  __typename: "dataportal_Digg_PuffBlock";
  id: string;
  heading: string | null;
  description: string | null;
  puffs: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock_puffs[] | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_LinksBlock_links {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_LinksBlock {
  __typename: "dataportal_Digg_LinksBlock";
  id: string;
  links: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_LinksBlock_links[] | null;
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_SharedContentContainer | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_TextBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_FaqBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_MediaBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_GroupBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_HeroBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_PuffBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks_dataportal_Digg_LinksBlock;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents {
  __typename: "dataportal_Digg_SharedContent";
  identifier: string;
  blocks: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents_blocks[] | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer {
  __typename: "dataportal_Digg_SharedContentContainer";
  id: string;
  contents: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer_contents[] | null;
}

export type Containers_dataportal_Digg_Containers_blocks = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_TextBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FaqBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_MediaBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_GroupBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_HeroBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_PuffBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_LinksBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_SharedContentContainer;

export interface Containers_dataportal_Digg_Containers_seo_image {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
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
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  updatedAt: any;
  heading: string | null;
  preamble: string | null;
  slug: string;
  order: number;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
  breadcrumb: (Containers_dataportal_Digg_Containers_breadcrumb | null)[];
  blocks: (Containers_dataportal_Digg_Containers_blocks | null)[];
  seo: Containers_dataportal_Digg_Containers_seo | null;
}

export interface Containers {
  dataportal_Digg_Containers: (Containers_dataportal_Digg_Containers | null)[];
}

export interface ContainersVariables {
  filter?: dataportal_QueryContainerArgs | null;
}
