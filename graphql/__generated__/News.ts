/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_v1_QueryContainerArgs, dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: News
// ====================================================

export interface News_dataportal_v1_Digg_News_image {
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

export interface News_dataportal_v1_Digg_News_breadcrumb_link {
  __typename: "dataportal_v1_Digg_Link";
  link: string;
  linktype: dataportal_LinkType;
}

export interface News_dataportal_v1_Digg_News_breadcrumb {
  __typename: "dataportal_v1_Digg_Breadrumb";
  name: string;
  link: News_dataportal_v1_Digg_News_breadcrumb_link;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_TextBlock_text {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_TextBlock {
  __typename: "dataportal_v1_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_TextBlock_text;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_FaqBlock_answer {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_FaqBlock {
  __typename: "dataportal_v1_Digg_FaqBlock";
  id: string;
  question: string;
  answer: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_FaqBlock_answer;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Image {
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

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Video {
  __typename: "dataportal_v1_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_File {
  __typename: "dataportal_v1_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock_media = News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Image | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Video | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_File;

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock {
  __typename: "dataportal_v1_Digg_MediaBlock";
  id: string;
  heading: string | null;
  description: string | null;
  media: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock_media;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_body {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_FaqBlock {
  __typename: "dataportal_v1_Digg_FaqBlock" | "dataportal_v1_Digg_GroupBlock" | "dataportal_v1_Digg_HeroBlock" | "dataportal_v1_Digg_MediaBlock" | "dataportal_v1_Digg_PuffBlock" | "dataportal_v1_Digg_LinksBlock" | "dataportal_v1_Digg_SharedContentContainer";
  id: string;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock_text {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock {
  __typename: "dataportal_v1_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock_text;
}

export type News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_blocks = News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_FaqBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock;

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock {
  __typename: "dataportal_v1_Digg_GroupBlock";
  id: string;
  heading: string | null;
  body: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_body | null;
  blocks: (News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock_blocks | null)[];
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_heroText {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Image {
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

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Video {
  __typename: "dataportal_v1_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_File {
  __typename: "dataportal_v1_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_media = News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Image | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Video | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_File;

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock {
  __typename: "dataportal_v1_Digg_HeroBlock";
  id: string;
  heading: string | null;
  heroText: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_heroText | null;
  media: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock_media;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock_puffs_link {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock_puffs_container_image {
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

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock_puffs_container {
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
  image: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock_puffs_container_image | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock_puffs {
  __typename: "dataportal_v1_Digg_Puff";
  heading: string | null;
  description: string | null;
  link: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock_puffs_link | null;
  theme: string | null;
  type: string;
  buttonText: string | null;
  container: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock_puffs_container | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock {
  __typename: "dataportal_v1_Digg_PuffBlock";
  id: string;
  heading: string | null;
  description: string | null;
  puffs: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock_puffs[] | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_LinksBlock_links {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_LinksBlock {
  __typename: "dataportal_v1_Digg_LinksBlock";
  id: string;
  links: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_LinksBlock_links[] | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_SharedContentContainer {
  __typename: "dataportal_v1_Digg_SharedContentContainer";
  id: string;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_TextBlock_text {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_TextBlock {
  __typename: "dataportal_v1_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_TextBlock_text;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_FaqBlock_answer {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_FaqBlock {
  __typename: "dataportal_v1_Digg_FaqBlock";
  id: string;
  question: string;
  answer: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_FaqBlock_answer;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Image {
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

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Video {
  __typename: "dataportal_v1_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_File {
  __typename: "dataportal_v1_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock_media = News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Image | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_Video | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock_media_dataportal_v1_Digg_File;

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock {
  __typename: "dataportal_v1_Digg_MediaBlock";
  id: string;
  heading: string | null;
  description: string | null;
  media: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock_media;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_body {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_FaqBlock {
  __typename: "dataportal_v1_Digg_FaqBlock" | "dataportal_v1_Digg_GroupBlock" | "dataportal_v1_Digg_HeroBlock" | "dataportal_v1_Digg_MediaBlock" | "dataportal_v1_Digg_PuffBlock" | "dataportal_v1_Digg_LinksBlock" | "dataportal_v1_Digg_SharedContentContainer";
  id: string;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock_text {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock {
  __typename: "dataportal_v1_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock_text;
}

export type News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_blocks = News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_FaqBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_blocks_dataportal_v1_Digg_TextBlock;

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock {
  __typename: "dataportal_v1_Digg_GroupBlock";
  id: string;
  heading: string | null;
  body: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_body | null;
  blocks: (News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock_blocks | null)[];
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_heroText {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Image {
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

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Video {
  __typename: "dataportal_v1_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_File {
  __typename: "dataportal_v1_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_media = News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Image | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_Video | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_media_dataportal_v1_Digg_File;

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock {
  __typename: "dataportal_v1_Digg_HeroBlock";
  id: string;
  heading: string | null;
  heroText: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_heroText | null;
  media: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock_media;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock_puffs_link {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock_puffs_container_image {
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

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock_puffs_container {
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
  image: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock_puffs_container_image | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock_puffs {
  __typename: "dataportal_v1_Digg_Puff";
  heading: string | null;
  description: string | null;
  link: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock_puffs_link | null;
  theme: string | null;
  type: string;
  buttonText: string | null;
  container: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock_puffs_container | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock {
  __typename: "dataportal_v1_Digg_PuffBlock";
  id: string;
  heading: string | null;
  description: string | null;
  puffs: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock_puffs[] | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_LinksBlock_links {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_LinksBlock {
  __typename: "dataportal_v1_Digg_LinksBlock";
  id: string;
  links: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_LinksBlock_links[] | null;
}

export type News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks = News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_SharedContentContainer | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_TextBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_FaqBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_MediaBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_GroupBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_HeroBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_PuffBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks_dataportal_v1_Digg_LinksBlock;

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents {
  __typename: "dataportal_v1_Digg_SharedContent";
  identifier: string;
  blocks: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents_blocks[] | null;
}

export interface News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer {
  __typename: "dataportal_v1_Digg_SharedContentContainer";
  id: string;
  contents: News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer_contents[] | null;
}

export type News_dataportal_v1_Digg_News_blocks = News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_TextBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_FaqBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_MediaBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_GroupBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_HeroBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_PuffBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_LinksBlock | News_dataportal_v1_Digg_News_blocks_dataportal_v1_Digg_SharedContentContainer;

export interface News_dataportal_v1_Digg_News_seo_image {
  __typename: "dataportal_v1_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface News_dataportal_v1_Digg_News_seo {
  __typename: "dataportal_v1_Digg_SEO";
  title: string | null;
  description: string | null;
  image: News_dataportal_v1_Digg_News_seo_image | null;
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

export interface News_dataportal_v1_Digg_News {
  __typename: "dataportal_v1_Digg_News";
  id: string;
  /**
   * two-letter lang
   */
  locale: string;
  updatedAt: any;
  publishedAt: any;
  heading: string | null;
  preamble: string | null;
  slug: string;
  order: number;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
  image: News_dataportal_v1_Digg_News_image | null;
  breadcrumb: (News_dataportal_v1_Digg_News_breadcrumb | null)[];
  blocks: (News_dataportal_v1_Digg_News_blocks | null)[];
  seo: News_dataportal_v1_Digg_News_seo | null;
}

export interface News {
  dataportal_v1_Digg_News: (News_dataportal_v1_Digg_News | null)[];
}

export interface NewsVariables {
  filter?: dataportal_v1_QueryContainerArgs | null;
}
