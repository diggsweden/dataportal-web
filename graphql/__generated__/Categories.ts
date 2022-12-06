/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { dataportal_QueryCategoryArgs } from "./globalTypes";

// ====================================================
// GraphQL query operation: Categories
// ====================================================

export interface Categories_categories {
  __typename: "dataportal_Digg_Category";
  id: string;
  name: string;
  /**
   * A unique identifier for this category
   */
  slug: string;
  /**
   * Category belongs to this taxonomy
   */
  taxonomy: string | null;
  updatedAt: any;
  /**
   * two-letter lang
   */
  locale: string;
}

export interface Categories {
  categories: Categories_categories[];
}

export interface CategoriesVariables {
  filter?: dataportal_QueryCategoryArgs | null;
}
