import React, { createContext } from 'react';
import { EntryScape, ESRdfType, ESType } from './EntryScape';
import { encode, decode } from 'qss';
import { DCATData, fetchDCATMeta } from '../../utilities/';
import withTranslation from 'next-translate/withTranslation';
import { SearchSortOrder } from '../pages/SearchPage';

/**
 * Props for search provider
 */
export interface SearchProviderProps {
  entryscapeUrl?: string;
  hitSpecifications?: { [key: string]: HitSpecification };
  facetSpecification?: FacetSpecification;
  initRequest: SearchRequest;
  i18n?: any;
  children?: React.ReactNode;
}

/**
 * Interface for data stored in provider state
 */
export interface SearchContextData {
  set: (req: Partial<SearchRequest>) => Promise<void>;
  toggleFacet: (facetValue: SearchFacetValue) => Promise<void>;
  fetchMoreFacets: (facetkey: string) => Promise<void>;
  fetchAllFacets: () => Promise<void>;
  searchInFacets: (query: string, facetkey: string) => Promise<void>;
  showMoreFacets: (facetkey: string) => void;
  updateFacetStats: () => Promise<void>;
  facetSelected: (key: string, value: string) => boolean;
  facetHasSelectedValues: (key: string) => boolean;
  getFacetValueTitle: (key: string, valueKey: string) => string | null;
  doSearch: (
    appendHits?: Boolean,
    setStateToLocation?: Boolean,
    reSortOnDone?: Boolean
  ) => Promise<void>;
  setStateToLocation: () => void;
  sortAllFacets: (excludeFacet?: string) => void;
  parseLocationToState: () => Promise<Boolean>;
  request: SearchRequest;
  result: SearchResult;
  loadingHits: boolean;
  loadingFacets: boolean;
  fetchAllFacetsOnMount: boolean;
  dcatmeta?: DCATData;
  allFacets: { [facet: string]: SearchFacet };
}

/**
 * Default value for Search provider
 */
export const defaultSearchSettings: SearchContextData = {
  request: { query: '', fetchFacets: true, takeFacets: 5, facetValues: [], take: 10, page: 0 },
  result: { hits: [], facets: {}, count: -1 },
  set: () => new Promise<void>((resolve) => {}),
  toggleFacet: () => new Promise<void>((resolve) => {}),
  fetchMoreFacets: () => new Promise<void>((resolve) => {}),
  fetchAllFacets: () => new Promise<void>((resolve) => {}),
  searchInFacets: () => new Promise<void>((resolve) => {}),
  showMoreFacets: () => {},
  updateFacetStats: () => new Promise<void>((resolve) => {}),
  facetSelected: () => false,
  facetHasSelectedValues: () => false,
  getFacetValueTitle: () => '',
  doSearch: () => new Promise<void>((resolve) => {}),
  setStateToLocation: () => {},
  sortAllFacets: () => {},
  parseLocationToState: () => new Promise<Boolean>((resolve) => {}),
  loadingHits: false,
  loadingFacets: false,
  fetchAllFacetsOnMount: true,
  dcatmeta: undefined,
  allFacets: {},
};

const hasWindow = typeof window !== 'undefined';
const hasLocalStore = typeof Storage !== 'undefined';

export const SearchContext = createContext<SearchContextData>(defaultSearchSettings);

/**
 * SearchProvider component
 */
class SearchProvider extends React.Component<SearchProviderProps, SearchContextData> {
  private postscribe: any;

  constructor(props: SearchProviderProps) {
    super(props);

    if (this.props.initRequest) {
      this.state = {
        ...defaultSearchSettings,
        request: {
          ...this.props.initRequest,
        },
      };
    } else {
      this.state = {
        ...defaultSearchSettings,
      };
    }
  }

