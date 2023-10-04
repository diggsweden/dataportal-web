/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Text
// ====================================================

export interface Text_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Text {
  __typename: "dataportal_Digg_Text";
  heading: string | null;
  text: Text_text;
}
