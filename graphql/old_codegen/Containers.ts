/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_QueryContainerArgs, dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Containers
// ====================================================

export interface Containers_dataportal_Digg_Containers_image {
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

export interface Containers_dataportal_Digg_Containers_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface Containers_dataportal_Digg_Containers_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface Containers_dataportal_Digg_Containers_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Text_text;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Faq_answer;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media_media;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock_elements[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements[];
}

export type Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock;

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules[];
}

export type Containers_dataportal_Digg_Containers_blocks = Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Text | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Faq | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_Media | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_RelatedContent | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_FormBlock | Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList;

export interface Containers_dataportal_Digg_Containers_seo_image {
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
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: Containers_dataportal_Digg_Containers_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: Containers_dataportal_Digg_Containers_domains[];
  categories: Containers_dataportal_Digg_Containers_categories[];
  tags: Containers_dataportal_Digg_Containers_tags[];
  blocks: Containers_dataportal_Digg_Containers_blocks[];
  seo: Containers_dataportal_Digg_Containers_seo | null;
}

export interface Containers {
  dataportal_Digg_Containers: (Containers_dataportal_Digg_Containers | null)[];
}

export interface ContainersVariables {
  filter?: dataportal_QueryContainerArgs | null;
}