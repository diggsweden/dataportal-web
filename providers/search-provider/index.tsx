import { Entry } from "@entryscape/entrystore-js";
import { useRouter } from "next/router";
import { I18n } from "next-translate";
import withTranslation from "next-translate/withTranslation";
import { decode, encode } from "qss";
import { Component, createContext, ReactNode } from "react";

import { ESRdfType, ESType } from "@/types/entrystore-core";
import {
  HitSpecification,
  FacetSpecification,
  SearchFacetValue,
  SearchFacet,
  SearchRequest,
  SearchResult,
  ESFacetField,
} from "@/types/search";
import { DCATData, fetchDCATMeta } from "@/utilities";
import { EntrystoreService } from "@/utilities/entrystore/entrystore.service";

/* eslint-disable no-unused-vars */
export enum SearchSortOrder {
  score_desc = 2,
  modified_asc = 4,
  modified_desc = 8,
}

/* eslint-enable no-unused-vars */

/**
 * Props for search provider
 */
export interface SearchProviderProps {
  entryscapeUrl?: string;
  hitSpecifications?: { [key: string]: HitSpecification };
  facetSpecification?: FacetSpecification;
  initRequest: SearchRequest;
  i18n: I18n;
  children?: ReactNode;
  fetchHitsWithFacets?: boolean;
  entry?: Entry;
  router: ReturnType<typeof useRouter>;
}

/**
 * Interface for data stored in provider state
 */
export interface SearchContextData {
  set: (_req: Partial<SearchRequest>) => Promise<void>;
  toggleFacet: (_facetValue: SearchFacetValue) => Promise<void>;
  fetchMoreFacets: (_facetkey: string) => Promise<void>;
  fetchAllFacets: () => Promise<void>;
  showMoreFacets: (_facetkey: string) => void;
  updateFacetStats: () => Promise<void>;
  facetSelected: (_key: string, _value: string) => boolean;
  doSearch: (
    _appendHits?: boolean,
    _setStateToLocation?: boolean,
    _reSortOnDone?: boolean,
    _hitsOnly?: boolean,
  ) => Promise<void>;
  setStateToLocation: () => void;
  sortAllFacets: (_excludeFacet?: string) => void;
  parseLocationToState: () => Promise<boolean>;
  request: SearchRequest;
  result: SearchResult;
  loadingHits: boolean;
  loadingFacets: boolean;
  fetchAllFacetsOnMount: boolean;
  dcatmeta?: DCATData;
  allFacets: { [facet: string]: SearchFacet };
  /**
   * Enable this if you need to fetch facets to display facet info in search results.
   */
  fetchHitsWithFacets: boolean;
}

/**
 * Default value for Search provider
 */
export const defaultSearchSettings: SearchContextData = {
  request: {
    query: "",
    fetchFacets: true,
    takeFacets: 5,
    facetValues: [],
    take: 10,
    page: 0,
  },
  result: { hits: [], facets: {}, count: -1 },
  set: async () => {},
  toggleFacet: () => new Promise<void>(() => {}),
  fetchMoreFacets: () => new Promise<void>(() => {}),
  fetchAllFacets: async () => {},
  showMoreFacets: () => {},
  updateFacetStats: () => new Promise<void>(() => {}),
  facetSelected: () => false,
  doSearch: async () => {},
  setStateToLocation: () => {},
  sortAllFacets: () => {},
  parseLocationToState: () => new Promise<boolean>(() => {}),
  loadingHits: false,
  loadingFacets: false,
  fetchAllFacetsOnMount: true,
  fetchHitsWithFacets: true,
  dcatmeta: undefined,
  allFacets: {},
};

/* eslint-enable no-unused-vars */

const hasWindow = typeof window !== "undefined";
const hasLocalStore = typeof Storage !== "undefined";

export const SearchContext = createContext<SearchContextData>(
  defaultSearchSettings,
);

/**
 * SearchProvider component
 */
class SearchProvider extends Component<SearchProviderProps, SearchContextData> {
  private entrystoreService: EntrystoreService;
  private entry?: Entry;

  private getCacheKeys(request: SearchRequest) {
    const cacheKeyBase = `${request.language || ""}_${
      request.esRdfTypes?.[0] || ""
    }`;
    return {
      data: `${cacheKeyBase}_facets-cache`,
      timestamp: `${cacheKeyBase}_facets-cache-ts`,
    };
  }

