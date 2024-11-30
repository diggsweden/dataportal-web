import { SearchSortOrder } from "@/providers/search-provider";
import { ESRdfType, ESType } from "@/utilities/entryscape/entryscape";

//unfortunate hack to get a entrystore class instance, script is inserted in head
// eslint-disable-next-line no-unused-vars
declare var ESJS: any;

//#region ES members

export interface ESEntryField {
  value: string;
  type: ESType;
}

export interface ESFacetFieldValue {
  name: string;
  count: number;
}

export interface ESFacetField {
  name: string;
  predicate: string;
  type: ESType;
  valueCount: number;
  values: ESFacetFieldValue[];
}

export interface HitSpecification {
  path?: string;
  titleResource?: string;
  descriptionResource?: string;
  // eslint-disable-next-line no-unused-vars
  pathResolver?: (hit: any) => string;
}

export interface FacetSpecification {
  facets?: FacetSpecificationItem[];
}

export interface FacetSpecificationItem {
  group: string;
  resource: string;
  indexOrder: number;
  type: ESType;
  related?: boolean;
  dcatProperty: string;
  dcatId?: string;
  dcatType?: string;
  dcatFilterEnabled?: boolean;
}

export interface SearchResult {
  hits?: SearchHit[];
  count?: number;
  pages?: number;
  facets?: { [facet: string]: SearchFacet };
  esFacets?: ESFacetField[];
  error?: string;
}

export interface SearchHit {
  entryId?: string;
  title: string;
  url: string;
  description?: string;
  info?: { [facet: string]: string[] };
  metadata?: { [facet: string]: string[] };
  esEntry?: any;
  titleLang?: string;
  descriptionLang?: string;
}

interface SearchFacet {
  name?: string;
  title: string;
  predicate: string;
  show: number;
  facetValues: SearchFacetValue[];
  lastFetched?: number;
  count: number;
  group: string;
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
