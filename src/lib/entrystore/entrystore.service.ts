import {
  type Entry,
  EntryStore,
  EntryStoreUtil,
  type Metadata,
} from "@entryscape/entrystore-js";
// @ts-expect-error no types.
import { namespaces } from "@entryscape/rdfjson";
import type { EnvSettings } from "@/env";
import type { ResourceLabel, Translate } from "@/i18n/types";
import {
  type EntryStoreName,
  type ESFacetField,
  type ESFacetFieldValue,
  ESRdfType,
  ESType,
  type LabelLink,
  type PageType,
} from "@/lib/entrystore/entrystore-core";
import { SearchSortOrder } from "@/providers/search-provider";
import type {
  FacetSpecification,
  HitSpecification,
  SearchFacet,
  SearchFacetValue,
  SearchHit,
  SearchRequest,
  SearchResult,
} from "@/types/search";
import {
  type Choice,
  fetchDCATMeta,
  getEntryLang,
  getLocalizedChoiceLabel,
  getLocalizedValue,
  getTemplateChoices,
  getUriNames,
  includeLangInPath,
  listChoices,
  resourcesSearch,
} from "@/utilities";
import type { DCATData } from "@/utilities/dcat-utils";
import {
  entryStoreBaseUrl,
  parseEmail,
  specsPathResolver,
  termsPathResolver,
} from "./entrystore-helpers";
import { entryCache } from "./local-cache";

interface EntryStoreConfig {
  /** The store this service reads/queries (its primary store). */
  store: EntryStoreName;
  /** Resolves store hosts; the admin store is always reachable for cross-store
   *  links (e.g. a data structure's data vocabulary, which lives in admin). */
  env: EnvSettings;
  lang: string;
  t: Translate;
  /**
   * URI → human label lookup for the `resources` namespace. Passed in from
   * a React hook (`useResourceLabel`) or the server helper
   * (`getResourceLabel`) so this class stays pure and test-friendly.
   * Required because `next-intl`'s dot-path key syntax can't address the
   * URL-shaped keys that live in `resources.json`.
   */
  resourceLabel: ResourceLabel;
  facetSpecification?: FacetSpecification;
  hitSpecifications?: { [key: string]: HitSpecification };
  entry?: Entry;
}

export class EntrystoreService {
  // ============================================================================
  // Class Setup and Configuration
  // ============================================================================
  private entryStore: EntryStore;
  private entryStoreUtil: EntryStoreUtil;
  /** Admin-store util for cross-store links; equals entryStoreUtil when this
   *  service's primary store is already admin. */
  private adminEntryStoreUtil: EntryStoreUtil;
  private t: Translate;
  private resourceLabel: ResourceLabel;
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
    this.entryStore = new EntryStore(
      entryStoreBaseUrl(config.env, config.store),
    );
    this.entryStoreUtil = new EntryStoreUtil(this.entryStore);
    this.entryStoreUtil.loadOnlyPublicEntries(true);

    if (config.store === "admin") {
      this.adminEntryStoreUtil = this.entryStoreUtil;
    } else {
      this.adminEntryStoreUtil = new EntryStoreUtil(
        new EntryStore(entryStoreBaseUrl(config.env, "admin")),
      );
      this.adminEntryStoreUtil.loadOnlyPublicEntries(true);
    }

