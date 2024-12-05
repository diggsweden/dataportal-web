/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntryStore, EntryStoreUtil, Entry } from "@entryscape/entrystore-js";
// @ts-expect-error unknown namespace.
import { namespaces } from "@entryscape/rdfjson";
// @ts-expect-error unknown namespace.
import lucene from "lucene";
import { Translate } from "next-translate";

import { SearchSortOrder } from "@/providers/search-provider";
import {
  HitSpecification,
  FacetSpecification,
  SearchFacet,
  SearchFacetValue,
  SearchHit,
  SearchRequest,
  SearchResult,
} from "@/types/search";
import {
  DCATData,
  getEntryLang,
  resourcesSearch,
  listChoices,
  getTemplateChoices,
  getLocalizedChoiceLabel,
  getUriNames,
  Choice,
  getLocalizedValue,
  fetchDCATMeta,
} from "@/utilities";

import { entryCache } from "../local-cache";

//#region ES members

/* eslint-disable no-unused-vars */

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
}

/* eslint-enable no-unused-vars */

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

//#endregion

/**
 * Utility class for performing searches against an
 * EntryScape instance connected to EntryStore https://entrystore.org/
 */
export class Entryscape {
  entryscapeUrl: string;
  hitSpecifications: { [key: string]: HitSpecification };
  facetSpecification: FacetSpecification;
  lang: string;
  t: Translate;
  entryStore: EntryStore;
  entryStoreUtil: EntryStoreUtil;
  constructor(
    entryscapeUrl: string,
    lang: string,
    t: Translate,
    facetSpecification?: FacetSpecification,
    hitSpecifications?: { [key: string]: HitSpecification },
  ) {
    this.entryscapeUrl = entryscapeUrl;
    this.facetSpecification = facetSpecification || {};

    this.hitSpecifications = hitSpecifications || {
      dataset: {
        descriptionResource: "",
        path: "/datamangd/",
        titleResource: "",
      },
    };

    this.lang = lang || "sv";
    this.t = t;

    namespaces.add("esterms", "http://entryscape.com/terms/");

    // Initialize the EntryStore instance
    this.entryStore = new EntryStore(this.entryscapeUrl);
    this.entryStoreUtil = new EntryStoreUtil(this.entryStore);
    this.entryStoreUtil.loadOnlyPublicEntries(true);
  }

  /**
   * Get the EntryStore instance
   * @returns EntryStore instance
   */
  private getEntryStore(): EntryStore {
    return this.entryStore;
  }

  private getEntryStoreUtil(): EntryStoreUtil {
    return this.entryStoreUtil;
  }

  /**
   * Iterate metafacets from entrystore,
   * will fetch resources from entrystore for {ESFacetType} uri types -
   * For friendly facet names
   *
   * @param metaFacets
   */
  async getFacets(
    metaFacets: ESFacetField[],
    dcat: DCATData,
  ): Promise<{ [key: string]: SearchFacet }> {
    const facets: { [key: string]: SearchFacet } = {};

    for (const f of metaFacets) {
      // Find the corresponding facet specification
      const facetSpec = this.facetSpecification?.facets?.find(
        (spec) => spec.resource === f.predicate,
      );

      if (facetSpec) {
        facets[f.predicate] = {
          title: this.t(f.predicate),
          name: f.name,
          predicate: f.predicate,
          indexOrder: facetSpec.indexOrder,
          count: f.valueCount,
          show: 25,
          group: facetSpec.group,
          facetValues: f.values
            .filter((value: ESFacetFieldValue) => {
              if (!value.name || value.name.trim() === "") return false;
              if (!facetSpec?.dcatFilterEnabled) return true;

              const choices: Choice[] = getTemplateChoices(
                dcat,
                facetSpec.dcatProperty,
                facetSpec.dcatId,
              );
              return choices.some(
                (choice: Choice) => choice.value === value.name,
              );
            })
            .map((value: ESFacetFieldValue) => {
              let displayName = value.name;

              if (facetSpec?.dcatType === "choice") {
                const choices = getTemplateChoices(
                  dcat,
                  facetSpec.dcatProperty,
                  facetSpec.dcatId,
                );
                const choice = choices.find(
                  (c: Choice) => c.value === value.name,
                );
                if (choice) {
                  displayName = getLocalizedChoiceLabel(choice, this.lang);
                }
              } else {
                displayName = entryCache.getValue(value.name) || value.name;
              }

              return {
                count: value.count,
                facet: f.predicate,
                facetType: f.type,
                facetValueString: `${f.predicate}||${value.name}||${
                  facetSpec.related || false
                }||${f.type}||${this.t(f.predicate)}||${displayName}`,
                related: facetSpec.related || false,
                resource: value.name,
                title: displayName,
              };
            }),
        };
      }
    }
    return facets;
  }