  addScripts() {
    if (typeof window !== 'undefined') {
      let reactThis = this;

      this.postscribe = (window as any).postscribe;

      this.postscribe(
        '#scriptsPlaceholder',
        ` 
        <script
         src="/entrystore_2021-03-18.js"
         crossorigin="anonymous"></script>
        `,
        {
          done: function () {
            if (reactThis.state && reactThis.state.fetchAllFacetsOnMount) {
              reactThis.parseLocationToState().then((anyParsed) => {
                if (anyParsed) {
                  reactThis
                    .set({
                      fetchFacets: true,
                    })
                    .then(() => {
                      reactThis.fetchAllFacets().finally(() => {
                        reactThis.doSearch().finally(() => {});
                      });
                    });
                }
              });
            } else {
              reactThis.parseLocationToState().then((anyParsed) => {
                if (anyParsed) {
                  reactThis
                    .set({
                      fetchFacets: true,
                    })
                    .then(() => {
                      reactThis.doSearch(false, false);
                    });
                }
              });
            }
          },
        }
      );
    }
  }

  /**
   * On component mount
   *
   * Fetches first batch of facets and store in state (if fetchAllFacetsOnMount = true)
   * handles browser history (back/forward)
   */
  async componentDidMount() {
    let reactThis = this;

    if (hasWindow) {
      await this.fetchDCATMeta();

      this.addScripts();

      //handles back/forward button, we need to make a new search when the URL has changed
      window.addEventListener('popstate', () => {
        reactThis.parseLocationToState().then((anyParsed) => {
          if (anyParsed) {
            reactThis
              .set({
                fetchFacets: true,
              })
              .then(() => {
                reactThis.fetchAllFacets().finally(() => {
                  reactThis.doSearch(false, false);
                });
              });
          }
        });
      });
    }
  }

  /**
   * Set/Store state in provider component
   */
  set = (req: SearchRequest) => {
    return new Promise<void>((resolve) => {
      this.setState(
        {
          ...this.state,
          request: {
            ...this.state.request,
            ...req,
          },
        },
        () => {
          resolve();
        }
      );
    });
  };

  fetchDCATMeta = async (): Promise<void> => {
    let dcatmeta = await fetchDCATMeta('/dcatse_bundle_2022-02-20.json');

    if (dcatmeta && dcatmeta.templates && dcatmeta.templates.length > 0) {
      this.setState({
        ...this.state,
        dcatmeta: dcatmeta,
      });
    }
  };

  /**
   * For each selected group of facets - make a search WITHOUT that group of facets selected.
   * This is for accurate facets count
   */
  updateFacetStatsGrouped = () => {
    return new Promise<void>((resolve) => {
      const { t, lang } = this.props.i18n;
      //only continue if we have allFacets and a SearchResult
      if (this.state.allFacets && this.state.result && this.state.result.facets) {
        let entryScape = new EntryScape(
          this.props.entryscapeUrl || 'https://admin.dataportal.se/store',
          lang,
          t,
          this.props.facetSpecification,
          this.props.hitSpecifications
        );

        var facetValues = this.state.request.facetValues as SearchFacetValue[];

        if (facetValues) {
          //Fetch counts for each group of facets
          let groupedFacets = Array.from(facetValues).reduce(function (
            acc: { [facet: string]: SearchFacetValue[] },
            obj: SearchFacetValue
          ) {
            var key = obj.facet;

            if (!acc[key]) acc[key] = [];

            acc[key].push(obj);
            return acc;
          },
          {});

          let searchPromises: Promise<any>[] = [];

          //iterate all facets by type, make one search for every facet group, updateing the facet count in allFacets
          if (groupedFacets && Object.entries(groupedFacets).length > 0) {
            for (let group in groupedFacets) {
              let facetsNotInGroup: SearchFacetValue[] = facetValues.filter(
                (f) => f.facet !== group
              );

              searchPromises.push(
                entryScape
                  .solrSearch({
                    ...this.state.request,
                    takeFacets: 100,
                    fetchFacets: true,
                    facetValues: facetsNotInGroup,
                    take: 0,
                  })
                  .then((res) => {
                    //fetch metafacets
                    if (res.esFacets) {
                      //set array allFacets state
                      this.setState(
                        (state) => {
                          const allFacets = this.state.allFacets as {
                            [facet: string]: SearchFacet;
                          };

                          //check every instance in allFacet for hitcounts in current SearchResult
                          Object.entries(allFacets).forEach(([k, v]) => {
                            if (k == group) {
                              let esFacetsInGroup = res.esFacets!.find((f) => f.predicate == group);

                              v.facetValues.forEach((f) => {
                                if (esFacetsInGroup && esFacetsInGroup.values) {
                                  var resultFacetValue = esFacetsInGroup!.values.find(
                                    (fv) => fv.name == f.resource
                                  );

                                  if (resultFacetValue) {
                                    f.count = resultFacetValue.count || 0;
                                  }
                                  // else
                                  //    f.count = 0;
                                }
                              });
                              //Sort facet values according to count, TODO: Parameterize
                              // v.facetValues.sort((a,b) =>
                              //   b.count - a.count
                              // );
                            }
                          });
                          return {
                            ...this.state,
                            allFacets: allFacets,
                          };
                        },
                        () => {}
                      );
                    }
                  })
              );
            }

            Promise.all(searchPromises).then(() => {
              resolve();
            });
          } else resolve();
        } else resolve();
      } else {
        resolve();
      }
    });
  };

