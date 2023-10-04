/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Input
// ====================================================

export interface Input {
  __typename: "dataportal_Digg_FormText" | "dataportal_Digg_FormTextArea" | "dataportal_Digg_FormRadio" | "dataportal_Digg_FormCheckbox" | "dataportal_Digg_FormDropdown";
  /**
   * Info about the specific input field
   */
  info: string | null;
  /**
   * If the specific input field should be required or not
   */
  required: boolean;
}
