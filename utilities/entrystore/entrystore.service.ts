/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EntryStore,
  EntryStoreUtil,
  Entry,
  Metadata,
} from "@entryscape/entrystore-js";
// @ts-expect-error no types.
import { namespaces } from "@entryscape/rdfjson";
import { Translate } from "next-translate";

import { SearchSortOrder } from "@/providers/search-provider";
import {
  ESType,
  ESRdfType,
  ESFacetFieldValue,
  ESFacetField,
  PageType,
  RelatedTerm,
} from "@/types/entrystore-core";
import {
  FacetSpecification,
  HitSpecification,
  SearchFacet,
  SearchFacetValue,
  SearchHit,
  SearchRequest,
  SearchResult,
} from "@/types/search";
import {
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

import { DCATData } from "../dcat-utils";
import {
  formatDatasetUrl,
  parseEmail,
  luceneFriendlyQuery,
} from "./entrystore-helpers";
import { entryCache } from "./local-cache";

interface EntryStoreConfig {
  baseUrl: string;
  lang: string;
  t: Translate;
  facetSpecification?: FacetSpecification;
  hitSpecifications?: { [key: string]: HitSpecification };
}

export class EntrystoreService {
  // ============================================================================
  // Class Setup and Configuration
  // ============================================================================
  private entryStore: EntryStore;
  private entryStoreUtil: EntryStoreUtil;
  private t: Translate;
  private lang: string;
  private _hitSpecifications: { [key: string]: HitSpecification } = {
    dataset: {
      descriptionResource: "",
      path: "/datamangd/",
      titleResource: "",
    },
  };
  private facetSpecification: FacetSpecification = {};

  private constructor(config: EntryStoreConfig) {
    this.entryStore = new EntryStore(config.baseUrl);
    this.entryStoreUtil = new EntryStoreUtil(this.entryStore);
    this.entryStoreUtil.loadOnlyPublicEntries(true);
    this.lang = config.lang;
    this.t = config.t;
    this.facetSpecification = config.facetSpecification || {};
    this._hitSpecifications = config.hitSpecifications || {};
    namespaces.add("esterms", "http://entryscape.com/terms/");
  }

  public static getInstance(config: EntryStoreConfig): EntrystoreService {
    return new EntrystoreService(config);
  }

  public getEntryStore(): EntryStore {
    return this.entryStore;
  }

  public getEntryStoreUtil(): EntryStoreUtil {
    return this.entryStoreUtil;
  }

  public get hitSpecifications(): { [key: string]: HitSpecification } {
    return this._hitSpecifications;
  }

  public set hitSpecifications(specs: { [key: string]: HitSpecification }) {
    this._hitSpecifications = specs;
  }

  // ============================================================================
  // Core Entry Operations
  // ============================================================================

  public async getEntry(contextId: string, entryId: string): Promise<Entry> {
    return this.entryStore.getEntry(
      this.entryStore.getEntryURI(contextId, entryId),
    );
  }

  public async getEntryByResourceURI(uri: string): Promise<Entry> {
    return this.entryStoreUtil.getEntryByResourceURI(uri);
  }

  // @ts-expect-error Not currently used
  private async getCachedEntry(uri: string): Promise<Entry | null> {
    const cached = entryCache.getValue(uri);
    if (cached) return JSON.parse(cached) as Entry;

    const entry = await this.entryStoreUtil.getEntryByResourceURI(uri);
    if (entry) entryCache.set(uri, JSON.stringify(entry));
    return entry;
  }

  public async loadEntriesByResourceURIs(
    uris: string[],
    context?: string | null,
    publicOnly = false,
  ): Promise<Entry[]> {
    const entries = await Promise.all(
      uris.map((uri) => this.entryStoreUtil.getEntryByResourceURI(uri)),
    );
    return publicOnly
      ? entries.filter((entry) => entry?.getEntryInfo().isPublic())
      : entries;
  }

  // ============================================================================
  // Search and Query Operations
  // ============================================================================

  public async solrSearch(
    request: SearchRequest,
    dcat?: DCATData,
  ): Promise<SearchResult> {
    const hits: SearchHit[] = [];
    let query = luceneFriendlyQuery(request.query || "*");
    const lang = request.language || "sv";

    const esQuery = this.entryStore.newSolrQuery();
    esQuery.publicRead(true);

    // Handle filters
    if (request.filters && request.filters.length > 0) {
      request.filters.forEach((filter) => {
        if (filter.property === "uri") {
          esQuery.uriProperty(filter.key, filter.values, "not");
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
                fvalue.map((f) => f.resource),
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

    query = luceneFriendlyQuery(query);

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
              this.entryStoreUtil,
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

        hitSpecification = this._hitSpecifications[rdfType] || {
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

        hit.url = `${hitSpecification.path || "datamangd"}${context.getId()}_${
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

  public async getResources(resources: string[]): Promise<any> {
    const result: any[] = [];
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
      requestPromises.push(resourcesSearch(resTmp, this.entryStore));
    }

    const responses = await Promise.all(requestPromises);
    responses.forEach((response) => {
      if (response && response.length > 0) {
        result.push(...response);
      }
    });

    return result;
  }

  // ============================================================================
  // Facet Operations
  // ============================================================================

  public async getFacets(
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

  public async processFacets(
    metaFacets: ESFacetField[],
    dcat: DCATData,
    facetSpecification?: FacetSpecification,
  ): Promise<{ [key: string]: SearchFacet }> {
    const facets: { [key: string]: SearchFacet } = {};

    for (const f of metaFacets) {
      const facetSpec = facetSpecification?.facets?.find(
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

  // ============================================================================
  // Metadata Operations
  // ============================================================================

  private async getMetaValues(
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

  public async getPublisherInfo(metadata: Metadata): Promise<string> {
    const publisherUri = metadata.findFirstValue(null, "dcterms:publisher");
    if (publisherUri) {
      try {
        const publisherEntry =
          await this.entryStoreUtil.getEntryByResourceURI(publisherUri);
        return publisherEntry
          ? getLocalizedValue(
              publisherEntry.getAllMetadata(),
              "foaf:name",
              publisherUri,
            )
          : "";
      } catch (error) {
        console.error("Failed to fetch publisher:", error);
        return "";
      }
    }
    return "";
  }

  public async getContactInfo(metadata: Metadata) {
    const contactPoint = metadata.findFirstValue(null, "dcat:contactPoint");
    if (!contactPoint) return { name: "", email: "" };

    const contactEntry =
      await this.entryStoreUtil.getEntryByResourceURI(contactPoint);
    const contactMetadata = contactEntry.getAllMetadata();

    return {
      name: getLocalizedValue(
        contactMetadata,
        "http://www.w3.org/2006/vcard/ns#fn",
      ),
      email: parseEmail(
        getLocalizedValue(
          contactMetadata,
          "http://www.w3.org/2006/vcard/ns#hasEmail",
        ),
      ),
    };
  }

  public async getKeywords(entry: Entry): Promise<string[]> {
    return entry
      .getAllMetadata()
      .find(null, "dcat:keyword")
      .map((k: { getValue: () => string }) => k.getValue());
  }

  // ============================================================================
  // Related Content Operations
  // ============================================================================

  public async getRelatedDatasets(entry: Entry) {
    const datasets = await this.entryStore
      .newSolrQuery()
      .rdfType(["dcat:Dataset", "esterms:IndependentDataService"])
      .publicRead(true)
      .uriProperty("dcterms:conformsTo", entry.getResourceURI())
      .getEntries();

    return datasets.map((ds: Entry) => ({
      title: getLocalizedValue(ds.getAllMetadata(), "dcterms:title"),
      url: `/${this.lang}/datasets/${this.entryStore.getContextId(
        ds.getEntryInfo().getMetadataURI(),
      )}_${ds.getId()}`,
    }));
  }

  public async getDatasetsInSeries(
    entry: Entry,
    resourceUri: string,
  ): Promise<SearchHit[] | null> {
    try {
      const datasetsInSeries = await this.entryStore
        .newSolrQuery()
        .rdfType(["dcat:Dataset", "esterms:IndependentDataService"])
        .uriProperty("dcat:inSeries", resourceUri)
        .publicRead(true)
        .getEntries();

      const dcat = await fetchDCATMeta();

      return await Promise.all(
        datasetsInSeries.map(async (e) => ({
          ...e,
          title: getLocalizedValue(e.getAllMetadata(), "dcterms:title"),
          description: getLocalizedValue(
            e.getAllMetadata(),
            "dcterms:description",
          ),
          metadata: await this.getMetaValues(e, "/dataset-series", dcat),
          modified: e.getEntryInfo().getModificationDate(),
          url: formatDatasetUrl(
            e,
            this.lang,
            this.entryStore.getContextId(e.getEntryInfo().getMetadataURI()),
          ),
        })),
      );
    } catch (error) {
      console.error("Failed to fetch dataset series:", error);
      return null;
    }
  }

  public async getRelatedSpecifications(
    entry: Entry,
    metadata: Metadata,
    pageType: PageType,
    hasResourceUri?: string,
  ) {
    try {
      if (pageType === "dataset") {
        const specifications = metadata
          .find(entry.getResourceURI(), "dcterms:conformsTo")
          .map((stmt: { getValue: () => string }) => stmt.getValue());

        const resourceEntries =
          await this.entryStoreUtil.loadEntriesByResourceURIs(
            specifications,
            null,
            true,
          );

        return resourceEntries
          .filter((e: Entry) => e)
          .map((e: Entry) => ({
            title: getLocalizedValue(e.getAllMetadata(), "dcterms:title"),
            url: `/${this.lang}/specifications/${e
              .getContext()
              .getId()}_${e.getId()}`,
          }));
      } else if (pageType === "terminology") {
        const specifications = await this.entryStore
          .newSolrQuery()
          .uriProperty(
            "http://www.w3.org/ns/dx/prof/hasResource",
            hasResourceUri || entry.getResourceURI(),
          )
          .rdfType(["dcterms:Standard", "prof:Profile"])
          .publicRead(true)
          .getEntries();

        return specifications
          .filter((e: Entry) => e)
          .map((e: Entry) => ({
            title: getLocalizedValue(e.getAllMetadata(), "dcterms:title"),
            url: `/${this.lang}/specifications/${e
              .getContext()
              .getId()}_${e.getId()}`,
          }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching specifications:", error);
      return [];
    }
  }

  public async getRelatedMQA(entry: Entry) {
    try {
      const mqa = this.entryStore.getEntryURI(
        entry.getContext().getId(),
        "_quality",
      );
      const mqaEntry = await this.entryStore.getEntry(mqa);
      const mqaMetadata = mqaEntry.getAllMetadata();

      return {
        title: getLocalizedValue(mqaMetadata, "dcterms:title"),
        url: `/metadatakvalitet/katalog/_quality/${entry.getContext().getId()}`,
      };
    } catch {
      return null;
    }
  }

  async getRelatedTerm(metadata: Metadata): Promise<RelatedTerm> {
    const termUri = metadata.findFirstValue(null, "skos:inScheme");
    const termEntry = await this.getEntryByResourceURI(termUri);

    return {
      title: getLocalizedValue(termEntry.getAllMetadata(), "dcterms:title"),
      url: `/${this.lang}/terminology/${termEntry
        .getContext()
        .getId()}_${termEntry.getId()}`,
    };
  }

  // ============================================================================
  // Download and Format Operations
  // ============================================================================

  public getDownloadFormats(baseUri: string) {
    return [
      {
        title: this.t("pages|datasetpage$download-metadata-as") + " RDF/XML",
        url: baseUri,
      },
      {
        title: this.t("pages|datasetpage$download-metadata-as") + " TURTLE",
        url: baseUri + "?format=text/turtle",
      },
      {
        title: this.t("pages|datasetpage$download-metadata-as") + " N-TRIPLES",
        url: baseUri + "?format=text/n-triples",
      },
      {
        title: this.t("pages|datasetpage$download-metadata-as") + " JSON-LD",
        url: baseUri + "?format=application/ld+json",
      },
    ];
  }
}
