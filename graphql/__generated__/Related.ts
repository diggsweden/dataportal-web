/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_QueryContainerArgs } from "./globalTypes";

// ====================================================
// GraphQL query operation: Related
// ====================================================

export interface Related_containers {
  __typename: "dataportal_Digg_Container";
  name: string;
  slug: string;
}

export interface Related {
  containers: (Related_containers | null)[];
}

export interface RelatedVariables {
  filter?: dataportal_QueryContainerArgs | null;
}
