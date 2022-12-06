/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: BlockData
// ====================================================

export interface BlockData_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface BlockData_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface BlockData_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: BlockData_dataportal_Digg_Text_text;
}

export interface BlockData_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface BlockData_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: BlockData_dataportal_Digg_Faq_answer;
}

export interface BlockData_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface BlockData_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface BlockData_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type BlockData_dataportal_Digg_Media_media = BlockData_dataportal_Digg_Media_media_dataportal_Digg_Image | BlockData_dataportal_Digg_Media_media_dataportal_Digg_Video | BlockData_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface BlockData_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: BlockData_dataportal_Digg_Media_media;
}

export interface BlockData_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface BlockData_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface BlockData_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface BlockData_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type BlockData_dataportal_Digg_Hero_media = BlockData_dataportal_Digg_Hero_media_dataportal_Digg_Image | BlockData_dataportal_Digg_Hero_media_dataportal_Digg_Video | BlockData_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface BlockData_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: BlockData_dataportal_Digg_Hero_heroText | null;
  media: BlockData_dataportal_Digg_Hero_media;
}

export interface BlockData_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface BlockData_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: BlockData_dataportal_Digg_RelatedContent_links[];
}

export type BlockData = BlockData_dataportal_Digg_ModuleList | BlockData_dataportal_Digg_Text | BlockData_dataportal_Digg_Faq | BlockData_dataportal_Digg_Media | BlockData_dataportal_Digg_Hero | BlockData_dataportal_Digg_RelatedContent;
