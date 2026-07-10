import type { EnvSettings } from "@/env";
import { ESRdfType, ESType } from "@/lib/entrystore/entrystore-core";
import {
  classPathResolver,
  conceptsPathResolver,
  propertyPathResolver,
  specsPathResolver,
} from "@/lib/entrystore/entrystore-helpers";
import { SearchSortOrder } from "@/providers/search-provider";

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
  showInSearchResult?: boolean;
  customFilter?: string; // Special case for special filters with checkbox
  customSearch?: ESRdfType[]; // Special case for special filters with search
  customLabel?: string; // Overrides the facet key used for its display label
}

interface HitSpecification {
  path: string;
  titleResource: string;
  descriptionResource: string;
  badge?: string; // Translation key for the hit's type badge
  parentLabel?: string; // Translation key for the parent-container label
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
    // Values to exclude or include from search
    filters?: {
      exclude?: {
        key: string;
        property: ESType;
        values: string[];
      }[];
      include?: {
        key: string;
        property: ESType;
      }[];
    };
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
        "http://www.w3.org/ns/dcat#DatasetSeries": {
          path: "/dataset-series/",
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
            dcatId: "dcat:dcterms:accrualPeriodicity",
            type: ESType.uri,
            dcatProperty: "dcterms:accrualPeriodicity",
            dcatType: "choice",
            dcatFilterEnabled: true,
            indexOrder: 4,
            group: "distribution",
          },
          {
            resource: "http://data.europa.eu/r5r/hvdCategory",
            type: ESType.uri,
            dcatProperty: "dcatap:hvdCategory",
            dcatFilterEnabled: false,
            indexOrder: 6,
            group: "type",
            customProperties: [
              "http://data.europa.eu/bna/c_ac64a52d",
              "http://data.europa.eu/bna/c_dd313021",
              "http://data.europa.eu/bna/c_164e0bf5",
              "http://data.europa.eu/bna/c_e1da4e07",
              "http://data.europa.eu/bna/c_a9135398",
              "http://data.europa.eu/bna/c_b79e35eb",
            ],
            showInSearchResult: true,
          },
          {
            resource: "http://purl.org/dc/terms/subject",
            type: ESType.uri,
            dcatProperty: "dcterms:subject",
            indexOrder: 7,
            group: "type",
            showInSearchResult: true,
            customFilter:
              "http://inspire.ec.europa.eu/metadata-codelist/TopicCategory/*",
          },
          {
            resource: "http://purl.org/dc/terms/conformsTo",
            type: ESType.uri,
            dcatProperty: "dcterms:conformsTo",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 8,
            group: "type",
            customFilter: "*",
          },
          {
            resource: "http://www.w3.org/ns/dcat#DataService",
            type: ESType.uri,
            dcatProperty: "dcat:DataService",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 8,
            group: "distribution",
            customSearch: [
              ESRdfType.data_service,
              ESRdfType.served_by_data_service,
            ],
          },
          {
            resource: "http://www.w3.org/ns/dcat#DatasetSeries",
            type: ESType.uri,
            dcatProperty: "dcat:DatasetSeries",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 9,
            group: "distribution",
            customSearch: [ESRdfType.dataset_series],
          },
          {
            resource: "http://purl.org/dc/terms/accessRights",
            type: ESType.uri,
            dcatProperty: "dcterms:accessRights",
            indexOrder: 10,
            group: "access",
            customLabel: "http://purl.org/dc/terms/accessRights:PUBLIC",
            customFilter:
              "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
          },
          {
            resource: "http://purl.org/dc/terms/accessRights",
            type: ESType.uri,
            dcatProperty: "dcterms:accessRights",
            indexOrder: 11,
            dcatType: "choice",
            group: "access",
            customLabel: "http://purl.org/dc/terms/accessRights",
            customProperties: [
              "http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC",
              "http://publications.europa.eu/resource/authority/access-right/RESTRICTED",
            ],
          },
        ],
      },
      initRequest: {
        esRdfTypes: [
          ESRdfType.dataset,
          ESRdfType.data_service,
          ESRdfType.dataset_series,
        ],
        filters: {
          exclude: [
            {
              key: "dcat:inSeries",
              property: "uri",
              values: ["*"],
            },
          ],
        },
        takeFacets: 30,
        language: lang,
        sortOrder: SearchSortOrder.score_desc,
      },
    },
    "datasets-series": {
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
            resource: "http://purl.org/dc/terms/publisher",
            dcatProperty: "dcterms:publisher",
            type: ESType.uri,
            indexOrder: 1,
            group: "default",
          },
        ],
      },
      initRequest: {
        esRdfTypes: [ESRdfType.dataset, ESRdfType.data_service],
        language: lang,
        takeFacets: 30,
        sortOrder: SearchSortOrder.modified_desc,
        filters: {
          include: [
            {
              key: "dcat:inSeries",
              property: "uri",
            },
          ],
        },
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
          pathResolver: specsPathResolver,
        },
        "http://purl.org/dc/terms/Standard": {
          path: `/specifications/`,
          titleResource: "dcterms:title",
          descriptionResource: "dcterms:description",
          pathResolver: specsPathResolver,
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
            group: "default",
          },
          {
            resource: "https://www.w3.org/ns/org#classification",
            dcatProperty: "org:classification",
            type: ESType.uri,
            indexOrder: 2,
            group: "default",
            customFilter:
              "https://dataportal.se/concepts/orgAspects/feeFinanzing",
          },
        ],
      },
      initRequest: {
        esRdfTypes: [ESRdfType.organisation],
        language: lang,
        takeFacets: 30,
        filters: {
          exclude: [
            {
              key: "dcterms:type",
              property: "uri",
              values: [
                "http://purl.org/adms/publishertype/PrivateIndividual(s)",
              ],
            },
          ],
        },
      },
    },
    "data-structures": {
      entryscapeUrl: env.ENTRYSCAPE_TERMS_PATH
        ? `https://${env.ENTRYSCAPE_TERMS_PATH}/store`
        : "https://editera.dataportal.se/store",
      hitSpecifications: {
        "http://www.w3.org/2004/02/skos/core#Concept": {
          path: `/concepts/`,
          titleResource: "http://www.w3.org/2004/02/skos/core#prefLabel",
          descriptionResource: "http://www.w3.org/2004/02/skos/core#definition",
          pathResolver: conceptsPathResolver,
          badge: "pages.data-structures.types.concept",
          parentLabel: "pages.data-structures.terminology",
        },
        "http://www.w3.org/2000/01/rdf-schema#Class": {
          path: `/class/`,
          titleResource: "http://www.w3.org/2000/01/rdf-schema#label",
          descriptionResource: "http://www.w3.org/2000/01/rdf-schema#comment",
          pathResolver: classPathResolver,
          badge: "pages.data-structures.types.class",
          parentLabel: "pages.data-structures.data-vocabulary",
        },
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property": {
          path: `/property/`,
          titleResource: "http://www.w3.org/2000/01/rdf-schema#label",
          descriptionResource: "http://www.w3.org/2000/01/rdf-schema#comment",
          pathResolver: propertyPathResolver,
          badge: "pages.data-structures.types.property",
          parentLabel: "pages.data-structures.data-vocabulary",
        },
      },
      facetSpecification: {
        facets: [
          {
            resource: "http://www.w3.org/2004/02/skos/core#inScheme",
            type: ESType.uri,
            dcatProperty: "dcterms:type",
            indexOrder: 1,
            group: "concept",
          },
          {
            resource: ESRdfType.term,
            type: ESType.wildcard,
            dcatProperty: "rdf:type",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 2,
            group: "concept",
            customSearch: [ESRdfType.term],
            customLabel: "http://dataportal.se/filter/only-concepts",
          },
          {
            resource: "http://www.w3.org/2000/01/rdf-schema#isDefinedBy",
            type: ESType.uri,
            dcatProperty: "dcterms:type",
            indexOrder: 3,
            group: "class-property",
          },
          {
            resource: ESRdfType.term_class,
            type: ESType.wildcard,
            dcatProperty: "rdf:type",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 4,
            group: "class-property",
            customSearch: [ESRdfType.term_class],
            customLabel: "http://dataportal.se/filter/only-classes",
          },
          {
            resource: ESRdfType.term_property,
            type: ESType.wildcard,
            dcatProperty: "rdf:type",
            dcatType: "choice",
            dcatFilterEnabled: false,
            indexOrder: 5,
            group: "class-property",
            customSearch: [ESRdfType.term_property],
            customLabel: "http://dataportal.se/filter/only-properties",
          },
        ],
      },
      initRequest: {
        esRdfTypes: [
          ESRdfType.term,
          ESRdfType.term_class,
          ESRdfType.term_property,
        ],
        language: lang,
        takeFacets: 30,
      },
    },
  } as Record<string, SearchProviderConfig>;
}
