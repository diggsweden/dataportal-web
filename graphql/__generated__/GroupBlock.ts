/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GroupBlock
// ====================================================

export interface GroupBlock_body {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface GroupBlock_blocks_dataportal_v1_Digg_FaqBlock {
  __typename: "dataportal_v1_Digg_FaqBlock" | "dataportal_v1_Digg_GroupBlock" | "dataportal_v1_Digg_HeroBlock" | "dataportal_v1_Digg_MediaBlock" | "dataportal_v1_Digg_PuffBlock" | "dataportal_v1_Digg_LinksBlock" | "dataportal_v1_Digg_SharedContentContainer";
  id: string;
}

export interface GroupBlock_blocks_dataportal_v1_Digg_TextBlock_text {
  __typename: "dataportal_v1_Digg_RichText";
  markdown: string | null;
}

export interface GroupBlock_blocks_dataportal_v1_Digg_TextBlock {
  __typename: "dataportal_v1_Digg_TextBlock";
  id: string;
  heading: string | null;
  text: GroupBlock_blocks_dataportal_v1_Digg_TextBlock_text;
}

export type GroupBlock_blocks = GroupBlock_blocks_dataportal_v1_Digg_FaqBlock | GroupBlock_blocks_dataportal_v1_Digg_TextBlock;

export interface GroupBlock {
  __typename: "dataportal_v1_Digg_GroupBlock";
  heading: string | null;
  body: GroupBlock_body | null;
  blocks: (GroupBlock_blocks | null)[];
}
