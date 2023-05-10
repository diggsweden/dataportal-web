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
export enum dataportal_v1_ContainerState {
  live = "live",
  preview = "preview",
}

export enum dataportal_LinkType {
  DOCUMENT = "DOCUMENT",
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL",
}

export interface dataportal_v1_QueryContainerArgs {
  limit?: number | null;
  id?: number | null;
  slug?: string | null;
  locale?: string | null;
  previewSecret?: string | null;
  state?: dataportal_v1_ContainerState | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
