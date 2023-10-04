/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Faq
// ====================================================

export interface Faq_answer {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Faq {
  __typename: "dataportal_Digg_Faq";
  question: string;
  answer: Faq_answer;
}
