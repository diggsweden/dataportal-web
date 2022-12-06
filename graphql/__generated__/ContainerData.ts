/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: ContainerData
// ====================================================

export interface ContainerData_image {
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

export interface ContainerData_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface ContainerData_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface ContainerData_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface ContainerData_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ContainerData_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: ContainerData_blocks_dataportal_Digg_Text_text;
}

export interface ContainerData_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ContainerData_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: ContainerData_blocks_dataportal_Digg_Faq_answer;
}

export interface ContainerData_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface ContainerData_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface ContainerData_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type ContainerData_blocks_dataportal_Digg_Media_media = ContainerData_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | ContainerData_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | ContainerData_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface ContainerData_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: ContainerData_blocks_dataportal_Digg_Media_media;
}

export interface ContainerData_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ContainerData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface ContainerData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface ContainerData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type ContainerData_blocks_dataportal_Digg_Hero_media = ContainerData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | ContainerData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | ContainerData_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface ContainerData_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: ContainerData_blocks_dataportal_Digg_Hero_heroText | null;
  media: ContainerData_blocks_dataportal_Digg_Hero_media;
}

export interface ContainerData_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface ContainerData_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: ContainerData_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: string;
}

export interface ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type ContainerData_blocks_dataportal_Digg_FormBlock_elements = ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | ContainerData_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface ContainerData_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: ContainerData_blocks_dataportal_Digg_FormBlock_elements[];
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: string;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements = ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements[];
}

export type ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks = ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent | ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock;

export interface ContainerData_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: ContainerData_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface ContainerData_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: ContainerData_blocks_dataportal_Digg_ModuleList_modules[];
}

export type ContainerData_blocks = ContainerData_blocks_dataportal_Digg_Text | ContainerData_blocks_dataportal_Digg_Faq | ContainerData_blocks_dataportal_Digg_Media | ContainerData_blocks_dataportal_Digg_Hero | ContainerData_blocks_dataportal_Digg_RelatedContent | ContainerData_blocks_dataportal_Digg_FormBlock | ContainerData_blocks_dataportal_Digg_ModuleList;

export interface ContainerData_seo_image {
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

export interface ContainerData_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: ContainerData_seo_image | null;
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

export interface ContainerData {
  __typename: "dataportal_Digg_Container" | "dataportal_Digg_Publication";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: ContainerData_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: ContainerData_domains[];
  categories: ContainerData_categories[];
  tags: ContainerData_tags[];
  blocks: ContainerData_blocks[];
  seo: ContainerData_seo | null;
}
