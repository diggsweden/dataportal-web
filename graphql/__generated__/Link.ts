/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: Link
// ====================================================

export interface Link {
  __typename: "dataportal_v1_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}
