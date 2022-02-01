import {ESFacetField, ESType, ESRdfType} from './EntryScape'

export enum SearchSortOrder {  
  score_desc = 2,
  modified_asc = 4,
  modified_desc = 8
}

export interface HitSpecification
{
  path?: string;
  titleResource?: string;
  descriptionResource?: string;
  pathResolver?: (hit:any) => string
}

export interface FacetSpecification
{
  facets?: FacetSpecificationItem[];
}

export interface FacetSpecificationItem
{
  resource: string;
  indexOrder: number;
  type:ESType;  
  related?: boolean;
  dcatProperty?: string;
  dcatType?: string;
  dcatFilterEnabled?: boolean;
}

export interface SearchResult {
  hits?: SearchHit[];
  count?: number;  
  pages?: number;  
  facets?: { [facet: string]: SearchFacet; };
  esFacets?: ESFacetField[];
  error? : string;
}

export interface SearchHit {
  entryId: string;
  title: string;
  url?: string;
  description?: string,
  info?: { [facet: string]: string[]; },
  metadata?: { [facet: string]: string[]; },
  esEntry: any,
  titleLang?: string; 
  descriptionLang?: string;
}

export interface SearchFacet {
  name?: string,    
  title: string,  
  predicate: string,
  show: number,
  facetValues: SearchFacetValue[]
  lastFetched?:number;
  count: number;
  indexOrder: number;
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
  titleQuery?: string;
  language?: string;  
  take?: number;
  page?: number;  
  facetValues?: SearchFacetValue[];
  fetchFacets?: boolean;
  takeFacets?: number;
  esRdfTypes?: ESRdfType[];
  sortOrder?: SearchSortOrder;
  compact?: Boolean;
}