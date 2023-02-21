/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Module
// ====================================================

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Module_dataportal_Digg_Module_blocks_dataportal_Digg_Text_text;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Module_dataportal_Digg_Module_blocks_dataportal_Digg_Faq_answer;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media_media = Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media_media;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Module_dataportal_Digg_Module_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements = Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock_elements[];
}

export type Module_dataportal_Digg_Module_blocks = Module_dataportal_Digg_Module_blocks_dataportal_Digg_ModuleList | Module_dataportal_Digg_Module_blocks_dataportal_Digg_Text | Module_dataportal_Digg_Module_blocks_dataportal_Digg_Faq | Module_dataportal_Digg_Module_blocks_dataportal_Digg_Media | Module_dataportal_Digg_Module_blocks_dataportal_Digg_RelatedContent | Module_dataportal_Digg_Module_blocks_dataportal_Digg_FormBlock;

export interface Module_dataportal_Digg_Module {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: Module_dataportal_Digg_Module_blocks[];
}

export interface Module {
  dataportal_Digg_Module: Module_dataportal_Digg_Module;
}

export interface ModuleVariables {
  identifier: string;
  locale?: string | null;
}
