import {ESFacetField, ESType, ESRdfType} from './EntryScape'

export enum SearchSortOrder {
  score_asc = 1,
  score_desc = 2,
  modified_asc = 4,
  modified_desc = 8
}

export interface HitSpecification
{
  path?: string;
  titleResource?: string;
  descriptionResource?: string;
}

export interface FacetSpecification
{
  facets?: FacetSpecificationItem[];
}

export interface FacetSpecificationItem
{
  resource: string;
  type:ESType;  
}

export interface SearchResult {
  hits?: SearchHit[];
  count?: number;  
  pages?: number;  
  facets?: { [facet: string]: SearchFacet; };
  esFacets?: ESFacetField[]
}

export interface SearchHit {
  entryId: string;
  title: string;
  url?: string;
  description?: string,
  info?: { [facet: string]: string[]; },
  metadata?: { [facet: string]: string[]; },
  esEntry: any
}

export interface SearchFacet {
  name?: string,    
  title: string,
  predicate: string,
  show: number,
  facetValues: SearchFacetValue[]
  lastFetched?:number;
}

export interface SearchFacetValue {  
  title?: string;    
  resource: string;  
  facet: string;  
  facetType: ESType;  
  count: number;
  facetValueString: string;
  related: Boolean;
}

export interface SearchRequest {
  query?: string;  
  language?: string;  
  take?: number;
  page?: number;  
  facetValues?: SearchFacetValue[];
  fetchFacets?: boolean;
  takeFacets?: number;
  esRdfTypes?: ESRdfType[];
  sortOrder?: SearchSortOrder;
}