/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_QueryContainerArgs, dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: MultiContainers
// ====================================================

export interface MultiContainers_category_image {
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

export interface MultiContainers_category_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface MultiContainers_category_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface MultiContainers_category_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface MultiContainers_category_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_category_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: MultiContainers_category_blocks_dataportal_Digg_Text_text;
}

export interface MultiContainers_category_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_category_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: MultiContainers_category_blocks_dataportal_Digg_Faq_answer;
}

export interface MultiContainers_category_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface MultiContainers_category_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface MultiContainers_category_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type MultiContainers_category_blocks_dataportal_Digg_Media_media = MultiContainers_category_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | MultiContainers_category_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | MultiContainers_category_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface MultiContainers_category_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: MultiContainers_category_blocks_dataportal_Digg_Media_media;
}

export interface MultiContainers_category_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_category_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface MultiContainers_category_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface MultiContainers_category_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type MultiContainers_category_blocks_dataportal_Digg_Hero_media = MultiContainers_category_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | MultiContainers_category_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | MultiContainers_category_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface MultiContainers_category_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: MultiContainers_category_blocks_dataportal_Digg_Hero_heroText | null;
  media: MultiContainers_category_blocks_dataportal_Digg_Hero_media;
}

export interface MultiContainers_category_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface MultiContainers_category_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: MultiContainers_category_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements = MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface MultiContainers_category_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: MultiContainers_category_blocks_dataportal_Digg_FormBlock_elements[];
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements = MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements[];
}

export type MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks = MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent | MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock;

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface MultiContainers_category_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: MultiContainers_category_blocks_dataportal_Digg_ModuleList_modules[];
}

export type MultiContainers_category_blocks = MultiContainers_category_blocks_dataportal_Digg_Text | MultiContainers_category_blocks_dataportal_Digg_Faq | MultiContainers_category_blocks_dataportal_Digg_Media | MultiContainers_category_blocks_dataportal_Digg_Hero | MultiContainers_category_blocks_dataportal_Digg_RelatedContent | MultiContainers_category_blocks_dataportal_Digg_FormBlock | MultiContainers_category_blocks_dataportal_Digg_ModuleList;

export interface MultiContainers_category_seo_image {
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

export interface MultiContainers_category_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: MultiContainers_category_seo_image | null;
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

export interface MultiContainers_category {
  __typename: "dataportal_Digg_Container";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: MultiContainers_category_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: MultiContainers_category_domains[];
  categories: MultiContainers_category_categories[];
  tags: MultiContainers_category_tags[];
  blocks: MultiContainers_category_blocks[];
  seo: MultiContainers_category_seo | null;
}

export interface MultiContainers_container_image {
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

export interface MultiContainers_container_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface MultiContainers_container_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface MultiContainers_container_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface MultiContainers_container_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_container_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: MultiContainers_container_blocks_dataportal_Digg_Text_text;
}

export interface MultiContainers_container_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_container_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: MultiContainers_container_blocks_dataportal_Digg_Faq_answer;
}

export interface MultiContainers_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface MultiContainers_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface MultiContainers_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type MultiContainers_container_blocks_dataportal_Digg_Media_media = MultiContainers_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | MultiContainers_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | MultiContainers_container_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface MultiContainers_container_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: MultiContainers_container_blocks_dataportal_Digg_Media_media;
}

export interface MultiContainers_container_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface MultiContainers_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface MultiContainers_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type MultiContainers_container_blocks_dataportal_Digg_Hero_media = MultiContainers_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | MultiContainers_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | MultiContainers_container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface MultiContainers_container_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: MultiContainers_container_blocks_dataportal_Digg_Hero_heroText | null;
  media: MultiContainers_container_blocks_dataportal_Digg_Hero_media;
}

export interface MultiContainers_container_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface MultiContainers_container_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: MultiContainers_container_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements = MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface MultiContainers_container_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: MultiContainers_container_blocks_dataportal_Digg_FormBlock_elements[];
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements = MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements[];
}

export type MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks = MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent | MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock;

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface MultiContainers_container_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: MultiContainers_container_blocks_dataportal_Digg_ModuleList_modules[];
}

export type MultiContainers_container_blocks = MultiContainers_container_blocks_dataportal_Digg_Text | MultiContainers_container_blocks_dataportal_Digg_Faq | MultiContainers_container_blocks_dataportal_Digg_Media | MultiContainers_container_blocks_dataportal_Digg_Hero | MultiContainers_container_blocks_dataportal_Digg_RelatedContent | MultiContainers_container_blocks_dataportal_Digg_FormBlock | MultiContainers_container_blocks_dataportal_Digg_ModuleList;

export interface MultiContainers_container_seo_image {
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

export interface MultiContainers_container_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: MultiContainers_container_seo_image | null;
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

export interface MultiContainers_container {
  __typename: "dataportal_Digg_Container";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: MultiContainers_container_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: MultiContainers_container_domains[];
  categories: MultiContainers_container_categories[];
  tags: MultiContainers_container_tags[];
  blocks: MultiContainers_container_blocks[];
  seo: MultiContainers_container_seo | null;
}

export interface MultiContainers {
  category: (MultiContainers_category | null)[];
  container: (MultiContainers_container | null)[];
}

export interface MultiContainersVariables {
  category?: dataportal_QueryContainerArgs | null;
  container?: dataportal_QueryContainerArgs | null;
}
