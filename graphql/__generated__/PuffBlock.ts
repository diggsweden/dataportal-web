/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: PuffBlock
// ====================================================

export interface PuffBlock_puffs_link {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface PuffBlock_puffs_container_image {
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

export interface PuffBlock_puffs_container {
  __typename: "dataportal_Digg_ContainerMeta";
  id: string;
  /**
   * two-letter lang
   */
  locale: string;
  updatedAt: any;
  createdAt: any;
  slug: string;
  title: string;
  description: string;
  image: PuffBlock_puffs_container_image | null;
}

export interface PuffBlock_puffs {
  __typename: "dataportal_Digg_Puff";
  heading: string | null;
  description: string | null;
  link: PuffBlock_puffs_link | null;
  theme: string | null;
  type: string;
  buttonText: string | null;
  container: PuffBlock_puffs_container | null;
}

export interface PuffBlock {
  __typename: "dataportal_Digg_PuffBlock";
  heading: string | null;
  description: string | null;
  puffs: PuffBlock_puffs[] | null;
}
