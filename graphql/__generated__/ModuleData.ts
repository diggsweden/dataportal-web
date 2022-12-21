/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: ModuleData
// ====================================================

export interface ModuleData_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface ModuleData_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ModuleData_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: ModuleData_blocks_dataportal_Digg_Text_text;
}

export interface ModuleData_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ModuleData_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: ModuleData_blocks_dataportal_Digg_Faq_answer;
}

export interface ModuleData_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface ModuleData_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface ModuleData_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type ModuleData_blocks_dataportal_Digg_Media_media = ModuleData_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | ModuleData_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | ModuleData_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface ModuleData_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: ModuleData_blocks_dataportal_Digg_Media_media;
}

export interface ModuleData_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ModuleData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface ModuleData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface ModuleData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type ModuleData_blocks_dataportal_Digg_Hero_media = ModuleData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | ModuleData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | ModuleData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface ModuleData_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: ModuleData_blocks_dataportal_Digg_Hero_heroText | null;
  media: ModuleData_blocks_dataportal_Digg_Hero_media;
}

export interface ModuleData_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface ModuleData_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: ModuleData_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type ModuleData_blocks_dataportal_Digg_FormBlock_elements = ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | ModuleData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface ModuleData_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: ModuleData_blocks_dataportal_Digg_FormBlock_elements[];
}

export type ModuleData_blocks = ModuleData_blocks_dataportal_Digg_ModuleList | ModuleData_blocks_dataportal_Digg_Text | ModuleData_blocks_dataportal_Digg_Faq | ModuleData_blocks_dataportal_Digg_Media | ModuleData_blocks_dataportal_Digg_Hero | ModuleData_blocks_dataportal_Digg_RelatedContent | ModuleData_blocks_dataportal_Digg_FormBlock;

export interface ModuleData {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: ModuleData_blocks[];
}
