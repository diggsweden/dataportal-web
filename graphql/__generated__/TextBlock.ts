/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TextBlock
// ====================================================

export interface TextBlock_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface TextBlock {
  __typename: "dataportal_Digg_TextBlock";
  heading: string | null;
  text: TextBlock_text;
}