  /**
   * Iterate allFacets in state and resort all facetvalues
   * (their count might have been changed without resorting them)
   *
   * @param excludedFacet is for resorting all but facets within that group
   */
  sortAllFacets = (excludedFacet: string = '') => {
    let allFacets = this.state.allFacets as { [facet: string]: SearchFacet };

    //check every instance in allFacet for hitcounts in current SearchResult
    Object.entries(allFacets).forEach(([k, v]) => {
      if (excludedFacet != k) {
        //iterate sorted array and make sure selected items appear first
        let tmpArr: SearchFacetValue[] = [];
        let tmpArrSelected: SearchFacetValue[] = [];
        //let tmpArrZero:SearchFacetValue[] = [];

        v.facetValues.forEach((f) => {
          if (this.facetSelected(f.facet, f.resource)) {
            tmpArrSelected.push(f);
          }
          // else if(f.count == 0) {
          //   tmpArrZero.push(f);
          // }
          else {
            tmpArr.push(f);
          }
        });

        tmpArr.sort((a, b) => b.count - a.count);

        //tmpArrZero.sort((a,b) => (b.title || '').localeCompare(a.title || ''))

        v.facetValues = tmpArrSelected.concat(tmpArr);
      }
    });

    this.setState({
      ...this.state,
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
      if (this.state.allFacets && this.state.result && this.state.result.facets) {
        //set array allFacets state
        this.setState(
          (state) => {
            const allFacets = this.state.allFacets as { [facet: string]: SearchFacet };
            const facets = this.state.result.facets as { [facet: string]: SearchFacet };

            //check every instance in allFacet for hitcounts in current SearchResult
            Object.entries(allFacets).forEach(([k, v]) => {
              //does allFacet exist in result with values
              if (facets[k] && facets[k].facetValues) {
                v.facetValues.forEach((f) => {
                  var resultFacetValue = facets[k].facetValues.find(
                    (fv) => fv.resource === f.resource // fv.title === f.title && fv.resource === f.resource
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
                  if (!allFacets[k].facetValues.find((ff) => ff.resource == f.resource)) {
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
          }
        );
      }
    });
  };

  /**
   * Check if facet with @param key and @param value is selected in current SearchRequest
   */
  facetSelected = (key: string, value: string) => {
    if (this.state.allFacets && this.state.result && this.state.result.facets) {
      var facetValues = this.state.request.facetValues as SearchFacetValue[];

      if (!facetValues) return false;

      var existing = facetValues.filter(
        (v: SearchFacetValue) => v.facet == key && v.resource == value
      );

      //existed
      if (existing && existing.length > 0) {
        return true;
      }
    }

    return false;
  };

  /**
   * Check if facet with @param key has any selected facetvalues in current SearchRequest
   */
  facetHasSelectedValues = (key: string) => {
    if (this.state.allFacets && this.state.result && this.state.result.facets) {
      var facetValues = this.state.request.facetValues as SearchFacetValue[];

      var existing = facetValues.filter((v: SearchFacetValue) => v.facet == key);

      //existed
      if (existing && existing.length > 0) {
        return true;
      }
    }

    return false;
  };

  /**
   * Get title for facetvalue in facet with key
   */
  getFacetValueTitle = (key: string, valueKey: string) => {
    var title = null;

    if (this.state.allFacets) {
      var existing = Object.entries(this.state.allFacets).filter(([v, f]) => {
        return v == key;
      });

      //existed
      if (existing && existing.length > 0) {
        if (existing && existing.length > 0) {
          existing.forEach(([facKey, facValue]) => {
            facValue.facetValues &&
              facValue.facetValues.forEach((f) => {
                if (f.resource == valueKey) title = f.title || '';
              });
          });
        }
      }
    }

    return title;
  };

  /**
   * Fetch all facets from entrystore, store in state sorted by count
   *
   * Will cache and fetch from localStorage, cache expires in 5 mins
   */
  fetchAllFacets = () => {
    const { t, lang } = this.props.i18n;
    return new Promise<void>((resolve) => {
      let wasCached = false;
      let store_cache_key = `${this.state.request.language || ''}_${
        this.state.request.esRdfTypes ? this.state.request.esRdfTypes[0].toString() : ''
      }_facets-cache`;
      let store_cache_key_stamp = `${this.state.request.language || ''}_${
        this.state.request.esRdfTypes ? this.state.request.esRdfTypes[0].toString() : ''
      }_facets-cache-ts`;

      this.setState({
        ...this.state,
        loadingFacets: true,
      });

      if (hasLocalStore && hasWindow && window.localStorage[store_cache_key]) {
        let ls_AllFacets = window.localStorage.getItem(store_cache_key);
        let ls_Stamp = window.localStorage.getItem(store_cache_key_stamp);

        let allFacets = ls_AllFacets
          ? (JSON.parse(ls_AllFacets) as { [facet: string]: SearchFacet })
          : null;
        let stampAllFacets = ls_Stamp
          ? (JSON.parse(ls_Stamp) as Date)
          : new Date('1982-04-22 03:04');

        //validate cache date
        let diff = (new Date(Date.now()).getTime() - new Date(stampAllFacets).getTime()) / 60000;

        //cache stamp invalid, clear facets
        if (diff > 5) {
          window.localStorage.removeItem(store_cache_key);
        }
        //cache stamp valid
        else {
          //found in cache, use cached
          if (allFacets) {
            this.setState(
              {
                ...this.state,
                allFacets: allFacets,
              },
              () => {
                wasCached = true;
                resolve();
              }
            );
          }
        }
      }

      if (!wasCached) {
        let entryScape = new EntryScape(
          this.props.entryscapeUrl || 'https://admin.dataportal.se/store',
          lang,
          t,
          this.props.facetSpecification,
          this.props.hitSpecifications
        );

        entryScape
          .solrSearch({
            query: '*',
            fetchFacets: true,
            take: 1,
            //facetValues:this.state.request.facetValues || [],
            takeFacets: this.state.request.takeFacets || 30,
          })
          .then((res) => {
            if (res.esFacets) {
              entryScape.getFacets(res.esFacets, 30, this.state.dcatmeta).then((r) => {
                if (r) {
                  this.setState(
                    {
                      ...this.state,
                      allFacets: r,
                    },
                    () => {
                      if (hasLocalStore && hasWindow) {
                        window.localStorage.setItem(store_cache_key, JSON.stringify(r));
                        window.localStorage.setItem(
                          store_cache_key_stamp,
                          JSON.stringify(new Date(Date.now()))
                        );
                      }
                      resolve();
                    }
                  );
                } else {
                  this.setState(
                    {
                      ...this.state,
                      request: this.state.request,
                      loadingFacets: false,
                    },
                    () => {
                      resolve();
                    }
                  );
                }
              });
            } else {
              this.setState(
                {
                  ...this.state,
                  loadingFacets: false,
                },
                () => {
                  resolve();
                }
              );
            }
          })
          .catch(() => {
            this.setState({
              ...this.state,
              loadingFacets: false,
            });
            resolve();
          });
      }
    });
  };

  /**
   * Use when query filtering facets, cannot retrive facets count,
   * will only fetch entries fromES from querytext, any found entries will be appended to the AllFacets state and localstorage
   *
   * TODO: Is now hardcoded to RDF: http://xmlns.com/foaf/0.1/Agent and URI estypes. Meaning only works for organisations for now.
   *
   */
  searchInFacets = (query: string, facetkey: string) => {
    const { t, lang } = this.props.i18n;
    return new Promise<void>((resolve) => {
      let store_cache_key = `${this.state.request.language || ''}_${
        this.state.request.esRdfTypes ? this.state.request.esRdfTypes[0].toString() : ''
      }_facets-cache`;
      let store_cache_key_stamp = `${this.state.request.language || ''}_${
        this.state.request.esRdfTypes ? this.state.request.esRdfTypes[0].toString() : ''
      }_facets-cache-ts`;

      this.setState({
        ...this.state,
        loadingFacets: true,
      });
      var facets = this.state.allFacets;

      let entryScape = new EntryScape(
        this.props.entryscapeUrl || 'https://admin.dataportal.se/store',
        lang,
        t,
        undefined,
        {
          'http://xmlns.com/foaf/0.1/Agent': {
            path: ``,
            titleResource: 'http://xmlns.com/foaf/0.1/name',
            descriptionResource: '',
          },
        }
      );

      entryScape
        .solrSearch({
          titleQuery: query && query.length > 0 ? query : '*',
          fetchFacets: false,
          take: 100,
          page: 0,
          esRdfTypes: [ESRdfType.agent],
        })
        .then((res) => {
          if (res && res.hits) {
            res.hits.forEach((h) => {
              if (
                facets[facetkey] &&
                facets[facetkey].facetValues &&
                h.title &&
                !facets[facetkey].facetValues.some(
                  (f) => f.title?.toLowerCase() == h.title.toLowerCase()
                )
              ) {
                var newValue: SearchFacetValue = {
                  count: -1,
                  title: h.title.trim(),
                  resource: h.esEntry.getResourceURI(),
                  facet: facetkey,
                  facetType: ESType.uri,
                  facetValueString: '',
                  related: false,
                };

                newValue.facetValueString = `${facetkey}||${newValue.resource}||${newValue.related}||${ESType.uri}||${facets[facetkey].title}||${newValue.title}`;

                (facets[facetkey].facetValues as SearchFacetValue[]).push(newValue);
              }
            });
          }
          this.setState(
            {
              allFacets: facets,
            },
            () => {
              if (hasLocalStore && hasWindow) {
                window.localStorage.setItem(store_cache_key, JSON.stringify(facets));
                window.localStorage.setItem(
                  store_cache_key_stamp,
                  JSON.stringify(new Date(Date.now()))
                );
              }

              this.mergeAllFacetsAndResult();
              resolve();
            }
          );
        })
        .catch(() => {
          this.setState({
            ...this.state,
            loadingFacets: false,
          });
          resolve();
        });
    });
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
      this.setState((state) => {
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
  toggleFacet = (facetValue: SearchFacetValue) => {
    return new Promise<void>((resolve) => {
      this.setState({
        ...this.state,
        loadingFacets: true,
      });

      var facetValues = this.state.request.facetValues as SearchFacetValue[];

      var existing = facetValues.filter(
        (v: SearchFacetValue) =>
          v.facet == facetValue.facet &&
          v.resource == facetValue.resource &&
          v.title == facetValue.title
      );

      //existed - remove from array
      if (existing && existing.length > 0) {
        facetValues = facetValues.filter((v: SearchFacetValue) => {
          return v.facet + v.resource !== facetValue.facet + facetValue.resource;
        });
      }
      //did not exist, add to array
      else {
        facetValues.push(facetValue);
      }
      this.setState(
        {
          ...this.state,
          loadingFacets: false,
          request: {
            ...this.state.request,
            facetValues: facetValues,
            page: 0,
          },
        },
        () => {
          resolve();
        }
      );
    });
  };

  /**
   * Save current request state to Location
   */
  setStateToLocation = () => {
    if (hasWindow && history) {
      let rdftypes: string[] = [];

      let query = this.state.request && this.state.request.query ? this.state.request.query : '';

      let page = this.state.request && this.state.request.page ? this.state.request.page + 1 : '1';

      let take = this.state.request && this.state.request.take ? this.state.request.take : 20;

      let compact = this.state.request && this.state.request.compact ? true : false;

      let sortOrder =
        this.state.request.sortOrder && this.state.request.sortOrder
          ? (this.state.request.sortOrder as SearchSortOrder)
          : SearchSortOrder.score_desc;

      let facets =
        this.state.request && this.state.request.facetValues
          ? Object.values(this.state.request.facetValues).map(
              (fval: SearchFacetValue) => fval.facetValueString
            )
          : [];

      if (this.state.request.esRdfTypes) {
        const getKeyFromValue = (value: string) =>
          Object.entries(ESRdfType).filter((item) => item[1] === value)[0][0];

        this.state.request.esRdfTypes!.forEach((e) => {
          rdftypes.push(getKeyFromValue(e));
        });
      }

      let newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?' +
        encode({
          p: page,
          q: query,
          s: sortOrder,
          t: take,
          f: facets.join('$'),
          rt: rdftypes.join('$'),
          c: compact,
        });
      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  /**
   * parse values in location to state
   *
   * Returns true if any values was parsed
   */
  parseLocationToState = () => {
    return new Promise<Boolean>((resolve) => {
      let fetchResults = false;

      if (hasWindow && history && window.location.search) {
        var qs = decode(window.location.search.substring(1)) as any;

        let querytext = qs.q && qs.q.toString().length > 0 ? qs.q.toString() : '';
        let page = qs.p && qs.p.toString().length > 0 ? qs.p.toString() : null;
        let queryfacets: SearchFacetValue[] = [];
        let rdftypes: ESRdfType[] = [];
        let take = qs.t && qs.t.toString().length > 0 ? qs.t.toString() : 20;
        let compact = qs.c && qs.c == true ? true : false;

        let sortOrder: SearchSortOrder = (qs.s as SearchSortOrder) || SearchSortOrder.score_desc;

        if (qs.rt && qs.rt.length > 0) {
          qs.rt.split('$').forEach((e: string) => {
            let rdf = ESRdfType[e as keyof typeof ESRdfType];
            if (rdf) rdftypes.push(rdf);
          });
        }

        //check if facets set in url
        if (qs.f && qs.f.length > 0) {
          let locationfacets = [];
          //array of facets
          if (qs.f.indexOf('$') > -1) {
            locationfacets = qs.f.split('$');
          } else {
            locationfacets.push(qs.f);
          }

          //each facet should have format: http://purl.org/etc..||https://www.geodata.se/etc....||true||l||Organisationer||Trafikverket
          if (locationfacets && locationfacets.length > 0) {
            locationfacets.forEach((f: string) => {
              let facetstring: string[] = [];

              if (f.indexOf('||') > -1) {
                facetstring = f.split('||');

                if (facetstring.length === 6) {
                  let facetType = ESType.unknown;

                  switch (facetstring[3]) {
                    case 'literal':
                      facetType = ESType.literal;
                      break;
                    case 'literal_s':
                      facetType = ESType.literal_s;
                      break;
                    case 'uri':
                      facetType = ESType.uri;
                      break;
                    case 'wildcard':
                      facetType = ESType.wildcard;
                      break;
                  }

                  queryfacets.push({
                    count: 0,
                    facetType: facetType,
                    facet: facetstring[0],
                    facetValueString: `${facetstring[0]}||${facetstring[1]}||${facetstring[2]}||${facetstring[3]}||${facetstring[4]}||${facetstring[5]}`,
                    related: facetstring[2] == 'true',
                    resource: facetstring[1],
                    title: facetstring[5],
                  });
                }
              }
            });
          }
        }

        this.setState(
          (state) => {
            if (querytext) {
              fetchResults = true;
              state.request.query = decodeURIComponent(querytext.replace(/\+/g, '%20'));
            }

            if (page && page > 0) {
              fetchResults = true;
              state.request.page = page - 1;
            }

            if (queryfacets) {
              fetchResults = true;
              state.request.facetValues = queryfacets;
            }

            if (take) {
              fetchResults = true;
              state.request.take = take;
            }

            if (sortOrder) {
              fetchResults = true;
              state.request.sortOrder = sortOrder;
            }

            if (rdftypes && rdftypes.length > 0) {
              fetchResults = true;
              state.request.esRdfTypes = rdftypes;
            }

            state.request.compact = compact;

            return {
              ...state,
            };
          },
          () => {
            resolve(fetchResults);
          }
        );
      }
    });
  };

  /**
   * Perform search against EntryStore, will use state SearchRequest
   */
  doSearch = (
    appendHits: Boolean = false,
    setStateToLocation: Boolean = true,
    reSortOnDone: Boolean = true
  ) => {
    const { t, lang } = this.props.i18n;
    return new Promise<void>((resolve) => {
      this.setState({
        ...this.state,
        loadingHits: true,
        loadingFacets: true,
      });

      if (setStateToLocation) this.setStateToLocation();

      let entryScape = new EntryScape(
        this.props.entryscapeUrl || 'https://admin.dataportal.se/store',
        lang,
        t,
        this.props.facetSpecification,
        this.props.hitSpecifications
      );
      entryScape.solrSearch(this.state.request, this.state.dcatmeta).then((res) => {
        let hits: SearchHit[] = res.hits || [];

        if (appendHits) {
          if (
            this.state.result &&
            this.state.result.hits &&
            (this.state.result.hits as SearchHit[])
          )
            hits = (this.state.result.hits as SearchHit[]).concat(hits);
        }

        res.pages = res.count ? Math.ceil(res.count / (this.state.request.take || 20)) : 0;

        //rerender so hits is available to consumers
        this.setState(
          {
            ...this.state,
            loadingHits: false,
            result: {
              ...this.state.result,
              hits: hits,
              count: res.count,
              pages: res.pages,
              error: res.error,
            },
            request: {
              ...this.state.request,
            },
          },
          () => {
            //fetch metafacets
            if (res.esFacets) {
              entryScape
                .getFacets(res.esFacets, this.state.request.takeFacets || 5, this.state.dcatmeta)
                .then((res) => {
                  this.setState(
                    {
                      ...this.state,
                      loadingFacets: false,
                      loadingHits: false,
                      result: {
                        ...this.state.result,
                        facets: res,
                      },
                    },
                    () => {
                      this.mergeAllFacetsAndResult().then(() => {
                        this.updateFacetStatsGrouped().then(() => {
                          if (reSortOnDone) this.sortAllFacets();

                          resolve();
                        });
                      });
                    }
                  );
                });
            } else {
              if (reSortOnDone) this.sortAllFacets();

              resolve();
            }
          }
        );
      });
    });
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
              }
            );
          });
        }
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
      searchInFacets: this.searchInFacets,
      updateFacetStats: this.mergeAllFacetsAndResult,
      facetSelected: this.facetSelected,
      facetHasSelectedValues: this.facetHasSelectedValues,
      getFacetValueTitle: this.getFacetValueTitle,
      sortAllFacets: this.sortAllFacets,
      request: this.state.request,
      result: this.state.result,
      loadingHits: this.state.loadingHits,
      loadingFacets: this.state.loadingFacets,
      fetchAllFacetsOnMount: true,
      allFacets: this.state.allFacets,
    };

    return <SearchContext.Provider value={data}>{this.props.children}</SearchContext.Provider>;
  }
}

export default withTranslation(SearchProvider, 'resources');