  /**
   * Fetch resources from resourceURI,
   * will batch requests to EntryScape, so we dont override the browser URI lengths
   *
   * @param resources
   */
  async getResources(resources: string[]): Promise<any> {
    const result: any[] = [];
    const es = this.getEntryStore();
    const maxRequestUriLength = 1500;
    const requestPromises: Promise<any>[] = [];

    while (resources.length) {
      const resTmp = [];
      while (
        resTmp.join(" OR ").length < maxRequestUriLength &&
        resources.length > 0
      ) {
        resTmp.push(resources.splice(0, 1)[0]);
      }
      requestPromises.push(resourcesSearch(resTmp, es));
    }

    const responses = await Promise.all(requestPromises);
    responses.forEach((response) => {
      if (response && response.length > 0) {
        result.push(...response);
      }
    });

    return result;
  }

  /**
   * Get metadata values from EntryScape entry
   * @param es EntryScape entry
   * @param dcat DCAT metadata object
   */
  async getMetaValues(
    entry: Entry,
    path: string,
    dcat?: DCATData,
  ): Promise<{ [key: string]: string[] }> {
    const values: { [key: string]: string[] } = {};

    if (entry && path !== "/organisations/") {
      const metadata = entry.getAllMetadata();

      try {
        const publisherUri = getLocalizedValue(
          metadata,
          "dcterms:publisher",
          entry.getResourceURI(),
        );
        const publisherName = entryCache.getValue(publisherUri);

        values["organisation_literal"] = [publisherName || publisherUri];
      } catch (error) {
        console.error("Error fetching publisher value:", error);
      }

      const themeFacetSpec = this.facetSpecification?.facets?.find(
        (spec) => spec.resource === "http://www.w3.org/ns/dcat#theme",
      );

      if (
        themeFacetSpec &&
        themeFacetSpec.dcatFilterEnabled &&
        themeFacetSpec.dcatProperty
      ) {
        try {
          const whitelist = await listChoices("dcat:theme", dcat!);
          values["theme_literal"] = metadata
            .find(null, "http://www.w3.org/ns/dcat#theme")
            .map((f: any) => f.getValue())
            .filter((value: string) => whitelist.includes(value))
            .map((value: string) => this.t(value));
        } catch (error) {
          console.error("Error fetching themes:", error);
        }
      } else {
        values["theme_literal"] = metadata
          .find(null, "http://www.w3.org/ns/dcat#theme")
          .map((f: any) => this.t(f.getValue()));
      }

      // Similar approach for formats
      const formatFacetSpec = this.facetSpecification?.facets?.find(
        (spec) => spec.resource === "http://purl.org/dc/terms/format",
      );

      if (
        formatFacetSpec &&
        formatFacetSpec.dcatFilterEnabled &&
        formatFacetSpec.dcatProperty
      ) {
        try {
          const whitelist = await listChoices("dcterms:format", dcat!);
          values["format_literal"] = metadata
            .find(null, "http://purl.org/dc/terms/format")
            .map((f: any) => f.getValue())
            .filter((value: string) => whitelist.includes(value))
            .map((value: string) => this.t(value));
        } catch (error) {
          console.error("Error fetching formats:", error);
        }
      } else {
        values["format_literal"] = metadata
          .find(null, "http://purl.org/dc/terms/format")
          .map((f: any) => this.t(f.getValue()));
      }
      const inSchemeUris = metadata.findFirstValue(
        null,
        "http://www.w3.org/2004/02/skos/core#inScheme",
      );
      const inSchemeName = entryCache.getValue(inSchemeUris);

      values["inScheme_resource"] = [inSchemeName || ""];

      values["modified"] = metadata
        .find(null, "http://purl.org/dc/terms/modified")
        .map((f: any) => f.getValue());
    } else {
      const metadata = entry.getAllMetadata();

      try {
        const publisherTypeUri = metadata.findFirstValue(null, "dcterms:type");
        const dcatMeta = await fetchDCATMeta();

        if (dcatMeta) {
          const orgTypeChoices = getTemplateChoices(
            dcatMeta,
            "dcterms:type",
            "adms:publishertype",
          ).find((c: Choice) => c.value === publisherTypeUri);

          if (orgTypeChoices) {
            values["organisation_type"] = [
              getLocalizedChoiceLabel(orgTypeChoices, this.lang),
            ];
          }
        }
      } catch (error) {
        console.error("Error fetching organisation type:", error);
      }
    }

    return values;
  }

