import type {
  Dataportal_ContainerState,
  ImageFragment,
  SeoDataFragment,
} from "@/graphql/gql/graphql";

export interface PublicationQueryOptions {
  state?: Dataportal_ContainerState;
  secret?: string;
  tags?: string[];
}

export interface PublicationListOptions {
  reuse?: boolean;
  seo?: SeoDataFragment;
  basePath?: string;
  heading?: string;
  preamble?: string;
  heroImage?: ImageFragment | null;
  breadcrumb?: string;
}
