/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL query operation: MainMenu
// ====================================================

export interface MainMenu_dataportal_v1_Digg_Menu_children_link {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface MainMenu_dataportal_v1_Digg_Menu_children_children_link {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface MainMenu_dataportal_v1_Digg_Menu_children_children_children_link {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface MainMenu_dataportal_v1_Digg_Menu_children_children_children {
  __typename: "dataportal_v1_Digg_MenuList";
  link: MainMenu_dataportal_v1_Digg_Menu_children_children_children_link | null;
  order: number;
}

export interface MainMenu_dataportal_v1_Digg_Menu_children_children {
  __typename: "dataportal_v1_Digg_MenuList";
  link: MainMenu_dataportal_v1_Digg_Menu_children_children_link | null;
  order: number;
  children: (MainMenu_dataportal_v1_Digg_Menu_children_children_children | null)[] | null;
}

export interface MainMenu_dataportal_v1_Digg_Menu_children {
  __typename: "dataportal_v1_Digg_MenuList";
  link: MainMenu_dataportal_v1_Digg_Menu_children_link | null;
  order: number;
  children: (MainMenu_dataportal_v1_Digg_Menu_children_children | null)[] | null;
}

export interface MainMenu_dataportal_v1_Digg_Menu {
  __typename: "dataportal_v1_Digg_MenuList";
  title: string | null;
  /**
   * Parameters that effects how the ui should be rendererd
   */
  uiHints: (string | null)[];
  /**
   * two-letter lang
   */
  locale: string;
  children: (MainMenu_dataportal_v1_Digg_Menu_children | null)[] | null;
}

export interface MainMenu {
  dataportal_v1_Digg_Menu: MainMenu_dataportal_v1_Digg_Menu | null;
}

export interface MainMenuVariables {
  locale?: string | null;
}
