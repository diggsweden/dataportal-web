/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MediaType
// ====================================================

export interface MediaType_dataportal_Digg_Image {
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

export interface MediaType_dataportal_Digg_Video {
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

export interface MediaType_dataportal_Digg_File {
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

export type MediaType = MediaType_dataportal_Digg_Image | MediaType_dataportal_Digg_Video | MediaType_dataportal_Digg_File;
