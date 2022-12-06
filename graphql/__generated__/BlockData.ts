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
  ext: string | null;
  /**
   * Data from screen9 media
   */
  screen9: any | null;
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
  ext: string | null;
  /**
   * Data from screen9 media
   */
  screen9: any | null;
}

export interface BlockData_dataportal_Digg_Media_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string | null;
  /**
   * Data from screen9 media
   */
  screen9: any | null;
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
  ext: string | null;
  /**
   * Data from screen9 media
   */
  screen9: any | null;
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
  ext: string | null;
  /**
   * Data from screen9 media
   */
  screen9: any | null;
}

export interface BlockData_dataportal_Digg_Hero_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string | null;
  /**
   * Data from screen9 media
   */
  screen9: any | null;
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

export interface BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: string;
}

export interface BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
  __typename: "dataportal_Digg_FormText" | "dataportal_Digg_FormTextArea";
  title: string;
  /**
   * Info about the specific input field
   */
  info: string | null;
  /**
   * If the specific input field should be required or not
   */
  required: boolean;
}

export interface BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
  __typename: "dataportal_Digg_FormRadio";
  title: string;
  /**
   * Info about the specific input field
   */
  info: string | null;
  /**
   * If the specific input field should be required or not
   */
  required: boolean;
  choices: BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
  __typename: "dataportal_Digg_FormCheckbox";
  title: string;
  /**
   * Info about the specific input field
   */
  info: string | null;
  /**
   * If the specific input field should be required or not
   */
  required: boolean;
  choices: BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
  __typename: "dataportal_Digg_FormDropdown";
  title: string;
  /**
   * Info about the specific input field
   */
  info: string | null;
  /**
   * If the specific input field should be required or not
   */
  required: boolean;
  items: string[];
}

export type BlockData_dataportal_Digg_FormBlock_elements = BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | BlockData_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface BlockData_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: BlockData_dataportal_Digg_FormBlock_elements[];
}

export type BlockData = BlockData_dataportal_Digg_ModuleList | BlockData_dataportal_Digg_Text | BlockData_dataportal_Digg_Faq | BlockData_dataportal_Digg_Media | BlockData_dataportal_Digg_Hero | BlockData_dataportal_Digg_RelatedContent | BlockData_dataportal_Digg_FormBlock;
