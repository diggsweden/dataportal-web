import { EnvSettings } from "@/env";
import { SearchSortOrder } from "@/providers/search-provider";
import { ESRdfType, ESType } from "@/utilities/entryscape/entryscape";

interface FacetConfig {
  resource: string;
  type: ESType;
  dcatProperty: string;
  indexOrder: number;
  group: string;
  dcatType?: string;
  dcatFilterEnabled?: boolean;
  dcatId?: string;
  related?: boolean;
  maschineName?: string;
}

interface HitSpecification {
  path: string;
  titleResource: string;
  descriptionResource: string;
}

interface SearchProviderConfig {
  entryscapeUrl: string;
  hitSpecifications: Record<string, HitSpecification>;
  facetSpecification: {
    facets: FacetConfig[];
  };
  initRequest: {
    esRdfTypes: ESRdfType[];
    language: string;
    takeFacets: number;
    sortOrder?: SearchSortOrder;
    // Values to exclude from search
    filters?: {
      key: string;
      property: ESType;
      values: string[];
    }[];
  };
}

export function createSearchProviderSettings(env: EnvSettings, lang: string) {
  return {
    datasets: {
      entryscapeUrl: env.ENTRYSCAPE_DATASETS_PATH
        ? `https://${env.ENTRYSCAPE_DATASETS_PATH}/store`
        : "https://admin.dataportal.se/store",
      hitSpecifications: {
        "http://www.w3.org/ns/dcat#Dataset": {
          path: `/datasets/`,
          titleResource: "dcterms:title",
          descriptionResource: "dcterms:description",
        },
        "http://www.w3.org/ns/dcat#DataService": {
          path: `/dataservice/`,
          titleResource: "dcterms:title",
          descriptionResource: "dcterms:description",
        },
      },
      facetSpecification: {
        facets: [
          {
            resource: "http://purl.org/dc/terms/license",
            type: ESType.uri,
            dcatProperty: "dcterms:license",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 5,
            group: "access",
          },
          {
            resource: "http://www.w3.org/ns/dcat#theme",
            type: ESType.uri,
            dcatProperty: "dcat:theme",
            dcatType: "choice",
            dcatFilterEnabled: true,
            indexOrder: 0,
            group: "type",
          },
          {
            resource: "http://purl.org/dc/terms/type",
            dcatProperty: "dcterms:type",
            dcatId: "adms:publishertype",
            type: ESType.uri,
            related: true,
            dcatType: "choice",
            indexOrder: 1,
            maschineName: "publishertype",
            group: "actor",
          },
          {
            resource: "http://purl.org/dc/terms/publisher",
            dcatProperty: "dcterms:publisher",
            type: ESType.uri,
            indexOrder: 2,
            group: "actor",
          },
          {
            resource: "http://purl.org/dc/terms/format",
            type: ESType.literal,
            dcatProperty: "dcterms:format",
            dcatType: "choice",
            dcatFilterEnabled: true,
            indexOrder: 3,
            group: "distribution",
          },
          {
            resource: "http://purl.org/dc/terms/accrualPeriodicity",
            dcatId: "dcat:dcterms:accrualPeriodicity_da",
            type: ESType.uri,
            dcatProperty: "dcterms:accrualPeriodicity",
            dcatType: "choice",
            dcatFilterEnabled: true,
            indexOrder: 4,
            group: "distribution",
          },
          {
            resource: "http://data.europa.eu/r5r/applicableLegislation",
            type: ESType.uri,
            dcatProperty: "dcatap:applicableLegislation",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 6,
            group: "type",
          },
          {
            resource: "http://purl.org/dc/terms/subject",
            type: ESType.uri,
            dcatProperty: "dcterms:subject",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 7,
            group: "type",
          },
          {
            resource: "http://purl.org/dc/terms/conformsTo",
            type: ESType.uri,
            dcatProperty: "dcterms:conformsTo",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 8,
            group: "type",
          },
        ],
      },
      initRequest: {
        esRdfTypes: [
          ESRdfType.dataset,
          ESRdfType.esterms_IndependentDataService,
          ESRdfType.esterms_ServedByDataService,
        ],
        takeFacets: 30,
        language: lang,
        sortOrder: SearchSortOrder.score_desc,
      },
    },
    specifications: {
      entryscapeUrl: env.ENTRYSCAPE_SPECS_PATH
        ? `https://${env.ENTRYSCAPE_SPECS_PATH}/store`
        : "https://editera.dataportal.se/store",
      hitSpecifications: {
        "http://www.w3.org/ns/dx/prof/Profile": {
          path: `/specifications/`,
          titleResource: "dcterms:title",
          descriptionResource: "dcterms:description",
        },
        "http://purl.org/dc/terms/Standard": {
          path: `/specifications/`,
          titleResource: "dcterms:title",
          descriptionResource: "dcterms:description",
        },
      },
      facetSpecification: {
        facets: [
          {
            resource: "http://www.w3.org/ns/dcat#theme",
            type: ESType.uri,
            dcatProperty: "dcat:theme",
            dcatType: "choice",
            dcatFilterEnabled: true,
            indexOrder: 0,
            group: "type",
          },
          {
            resource: "http://purl.org/dc/terms/publisher",
            dcatProperty: "dcterms:publisher",
            type: ESType.uri,
            indexOrder: 1,
            group: "actor",
          },
        ],
      },
      initRequest: {
        esRdfTypes: [ESRdfType.spec_standard, ESRdfType.spec_profile],
        language: lang,
        takeFacets: 30,
      },
    },
    organisations: {
      entryscapeUrl: env.ENTRYSCAPE_DATASETS_PATH
        ? `https://${env.ENTRYSCAPE_DATASETS_PATH}/store`
        : "https://admin.dataportal.se/store",
      hitSpecifications: {
        "http://xmlns.com/foaf/0.1/Agent": {
          path: `/organisations/`,
          titleResource: "foaf:name",
          descriptionResource: "dcterms:description",
        },
      },
      facetSpecification: {
        facets: [
          {
            resource: "http://purl.org/dc/terms/type",
            dcatProperty: "dcterms:type",
            dcatId: "adms:publishertype",
            type: ESType.uri,
            dcatType: "choice",
            indexOrder: 1,
            maschineName: "publishertype",
            group: "default",
          },
        ],
      },
      initRequest: {
        esRdfTypes: [ESRdfType.agent],
        language: lang,
        takeFacets: 30,
        filters: [
          {
            key: "dcterms:type",
            property: "uri",
            values: ["http://purl.org/adms/publishertype/PrivateIndividual(s)"],
          },
        ],
      },
    },
    concepts: {
      entryscapeUrl: env.ENTRYSCAPE_TERMS_PATH
        ? `https://${env.ENTRYSCAPE_TERMS_PATH}/store`
        : "https://editera.dataportal.se/store",
      hitSpecifications: {
        "http://www.w3.org/2004/02/skos/core#Concept": {
          path: `/concepts/`,
          titleResource: "http://www.w3.org/2004/02/skos/core#prefLabel",
          descriptionResource: "http://www.w3.org/2004/02/skos/core#definition",
        },
      },
      facetSpecification: {
        facets: [
          {
            resource: "http://www.w3.org/2004/02/skos/core#inScheme",
            type: ESType.uri,
            dcatProperty: "dcterms:type",
            indexOrder: 0,
            group: "default",
          },
        ],
      },
      initRequest: {
        esRdfTypes: [ESRdfType.term],
        language: lang,
        takeFacets: 30,
      },
    },
  } as Record<string, SearchProviderConfig>;
}