  constructor(props: SearchProviderProps) {
    super(props);
    const { t, lang } = props.i18n!;

    this.entrystoreService = EntrystoreService.getInstance({
      baseUrl: props.entryscapeUrl || "https://admin.dataportal.se/store",
      lang: lang,
      t: t,
      facetSpecification: props.facetSpecification,
      hitSpecifications: props.hitSpecifications,
      entry: props.entry,
    });

    this.entry = props.entry;

    this.state = {
      ...defaultSearchSettings,
      request: {
        ...props.initRequest,
      },
      fetchHitsWithFacets: props.fetchHitsWithFacets || true,
    };
  }

  /**
   * Initial load of search results and facets
   */
  initialLoad = async () => {
    const loadTasks = [this.doSearch(false, true, false, true)];

    if (this.state.fetchAllFacetsOnMount) {
      loadTasks.push(this.fetchAllFacets());
    }

    await Promise.all(loadTasks);
    await this.set({ fetchFacets: true });

    if (this.state.fetchHitsWithFacets) {
      await this.doSearch(false, false);
    }
  };

  /**
   * Handle browser back/forward navigation
   */
  private handlePopState = async () => {
    const anyParsed = await this.parseLocationToState();
    if (anyParsed) {
      await this.set({ fetchFacets: true });
      await this.fetchAllFacets();
      await this.doSearch(false, false);
    }
  };

