/* eslint-disable no-unused-vars */
import { Entry, EntryStore } from "@entryscape/entrystore-js";

import { OrganisationData } from "./organisation";
import { SearchHit } from "./search";

// Core EntryStore Types
export enum ESType {
  unknown = "unknown",
  literal_s = "literal_s",
  literal = "literal",
  uri = "uri",
  wildcard = "wildcard",
}

export enum ESRdfType {
  dataset = "http://www.w3.org/ns/dcat#Dataset",
  spec_profile = "http://www.w3.org/ns/dx/prof/Profile",
  spec_standard = "http://purl.org/dc/terms/Standard",
  term = "http://www.w3.org/2004/02/skos/core#Concept",
  esterms_IndependentDataService = "esterms:IndependentDataService",
  esterms_ServedByDataService = "esterms:ServedByDataService",
  hvd = "http://data.europa.eu/eli/reg_impl/2023/138/oj",
  agent = "http://xmlns.com/foaf/0.1/Agent",
  national_data = "http://purl.org/dc/terms/subject",
  dataset_series = "http://www.w3.org/ns/dcat#DatasetSeries",
  spec = "http://purl.org/dc/terms/conformsTo",
}

export const checkBoxFilterConfigs: Record<
  string,
  { id: string; name: string }
> = {
  "http://data.europa.eu/r5r/applicableLegislation": {
    id: "hvd_only",
    name: "hvd",
  },
  "http://purl.org/dc/terms/conformsTo": {
    id: "spec_only",
    name: "Specification",
  },
  "http://purl.org/dc/terms/subject": {
    id: "national_only",
    name: "National data",
  },
};

// Facet Types
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

// Provider Types
export type PageType =
  | "dataset"
  | "dataset-series"
  | "dataservice"
  | "apiexplore"
  | "organisation"
  | "terminology"
  | "specification"
  | "concept"
  | "mqa";

export interface ContactInfo {
  name: string;
  email: string;
}

export interface RelatedTerm {
  title: string;
  url: string;
}

export interface DownloadFormat {
  title: string;
  url: string;
}

// Entry Types
export interface ESEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  env: any; // Replace with proper env type
  entrystore: EntryStore;
  entry: Entry;
  loading: boolean;
  title: string;
  description: string;
  publisher: string;
  termPublisher?: string;
  definition?: string;
  conformsTo?: string[];
  hasResource?: string[];
  address: string;
  context: string;
  esId: string;
  contact?: ContactInfo;
  relatedSpecifications?: RelatedTerm[];
  keywords?: string[];
  downloadFormats?: DownloadFormat[];
  mqaCatalog?: RelatedTerm | null;
  datasetsInSeries?: SearchHit[];
  organisationData?: OrganisationData;
  relatedTerm?: RelatedTerm;
  relatedDatasets?: RelatedTerm[];
  organisationLink?: string;
}
