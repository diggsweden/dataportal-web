/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * The publicationstate of a container, either preview or live
 */
export enum dataportal_ContainerState {
  live = "live",
  preview = "preview",
}

export enum dataportal_LinkType {
  DOCUMENT = "DOCUMENT",
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL",
}

export interface dataportal_QueryCategoryArgs {
  limit?: number | null;
  locale?: string | null;
  slug?: string | null;
  taxonomy?: string | null;
}

export interface dataportal_QueryContainerArgs {
  limit?: number | null;
  id?: number | null;
  slug?: string | null;
  locale?: string | null;
  previewSecret?: string | null;
  state?: dataportal_ContainerState | null;
  domains?: string[] | null;
  categories?: string[] | null;
  tags?: string[] | null;
}

export interface dataportal_QueryDomainArgs {
  limit?: number | null;
  locale?: string | null;
  slug?: string | null;
}

export interface dataportal_QuerySearchArgs {
  limit?: number | null;
  offset?: number | null;
  query?: string | null;
  locale?: string | null;
  getHighlights?: boolean | null;
  highlightsLength?: number | null;
  highlightPreText?: string | null;
  highlightPostText?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
