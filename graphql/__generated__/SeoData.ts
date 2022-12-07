/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SeoData
// ====================================================

export interface SeoData_image {
  __typename: "dataportal_v1_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface SeoData {
  __typename: "dataportal_v1_Digg_SEO";
  title: string | null;
  description: string | null;
  image: SeoData_image | null;
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
