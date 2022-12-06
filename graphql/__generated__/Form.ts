/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Form
// ====================================================

export interface Form_dataportal_Digg_Form_elements_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface Form_dataportal_Digg_Form_elements_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: string;
}

export interface Form_dataportal_Digg_Form_elements_dataportal_Digg_FormText {
  __typename: "dataportal_Digg_FormText" | "dataportal_Digg_FormTextArea";
  title: string;
  /**
   * Info about the specific input field
   */
  info: string | null;
  /**
   * If the specific input field should be required or not
   */
  required: boolean;
}

export interface Form_dataportal_Digg_Form_elements_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Form_dataportal_Digg_Form_elements_dataportal_Digg_FormRadio {
  __typename: "dataportal_Digg_FormRadio";
  title: string;
  /**
   * Info about the specific input field
   */
  info: string | null;
  /**
   * If the specific input field should be required or not
   */
  required: boolean;
  choices: Form_dataportal_Digg_Form_elements_dataportal_Digg_FormRadio_choices[];
}

export interface Form_dataportal_Digg_Form_elements_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface Form_dataportal_Digg_Form_elements_dataportal_Digg_FormCheckbox {
  __typename: "dataportal_Digg_FormCheckbox";
  title: string;
  /**
   * Info about the specific input field
   */
  info: string | null;
  /**
   * If the specific input field should be required or not
   */
  required: boolean;
  choices: Form_dataportal_Digg_Form_elements_dataportal_Digg_FormCheckbox_choices[];
}

export interface Form_dataportal_Digg_Form_elements_dataportal_Digg_FormDropdown {
  __typename: "dataportal_Digg_FormDropdown";
  title: string;
  /**
   * Info about the specific input field
   */
  info: string | null;
  /**
   * If the specific input field should be required or not
   */
  required: boolean;
  items: string[];
}

export type Form_dataportal_Digg_Form_elements = Form_dataportal_Digg_Form_elements_dataportal_Digg_FormPageBreak | Form_dataportal_Digg_Form_elements_dataportal_Digg_FormDescription | Form_dataportal_Digg_Form_elements_dataportal_Digg_FormText | Form_dataportal_Digg_Form_elements_dataportal_Digg_FormRadio | Form_dataportal_Digg_Form_elements_dataportal_Digg_FormCheckbox | Form_dataportal_Digg_Form_elements_dataportal_Digg_FormDropdown;

export interface Form_dataportal_Digg_Form {
  __typename: "dataportal_Digg_Form";
  id: string;
  /**
   * A unique identifier
   */
  identifier: string;
  /**
   * The building blocks of the form
   */
  elements: Form_dataportal_Digg_Form_elements[];
}

export interface Form {
  dataportal_Digg_Form: Form_dataportal_Digg_Form;
}

export interface FormVariables {
  identifier: string;
  locale?: string | null;
}
