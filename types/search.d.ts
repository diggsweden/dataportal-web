//unfortunate hack to get a entrystore class instance, script is inserted in head
declare var ESJS: any;

//#region ES members

interface ESEntryField {
  value: string;
  type: ESType;
}

interface ESFacetFieldValue {
  name: string;
  count: number;
}

interface ESFacetField {
  name: string;
  predicate: string;
  type: ESType;
  valueCount: number;
  values: ESFacetFieldValue[];
}


interface HitSpecification {
  path?: string;
  titleResource?: string;
  descriptionResource?: string;
  pathResolver?: (hit: any) => string;
}

interface FacetSpecification {
  facets?: FacetSpecificationItem[];
}

interface FacetSpecificationItem {
  resource: string;
  indexOrder: number;
  type: ESType;
  related?: boolean;
  dcatProperty?: string;
  dcatType?: string;
  dcatFilterEnabled?: boolean;
}

interface SearchResult {
  hits?: SearchHit[];
  count?: number;
  pages?: number;
  facets?: { [facet: string]: SearchFacet };
  esFacets?: ESFacetField[];
  error?: string;
}

interface SearchHit {
  entryId?: string;
  title: string;
  url?: string;
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
  indexOrder: number;
}

interface SearchFacetValue {
  title?: string;
  resource: string;
  facet: string;
  facetType: ESType;
  count: number;
  facetValueString: string;
  related: Boolean;
}

interface SearchRequest {
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
