import React, { createContext } from 'react';
import { SearchResult, SearchRequest, SearchFacetValue, SearchFacet,SearchHit, HitSpecification, FacetSpecification, SearchSortOrder } from './Search';
import { EntryScape, ESType } from './EntryScape';
import { encode, decode } from 'qss';
import { json } from 'body-parser';

/**
 * Props for search provider
 */
export interface SearchProviderProps {
  entryscapeUrl?: string;  
  hitSpecification?: HitSpecification;
  facetSpecification?: FacetSpecification;
  initRequest: SearchRequest;
}

/**
 * Interface for data stored in provider state
 */
export interface SearchContextData {    
  set: (req: Partial<SearchRequest>) => Promise<void>;  
  toggleFacet: (facetValue: SearchFacetValue) => Promise<void>;  
  fetchMoreFacets: (facetkey:string) => Promise<void>;  
  fetchAllFacets: () => Promise<void>;  
  showMoreFacets: (facetkey:string) => void;
  updateFacetStats: () => Promise<void>;
  facetSelected: (key:string,value:string) => boolean;
  doSearch: (appendHits?:Boolean, setStateToLocation?:Boolean, reSortOnDone?:Boolean) => Promise<void>;     
  setStateToLocation: () => void;     
  sortAllFacets: (excludeFacet?:string) => void;
  parseLocationToState: () => Promise<Boolean>;
  request: SearchRequest;
  result: SearchResult;  
  loadingHits: boolean;
  loadingFacets: boolean;
  fetchAllFacetsOnMount: boolean,
  allFacets: { [facet: string]: SearchFacet; };
}

/**
 * Default value for Search provider
 */
const defaultSettings:SearchContextData = {
  request: {query:'',fetchFacets:true,takeFacets:5,facetValues:[], take:10, page:0},
  result: {hits:[],facets:{},count:0},    
  set: () =>  new Promise<void>(resolve => {}),  
  toggleFacet: () =>  new Promise<void>(resolve => {}),  
  fetchMoreFacets: () => new Promise<void>(resolve => {}),
  fetchAllFacets: () => new Promise<void>(resolve => {}),
  showMoreFacets: () => {},
  updateFacetStats: () => new Promise<void>(resolve => {}),
  facetSelected: () => false,
  doSearch: () => new Promise<void>(resolve => {}),   
  setStateToLocation: () => {},   
  sortAllFacets: () => {},
  parseLocationToState: () => new Promise<Boolean>(resolve => {}),
  loadingHits: false,
  loadingFacets: false,
  fetchAllFacetsOnMount: true,
  allFacets: {}
}

const hasWindow = typeof window !== 'undefined';
const hasLocalStore = typeof(Storage) !== "undefined";

export const SearchContext = createContext<SearchContextData>(
  defaultSettings
);

/**
 * SearchProvider component
 */
export class SearchProvider extends React.Component<SearchProviderProps, SearchContextData> {
  
  constructor(props:SearchProviderProps){
    super(props);        

    if(this.props.initRequest)
    {
      this.state = {
        ...defaultSettings,
        request: {
          ...this.props.initRequest
        }
      }
    }
    else{
      this.state = {
        ...defaultSettings
      }
    }
  }  

  /**
   * On component mount
   * 
   * Fetches first batch of facets and store in state (if fetchAllFacetsOnMount = true)
   * handles browser history (back/forward) 
   */
  componentDidMount() {        
    let reactThis = this;

    if(hasWindow)
    {
      //handles back/forward button, we need to make a new search when the URL has changed
      window.addEventListener("popstate", () => {
        reactThis.parseLocationToState().then(anyParsed => {
          if(anyParsed)
          {       
            reactThis.set({
              fetchFacets:true
            }).then(() => {    
              reactThis.fetchAllFacets().finally(() => {               
                reactThis.doSearch(false,false);
              });
            });
          }
        });
      });    
            
      if(this.state && this.state.fetchAllFacetsOnMount) {      
          this.parseLocationToState().then(anyParsed => {
            if(anyParsed)
            {      
              this.set({
                fetchFacets:true
              }).then(() => {
                this.fetchAllFacets().finally(() => {                        
                  this.doSearch().finally(() => {                                                           
                  });
                });
              })                          
            }
          });      
      }
      else {
        this.parseLocationToState().then(anyParsed => {
          if(anyParsed)
          {
            this.set({
              fetchFacets:true
            }).then(() => {
              this.doSearch(false, false);
            });
          }
        }); 
      }    
    }
  }  

