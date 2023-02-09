/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_QueryDomainArgs, dataportal_QueryContainerArgs, dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: DomainAggregate
// ====================================================

export interface DomainAggregate_domain_taxonomies_categories {
  __typename: "dataportal_Digg_Category";
  id: string;
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
  /**
   * Category belongs to this taxonomy
   */
  taxonomy: string | null;
  updatedAt: any;
  /**
   * two-letter lang
   */
  locale: string;
}

export interface DomainAggregate_domain_taxonomies {
  __typename: "dataportal_Digg_Taxonomy";
  id: string;
  name: string;
  slug: string;
  categories: DomainAggregate_domain_taxonomies_categories[];
}

export interface DomainAggregate_domain {
  __typename: "dataportal_Digg_Domain";
  id: string;
  name: string;
  slug: string;
  taxonomies: DomainAggregate_domain_taxonomies[];
}

export interface DomainAggregate_rootContainer_image {
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

export interface DomainAggregate_rootContainer_domains {
  __typename: "dataportal_Digg_Domain";
  name: string;
  slug: string;
}

export interface DomainAggregate_rootContainer_categories {
  __typename: "dataportal_Digg_Category";
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
}

export interface DomainAggregate_rootContainer_tags {
  __typename: "dataportal_Digg_Tag";
  value: string;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: DomainAggregate_rootContainer_blocks_dataportal_Digg_Text_text;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: DomainAggregate_rootContainer_blocks_dataportal_Digg_Faq_answer;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type DomainAggregate_rootContainer_blocks_dataportal_Digg_Media_media = DomainAggregate_rootContainer_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | DomainAggregate_rootContainer_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | DomainAggregate_rootContainer_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: DomainAggregate_rootContainer_blocks_dataportal_Digg_Media_media;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: DomainAggregate_rootContainer_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements = DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock_elements[];
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text {
  __typename: "dataportal_Digg_Text";
  id: string;
  heading: string | null;
  text: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text_text;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq {
  __typename: "dataportal_Digg_Faq";
  id: string;
  question: string;
  answer: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq_answer;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image {
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

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video {
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

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File {
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

export type DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media = DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Image | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_Video | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media_dataportal_Digg_File;

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media {
  __typename: "dataportal_Digg_Media";
  id: string;
  heading: string | null;
  description: string | null;
  media: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media_media;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links {
  __typename: "dataportal_Digg_Link";
  slug: string;
  title: string | null;
  description: string | null;
  linktype: dataportal_LinkType;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent {
  __typename: "dataportal_Digg_RelatedContent";
  id: string;
  links: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent_links[];
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription_text;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText {
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

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio {
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
  choices: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio_choices[];
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox {
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
  choices: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown {
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

export type DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements = DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormPageBreak | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDescription | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormText | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormRadio | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormCheckbox | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements_dataportal_Digg_FormDropdown;

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock {
  __typename: "dataportal_Digg_FormBlock";
  id: string;
  elements: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock_elements[];
}

export type DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks = DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_ModuleList | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Text | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Faq | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_Media | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_RelatedContent | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks_dataportal_Digg_FormBlock;

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules {
  __typename: "dataportal_Digg_Module";
  identifier: string;
  blocks: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules_blocks[];
}

export interface DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList {
  __typename: "dataportal_Digg_ModuleList";
  id: string;
  modules: DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList_modules[];
}

export type DomainAggregate_rootContainer_blocks = DomainAggregate_rootContainer_blocks_dataportal_Digg_Text | DomainAggregate_rootContainer_blocks_dataportal_Digg_Faq | DomainAggregate_rootContainer_blocks_dataportal_Digg_Media | DomainAggregate_rootContainer_blocks_dataportal_Digg_RelatedContent | DomainAggregate_rootContainer_blocks_dataportal_Digg_FormBlock | DomainAggregate_rootContainer_blocks_dataportal_Digg_ModuleList;

export interface DomainAggregate_rootContainer_seo_image {
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

export interface DomainAggregate_rootContainer_seo {
  __typename: "dataportal_Digg_SEO";
  title: string | null;
  description: string | null;
  image: DomainAggregate_rootContainer_seo_image | null;
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

export interface DomainAggregate_rootContainer {
  __typename: "dataportal_Digg_Container";
  id: string;
  name: string;
  /**
   * two-letter lang
   */
  locale: string;
  heading: string | null;
  preamble: string | null;
  image: DomainAggregate_rootContainer_image | null;
  updatedAt: any;
  createdAt: any;
  slug: string;
  domains: DomainAggregate_rootContainer_domains[];
  categories: DomainAggregate_rootContainer_categories[];
  tags: DomainAggregate_rootContainer_tags[];
  blocks: DomainAggregate_rootContainer_blocks[];
  seo: DomainAggregate_rootContainer_seo | null;
}

export interface DomainAggregate {
  domain: DomainAggregate_domain[];
  rootContainer: (DomainAggregate_rootContainer | null)[];
}

export interface DomainAggregateVariables {
  domain?: dataportal_QueryDomainArgs | null;
  root?: dataportal_QueryContainerArgs | null;
}
