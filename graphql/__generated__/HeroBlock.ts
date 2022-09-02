/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: HeroBlock
// ====================================================

export interface HeroBlock_heroText {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface HeroBlock_media_dataportal_Digg_Image {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
  width: number | null;
  height: number | null;
}

export interface HeroBlock_media_dataportal_Digg_Video {
  __typename: "dataportal_Digg_Video";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface HeroBlock_media_dataportal_Digg_File {
  __typename: "dataportal_Digg_File";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export type HeroBlock_media = HeroBlock_media_dataportal_Digg_Image | HeroBlock_media_dataportal_Digg_Video | HeroBlock_media_dataportal_Digg_File;

export interface HeroBlock {
  __typename: "dataportal_Digg_HeroBlock";
  heading: string | null;
  heroText: HeroBlock_heroText | null;
  media: HeroBlock_media;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
}
