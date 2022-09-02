/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: BlockData
// ====================================================

export interface BlockData_dataportal_Digg_SharedContentContainer {
  __typename: "dataportal_Digg_SharedContentContainer";
  id: string;
}

export interface BlockData_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface BlockData_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: BlockData_dataportal_Digg_TextBlock_text;
}

export interface BlockData_dataportal_Digg_FaqBlock_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface BlockData_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock";
  id: string;
  question: string;
  answer: BlockData_dataportal_Digg_FaqBlock_answer;
}

export interface BlockData_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image {
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

export interface BlockData_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface BlockData_dataportal_Digg_MediaBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type BlockData_dataportal_Digg_MediaBlock_media = BlockData_dataportal_Digg_MediaBlock_media_dataportal_Digg_Image | BlockData_dataportal_Digg_MediaBlock_media_dataportal_Digg_Video | BlockData_dataportal_Digg_MediaBlock_media_dataportal_Digg_File;

export interface BlockData_dataportal_Digg_MediaBlock {
  __typename: "dataportal_Digg_MediaBlock";
  id: string;
  heading: string | null;
  description: string | null;
  media: BlockData_dataportal_Digg_MediaBlock_media;
}

export interface BlockData_dataportal_Digg_GroupBlock_body {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface BlockData_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock {
  __typename: "dataportal_Digg_FaqBlock" | "dataportal_Digg_GroupBlock" | "dataportal_Digg_HeroBlock" | "dataportal_Digg_MediaBlock" | "dataportal_Digg_PuffBlock" | "dataportal_Digg_LinksBlock" | "dataportal_Digg_SharedContentContainer";
  id: string;
}

export interface BlockData_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface BlockData_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: BlockData_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock_text;
}

export type BlockData_dataportal_Digg_GroupBlock_blocks = BlockData_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_FaqBlock | BlockData_dataportal_Digg_GroupBlock_blocks_dataportal_Digg_TextBlock;

export interface BlockData_dataportal_Digg_GroupBlock {
  __typename: "dataportal_Digg_GroupBlock";
  id: string;
  heading: string | null;
  body: BlockData_dataportal_Digg_GroupBlock_body | null;
  blocks: (BlockData_dataportal_Digg_GroupBlock_blocks | null)[];
}

export interface BlockData_dataportal_Digg_HeroBlock_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface BlockData_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image {
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

export interface BlockData_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface BlockData_dataportal_Digg_HeroBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type BlockData_dataportal_Digg_HeroBlock_media = BlockData_dataportal_Digg_HeroBlock_media_dataportal_Digg_Image | BlockData_dataportal_Digg_HeroBlock_media_dataportal_Digg_Video | BlockData_dataportal_Digg_HeroBlock_media_dataportal_Digg_File;

export interface BlockData_dataportal_Digg_HeroBlock {
  __typename: "dataportal_Digg_HeroBlock";
  id: string;
  heading: string | null;
  heroText: BlockData_dataportal_Digg_HeroBlock_heroText | null;
  media: BlockData_dataportal_Digg_HeroBlock_media;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
}

export interface BlockData_dataportal_Digg_PuffBlock_puffs_link {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface BlockData_dataportal_Digg_PuffBlock_puffs_container_image {
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

export interface BlockData_dataportal_Digg_PuffBlock_puffs_container {
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
  image: BlockData_dataportal_Digg_PuffBlock_puffs_container_image | null;
}

export interface BlockData_dataportal_Digg_PuffBlock_puffs {
  __typename: "dataportal_Digg_Puff";
  heading: string | null;
  description: string | null;
  link: BlockData_dataportal_Digg_PuffBlock_puffs_link | null;
  theme: string | null;
  type: string;
  buttonText: string | null;
  container: BlockData_dataportal_Digg_PuffBlock_puffs_container | null;
}

export interface BlockData_dataportal_Digg_PuffBlock {
  __typename: "dataportal_Digg_PuffBlock";
  id: string;
  heading: string | null;
  description: string | null;
  puffs: BlockData_dataportal_Digg_PuffBlock_puffs[] | null;
}

export interface BlockData_dataportal_Digg_LinksBlock_links {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface BlockData_dataportal_Digg_LinksBlock {
  __typename: "dataportal_Digg_LinksBlock";
  id: string;
  links: BlockData_dataportal_Digg_LinksBlock_links[] | null;
}

export type BlockData = BlockData_dataportal_Digg_SharedContentContainer | BlockData_dataportal_Digg_TextBlock | BlockData_dataportal_Digg_FaqBlock | BlockData_dataportal_Digg_MediaBlock | BlockData_dataportal_Digg_GroupBlock | BlockData_dataportal_Digg_HeroBlock | BlockData_dataportal_Digg_PuffBlock | BlockData_dataportal_Digg_LinksBlock;
