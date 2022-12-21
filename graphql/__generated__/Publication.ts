/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_QueryContainerArgs, dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Publication
// ====================================================

export interface Publication_dataportal_Digg_Publications_image {
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

export interface Publication_dataportal_Digg_Publications_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface Publication_dataportal_Digg_Publications_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface Publication_dataportal_Digg_Publications_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Text_text;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Faq_answer;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media_media = Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media_media;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_media = Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_heroText | null;
  media: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero_media;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements = Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock_elements[];
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements = Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements[];
}

export type Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks = Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock;

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList_modules[];
}

export type Publication_dataportal_Digg_Publications_blocks = Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Text | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Faq | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Media | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_Hero | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_RelatedContent | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_FormBlock | Publication_dataportal_Digg_Publications_blocks_dataportal_Digg_ModuleList;

export interface Publication_dataportal_Digg_Publications_seo_image {
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

export interface Publication_dataportal_Digg_Publications_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: Publication_dataportal_Digg_Publications_seo_image | null;
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

export interface Publication_dataportal_Digg_Publications {
  __typename: "dataportal_Digg_Publication";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: Publication_dataportal_Digg_Publications_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: Publication_dataportal_Digg_Publications_domains[];
  categories: Publication_dataportal_Digg_Publications_categories[];
  tags: Publication_dataportal_Digg_Publications_tags[];
  blocks: Publication_dataportal_Digg_Publications_blocks[];
  seo: Publication_dataportal_Digg_Publications_seo | null;
  publishedAt: any;
  startDate: any | null;
  endDate: any | null;
}

export interface Publication {
  dataportal_Digg_Publications: (Publication_dataportal_Digg_Publications | null)[];
}

export interface PublicationVariables {
  filter?: dataportal_QueryContainerArgs | null;
}
