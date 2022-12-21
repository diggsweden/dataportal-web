/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_QuerySearchArgs, dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Search
// ====================================================

export interface Search_dataportal_Digg_Search_hits_highlights {
  __typename: "dataportal_Digg_SearchHighlight";
  name: string | null;
  value: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Text_text;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Faq_answer;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media_media = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media_media;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_media = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_heroText | null;
  media: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero_media;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock_elements[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements[];
}

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList_modules[];
}

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Text | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Faq | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Media | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_Hero | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_RelatedContent | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_FormBlock | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks_dataportal_Digg_ModuleList;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_seo_image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_seo_image | null;
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container {
  __typename: "dataportal_Digg_Container";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_domains[];
  categories: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_categories[];
  tags: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_tags[];
  blocks: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_blocks[];
  seo: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container_seo | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Text_text;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Faq_answer;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media_media = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media_media;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_media = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_heroText | null;
  media: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero_media;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock_elements[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Image | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_Video | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media_dataportal_Digg_File;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero {
  __typename: "dataportal_Digg_Hero";
  id: string;
  heading: string | null;
  heroText: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_heroText | null;
  media: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero_media;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements[];
}

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Hero | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList_modules[];
}

export type Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Text | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Faq | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Media | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_Hero | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_RelatedContent | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_FormBlock | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks_dataportal_Digg_ModuleList;

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_seo_image {
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_seo_image | null;
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

export interface Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication {
  __typename: "dataportal_Digg_Publication";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_domains[];
  categories: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_categories[];
  tags: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_tags[];
  blocks: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_blocks[];
  seo: Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication_seo | null;
  publishedAt: any;
  startDate: any | null;
  endDate: any | null;
}

export type Search_dataportal_Digg_Search_hits_hit = Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Container | Search_dataportal_Digg_Search_hits_hit_dataportal_Digg_Publication;

export interface Search_dataportal_Digg_Search_hits {
  __typename: "dataportal_Digg_SearchHit";
  highlights: (Search_dataportal_Digg_Search_hits_highlights | null)[] | null;
  hit: Search_dataportal_Digg_Search_hits_hit | null;
}

export interface Search_dataportal_Digg_Search {
  __typename: "dataportal_Digg_SearchResult";
  totalNrOfHits: number | null;
  hits: (Search_dataportal_Digg_Search_hits | null)[] | null;
}

export interface Search {
  dataportal_Digg_Search: Search_dataportal_Digg_Search;
}

export interface SearchVariables {
  filter?: dataportal_QuerySearchArgs | null;
}
