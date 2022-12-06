import { BlockData } from '../graphql/__generated__/BlockData';
import { SeoData } from '../graphql/__generated__/SeoData';
import {
  DomainAggregateResponse,
  MultiContainerResponse,
  PublicationListResponse,
  PublicationResponse,
  RootAggregateResponse,
} from './queryHelpers';

export type DataportalPageProps =
  | MultiContainerResponse
  | PublicationListResponse
  | PublicationResponse
  | DomainAggregateResponse
  | RootAggregateResponse;

type ResolvedPage = {
  blocks?: BlockData[];
  seo?: SeoData | null;
};

/**
 * Resolves different types of api responses into the same format
 *
 * @param {DataportalPageProps} props
 * @returns {ResolvedPage}
 */
export const resolvePage = (props: DataportalPageProps): ResolvedPage => {
  switch (props.type) {
    case 'RootAggregate':
      return { blocks: props.blocks, seo: props.seo };
    case 'DomainAggregate':
      return { blocks: props.blocks, seo: props.seo };
    case 'MultiContainer':
      return { blocks: props.container?.blocks, seo: props.container?.seo };
    case 'Publication':
      return { blocks: props.blocks, seo: props.seo };
    case 'PublicationList':
      return {};
    default:
      return {};
  }
};

export const populateSeo: SeoData = {
  __typename: 'dataportal_Digg_SEO',
  lang: 'sv',
  title: '',
  description: '',
  image: null,
  robotsFollow: true,
  robotsIndex: true,
};
