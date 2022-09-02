/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FaqBlock
// ====================================================

export interface FaqBlock_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface FaqBlock {
  __typename: "dataportal_Digg_FaqBlock";
  question: string;
  answer: FaqBlock_answer;
}
