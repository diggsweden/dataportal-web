/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: Module
// ====================================================

export interface Module_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface Module_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Module_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Module_blocks_dataportal_Digg_Text_text;
}

export interface Module_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Module_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Module_blocks_dataportal_Digg_Faq_answer;
}

export interface Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Module_blocks_dataportal_Digg_Media_media = Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Module_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Module_blocks_dataportal_Digg_Media_media;
}

export interface Module_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Module_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface Module_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Module_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type Module_blocks_dataportal_Digg_Hero_media = Module_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | Module_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | Module_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface Module_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: Module_blocks_dataportal_Digg_Hero_heroText | null;
  media: Module_blocks_dataportal_Digg_Hero_media;
}

export interface Module_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Module_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Module_blocks_dataportal_Digg_RelatedContent_links[];
}

export type Module_blocks = Module_blocks_dataportal_Digg_ModuleList | Module_blocks_dataportal_Digg_Text | Module_blocks_dataportal_Digg_Faq | Module_blocks_dataportal_Digg_Media | Module_blocks_dataportal_Digg_Hero | Module_blocks_dataportal_Digg_RelatedContent;

export interface Module {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: Module_blocks[];
}
