/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Settings
// ====================================================

export interface Settings_dataportal_v1_Digg_Settings_items {
  __typename: "dataportal_v1_Digg_KeyVal";
  key: string;
  value: string;
}

export interface Settings_dataportal_v1_Digg_Settings {
  __typename: "dataportal_v1_Digg_SettingsList";
  items: (Settings_dataportal_v1_Digg_Settings_items | null)[] | null;
}

export interface Settings {
  dataportal_v1_Digg_Settings: Settings_dataportal_v1_Digg_Settings | null;
}

export interface SettingsVariables {
  locale?: string | null;
}