    this.lang = config.lang;
    this.t = config.t;
    this.resourceLabel = config.resourceLabel;
    this.facetSpecification = config.facetSpecification || {};
    this._hitSpecifications = config.hitSpecifications || {};
    namespaces.add("esterms", "http://entryscape.com/terms/");
    this.entryStore.getREST().disableJSONP();
    this.entryStore.getREST().disableCredentials();
  }

  public static getInstance(config: EntryStoreConfig): EntrystoreService {
    return new EntrystoreService(config);
  }

  public getEntryStore(): EntryStore {
    return this.entryStore;
  }

  public getEntryStoreUtil(): EntryStoreUtil {
    this.entryStoreUtil.loadOnlyPublicEntries(true);
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

  /** Solr field for a URI predicate, hashed by the SDK (no dep, no literal hash). */
  private uriPredicateField(predicate: string): string {
    const probe = this.entryStore.newSolrQuery();
    probe.uriProperty(predicate, "*");
    const { md5 } = (probe as unknown as { properties: { md5: string }[] })
      .properties[0];
    return `metadata.predicate.uri.${md5}`;
  }

  public async solrSearch(
    request: SearchRequest,
    dcat?: DCATData,
    entry?: Entry,
  ): Promise<SearchResult> {
    const hits: SearchHit[] = [];
    const query = request.query;
    const lang = request.language || "sv";
    const esQuery = this.entryStore.newSolrQuery();
    esQuery.publicRead(true);

    // Handle filters
    if (request?.filters?.exclude && request?.filters?.exclude?.length > 0) {
      request.filters.exclude.forEach((filter) => {
        if (filter.property === "uri") {
          esQuery.uriProperty(filter.key, filter.values || [], "not");
        }
      });
    }

    // Filters to include
    if (
      request.filters?.include &&
      request.filters.include.length > 0 &&
      entry
    ) {
      request.filters.include.forEach((filter) => {
        if (filter.property === "uri") {
          esQuery.uriProperty(filter.key, entry.getResourceURI());
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
          if (
            fSpec.type === ESType.literal ||
            fSpec.type === ESType.literal_s
          ) {
            esQuery.facetLimit(1000);
            esQuery.literalFacet(fSpec.resource, !!fSpec.related);
          } else if (
            fSpec.type === ESType.uri ||
            fSpec.type === ESType.wildcard
          ) {
            esQuery.uriFacet(fSpec.resource, !!fSpec.related);
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
              // Special case for special filters with search checkbox
              if (fvalue[0].customSearch) {
                break;
              }
              // Special case for special filters with regular checkbox
              if (fvalue[0].customFilter) {
                esQuery.literalProperty(
                  key,
                  fvalue[0].customFilter,
                  null,
                  "string",
                  fvalue[0].related,
                );
                break;
              }
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
              // Special case for special filters with search checkbox
              if (fvalue[0].customSearch) {
                break;
              }
              // Special case for special filters with regular checkbox
              if (fvalue[0].customFilter) {
                const excludeProperties = this.facetSpecification?.facets?.find(
                  (f) => f.customFilter === fvalue[0].customFilter,
                )?.excludeProperties;
                if (excludeProperties?.length) {
                  for (const predicate of excludeProperties) {
                    esQuery.uriProperty(predicate, "*", "not");
                  }
                } else {
                  esQuery.uriProperty(
                    key,
                    fvalue[0].customFilter,
                    null,
                    fvalue[0].related,
                  );
                }
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

    // Apply the active type facet's includeProperties (require p1 OR p2 …).
    const activeTypeFacet = this.facetSpecification?.facets?.find(
      (f) =>
        f.includeProperties?.length &&
        f.customSearch &&
        f.customSearch.length === request.esRdfTypes?.length &&
        f.customSearch.every((t) => request.esRdfTypes?.includes(t)),
    );
    if (activeTypeFacet?.includeProperties) {
      esQuery.or(
        Object.fromEntries(
          activeTypeFacet.includeProperties.map((predicate) => [
            this.uriPredicateField(predicate),
            "*",
          ]),
        ),
      );
    }

    const searchList = esQuery
      .limit(request.take || 20)
      .rdfType(request.esRdfTypes || [ESRdfType.dataset])
      .publicRead(true)
      .list();

    // Set query text
    if (query) {
      // This is a bit of a hack to make search work for sentences and partial words
      esQuery.or({
        title: query,
        description: query,
        "tag.literal": query,
        all: query,
      });
    }

    try {
      const entryList = await searchList.getEntries(request.page || 0);
      let metaFacets: ReturnType<typeof searchList.getFacets> | undefined;

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
            const uris = fg.values
              .filter((v: SearchFacet) => {
                if (facetSpec.customProperties?.length) {
                  return facetSpec.customProperties.some((p: string) =>
                    v.name?.startsWith(p),
                  );
                }
                return v.name?.toLocaleLowerCase().startsWith("http");
              })
              .map((v: SearchFacet) => v.name);

            if (uris.length) {
              await getUriNames(
                uris,
                this.entryStoreUtil,
                this.resourceLabel,
                undefined,
                !!(
                  facetSpec.customProperties &&
                  facetSpec.customProperties.length > 0
                ),
              );
            }
          }
        }
      }

      // Process children sequentially to maintain order
      for (const entry of entryList) {
        const metaData = entry.getAllMetadata();
        const resourceURI = entry.getResourceURI();
        const context = entry.getContext();
        const rdfType = metaData.findFirstValue(
          entry.getResourceURI(),
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        );

        const hitSpecification = this._hitSpecifications[rdfType] || {
          titleResource: "dcterms:title",
          path: "/datasets/",
          descriptionResource: "dcterms:description",
        };

        const hit = {
          entryId: entry.getId(),
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
          esEntry: entry,
          metadata: await this.getMetaValues(
            entry,
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
          badge:
            this.resolveSpecBadge(metaData, resourceURI, rdfType) ||
            hitSpecification.badge,
          parentLabel: hitSpecification.parentLabel,
        };

        hit.url = hitSpecification.pathResolver
          ? hitSpecification.pathResolver(entry)
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

    const specFacets = this.facetSpecification?.facets;
    if (!specFacets || specFacets.length === 0) return {};

    for (const f of specFacets) {
      const metaFacet = metaFacets.find(
        (spec) => spec.predicate === f.resource,
      );

      if (metaFacet) {
        facets[f.customLabel || f.resource] = {
          title: this.resourceLabel(metaFacet.predicate),
          name: metaFacet.name,
          predicate: metaFacet.predicate,
          indexOrder: f.indexOrder,
          count: metaFacet.valueCount,
          show: 25,
          group: f.group,
          customFilter: f.customFilter,
          customLabel: f.customLabel,
          customSearch: f.customSearch,
          exclusive: f.exclusive,
          facetValues:
            metaFacet.values.length > 0
              ? metaFacet.values
                  .filter((value: ESFacetFieldValue) => {
                    if (f.customProperties && f.customProperties.length > 0) {
                      return f.customProperties.some((property) =>
                        value.name.startsWith(property),
                      );
                    }
                    if (!value.name || value.name.trim() === "") return false;
                    if (!f?.dcatFilterEnabled) return true;

                    const choices: Choice[] = getTemplateChoices(
                      dcat,
                      f.dcatProperty,
                      f.dcatId,
                    );
                    return choices.some(
                      (choice: Choice) => choice.value === value.name,
                    );
                  })
                  .map((value: ESFacetFieldValue) => {
                    let displayName = value.name;
                    if (f?.dcatType === "choice") {
                      const choices = getTemplateChoices(
                        dcat,
                        f.dcatProperty,
                        f.dcatId,
                      );
                      const choice = choices.find(
                        (c: Choice) => c.value === value.name,
                      );
                      if (choice) {
                        displayName = getLocalizedChoiceLabel(
                          choice,
                          this.lang,
                        );
                      }
                    } else {
                      displayName =
                        entryCache.getValue(value.name) || value.name;
                    }
                    return {
                      count: value.count,
                      facet: metaFacet.predicate,
                      facetType: metaFacet.type,
                      facetValueString: `${metaFacet.predicate}||${
                        value.name
                      }||${f.related || false}||${metaFacet.type}||${this.resourceLabel(
                        metaFacet.predicate,
                      )}||${displayName}||${f.customFilter}||${
                        f.customSearch
                          ? JSON.stringify(f.customSearch)
                          : undefined
                      }||${f.customLabel}`,
                      related: f.related || false,
                      resource: value.name,
                      title: displayName,
                      customFilter: f.customFilter,
                      customLabel: f.customLabel,
                      customSearch: f.customSearch,
                    };
                  })
              : [
                  {
                    count: 0,
                    facet: metaFacet.predicate,
                    facetType: metaFacet.type,
                    facetValueString: `${metaFacet.predicate}||${
                      f.customFilter
                    }||${f.related || false}||${metaFacet.type}||${this.resourceLabel(
                      metaFacet.predicate,
                    )}||${f.customFilter}||${f.customFilter}||${
                      f.customSearch
                        ? JSON.stringify(f.customSearch)
                        : undefined
                    }||${f.customLabel}`,
                    related: false,
                    resource: "",
                    title: "",
                    customFilter: f.customFilter,
                    customSearch: f.customSearch,
                    customLabel: f.customLabel,
                  },
                ],
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
          title: this.resourceLabel(f.predicate),
          name: f.name,
          predicate: f.predicate,
          indexOrder: facetSpec.indexOrder,
          count: f.valueCount,
          show: 25,
          group: facetSpec.group,
          customFilter: facetSpec.customFilter,
          customSearch: facetSpec.customSearch,
          exclusive: facetSpec.exclusive,
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
                }||${f.type}||${this.resourceLabel(f.predicate)}||${displayName}||${
                  facetSpec.customFilter || null
                }||${
                  facetSpec.customSearch
                    ? JSON.stringify(facetSpec.customSearch)
                    : undefined
                }||${facetSpec.customLabel}`,
                related: facetSpec.related || false,
                resource: value.name,
                title: displayName,
                customLabel: facetSpec.customLabel,
                customFilter: facetSpec.customFilter,
                customSearch: facetSpec.customSearch,
              };
            }),
        };
      }
    }
    return facets;
  }

  private resolveSpecBadge(
    metaData: any,
    resourceURI: string,
    rdfType: string,
  ): string | undefined {
    const isProfile = rdfType === "http://www.w3.org/ns/dx/prof/Profile";
    const isStandard = rdfType === "http://purl.org/dc/terms/Standard";
    if (!isProfile && !isStandard) return undefined;

    const hasIntroduces =
      metaData.find(resourceURI, "https://w3id.org/inspec/datavoc/introduces")
        .length > 0;
    const hasReuses =
      metaData.find(resourceURI, "https://w3id.org/inspec/datavoc/reuses")
        .length > 0;

    if (hasIntroduces || hasReuses) {
      return isStandard
        ? "pages.specifications.types.standard"
        : "pages.specifications.types.profile";
    }

    return undefined;
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

        values.organisation_literal = [publisherName || publisherUri];
      } catch (error) {
        console.error("Error fetching publisher value:", error);
      }

      const themeFacetSpec = this.facetSpecification?.facets?.find(
        (spec) => spec.resource === "http://www.w3.org/ns/dcat#theme",
      );

      if (
        themeFacetSpec?.dcatFilterEnabled &&
        themeFacetSpec.dcatProperty &&
        dcat
      ) {
        try {
          const whitelist = await listChoices("dcat:theme", dcat);
          values.theme_literal = metadata
            .find(null, "http://www.w3.org/ns/dcat#theme")
            .map((f: any) => f.getValue())
            .filter((value: string) => whitelist.includes(value))
            .map((value: string) => this.resourceLabel(value));
        } catch (error) {
          console.error("Error fetching themes:", error);
        }
      } else {
        values.theme_literal = metadata
          .find(null, "http://www.w3.org/ns/dcat#theme")
          .map((f: any) => this.resourceLabel(f.getValue()));
      }

      const formatFacetSpec = this.facetSpecification?.facets?.find(
        (spec) => spec.resource === "http://purl.org/dc/terms/format",
      );

      if (
        formatFacetSpec?.dcatFilterEnabled &&
        formatFacetSpec.dcatProperty &&
        dcat
      ) {
        try {
          const whitelist = await listChoices("dcterms:format", dcat);
          values.format_literal = metadata
            .find(null, "http://purl.org/dc/terms/format")
            .map((f: any) => f.getValue())
            .filter((value: string) => whitelist.includes(value))
            .map((value: string) => this.resourceLabel(value));
        } catch (error) {
          console.error("Error fetching formats:", error);
        }
      } else {
        values.format_literal = metadata
          .find(null, "http://purl.org/dc/terms/format")
          .map((f: any) => this.resourceLabel(f.getValue()));
      }

      // Adding custom facets with showInSearchResult true to custom_facet_literal if they are present in the metadata
      const customFacets = this.facetSpecification?.facets?.filter(
        (spec) => spec.showInSearchResult,
      );

      if (customFacets && customFacets.length > 0) {
        for (const facet of customFacets) {
          const hasResource = metadata
            .find(entry.getResourceURI(), facet.resource)
            .some((f: any) => {
              const value = f.getValue();

              return (
                value.startsWith(
                  facet?.customFilter?.endsWith("*")
                    ? facet?.customFilter?.slice(0, -1)
                    : facet?.customFilter || facet?.customProperties?.[0],
                ) || facet?.customProperties?.includes(value)
              );
            });

          if (hasResource) {
            // Initialize the array if it doesn't exist
            values.custom_facet_literal = values.custom_facet_literal || [];
            // Add the translated resource URI to custom_facet_literal array
            values.custom_facet_literal.push(
              this.resourceLabel(facet.resource),
            );
          }
        }
      }

      // Link to the hit's parent container ("Terminologi" / "Datavokabulär").
      // Concepts reference it via skos:inScheme (a skos:ConceptScheme); classes
      // and properties via rdfs:isDefinedBy (an owl:Ontology).
      const inSchemeUri = metadata.findFirstValue(null, "skos:inScheme");
      const definedByUri = metadata.findFirstValue(null, "rdfs:isDefinedBy");

      const parentUri = inSchemeUri || definedByUri;

      if (parentUri) {
        // Default to the cached name, else the URI itself. Classes/properties
        // reference a bare namespace via rdfs:isDefinedBy that isn't a store
        // entry, so we just show that URI as-is — no per-hit lookup (perf).
        let parentName = entryCache.getValue(parentUri) || parentUri;
        let parentUrl = "";

        // Only concepts have a resolvable ConceptScheme entry (internal
        // terminology page + publisher), so load it for those only.
        if (inSchemeUri) {
          try {
            const schemeEntry = await this.getEntryByResourceURI(inSchemeUri);
            if (schemeEntry) {
              const schemeMeta = schemeEntry.getAllMetadata();
              parentUrl = termsPathResolver(schemeEntry);
              parentName =
                getLocalizedValue(schemeMeta, "dcterms:title", inSchemeUri) ||
                getLocalizedValue(schemeMeta, "rdfs:label", inSchemeUri) ||
                parentName;

              // "Utgivare" in the design is the terminology's publisher, not
              // the concept's own (concepts usually have none of their own).
              const { name: publisherName } = await this.getPublisherInfo(
                schemeEntry.getResourceURI(),
                schemeMeta,
              );
              if (publisherName) {
                values.publisher_literal = [publisherName];
              }
            }
          } catch (error) {
            console.error("Error resolving terminology link:", error);
          }
        } else if (definedByUri) {
          try {
            const vocabEntry =
              await this.adminEntryStoreUtil.getEntryByResourceURI(
                definedByUri,
              );
            if (vocabEntry) {
              const vocabMeta = vocabEntry.getAllMetadata();
              parentUrl = `${includeLangInPath(this.lang)}/data-vocabulary/${vocabEntry
                .getContext()
                .getId()}_${vocabEntry.getId()}`;
              parentName =
                getLocalizedValue(vocabMeta, "dcterms:title", definedByUri) ||
                getLocalizedValue(vocabMeta, "rdfs:label", definedByUri) ||
                parentName;
            }
          } catch {}
        }

        values.inScheme_resource = [parentName];
        if (parentUrl) {
          values.inScheme_url = [parentUrl];
        }
      } else {
        values.inScheme_resource = [""];
      }

      values.modified = metadata
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
            values.organisation_type = [
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

  public async getPublisherInfo(
    resourceUri: string,
    metadata: Metadata,
  ): Promise<{ name: string; entry: Entry | null }> {
    const publisherUri = metadata.findFirstValue(
      resourceUri,
      "dcterms:publisher",
    );
    if (publisherUri) {
      try {
        const publisherEntry =
          await this.entryStoreUtil.getEntryByResourceURI(publisherUri);
        return publisherEntry
          ? {
              entry: publisherEntry,
              name: getLocalizedValue(
                publisherEntry.getAllMetadata(),
                "foaf:name",
                publisherUri,
              ),
            }
          : { entry: null, name: "" };
      } catch (error) {
        console.error("Failed to fetch publisher:", error);
        return { entry: null, name: "" };
      }
    }
    return { entry: null, name: "" };
  }

  public async getContactInfo(metadata: Metadata) {
    const contactPoint = metadata.findFirstValue(null, "dcat:contactPoint");
    if (!contactPoint) return { title: "", url: "" };

    const contactEntry =
      await this.entryStoreUtil.getEntryByResourceURI(contactPoint);
    const contactMetadata = contactEntry.getAllMetadata();

    return {
      title: getLocalizedValue(
        contactMetadata,
        "http://www.w3.org/2006/vcard/ns#fn",
      ),
      url: parseEmail(
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
      .find(entry.getResourceURI(), "dcat:keyword")
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

    const all: LabelLink[] = [];
    const grunddata: LabelLink[] = [];
    for (const ds of datasets) {
      const meta = ds.getAllMetadata();
      const item = {
        title: getLocalizedValue(meta, "dcterms:title"),
        url: `${includeLangInPath(
          this.lang,
        )}/datasets/${this.entryStore.getContextId(
          ds.getEntryInfo().getMetadataURI(),
        )}_${ds.getId()}`,
      };
      all.push(item);

      const isGrunddata = meta
        .find(ds.getResourceURI(), "http://purl.org/dc/terms/subject")
        .some((s: { getValue: () => string }) =>
          s.getValue().includes("/concepts/grunddata/"),
        );
      if (isGrunddata) grunddata.push(item);
    }

    return { all, grunddata };
  }

  public async getShowcases(entry: Entry) {
    const showcaseData = await this.entryStore
      .newSolrQuery()
      .rdfType("dcat:Resource")
      .publicRead(true)
      .uriProperty("dcterms:publisher", entry.getResourceURI())
      .getEntries();

    return showcaseData.map((entry: Entry) => ({
      title: getLocalizedValue(entry.getAllMetadata(), "dcterms:title"),
      date: getLocalizedValue(entry.getAllMetadata(), "dcterms:issued"),
      description: getLocalizedValue(
        entry.getAllMetadata(),
        "dcterms:description",
      ),
    }));
  }

  public async getRelatedSpecifications(
    entry: Entry,
    metadata: Metadata,
    pageType: PageType,
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

        return {
          all: resourceEntries
            .filter((e: Entry) => e)
            .map((e: Entry) => ({
              title: getLocalizedValue(e.getAllMetadata(), "dcterms:title"),
              url: `${includeLangInPath(this.lang)}${specsPathResolver(e)}`,
            })),
          interoperable: [] as LabelLink[],
        };
      } else if (
        pageType === "terminology" ||
        pageType === "concept" ||
        pageType === "data-vocabulary"
      ) {
        const resourceUri = entry
          .getResourceURI()
          .replace(
            "https://dataportal.se/concepts/",
            "https://www.dataportal.se/terminology/",
          )
          .replace(
            "https://www-sandbox.dataportal.se/concepts/",
            "https://www-sandbox.dataportal.se/terminology/",
          );

        const specifications = await this.entryStore
          .newSolrQuery()
          .publicRead(true)
          .uriProperty("http://www.w3.org/ns/dx/prof/hasResource", resourceUri)
          .rdfType([ESRdfType.spec_standard, ESRdfType.spec_profile])
          .getEntries();

        const all: LabelLink[] = [];
        const interoperable: LabelLink[] = [];
        for (const e of specifications.filter((e: Entry) => e)) {
          const meta = e.getAllMetadata();
          const item = {
            title: getLocalizedValue(meta, "dcterms:title"),
            url: `${includeLangInPath(this.lang)}${specsPathResolver(e)}`,
          };
          all.push(item);

          // Interoperable specs declare their terms via INSPEC predicates.
          const isInteroperable =
            meta.find(
              e.getResourceURI(),
              "https://w3id.org/inspec/datavoc/introduces",
            ).length > 0 ||
            meta.find(
              e.getResourceURI(),
              "https://w3id.org/inspec/datavoc/reuses",
            ).length > 0;
          if (isInteroperable) interoperable.push(item);
        }

        return { all, interoperable };
      }
      return { all: [] as LabelLink[], interoperable: [] as LabelLink[] };
    } catch (error) {
      console.error("Error fetching specifications:", error);
      return { all: [] as LabelLink[], interoperable: [] as LabelLink[] };
    }
  }

  /**
   * Resolves a class/property's data vocabulary (`rdfs:isDefinedBy`) to a
   * /data-vocabulary link, or the raw URI if it has no store entry.
   */
  public async getDataVocabularyLink(
    metadata: Metadata,
  ): Promise<LabelLink | undefined> {
    const uri = metadata.findFirstValue(null, "rdfs:isDefinedBy");
    if (!uri) return undefined;

    try {
      const ref = await this.getEntryByResourceURI(uri);

      const refMeta = ref.getAllMetadata();
      const label =
        getLocalizedValue(refMeta, "dcterms:title") ||
        getLocalizedValue(refMeta, "rdfs:label");
      return {
        title: label || uri,
        url: `${includeLangInPath(this.lang)}/data-vocabulary/${ref
          .getContext()
          .getId()}_${ref.getId()}`,
      };
    } catch {
      // No store entry for this URI, fall back to a plain external link on the raw URI.
      return { title: uri, url: uri };
    }
  }

  /** The spec's diagram: first image/* `prof:hasResource` URL, or undefined. */
  public async getSpecificationImage(
    entry: Entry,
  ): Promise<string | undefined> {
    const PROF = "http://www.w3.org/ns/dx/prof/";
    const resourceUris = entry
      .getAllMetadata()
      .find(entry.getResourceURI(), `${PROF}hasResource`)
      .map((s: { getValue: () => string }) => s.getValue());
    if (resourceUris.length === 0) return undefined;

    const refs = await Promise.allSettled(
      resourceUris.map((uri: string) =>
        this.entryStoreUtil.getEntryByResourceURI(uri),
      ),
    );
    for (const r of refs) {
      if (r.status !== "fulfilled") continue;
      const refMeta = r.value.getAllMetadata();
      const format =
        refMeta.findFirstValue(null, "http://purl.org/dc/terms/format") ?? "";
      if (format.startsWith("image/")) {
        return (
          refMeta.findFirstValue(null, `${PROF}hasArtifact`) ||
          r.value.getResourceURI()
        );
      }
    }
    return undefined;
  }

  /** Resolve a spec relation's targets into class/property links, split by type. */
  private async termsByType(
    entry: Entry,
    predicate: string,
    resolver: EntrystoreService = this,
  ): Promise<{ classes: LabelLink[]; properties: LabelLink[] }> {
    const CLASS = "http://www.w3.org/2000/01/rdf-schema#Class";
    const PROP = "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property";

    const classes: LabelLink[] = [];
    const properties: LabelLink[] = [];
    const uris = entry
      .getAllMetadata()
      .find(entry.getResourceURI(), predicate)
      .map((s: { getValue: () => string }) => s.getValue());
    if (uris.length === 0) return { classes, properties };

    const refs = await Promise.allSettled(
      uris.map((uri: string) => resolver.getEntryByResourceURI(uri)),
    );
    for (const r of refs) {
      if (r.status !== "fulfilled") continue;
      const ref = r.value;
      const refMeta = ref.getAllMetadata();
      const types = refMeta
        .find(
          ref.getResourceURI(),
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        )
        .map((s: { getValue: () => string }) => s.getValue());
      const isClass = types.includes(CLASS);
      if (!isClass && !types.includes(PROP)) continue;
      const item = {
        title:
          getLocalizedValue(refMeta, "rdfs:label") ||
          getLocalizedValue(refMeta, "dcterms:title") ||
          ref.getResourceURI(),
        url: `${includeLangInPath(this.lang)}/${
          isClass ? "class" : "property"
        }/${ref.getContext().getId()}_${ref.getId()}`,
      };
      (isClass ? classes : properties).push(item);
    }
    return { classes, properties };
  }

  /** A spec's introduced + reused classes/properties (`inspec:introduces`/`reuses`). */
  public async getSpecTerms(
    entry: Entry,
    resolver: EntrystoreService = this,
  ): Promise<{
    introducedClasses: LabelLink[];
    introducedProperties: LabelLink[];
    reusedClasses: LabelLink[];
    reusedProperties: LabelLink[];
  }> {
    const [introduced, reused] = await Promise.all([
      this.termsByType(
        entry,
        "https://w3id.org/inspec/datavoc/introduces",
        resolver,
      ),
      this.termsByType(
        entry,
        "https://w3id.org/inspec/datavoc/reuses",
        resolver,
      ),
    ]);
    return {
      introducedClasses: introduced.classes,
      introducedProperties: introduced.properties,
      reusedClasses: reused.classes,
      reusedProperties: reused.properties,
    };
  }

  public async getRelatedMQA(entry: Entry, pageType?: PageType) {
    let contextId = entry.getContext().getId();
    try {
      if (pageType === "organisation") {
        const categoryEntries = await this.entryStore
          .newSolrQuery()
          .publicRead(true)
          .rdfType(["dcat:Catalog"])
          .uriProperty("dcterms:publisher", entry.getResourceURI())
          .getEntries();

        if (categoryEntries.length > 0) {
          contextId = categoryEntries[0].getContext().getId();
        }
      }

      const mqa = this.entryStore.getEntryURI(contextId, "_quality");
      const mqaEntry = await this.entryStore.getEntry(mqa);
      const mqaMetadata = mqaEntry.getAllMetadata();

      return {
        title: getLocalizedValue(mqaMetadata, "dcterms:title"),
        url: `${includeLangInPath(
          this.lang,
        )}/metadatakvalitet/katalog/_quality/${contextId}`,
      };
    } catch {
      return null;
    }
  }

  async getRelatedTerm(
    metadata: Metadata,
    returnEntry = false,
  ): Promise<LabelLink | Entry> {
    const termUri = metadata.findFirstValue(null, "skos:inScheme");
    const termEntry = await this.getEntryByResourceURI(termUri);

    if (returnEntry) {
      return termEntry;
    }

    return {
      title: getLocalizedValue(termEntry.getAllMetadata(), "dcterms:title"),
      url: `${includeLangInPath(this.lang)}${termsPathResolver(termEntry)}`,
    };
  }

  public async getRelatedDatasetSeries(entry: Entry, metadata: Metadata) {
    try {
      const datasetSeriesUris = metadata
        .find(entry.getResourceURI(), "dcat:inSeries")
        .map((stmt: { getValue: () => string }) => stmt.getValue());

      const datasetSeriesEntries =
        await this.entryStoreUtil.loadEntriesByResourceURIs(
          datasetSeriesUris,
          null,
          true,
        );

      return datasetSeriesEntries.map((e: Entry) => ({
        title: getLocalizedValue(e.getAllMetadata(), "dcterms:title"),
        url: `${includeLangInPath(this.lang)}/dataset-series/${e
          .getContext()
          .getId()}_${e.getId()}`,
      }));
    } catch {
      return [];
    }
  }

  public async getOrganisationLink(publisherEntry: Entry | null) {
    if (!publisherEntry) return null;

    return `${includeLangInPath(this.lang)}/organisations/${publisherEntry
      .getContext()
      .getId()}_${publisherEntry.getId()}`;
  }

  // ============================================================================
  // Download and Format Operations
  // ============================================================================

  public getDownloadFormats(baseUri: string) {
    return [
      {
        title: `${this.t("pages.datasetpage.download-metadata-as")} RDF/XML`,
        url: `${baseUri}?recursive=dcat&format=application/rdf+xml`,
      },
      {
        title: `${this.t("pages.datasetpage.download-metadata-as")} TURTLE`,
        url: `${baseUri}?recursive=dcat&format=text/turtle`,
      },
      {
        title: `${this.t("pages.datasetpage.download-metadata-as")} N-TRIPLES`,
        url: `${baseUri}?recursive=dcat&format=text/n-triples`,
      },
      {
        title: `${this.t("pages.datasetpage.download-metadata-as")} JSON-LD`,
        url: `${baseUri}?recursive=dcat&format=application/ld+json`,
      },
    ];
  }
}
