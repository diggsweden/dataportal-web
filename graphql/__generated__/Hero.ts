/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Hero
// ====================================================

export interface Hero_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Hero_media_dataportal_Digg_Image {
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

export interface Hero_media_dataportal_Digg_Video {
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

export interface Hero_media_dataportal_Digg_File {
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

export type Hero_media = Hero_media_dataportal_Digg_Image | Hero_media_dataportal_Digg_Video | Hero_media_dataportal_Digg_File;

export interface Hero {
  __typename: "dataportal_Digg_Hero";
  heading: string | null;
  heroText: Hero_heroText | null;
  media: Hero_media;
}