  /**
   * Constructs a lucene friendly query text value
   *
   * if lucene syntax is used incorrectly the query will be run without lucene special characters
   *
   * @param query RAW query input
   */
  luceneFriendlyQuery(query: string): string {
    if (query === "AND" || query === "NOT" || query === "OR") return "*";

    try {
      const ast = lucene.parse(query);
      let q = lucene.toString(ast);
      q = q.replace(/\\~ /g, "~");
      // eslint-disable-next-line no-useless-escape
      q = q.replace(/\+\-/g, "");
      // eslint-disable-next-line no-useless-escape
      q = q.replace(/ NOT \-/g, " NOT ");
      q = q.replace(/ AND NOT /g, "+NOT+");
      q = q.replace(/ OR NOT /g, "+NOT+");
      q = q.replace(/ OR /g, "+OR+");
      q = q.replace(/ AND /g, "+AND+");
      q = q.replace(/ NOT /g, "+-");
      if (q.indexOf('"') === -1) q = q.replace(/ /g, "+AND+");
      if (q.length === 0) q = "*";
      return q;
    } catch {
      // eslint-disable-next-line no-useless-escape
      return query.replace(/[\!\*\-\+\&\|\(\)\[\]\{\}\^\\~\?\:\"]/g, "").trim();
    }
  }

  /**
   * Query EntryScape backend from given request
   *
   * @param request
   *
   * @returns {Promise<SearchResult>}
   */
  async solrSearch(
    request: SearchRequest,
    dcat?: DCATData,
  ): Promise<SearchResult> {
    const hits: SearchHit[] = [];
    let query = this.luceneFriendlyQuery(request.query || "*");
    const lang = request.language || "sv";
    const es = this.getEntryStore();

    const esQuery = es.newSolrQuery();
    esQuery.publicRead(true);

    // Handle filters
    if (request.filters && request.filters.length > 0) {
      request.filters.forEach((filter) => {
        if (filter.property === "uri") {
          esQuery.uriProperty(filter.key, filter.values);
        }
      });
    }

    // Only set up facets if explicitly requested
    if (request.fetchFacets) {
      if (
        this.facetSpecification?.facets &&
        this.facetSpecification.facets.length > 0
      ) {
        this.facetSpecification.facets.forEach((fSpec) => {
          if (fSpec.type == ESType.literal || fSpec.type == ESType.literal_s) {
            esQuery.facetLimit(1000);
            esQuery.literalFacet(fSpec.resource, fSpec.related ? true : false);
          } else if (
            fSpec.type == ESType.uri ||
            fSpec.type == ESType.wildcard
          ) {
            esQuery.uriFacet(fSpec.resource, fSpec.related ? true : false);
          }
        });
      }
    }

    // Handle facet values
    if (request.facetValues && request.facetValues.length > 0) {
      const groupedFacets = Array.from(request.facetValues).reduce(
        (acc: { [facet: string]: SearchFacetValue[] }, obj) => {
          const key = obj.facet;
          if (!acc[key]) acc[key] = [];
          acc[key].push(obj);
          return acc;
        },
        {},
      );

      Object.entries(groupedFacets).forEach(([key, fvalue]) => {
        if (fvalue?.length > 0) {
          switch (fvalue[0].facetType) {
            case ESType.literal:
            case ESType.literal_s:
              esQuery.literalProperty(
                key,
                fvalue.map((f) => f.resource), // Changed from f.title to f.resource
                null,
                "string",
                fvalue[0].related,
              );
              break;
            case ESType.uri:
            case ESType.wildcard:
              // Special case for National basic data because all subjects might not be National basic data
              if (fvalue[0].facet === "http://purl.org/dc/terms/subject") {
                esQuery.uriProperty(
                  key,
                  "http://inspire.ec.europa.eu/metadata-codelist/TopicCategory/*",
                  null,
                  fvalue[0].related,
                );
                break;
              }

              esQuery.uriProperty(
                key,
                fvalue.map((f) => f.resource),
                null,
                fvalue[0].related,
              );
              break;
          }
        }
      });
    }

    // Handle sort order
    if (request.sortOrder) {
      switch (request.sortOrder) {
        case SearchSortOrder.modified_asc:
          esQuery.sort("modified+asc");
          break;
        case SearchSortOrder.modified_desc:
          esQuery.sort("metadata.predicate.literal_s.3e2f60da+desc");
          break;
        case SearchSortOrder.score_desc:
          esQuery.sort("score+desc");
          break;
      }
    }

    const searchList = esQuery
      .limit(request.take || 20)
      .rdfType(request.esRdfTypes || [ESRdfType.dataset])
      .publicRead(true)
      .list();

    query = this.luceneFriendlyQuery(query);

    // Set query text
    if (query) {
      esQuery.all(`${query}`);
    }

    try {
      const children = await searchList.getEntries(request.page || 0);
      let metaFacets;

      if (request.fetchFacets) {
        metaFacets = searchList.getFacets();
      }

      // Process facet values if they are not type choices
      if (metaFacets) {
        for (const fg of metaFacets) {
          const facetSpec = this.facetSpecification?.facets?.find(
            (spec) => spec.resource === fg.predicate,
          );

          if (facetSpec && facetSpec.dcatType !== "choice") {
            await getUriNames(
              fg.values
                .filter(
                  (v: SearchFacet) =>
                    v.name?.toLocaleLowerCase().startsWith("http"),
                )
                .map((v: SearchFacet) => v.name),
              this.getEntryStoreUtil(),
              facetSpec?.dcatProperty,
            );
          }
        }
      }

      // Process children sequentially to maintain order
      for (const child of children) {
        const metaData = child.getAllMetadata();
        const resourceURI = child.getResourceURI();
        const context = child.getContext();
        const rdfType = metaData.findFirstValue(
          child.getResourceURI(),
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        );

        let hitSpecification: HitSpecification = {
          descriptionResource: "blaa",
          path: "hmm",
          titleResource: "blaa",
        };

        hitSpecification = this.hitSpecifications[rdfType] || {
          titleResource: "dcterms:title",
          path: "/datasets/",
          descriptionResource: "dcterms:description",
        };

        const hit = {
          entryId: child.getId(),
          title: getLocalizedValue(
            metaData,
            hitSpecification.titleResource || "dcterms:title",
            resourceURI,
          ),
          description: getLocalizedValue(
            metaData,
            hitSpecification.descriptionResource || "dcterms:description",
            resourceURI,
          ),
          esEntry: child,
          metadata: await this.getMetaValues(
            child,
            hitSpecification.path || "",
            dcat,
          ),
          url: "",
          titleLang: getEntryLang(
            metaData,
            hitSpecification.titleResource || "dcterms:title",
            lang,
          ),
          descriptionLang: getEntryLang(
            metaData,
            hitSpecification.descriptionResource || "dcterms:description",
            lang,
          ),
        };

        hit.url = hitSpecification.pathResolver
          ? hitSpecification.pathResolver(child)
          : `${hitSpecification.path || "datamangd"}${context.getId()}_${
              hit.entryId
            }`;

        hits.push(hit);
      }

      return {
        hits,
        count: searchList.getSize(),
        facets: {},
        esFacets: metaFacets,
      };
    } catch (error) {
      console.error("Error in solrSearch:", error);
      throw error;
    }
  }
}