  /**
   * On component mount - Modified to handle browser navigation
   */
  async componentDidMount() {
    if (!hasWindow) return;

    try {
      await this.fetchDCATMeta();
      const anyParsed = await this.parseLocationToState();

      if (!anyParsed) return;

      await this.initialLoad();

      // Add event listener for browser navigation
      window.addEventListener("popstate", this.handlePopState);
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  componentWillUnmount() {
    if (hasWindow) {
      // Remove event listener for browser navigation
      window.removeEventListener("popstate", this.handlePopState);
    }
  }

  // Update EntryScape instance when language changes
  componentDidUpdate(prevProps: SearchProviderProps) {
    if (prevProps.i18n.lang !== this.props.i18n.lang) {
      const { t, lang } = this.props.i18n;
      this.entrystoreService = EntrystoreService.getInstance({
        baseUrl:
          this.props.entryscapeUrl || "https://admin.dataportal.se/store",
        lang: lang,
        t: t,
        facetSpecification: this.props.facetSpecification,
        hitSpecifications: this.props.hitSpecifications,
      });
    }
  }
  /**
   * Set/Store state in provider component
   */
  set = async (req: Partial<SearchRequest>): Promise<void> => {
    await new Promise<void>((resolve) => {
      this.setState(
        {
          request: {
            ...this.state.request,
            ...req,
          },
        },
        resolve,
      );
    });
  };

  fetchDCATMeta = async (): Promise<void> => {
    const dcatmeta = await fetchDCATMeta(
      "https://static.infra.entryscape.com/blocks-ext/1/opendata/dcat-ap_se2.json",
    );

    if (dcatmeta && dcatmeta.templates && dcatmeta.templates.length > 0) {
      this.setState({
        dcatmeta: dcatmeta,
      });
    }
  };

  /**
   * For each selected group of facets - make a search WITHOUT that group of facets selected.
   * This is for accurate facets count
   */
  updateFacetStatsGrouped = async (): Promise<void> => {
    // Only continue if we have allFacets and a SearchResult
    if (!this.state.allFacets || !this.state.result?.facets) {
      return;
    }

    const facetValues = this.state.request.facetValues as SearchFacetValue[];
    if (!facetValues?.length) {
      return;
    }

    // Fetch counts for each group of facets
    const groupedFacets = facetValues.reduce(
      (acc: { [facet: string]: SearchFacetValue[] }, obj) => {
        const key = obj.facet;
        if (!acc[key]) acc[key] = [];
        acc[key].push(obj);
        return acc;
      },
      {},
    );

    if (!Object.keys(groupedFacets).length) {
      return;
    }

    try {
      const searchPromises = Object.keys(groupedFacets).map(async (group) => {
        const facetsNotInGroup = facetValues.filter((f) => f.facet !== group);

        const res = await this.entrystoreService.solrSearch({
          ...this.state.request,
          takeFacets: 100,
          fetchFacets: true,
          facetValues: facetsNotInGroup,
          take: 0,
        });

        if (!res.esFacets) return;

        await new Promise<void>((resolve) => {
          this.setState(() => {
            const allFacets = { ...this.state.allFacets } as {
              [facet: string]: SearchFacet;
            };

            const esFacetsInGroup = res.esFacets?.find(
              (f) => f.predicate === group,
            );

            if (allFacets[group] && esFacetsInGroup?.values) {
              allFacets[group].facetValues.forEach((f: SearchFacetValue) => {
                const resultFacetValue = esFacetsInGroup.values.find(
                  (fv) => fv.name === f.resource,
                );
                f.count = resultFacetValue?.count || 0;
              });
            }

            return {
              allFacets,
            };
          }, resolve);
        });
      });

      await Promise.all(searchPromises);
    } catch (error) {
      console.error("Error in updateFacetStatsGrouped:", error);
    }
  };

  /**
   * Iterate allFacets in state and resort all facetvalues
   * (their count might have been changed without resorting them)
   *
   * @param excludedFacet is for resorting all but facets within that group
   */
  sortAllFacets = (excludedFacet: string = "") => {
    const allFacets = this.state.allFacets as { [facet: string]: SearchFacet };

    //check every instance in allFacet for hitcounts in current SearchResult
    Object.entries(allFacets).forEach(([key, facet]) => {
      if (excludedFacet !== key) {
        //iterate sorted array and make sure selected items appear first
        const tmpArr: SearchFacetValue[] = [];
        const tmpArrSelected: SearchFacetValue[] = [];

        facet.facetValues.forEach((f) => {
          if (this.facetSelected(f.facet, f.resource)) {
            tmpArrSelected.push(f);
          } else {
            tmpArr.push(f);
          }
        });

        tmpArr.sort((a, b) => b.count - a.count);

        facet.facetValues = tmpArrSelected.concat(tmpArr);
      }
    });

    this.setState({
      allFacets: allFacets,
      loadingFacets: false,
    });
  };

  /**
   * Compare current SearchResult with allFacets-list,
   * add not existing facets to allFacets
   */
  mergeAllFacetsAndResult = () => {
    return new Promise<void>((resolve) => {
      //only continue if we have allFacets and a SearchResult
      if (
        this.state.allFacets &&
        this.state.result &&
        this.state.result.facets
      ) {
        //set array allFacets state
        this.setState(
          () => {
            const allFacets = this.state.allFacets as {
              [facet: string]: SearchFacet;
            };
            const facets = this.state.result.facets as {
              [facet: string]: SearchFacet;
            };

            //check every instance in allFacet for hitcounts in current SearchResult
            Object.entries(allFacets).forEach(([k, v]) => {
              //does allFacet exist in result with values
              if (facets[k] && facets[k].facetValues) {
                v.facetValues.forEach((f) => {
                  const resultFacetValue = facets[k].facetValues.find(
                    (fv) => fv.resource === f.resource, // fv.title === f.title && fv.resource === f.resource
                  );

                  if (resultFacetValue) f.count = resultFacetValue.count || 0;
                  else f.count = 0;
                });
              }
            });

            //iterate results and merge with allFacets
            Object.entries(facets).forEach(([k, v]) => {
              //did not exist, add
              if (!allFacets[k]) {
                allFacets[k] = v;
              }
              //existed, sync values
              else {
                v.facetValues.forEach((f: SearchFacetValue) => {
                  if (
                    !allFacets[k].facetValues.find(
                      (ff) => ff.resource == f.resource,
                    )
                  ) {
                    //ff.title == f.title &&
                    (allFacets[k].facetValues as SearchFacetValue[]).push(f);
                  }
                });
              }
            });

            return {
              ...this.state,
              allFacets: allFacets,
            };
          },
          () => {
            resolve();
          },
        );
      }
    });
  };

  /**
   * Check if facet with @param key and @param value is selected in current SearchRequest
   */
  facetSelected = (key: string, value: string): boolean => {
    const { facetValues } = this.state.request;

    if (!facetValues || !Array.isArray(facetValues)) {
      return false;
    }

    return facetValues.some(
      (facetValue) =>
        (facetValue.facet === key && facetValue.resource === value) ||
        facetValue.customFilter === value,
    );
  };

  /**
   * Fetch all facets from entrystore, store in state sorted by count
   *
   * Will cache and fetch from localStorage, cache expires in 5 mins
   */
  fetchAllFacets = async (): Promise<void> => {
    const { request, dcatmeta } = this.state;
    const CACHE_KEYS = this.getCacheKeys(request);

    const CACHE_EXPIRY_MINS = 5;

    this.setState({ loadingFacets: true });

    try {
      // Check cache if browser environment
      if (hasWindow && hasLocalStore) {
        const cachedData = localStorage.getItem(CACHE_KEYS.data);
        const cachedTimestamp = localStorage.getItem(CACHE_KEYS.timestamp);

        if (cachedData && cachedTimestamp) {
          const allFacets = JSON.parse(cachedData) as {
            [facet: string]: SearchFacet;
          };
          const cacheAge =
            (Date.now() - new Date(JSON.parse(cachedTimestamp)).getTime()) /
            60000;

          if (cacheAge <= CACHE_EXPIRY_MINS) {
            this.setState({ allFacets, loadingFacets: false });
            return;
          }

          // Clear expired cache
          localStorage.removeItem(CACHE_KEYS.data);
          localStorage.removeItem(CACHE_KEYS.timestamp);
        }
      }

      const searchResult = await this.entrystoreService.solrSearch({
        query: "*",
        fetchFacets: true,
        take: 1,
        takeFacets: request.takeFacets || 30,
      });

      if (!searchResult.esFacets || !dcatmeta) {
        throw new Error("Missing required facets or DCAT metadata");
      }

      const facets = await this.entrystoreService.getFacets(
        searchResult.esFacets,
        dcatmeta,
      );

      if (!facets) {
        throw new Error("Failed to process facets");
      }

      this.setState({ allFacets: facets });

      // Cache results if browser environment
      if (hasWindow && hasLocalStore) {
        try {
          localStorage.setItem(CACHE_KEYS.data, JSON.stringify(facets));
          localStorage.setItem(
            CACHE_KEYS.timestamp,
            JSON.stringify(new Date()),
          );
        } catch (cacheError) {
          console.warn("Failed to cache facets:", cacheError);
        }
      }
    } catch (error) {
      console.error("Failed to fetch facets:", error);
    } finally {
      this.setState({ loadingFacets: false });
    }
  };

  /**
   * increase "show" parameter for facet with key @param facetkey
   */
  showMoreFacets = (facetkey: string) => {
    if (
      facetkey &&
      this.state.allFacets &&
      (this.state.allFacets as { [facet: string]: SearchFacet })[facetkey]
    ) {
      this.setState(() => {
        const facets = this.state.allFacets as { [facet: string]: SearchFacet };

        facets[facetkey].show = (facets[facetkey].show || 0) + 100;

        return {
          ...this.state,
          allFacets: facets,
        };
      });
    }
  };

  /**
   * Toggles facetvalue as selected/not selected in current SearchRequest
   */
  toggleFacet = async (facetValue: SearchFacetValue) => {
    this.setState({ loadingFacets: true });

    const facetValues = this.state.request.facetValues || [];

    const existing = facetValues.filter(
      (v: SearchFacetValue) =>
        v.facet == facetValue.facet &&
        v.resource == facetValue.resource &&
        v.related == facetValue.related &&
        v.customFilter == facetValue.customFilter &&
        v.customSearch == facetValue.customSearch,
    );

    let newFacetValues: SearchFacetValue[];
    if (existing.length > 0) {
      newFacetValues = facetValues.filter((v) => !existing.includes(v));
    } else {
      newFacetValues = [...facetValues, facetValue];
    }

    await this.set({
      facetValues: newFacetValues,
      page: 0,
    });

    this.setState({ loadingFacets: false });
  };

  /**
   * Save current request state to Location
   */
  setStateToLocation = () => {
    if (!hasWindow) return;

    const rdftypes: string[] = [];

    const query = this.state.request?.query || "";
    const page = this.state.request?.page ? this.state.request.page + 1 : "1";
    const take = this.state.request?.take || 20;
    const sortOrder =
      this.state.request?.sortOrder || SearchSortOrder.score_desc;

    const facets =
      this.state.request?.facetValues?.map(
        (fval: SearchFacetValue) => fval.facetValueString,
      ) || [];

    if (this.state.request.esRdfTypes) {
      const getKeyFromValue = (value: string) =>
        Object.entries(ESRdfType).filter((item) => item[1] === value)[0][0];

      this.state.request.esRdfTypes.forEach((e) => {
        rdftypes.push(getKeyFromValue(e));
      });
    }

    const searchParams = encode({
      p: page.toString(),
      q: query,
      s: sortOrder.toString(),
      t: take.toString(),
      f: facets.join("$"),
      rt: rdftypes.join("$"),
    });

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    // Use the router from props
    this.props.router.push(newUrl, undefined, { shallow: true });
  };

  /**
   * parse values in location to state
   *
   * Returns true if any values was parsed
   */
  parseLocationToState = async (): Promise<boolean> => {
    if (!hasWindow || !history || !window.location.search) {
      return false;
    }

    let fetchResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qs = decode(window.location.search.substring(1)) as any;

    // Parse query parameters
    const querytext = qs.q?.toString().length > 0 ? qs.q.toString() : "";
    const page = qs.p?.toString().length > 0 ? qs.p.toString() : null;
    const take = qs.t?.toString().length > 0 ? qs.t.toString() : 20;
    const sortOrder: SearchSortOrder =
      (qs.s as SearchSortOrder) || SearchSortOrder.score_desc;

    // Parse RDF types
    const rdftypes: ESRdfType[] = [];
    if (qs.rt?.length > 0) {
      qs.rt.split("$").forEach((e: string) => {
        const rdf = ESRdfType[e as keyof typeof ESRdfType];
        if (rdf) rdftypes.push(rdf);
      });
    }

    // Parse facets
    const queryfacets: SearchFacetValue[] = [];
    if (qs.f?.length > 0) {
      const locationfacets = qs.f.indexOf("$") > -1 ? qs.f.split("$") : [qs.f];

      locationfacets.forEach((f: string) => {
        if (!f.includes("||")) return;

        const facetstring = f.split("||");
        if (facetstring.length !== 9) return;

        let facetType = ESType.unknown;
        switch (facetstring[3]) {
          case "literal":
            facetType = ESType.literal;
            break;
          case "literal_s":
            facetType = ESType.literal_s;
            break;
          case "uri":
            facetType = ESType.uri;
            break;
          case "wildcard":
            facetType = ESType.wildcard;
            break;
        }

        queryfacets.push({
          count: 0,
          facetType,
          facet: facetstring[0],
          facetValueString: f,
          related: facetstring[2] === "true",
          resource: facetstring[1],
          title: facetstring[5],
          customFilter:
            facetstring[6] !== "undefined" ? facetstring[6] : undefined,
          customSearch:
            facetstring[7] && facetstring[7] !== "undefined"
              ? JSON.parse(facetstring[7])
              : undefined,
          customLabel:
            facetstring[8] !== "undefined" ? facetstring[8] : undefined,
        });
      });
    }

    await new Promise<void>((resolve) => {
      this.setState((state) => {
        const newState = { ...state };

        if (querytext) {
          fetchResults = true;
          newState.request.query = decodeURIComponent(
            querytext.replace(/\+/g, "%20"),
          );
        }

        if (page && page > 0) {
          fetchResults = true;
          newState.request.page = page - 1;
        }

        if (queryfacets.length) {
          fetchResults = true;
          newState.request.facetValues = queryfacets;
        }

        if (take) {
          fetchResults = true;
          newState.request.take = take;
        }

        if (sortOrder) {
          fetchResults = true;
          newState.request.sortOrder = sortOrder;
        }

        if (rdftypes.length) {
          fetchResults = true;
          newState.request.esRdfTypes = rdftypes;
        }

        return newState;
      }, resolve);
    });

    return fetchResults;
  };

  /**
   * Modified doSearch to support hits-only initial request
   */
  doSearch = async (
    appendHits = false,
    setStateToLocation = true,
    reSortOnDone = true,
    hitsOnly = false,
  ): Promise<void> => {
    this.setState({
      loadingHits: true,
      loadingFacets: !hitsOnly,
    });

    if (setStateToLocation) {
      this.setStateToLocation();
    }

    try {
      // Modify request for hits-only
      const searchRequest = {
        ...this.state.request,
        fetchFacets: !hitsOnly,
      };

      const searchResult = await this.entrystoreService.solrSearch(
        searchRequest,
        this.state.dcatmeta,
        this.entry,
      );

      const hits =
        appendHits && this.state.result?.hits
          ? [...this.state.result.hits, ...(searchResult.hits || [])]
          : searchResult.hits || [];

      const pages = searchResult.count
        ? Math.ceil(searchResult.count / (this.state.request.take || 20))
        : 0;

      // Batch state update for hits
      await this.batchStateUpdate({
        loadingHits: false,
        result: {
          ...this.state.result,
          hits,
          count: searchResult.count,
          pages,
          error: searchResult.error,
        },
      });

      // Process facets if not hits-only request
      if (!hitsOnly && searchResult.esFacets && this.state.dcatmeta) {
        await this.processFacets(searchResult.esFacets, reSortOnDone);
      }
    } catch (error) {
      console.error("Error in doSearch:", error);
      this.setState({
        loadingHits: false,
        loadingFacets: false,
      });
    }
  };

  /**
   * Helper method for batched state updates
   */
  private batchStateUpdate = (
    updates: Partial<SearchContextData>,
  ): Promise<void> => {
    return new Promise((resolve) => {
      this.setState(
        (prevState) => ({
          ...prevState,
          ...updates,
        }),
        resolve,
      );
    });
  };

  /**
   * Separate facet processing logic
   */
  private processFacets = async (
    esFacets: ESFacetField[],
    reSortOnDone: boolean,
  ): Promise<void> => {
    try {
      const facets = await this.entrystoreService.getFacets(
        esFacets,
        this.state.dcatmeta!,
      );

      await this.batchStateUpdate({
        loadingFacets: false,
        result: {
          ...this.state.result,
          facets,
        },
      });

      await Promise.all([
        this.mergeAllFacetsAndResult(),
        this.updateFacetStatsGrouped(),
      ]);

      if (reSortOnDone) {
        this.sortAllFacets();
      }
    } catch (error) {
      console.error("Error processing facets:", error);
      this.setState({ loadingFacets: false });
    }
  };

  /**
   * Search and retrive as many facets as EntryScape lets ut (100 as of now), will be stored in state
   */
  fetchMoreFacets = (facetkey: string) => {
    return new Promise<void>((resolve) => {
      this.setState(
        {
          ...this.state,
          loadingFacets: true,
          request: {
            ...this.state.request,
            fetchFacets: true,
            takeFacets: 100, //EntryScape is limited to 100 facets
          },
        },
        () => {
          this.doSearch().then(() => {
            this.showMoreFacets(facetkey);
            this.setState(
              {
                ...this.state,
                loadingFacets: false,
              },
              () => {
                resolve();
              },
            );
          });
        },
      );
    });
  };

  render() {
    const data: SearchContextData = {
      set: this.set,
      doSearch: this.doSearch,
      setStateToLocation: this.setStateToLocation,
      parseLocationToState: this.parseLocationToState,
      toggleFacet: this.toggleFacet,
      fetchMoreFacets: this.fetchMoreFacets,
      showMoreFacets: this.showMoreFacets,
      fetchAllFacets: this.fetchAllFacets,
      updateFacetStats: this.mergeAllFacetsAndResult,
      facetSelected: this.facetSelected,
      sortAllFacets: this.sortAllFacets,
      request: this.state.request,
      result: this.state.result,
      loadingHits: this.state.loadingHits,
      loadingFacets: this.state.loadingFacets,
      fetchAllFacetsOnMount: true,
      allFacets: this.state.allFacets,
      fetchHitsWithFacets: this.state.fetchHitsWithFacets,
    };

    return (
      <SearchContext.Provider value={data}>
        {this.props.children}
      </SearchContext.Provider>
    );
  }
}

export default withTranslation(SearchProvider, "resources");