  /**
   * Set/Store state in provider component
   */
  set = (req: SearchRequest) => {    
    return new Promise<void>(resolve => {
      this.setState({
        ...this.state,
        request:{   
          ...this.state.request,       
          ...req          
        }
      }, () => {
        resolve();
      });
    });      
  };

  /**
   * For each selected group of facets - make a search WITHOUT that group of facets selected. 
   * This is for accurate facets count
   */
  updateFacetStatsGrouped = () => { 
    return new Promise<void>(resolve => {
      
      //only continue if we have allFacets and a SearchResult
      if(this.state.allFacets && this.state.result && this.state.result.facets)
      {                   
        let entryScape = new EntryScape(this.props.entryscapeUrl || 'https://registrera.oppnadata.se/store', this.props.hitSpecification, this.props.facetSpecification);
        
        var facetValues = this.state.request.facetValues as SearchFacetValue[];
       
        if(facetValues)
        {       
          //Fetch counts for each group of facets
          let groupedFacets = Array.from(facetValues)
          .reduce(function (acc:{ [facet: string]: SearchFacetValue[]; }, obj:SearchFacetValue) {
            var key = obj.facet;            

            if(!acc[key])
              acc[key] = [];

            acc[key].push(obj);
            return acc;
          }, {});  

          //iterate all facets by type, make one search for every facet group, updateing the facet count in allFacets
          if(groupedFacets)
          {
            for(let group in groupedFacets)
            {      
              let facetsNotInGroup:SearchFacetValue[] = facetValues.filter((f) => 
                f.facet !== group
              );

              //if(facetsNotInGroup && facetsNotInGroup.length > 0)
            // {
                entryScape.solrSearch({
                  ...this.state.request,
                  takeFacets: 100,                  
                  fetchFacets: true,
                  facetValues: facetsNotInGroup,
                  take:0
                }).then((res) => {
                  //fetch metafacets
                  if(res.esFacets)
                  {                      
                    //set array allFacets state          
                    this.setState(state => {
                      const allFacets = this.state.allFacets  as { [facet: string]: SearchFacet; };                                

                      //check every instance in allFacet for hitcounts in current SearchResult
                      Object.entries(allFacets).forEach(([k,v]) => {

                        if(k == group) {                            

                          let esFacetsInGroup = res.esFacets!.find(f => 
                            f.predicate == group
                          )
                          
                          v.facetValues.forEach((f) => {
                            
                            if(esFacetsInGroup && esFacetsInGroup.values)
                            {                                                                                  
                              var resultFacetValue = esFacetsInGroup!.values.find(fv => 
                                fv.name == f.resource
                              );                                            

                              if(resultFacetValue)
                              {                                                          
                                f.count = resultFacetValue.count || 0;
                              }      
                              // else
                              //    f.count = 0;                 
                            }
                          })
                          //Sort facet values according to count, TODO: Parameterize
                          // v.facetValues = v.facetValues.sort((a,b) => {
                          //   return b.count - a.count;
                          // });
                        }
                      });                                          

                      return {
                        ...this.state,                        
                        allFacets:allFacets                        
                      }
                    }, () => {
                      resolve();
                    }); 

                  }
                });
            //}                    
            }            
          }  
          else
            resolve();        
        }  
        else
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
  sortAllFacets = (excludedFacet:string = '') => {
    
    const allFacets = this.state.allFacets  as { [facet: string]: SearchFacet; };

    this.setState({
      ...this.state,
      loadingFacets:true
    });  

    //check every instance in allFacet for hitcounts in current SearchResult
    Object.entries(allFacets).forEach(([k,v]) => {             
        if(excludedFacet != k)
        {                      
          //Sort facet values according to count and selected
          v.facetValues = v.facetValues.sort((a,b) => {             
            return b.count - a.count;
          });          
          
          //iterate sorted array and make sure selected items appear first
          let tmpArr:SearchFacetValue[] = [];
          let tmpArrSelected:SearchFacetValue[] = [];
          v.facetValues.forEach(f =>
          {
            if(this.facetSelected(f.facet,f.resource))                   
              tmpArrSelected.push(f);
            else 
              tmpArr.push(f);
          });

          tmpArrSelected = tmpArrSelected.sort((a,b) => {             
            return b.count - a.count;
          });         

          v.facetValues = tmpArrSelected.concat(tmpArr);
        }
    }); 

    this.setState({
      ...this.state,
      allFacets:allFacets,
      loadingFacets:false
    });  
  }

  /**
   * Compare current SearchResult with allFacets-list, 
   * add not existing facets to allFacets
   */
  mergeAllFacetsAndResult = () => {
    return new Promise<void>(resolve => {
      
      //only continue if we have allFacets and a SearchResult
      if(this.state.allFacets && this.state.result && this.state.result.facets)
      {   
        //set array allFacets state          
        this.setState(state => {
          const allFacets = this.state.allFacets  as { [facet: string]: SearchFacet; };
          const facets = this.state.result.facets  as { [facet: string]: SearchFacet; };          
          
          //check every instance in allFacet for hitcounts in current SearchResult
          Object.entries(allFacets).forEach(([k,v]) => {            
            //does allFacet exist in result with values            
            if(facets[k] && facets[k].facetValues) {              
              v.facetValues.forEach((f) => {
                var resultFacetValue = facets[k].facetValues.find(fv => 
                  fv.title === f.title && fv.resource === f.resource
                );                

                if(resultFacetValue)
                  f.count = resultFacetValue.count || 0;
                else
                  f.count = 0;               
              })            
            }                        
          });     
          
          //iterate results and merge with allFacets
          Object.entries(facets).forEach(([k,v]) => {
            //did not exist, add
            if(!allFacets[k]) {
              allFacets[k] = v;              
            }
            //existed, sync values
            else{
              v.facetValues.forEach((f:SearchFacetValue) => {
                if(!allFacets[k].facetValues.find(ff => ff.title == f.title && ff.resource == f.resource))
                {
                  (allFacets[k].facetValues as SearchFacetValue[]).push(f);                  
                }
              });
            }
          })
          
          return {
            ...this.state,
           allFacets:allFacets
          }
        });   
  
      }   
      resolve();
    });      
  };

  /**
   * Check if facet with @param key and @param value is selected in current SearchRequest
   */
  facetSelected = (key:string,value:string) => {    
      if(this.state.allFacets && this.state.result && this.state.result.facets)
      {             
        var facetValues = this.state.request.facetValues as SearchFacetValue[];

        var existing = facetValues.filter((v:SearchFacetValue) => v.facet == key && v.resource == value);

        //existed - remove from array
        if(existing && existing.length > 0)
        {
          return true;
        }         
      }    
      
      return false;
  };


  /**
   * Fetch all facets from entrystore, store in state sorted by count
   * 
   * Will cache and fetch from localStorage, cache expires in 5 mins
   */
  fetchAllFacets = () => {
    return new Promise<void>(resolve => {    
      
      let wasCached = false;
      let store_cache_key = `${this.state.request.language || ''}_${this.state.request.esRdfTypes? this.state.request.esRdfTypes[0].toString() : ''}_facets-cache`;
      let store_cache_key_stamp = `${this.state.request.language || ''}_${this.state.request.esRdfTypes? this.state.request.esRdfTypes[0].toString() : ''}_facets-cache-ts`;

      this.setState({
        ...this.state,
        loadingFacets:true
      });      

      if(hasLocalStore && hasWindow && window.localStorage[store_cache_key])
      {        
        let ls_AllFacets = window.localStorage.getItem(store_cache_key);
        let ls_Stamp =  window.localStorage.getItem(store_cache_key_stamp);        

        let allFacets = ls_AllFacets? JSON.parse(ls_AllFacets) as { [facet: string]: SearchFacet; } : null;
        let stampAllFacets = ls_Stamp? JSON.parse(ls_Stamp) as Date : new Date('1982-04-22 03:04');

        //validate cache date
        let diff = (new Date(Date.now()).getTime() - new Date(stampAllFacets).getTime()) / 60000;          

        //cache stamp invalid, clear facets
        if(diff > 5)
        {          
          window.localStorage.removeItem(store_cache_key);
        }
        //cache stamp valid
        else {          
          //found in cache, use cached
          if(allFacets)
          {
            this.setState({
              ...this.state,
              allFacets:allFacets
            }, () => {          
              wasCached = true;                      
              resolve();                      
            });            
          }
        }
      }

      if(!wasCached)
      {        
        let entryScape = new EntryScape(this.props.entryscapeUrl || 'https://registrera.oppnadata.se/store', this.props.hitSpecification, this.props.facetSpecification);

        entryScape.solrSearch({
          query: '*',
          fetchFacets: true,
          take:1,
          //facetValues:this.state.request.facetValues || [],
          takeFacets: this.state.request.takeFacets || 30
        }).then((res) => {        
          if(res.esFacets)
          {                                  
            entryScape.getFacets(res.esFacets,30).then((r) => {           
              if(r)
              {                                    
                this.setState({
                  ...this.state,
                  allFacets:r
                }, () => {                                  
                  if(hasLocalStore && hasWindow)
                  {
                    window.localStorage.setItem(store_cache_key,JSON.stringify(r));
                    window.localStorage.setItem(store_cache_key_stamp,JSON.stringify(new Date(Date.now())));
                  }                                  
                  resolve();
                });
              }
              else
              {
                this.setState({
                  ...this.state,
                  loadingFacets:false
                }, () => {                  
                  resolve()
                });
              }                        
            });
          }
          else {
            this.setState({
              ...this.state,
              loadingFacets:false
            }, () => {              
              resolve();
            });            
          }
        }).catch( () => {
          this.setState({
            ...this.state,
            loadingFacets:false
          });                  
          resolve();        
        });
      }
    });      
  } 

  /**
   * increase "show" parameter for facet with key @param facetkey
   */
  showMoreFacets = (facetkey:string) => {
    
    if(facetkey && this.state.allFacets && (this.state.allFacets as { [facet: string]: SearchFacet; })[facetkey])
    {     
      this.setState(state => {
        const facets = this.state.allFacets  as { [facet: string]: SearchFacet; };

        facets[facetkey].show = (facets[facetkey].show || 0) + 100;        

        return {
          ...this.state,
         allFacets:facets
        }
      });   

    }    
  }

  /**
   * Toggles facetvalue as selected/not selected in current SearchRequest
   */
  toggleFacet = (facetValue: SearchFacetValue) => {
    return new Promise<void>(resolve => {

      this.setState({
        ...this.state,
        loadingFacets:true
      });

      var facetValues = this.state.request.facetValues as SearchFacetValue[];

      var existing = facetValues.filter((v:SearchFacetValue) => v.facet == facetValue.facet && v.resource == facetValue.resource && v.title == facetValue.title);
      
      //existed - remove from array
      if(existing && existing.length > 0)
      {
        facetValues = facetValues.filter((v:SearchFacetValue) => {
          return (v.facet + v.resource) !== (facetValue.facet + facetValue.resource);
        });
      }
      //did not exist, add to array
      else{
        facetValues.push(facetValue);
      }

      this.setState({
        ...this.state,
        loadingFacets:false,
        request:{   
          ...this.state.request,          
          facetValues:facetValues,
          page:0          
        }        
      }, () => {              
        resolve();
      });
    });      
  };

  /**
   * Save current request state to Location
   */
  setStateToLocation = () => {
    if(hasWindow && history.pushState)
    {
      let query = this.state.request && this.state.request.query? this.state.request.query : '';

      let page = this.state.request && this.state.request.page? this.state.request.page + 1: '1';

      let sortOrder = this.state.request.sortOrder && this.state.request.sortOrder? 
        this.state.request.sortOrder as SearchSortOrder
        : 
        SearchSortOrder.score_asc;

      let facets = this.state.request && this.state.request.facetValues? 

        Object.values(this.state.request.facetValues).map((fval:SearchFacetValue) => fval.facetValueString)
        : [];          

      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + encode({p:page,q:query,s:sortOrder, f:facets.join('$')});
      window.history.pushState({path:newurl},'',newurl);
    }
  }

  /**
   * parse values in location to state
   * 
   * Returns true if any values was parsed
   */
  parseLocationToState = () => {
    return new Promise<Boolean>(resolve => {
      let fetchResults = false;

      if(hasWindow && history.pushState && window.location.search)
      {
        var qs = decode(window.location.search.substring(1)) as any;        

        let querytext = qs.q && qs.q.toString().length > 0? qs.q.toString() : '*';
        let page = qs.p && qs.p.toString().length > 0? qs.p.toString() : null;
        let queryfacets:SearchFacetValue[] = [];

        let sortOrder:SearchSortOrder = qs.s as SearchSortOrder || SearchSortOrder.score_asc;
        
        let facetstrings:{ [facet: string]: string[]; } = {};        
              
        //check if facets set in url
        if(qs.f && qs.f.length > 0)
        {
          let locationfacets = [];
          //array of facets
          if(qs.f.indexOf('$') > -1)
          {
            locationfacets = qs.f.split('$');
          }
          else{
            locationfacets.push(qs.f);
          }        

          //each facet should have format: http://purl.org/etc..||https://www.geodata.se/etc....||true||l||Organisationer||Trafikverket
          if(locationfacets && locationfacets.length > 0)
          {          
            locationfacets.forEach((f:string) => {            
              let facetstring:string[] = [];
                            
              if(f.indexOf('||') > -1)
              {
                facetstring = f.split('||');

                if(facetstring.length === 6)
                {
                  let facetType =  ESType.unknown;

                  switch(facetstring[3])
                  {
                    case 'literal':
                      facetType = ESType.literal;
                      break;
                    case 'literal_s':
                      facetType = ESType.literal_s;
                      break;
                    case 'uri':
                        facetType = ESType.uri;
                        break;
                  }

                  queryfacets.push({
                    count:0,
                    facetType: facetType,
                    facet: facetstring[0],
                    facetValueString:`${facetstring[0]}||${facetstring[1]}||${facetstring[2]}||${facetstring[3]}||${facetstring[4]}||${facetstring[5]}`,
                    related:facetstring[2] == 'true',
                    resource: facetstring[1],
                    title:facetstring[5]
                  });
                }
              }                
            });          
          }
        }

        this.setState(state => {
          if(querytext)
          {
            fetchResults = true;
            state.request.query = decodeURIComponent(querytext.replace(/\+/g, '%20'));              
          }

          if(page && page > 0)
          {
            fetchResults = true;
            state.request.page = page - 1;
          }        

          if(queryfacets){
            fetchResults = true;
            state.request.facetValues = queryfacets;
          }

          if(sortOrder){
            fetchResults = true;
            state.request.sortOrder = sortOrder;
          }
  
          return {
            ...state         
          }
        }, () => {
          resolve(fetchResults);
        });         
      }      
    });
  }


  /**
   * Perform search against EntryStore, will use state SearchRequest
   */
  doSearch = (appendHits:Boolean = false, setStateToLocation:Boolean = true, reSortOnDone:Boolean = true) => {  
    return new Promise<void>(resolve => {                 
      this.setState({
        ...this.state,
        loadingHits:true,
        loadingFacets:true
      })            

      if(setStateToLocation)
        this.setStateToLocation();    

      let entryScape = new EntryScape(this.props.entryscapeUrl || 'https://registrera.oppnadata.se/store', this.props.hitSpecification, this.props.facetSpecification);
      entryScape.solrSearch(this.state.request).then((res) => {
              
        let hits:SearchHit[] = res.hits || [];
              
        if(appendHits){
          if(this.state.result && this.state.result.hits && (this.state.result.hits as SearchHit[]))
            hits = (this.state.result.hits as SearchHit[]).concat(hits);
        }
        
        res.pages = res.count? Math.ceil(res.count / (this.state.request.take || 10)) : 0;
        
        //rerender so hits is available to consumers
        this.setState({
          ...this.state,
          loadingHits:false,
          result:
          {
            ...this.state.result,
            hits:hits,
            count:res.count,       
            pages: res.pages   
          },
          request:{
            ...this.state.request
          }
        }, () => {   
          //fetch metafacets
          if(res.esFacets)
          {                      
            entryScape.getFacets(res.esFacets,this.state.request.takeFacets || 5)
            .then((res) => {                                  
              this.setState({
                ...this.state,             
                loadingFacets:false,
                loadingHits:false,
                result:{     
                  ...this.state.result,                      
                  facets:res              
                }
              }, () => {                                
                this.mergeAllFacetsAndResult().finally(() => {                                    
                  this.updateFacetStatsGrouped().finally(() => {  
                    if(reSortOnDone)        
                      this.sortAllFacets();                                                                            
                    resolve();                  
                  });
                });
              
              });
            })
            .finally(() => {              
              resolve();                      
            });
          }
          else{     
            if(reSortOnDone)   
            {              
              this.sortAllFacets();
            }
            resolve();
          } 
        });     
      });       
    });
  };  
  
  /**
   * Search and retrive as many facets as EntryScape lets ut (100 as of now), will be stored in state
   */
  fetchMoreFacets = (facetkey:string) => {
    return new Promise<void>(resolve => {                 

      this.setState({                
        ...this.state,
        loadingFacets:true,
        request:{
          ...this.state.request,
          fetchFacets: true,
          takeFacets: 100 //EntryScape is limited to 100 facets
        }  
      }, () => {                
          this.doSearch().then(() => {                  
            this.showMoreFacets(facetkey);
            this.setState({
              ...this.state,
              loadingFacets:false          
            })   
            resolve();
          });            
        }
      )                                                                                          
      
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
      allFacets: this.state.allFacets
    }

    return (    
        <SearchContext.Provider
          value={data}
        >         
          {this.props.children}
        </SearchContext.Provider>      
    );
  }
}