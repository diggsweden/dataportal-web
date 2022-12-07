/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: SharedContentData
// ====================================================

export interface SharedContentData_blocks_dataportal_v1_Digg_SharedContentContainer {
  __typename: "dataportal_v1_Digg_SharedContentContainer";
  id: string;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_TextBlock_text {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_TextBlock {
  __typename: "dataportal_v1_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: SharedContentData_blocks_dataportal_v1_Digg_TextBlock_text;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_FaqBlock_answer {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_FaqBlock {
  __typename: "dataportal_v1_Digg_FaqBlock";
  id: string;
  question: string;
  answer: SharedContentData_blocks_dataportal_v1_Digg_FaqBlock_answer;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Image {
  __typename: "dataportal_v1_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Video {
  __typename: "dataportal_v1_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_File {
  __typename: "dataportal_v1_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type SharedContentData_blocks_dataportal_v1_Digg_MediaBlock_media = SharedContentData_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Image | SharedContentData_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Video | SharedContentData_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_File;

export interface SharedContentData_blocks_dataportal_v1_Digg_MediaBlock {
  __typename: "dataportal_v1_Digg_MediaBlock";
  id: string;
  heading: string | null;
  description: string | null;
  media: SharedContentData_blocks_dataportal_v1_Digg_MediaBlock_media;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_body {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_FaqBlock {
  __typename: "dataportal_v1_Digg_FaqBlock" | "dataportal_v1_Digg_GroupBlock" | "dataportal_v1_Digg_HeroBlock" | "dataportal_v1_Digg_MediaBlock" | "dataportal_v1_Digg_PuffBlock" | "dataportal_v1_Digg_LinksBlock" | "dataportal_v1_Digg_SharedContentContainer";
  id: string;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock_text {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock {
  __typename: "dataportal_v1_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock_text;
}

export type SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_blocks = SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_FaqBlock | SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock;

export interface SharedContentData_blocks_dataportal_v1_Digg_GroupBlock {
  __typename: "dataportal_v1_Digg_GroupBlock";
  id: string;
  heading: string | null;
  body: SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_body | null;
  blocks: (SharedContentData_blocks_dataportal_v1_Digg_GroupBlock_blocks | null)[];
}

export interface SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_heroText {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Image {
  __typename: "dataportal_v1_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Video {
  __typename: "dataportal_v1_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_File {
  __typename: "dataportal_v1_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_media = SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Image | SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Video | SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_File;

export interface SharedContentData_blocks_dataportal_v1_Digg_HeroBlock {
  __typename: "dataportal_v1_Digg_HeroBlock";
  id: string;
  heading: string | null;
  heroText: SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_heroText | null;
  media: SharedContentData_blocks_dataportal_v1_Digg_HeroBlock_media;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
}

export interface SharedContentData_blocks_dataportal_v1_Digg_PuffBlock_puffs_link {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_PuffBlock_puffs_container_image {
  __typename: "dataportal_v1_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_PuffBlock_puffs_container {
  __typename: "dataportal_v1_Digg_ContainerMeta";
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
  image: SharedContentData_blocks_dataportal_v1_Digg_PuffBlock_puffs_container_image | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_PuffBlock_puffs {
  __typename: "dataportal_v1_Digg_Puff";
  heading: string | null;
  description: string | null;
  link: SharedContentData_blocks_dataportal_v1_Digg_PuffBlock_puffs_link | null;
  theme: string | null;
  type: string;
  buttonText: string | null;
  container: SharedContentData_blocks_dataportal_v1_Digg_PuffBlock_puffs_container | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_PuffBlock {
  __typename: "dataportal_v1_Digg_PuffBlock";
  id: string;
  heading: string | null;
  description: string | null;
  puffs: SharedContentData_blocks_dataportal_v1_Digg_PuffBlock_puffs[] | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_LinksBlock_links {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface SharedContentData_blocks_dataportal_v1_Digg_LinksBlock {
  __typename: "dataportal_v1_Digg_LinksBlock";
  id: string;
  links: SharedContentData_blocks_dataportal_v1_Digg_LinksBlock_links[] | null;
}

export type SharedContentData_blocks = SharedContentData_blocks_dataportal_v1_Digg_SharedContentContainer | SharedContentData_blocks_dataportal_v1_Digg_TextBlock | SharedContentData_blocks_dataportal_v1_Digg_FaqBlock | SharedContentData_blocks_dataportal_v1_Digg_MediaBlock | SharedContentData_blocks_dataportal_v1_Digg_GroupBlock | SharedContentData_blocks_dataportal_v1_Digg_HeroBlock | SharedContentData_blocks_dataportal_v1_Digg_PuffBlock | SharedContentData_blocks_dataportal_v1_Digg_LinksBlock;

export interface SharedContentData {
  __typename: "dataportal_v1_Digg_SharedContent";
  identifier: string;
  blocks: SharedContentData_blocks[] | null;
}
