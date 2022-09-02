/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Footer
// ====================================================

export interface Footer_dataportal_Digg_Footer_logo {
  __typename: "dataportal_Digg_Image";
  url: string;
  alt: string | null;
  name: string | null;
  description: string | null;
  mime: string;
  ext: string;
}

export interface Footer_dataportal_Digg_Footer_columns_text {
  __typename: "dataportal_Digg_RichText";
  markdown: string | null;
}

export interface Footer_dataportal_Digg_Footer_columns {
  __typename: "dataportal_Digg_Column";
  title: string | null;
  text: Footer_dataportal_Digg_Footer_columns_text;
}

export interface Footer_dataportal_Digg_Footer {
  __typename: "dataportal_Digg_Footer";
  logo: Footer_dataportal_Digg_Footer_logo | null;
  columns: (Footer_dataportal_Digg_Footer_columns | null)[];
}

export interface Footer {
  dataportal_Digg_Footer: Footer_dataportal_Digg_Footer | null;
}

export interface FooterVariables {
  locale?: string | null;
}
