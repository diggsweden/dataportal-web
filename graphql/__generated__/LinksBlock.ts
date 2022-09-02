/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_LinkType } from "./globalTypes";

// ====================================================
// GraphQL fragment: LinksBlock
// ====================================================

export interface LinksBlock_links {
  __typename: "dataportal_Digg_Link";
  title: string | null;
  link: string;
  linktype: dataportal_LinkType;
  description: string | null;
}

export interface LinksBlock {
  __typename: "dataportal_Digg_LinksBlock";
  links: LinksBlock_links[] | null;
}
