/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: MenuData
// ====================================================

export interface MenuData_link {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface MenuData {
  __typename: "dataportal_Digg_MenuList";
  link: MenuData_link | null;
  order: number;
}
