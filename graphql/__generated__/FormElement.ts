/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FormElement
// ====================================================

export interface FormElement_dataportal_Digg_FormPageBreak {
  __typename: "dataportal_Digg_FormPageBreak";
  title: string;
}

export interface FormElement_dataportal_Digg_FormDescription {
  __typename: "dataportal_Digg_FormDescription";
  title: string;
  text: string;
}

export interface FormElement_dataportal_Digg_FormText {
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

export interface FormElement_dataportal_Digg_FormRadio_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface FormElement_dataportal_Digg_FormRadio {
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
  choices: FormElement_dataportal_Digg_FormRadio_choices[];
}

export interface FormElement_dataportal_Digg_FormCheckbox_choices {
  __typename: "dataportal_Digg_FormChoice";
  /**
   * Text corresponding to if the choice is active
   */
  popup: string | null;
  label: string;
}

export interface FormElement_dataportal_Digg_FormCheckbox {
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
  choices: FormElement_dataportal_Digg_FormCheckbox_choices[];
}

export interface FormElement_dataportal_Digg_FormDropdown {
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

export type FormElement = FormElement_dataportal_Digg_FormPageBreak | FormElement_dataportal_Digg_FormDescription | FormElement_dataportal_Digg_FormText | FormElement_dataportal_Digg_FormRadio | FormElement_dataportal_Digg_FormCheckbox | FormElement_dataportal_Digg_FormDropdown;
