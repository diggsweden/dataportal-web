import { SearchHit, SearchResult, SearchRequest, SearchFacetValue, SearchFacet, HitSpecification, FacetSpecification, FacetSpecificationItem, SearchSortOrder } from './Search';
import i18next from 'i18next';
import { request } from 'express';
const lucene = require('lucene');
import { slugify } from 'utilities/urlHelpers'
import {getLocalizedValue, getEntryLang} from 'utilities/entrystoreUtil'
//const tokenize = require('edge-ngrams')()

//unfortunate hack to get a entrystore class instance, script is inserted in head
declare var EntryStore:any;

//#region ES members

export enum ESType {
  unknown = 'unknown',
  literal_s = 'literal_s',
  literal = 'literal',
  uri = 'uri',
  wildcard = "wildcard"
}

export enum ESRdfType {
  dataset = "http\://www.w3.org/ns/dcat#Dataset",
  spec_profile = "http\://www.w3.org/ns/dx/prof/Profile",
  spec_standard = "http\://purl.org/dc/terms/Standard",
  term = "http\://www.w3.org/2004/02/skos/core#Concept",
  esterms_IndependentDataService = "esterms:IndependentDataService",
  esterms_ServedByDataService = "esterms:ServedByDataService",
  agent = "http\://xmlns.com/foaf/0.1/Agent"
}

export interface ESEntryField {
  value:string;
  type:ESType;
}

export interface ESFacetFieldValue {
  name:string;
  count:number;
}

export interface ESFacetField {
  name:string;
  predicate:string;
  type:ESType;
  valueCount: number;
  values:ESFacetFieldValue[];  
}

//#endregion

/**
 * Utility class for performing searches against an 
 * EntryScape instance connected to EntryStore https://entrystore.org/
 */
export class EntryScape {    
  entryscapeUrl:string;    
  hitSpecifications:{ [key:string] : HitSpecification }
  facetSpecification:FacetSpecification;

  constructor(entryscapeUrl:string, facetSpecification?: FacetSpecification, hitSpecifications?: { [key:string] : HitSpecification } ){
    this.entryscapeUrl = entryscapeUrl;            
    this.facetSpecification = facetSpecification || {};        

    this.hitSpecifications = 
      hitSpecifications 
      || 
      { "dataset" : {
        descriptionResource: "",
        path: "/datamangd/",
        titleResource: ""
      }};    
    
    EntryStore.namespaces.add('esterms', 'http://entryscape.com/terms/');       
  } 

  /**
   * Iterate metafacets from entrystore, 
   * will fetch resources from entrystore for {ESFacetType} uri types -
   * For friendly facet names
   * 
   * @param metaFacets 
   */
  getFacets(metaFacets:ESFacetField[],take:number) : Promise<{ [key: string]: SearchFacet; }> {
    return new Promise<{ [key: string]: SearchFacet; }>(resolve => {     

      let literalFacets:{ [key: string]: SearchFacet; } = {};    
      let uriFacets:{ [key: string]: SearchFacet; } = {};      
      let returnFacets:{ [key: string]: SearchFacet; } = {};      
      let resources:string[] = [];            

      metaFacets.forEach((f:ESFacetField) => {     
        
        //literal types, add to response directly         
        if(f.type == ESType.literal || f.type == ESType.literal_s || f.type == ESType.wildcard)
        {               
          literalFacets[f.predicate] = {
            name: f.name,
            facetValues:[],
            show: 25,
            predicate: f.predicate,            
            title: i18next.t('resource|'+f.predicate),
            count: f.valueCount
          };
          
          f.values.splice(0,take).forEach((fvalue:ESFacetFieldValue) => {      
            
            var newValue:SearchFacetValue = 
            {              
              count:fvalue.count,
              title:fvalue.name.trim(),
              resource: fvalue.name.trim(),
              facet:f.predicate,              
              facetType:f.type,
              facetValueString: '',
              related:f.name.startsWith('related.')              
            };

            newValue.facetValueString = `${f.predicate}||${newValue.resource}||${newValue.related}||${f.type}||${literalFacets[f.predicate].title}||${newValue.title}`;
            
            (literalFacets[f.predicate].facetValues as SearchFacetValue[]).push(newValue);
          });  
          
          returnFacets[f.predicate] = literalFacets[f.predicate];
        }
        
        //uri types, concat resourceURIs for fetching from backend
        if(f.type == ESType.uri)              
        {                    
          uriFacets[f.predicate] = {
            name: f.name,
            facetValues:[],
            show: 25,
            predicate: f.predicate, 
            title: i18next.t('resource|'+f.predicate),   
            count: f.valueCount         
          };
          
          f.values.splice(0,take).forEach((fvalue:ESFacetFieldValue) => {
            if(!resources.includes(fvalue.name))
            {
              resources.push(fvalue.name);

              var newValue:SearchFacetValue = 
              {                
                count:fvalue.count,
                title:i18next.t('resource|'+fvalue.name),
                resource: fvalue.name,
                facet:f.predicate,
                facetType:f.type,
                facetValueString: '',
                related:f.name.startsWith('related.')                
              };

              newValue.facetValueString = `${f.predicate}||${newValue.resource}||${newValue.related}||${f.type}||${uriFacets[f.predicate].title}||${newValue.title}`;

              (uriFacets[f.predicate].facetValues as SearchFacetValue[]).push(newValue);
            }
          });
                   
          returnFacets[f.predicate] = uriFacets[f.predicate];
        }
      });      
        
      //found resources for retrieval
      if(resources && resources.length > 0)
      {
        this.getResources(resources).then((res) => {          

          Object.entries(uriFacets).forEach(([key,value]) => {           
             value.facetValues.forEach((f) => {       
               
               if(f && f.title == f.resource)
               {                 
                  let entry = res.find((entry:any) => entry.getResourceURI() == f.resource);
                  
                  if(entry){                  
                      var meta = entry.getMetadata();                                          

                      var title = getLocalizedValue(meta,"http://xmlns.com/foaf/0.1/name",i18next.languages[0])

                      if(!title)
                        title = getLocalizedValue(meta,"http://purl.org/dc/terms/title",i18next.languages[0]);

                      f.title = title || f.resource;                           
                      f.title =f.title!.trim();
                  }
               }
             })             
          })
      
          Object.entries(returnFacets).forEach(([key,value]) => {           
            value.facetValues.forEach((f) => {   
              //f.facetValueString = `${value.title}||${f.title}`
              f.facetValueString = `${value.predicate}||${f.resource}||${f.related}||${f.facetType}||${value.title}||${f.title}`
            })
          });      
          resolve(returnFacets);
        });        
      }
      else
      {
        resolve(returnFacets);
      }
    });
  }  

  /**
   * Fetch resources from resourceURI, 
   * will batch requests to EntryScape, so we dont override the browser URI lengths
   * 
   * @param resources 
   */
  getResources(resources:string[]) : Promise<any> {
    return new Promise<any>(resolve => {
      let result:any[] = []
      const es = new EntryStore.EntryStore(this.entryscapeUrl);                   
      const maxRequestUriLength:number = 1500; //for batching request, max URI length is actually 2083 (IE), but keep it safe
      let resTmp:string[] = [];       
      let requestPromises:Promise<any>[] = []     

      while(resources.length)
      {         
        while((resTmp.join(' OR ')).length < maxRequestUriLength) 
        {
          resTmp.push(resources.splice(0,1)[0]);                           
        }

        requestPromises.push(
          this.resourcesSearch(resTmp,es)        
        );
        resTmp = [];
      }    

      Promise.all(requestPromises).then((r:any[]) => {
        if(r && r.length > 0)
        {
          result = Array.prototype.concat(...r);          
        }

        resolve(result);
      });          
    });
  }

  /**
   * Make SolrSearch and retrive entries from entryscape
   * Does not handle to large resource arrays, can leed to request URI errors,
   * use in batches, see {getResources}-method
   * 
   * @param resources 
   * @param es 
   */
  resourcesSearch(resources:string[],es:any) : Promise<any> {
    return new Promise<any>(resolve => {
      let esQuery = es.newSolrQuery();
        esQuery                          
          .resource(resources,null)          
          .getEntries(0)
          .then((children:any) => {   
            resolve(children);            
          });
    })
  }
 
  /**
   * Get metadata values from EntryScape entry
   * @param es EntryScape entry 
   */
  getMetaValues(es:any) : {[key:string]: string[]} {
    let values:{[key:string]: string[]} = {};
    
    if(es)
    {         
      let metadata = es.getMetadata();

      values['organisation_literal'] = metadata
        .find(null, "http://www.w3.org/ns/dcat#keyword")        
        .filter((f:any) => f.getLanguage() == undefined)
        .map((f:any) => { return f.getValue()} );      

      values['theme_literal'] = metadata.find(null, "http://www.w3.org/ns/dcat#theme")
        .map((f:any) => {
          return i18next.t('resource|' + f.getValue())
        });      
      values['format_literal'] = metadata.find(null, "http://purl.org/dc/terms/format").map((f:any) => {return f.getValue()} );      

      values['inScheme_resource'] = metadata.find(null, "http://www.w3.org/2004/02/skos/core#inScheme").map((f:any) => {return f.getValue()} );            

      values['modified'] = metadata.find(null, "http://purl.org/dc/terms/modified").map((f:any) => {return f.getValue()} );      

      //theme needs to be translated
      //if(values['theme_literal'])
        //values['theme_literal'] = i18next.t('facetvalues|'+values['theme_literal']);
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
  luceneFriendlyQuery(query:string) : string {        
    let q = '';       

    if(query == "AND" || query == "NOT" || query == "OR")
      return '*';

    if(query && (query.startsWith('AND ') || query.startsWith('AND+')))
    {
      query = query.substring(4,query.length)
    }

    if(query && (query.startsWith('OR ') || query.startsWith('OR+')))
    {
      query = query.substring(3,query.length)
    }

    if(query && (query.startsWith('NOT ') || query.startsWith('NOT+')))
    {
      query = query.substring(4,query.length)
    }    
    
    let ast = {};
    try{
      ast = lucene.parse(query); 
      q = lucene.toString(ast);
      q = q.replace(/\~ /g, '~')      
    }
    //could not parse as lucene, remove all special chars and trim 
    catch(err)
    {            
      q = query.replace(/([\!\*\-\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "").trim();    
      q = q.replace(/\s+/g, ' '); //removes mulitple whitespaces
    }
    
    q = q.replace(/\+\-/g,"");    
    q = q.replace(/ NOT \-/g," NOT ");
    q = q.replace(/ AND NOT /g,"+NOT+");    
    q = q.replace(/ OR NOT /g,"+NOT+");
    q = q.replace(/ OR /g,"+OR+");
    q = q.replace(/ AND /g,"+AND+");
    q = q.replace(/ NOT /g,"+-");    
    //q = q.replace(/ NOT \-/g,"");

    if(q.indexOf("\"") == -1)
      q = q.replace(/ /g,"+AND+");
          
    if(q.length == 0)
      q = "*";

    return q;
  }

  /**
   * Query EntryScape backend from given request
   * 
   * @param request 
   * 
   * @returns {Promise<SearchResult>}
   */
  solrSearch(request:SearchRequest) : Promise<SearchResult> {
    return new Promise<SearchResult>(resolve => {

      let hits: SearchHit[] = [];      
      let query = request.query || '*';

      this.luceneFriendlyQuery(query);
      let modifiedQuery = query.split(' ');
      modifiedQuery = modifiedQuery.map(s => s.trim()).filter(s => s.length > 0 && s != 'AND');
      let lang = request.language || 'sv';      

      const es = new EntryStore.EntryStore(this.entryscapeUrl);     
      
      let esQuery = es.newSolrQuery();      
      let searchList:any;

      if(request.fetchFacets)
      {
        if(this.facetSpecification && this.facetSpecification.facets && this.facetSpecification.facets.length > 0)
        {
          this.facetSpecification.facets.forEach(fSpec => {                         
            if(fSpec.type == ESType.literal || fSpec.type == ESType.literal_s)
              esQuery.literalFacet(fSpec.resource, fSpec.related? true : false);
            else if(fSpec.type == ESType.uri || fSpec.type == ESType.wildcard)
              esQuery.uriFacet(fSpec.resource, fSpec.related? true : false);
          });
        }        
      }

      //if request has facetValues object, add facets to query
      if(request.facetValues && request.facetValues.length > 0)
      {          
        //group by facet type (if many selected within same facet group)
        let groupedFacets = Array.from(request.facetValues)
          .reduce(function (acc:{ [facet: string]: SearchFacetValue[]; }, obj:SearchFacetValue) {
            var key = obj.facet;            

            if(!acc[key])
              acc[key] = [];

            acc[key].push(obj);
            return acc;
          }, {});                

        //iterate groups and add facets within each, will be "OR" between facets in group, and "AND" between groups
        Object.entries(groupedFacets).forEach(([key, fvalue]) => {        
          if(fvalue && fvalue.length > 0)         
            switch(fvalue[0].facetType)
            {
              case ESType.literal:
              case ESType.literal_s:              
                esQuery.literalProperty(key,fvalue.map(f => {return f.title}),null,'string',fvalue[0].related);                
                break;
              case ESType.uri:      
              case ESType.wildcard:                                    
                esQuery.uriProperty(key,fvalue.map(f => {return f.resource}),null,fvalue[0].related);                
                break;
            } 
        });        
      }      

      
      if(request.sortOrder)
        switch(request.sortOrder)
        {
          case SearchSortOrder.modified_asc:
            esQuery.sort('modified+asc');
            break;
          case SearchSortOrder.modified_desc:
            esQuery.sort('metadata.predicate.literal_s.3e2f60da+desc');
            break;          
          case SearchSortOrder.score_desc:
            esQuery.sort('score+desc');
            break;
        }        
        
      let page = request.page || 0;
      let offset = page > 0? page * (request.take || 20) : 0;     

      esQuery        
        .limit(request.take || 20)                
        .rdfType(request.esRdfTypes || [ESRdfType.dataset]) //we will use dataset as default if no resource type is defined                                
        .publicRead(true)
        .offset(offset || 0);      

      searchList = esQuery.list();             
      
      let queryUrl = searchList.getQuery().getQuery();      

      //let q = this.luceneFriendlyQuery(query);//modifiedQuery.join("+AND+");       
      let titleQ = request.titleQuery ? this.luceneFriendlyQuery(request.titleQuery) : undefined;    

      /*
      För titeln (dcterms:title, dvs http://purl.org/dc/terms/title):
      metadata.predicate.literal_t.3f2ae919

      För beskrivningen (dcterms:description):
      metadata.predicate.literal_t.feda1d30

      För nyckelord (dcat:keyword):
      metadata.predicate.literal_t.a6424133

      För att få fram hashen gör jag:
      echo -n http://www.w3.org/ns/dcat#keyword | md5sum | cut -c1-8
       */      

      let gram = query.split(' ').reduce((memo:string[], token) => 
        {          
          let tmpMemo:string[] = [];
          if(token.length > 4)            
            tmpMemo = [...tmpMemo, token.substr(0, token.length - 2)+ "*"]
          else
            tmpMemo = [...tmpMemo, token]
           
          memo.push(`${tmpMemo.join("+AND+")}`)
          return memo
        }, [])

      query = this.luceneFriendlyQuery(query);
      let gramQuery = this.luceneFriendlyQuery(gram.join(" "));//modifiedQuery.join("+AND+");    
      
      //set query text
      if(titleQ)
        queryUrl = queryUrl.replace("&query=",
          `&query=(title:(${titleQ}))+AND+`)
      else
        queryUrl = queryUrl.replace("&query=",                    
          `&query=(metadata.object.literal:(${query})+OR+metadata.predicate.literal_t.3f2ae919:(${gramQuery})+OR+metadata.predicate.literal_t.feda1d30:(${gramQuery})+OR+metadata.predicate.literal_t.a6424133:(${gramQuery}))+AND+`)

      fetch(queryUrl)
      .then(response => {           
        response.json()
          .then(data => {            
            //if backend error return empty result and error message
            if(data.error)
            {            
              resolve({
                error: data.error,
                hits:[],
                count: 0,
                facets: {},
                esFacets: []   
              });
            }

            let children = EntryStore.factory.extractSearchResults(data, searchList, es);
        
            //facets must be retrieved explicitly if requested
            if(request.fetchFacets)
            {               
              searchList.setFacets(data.facetFields);                       
              var metaFacets = searchList.getFacets();             
            }                  
                        
            let hitSpecification:HitSpecification = {
              descriptionResource: "blaa",
              path: "hmm",
              titleResource: "blaa"
            };

            //construct SearchHit-array
            children.forEach((child:any) => {      
              
              let metaData = child.getMetadata();
              let context = child.getContext();                          
              let rdfType = metaData.findFirstValue(child.getResourceURI(), "http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
              
              hitSpecification = this.hitSpecifications[rdfType] || { titleResource:"dcterms:title", path: "/datasets/", descriptionResource: "dcterms:description" }              
              
              let hit = {
                entryId: child.getId(),
                title: getLocalizedValue(metaData,hitSpecification.titleResource || "dcterms:title",lang),
                description: getLocalizedValue(metaData,hitSpecification.descriptionResource || "dcterms:description",lang),
                esEntry: child,
                metadata: this.getMetaValues(child),
                url:'',

                titleLang: getEntryLang(metaData,hitSpecification.titleResource || "dcterms:title",lang),
                descriptionLang: getEntryLang(metaData,hitSpecification.descriptionResource || "dcterms:description",lang),

                
              };
              

              if(hitSpecification.pathResolver)
                hit.url = hitSpecification.pathResolver(child);
              else
                hit.url = `${hitSpecification.path || 'datamangd'}${context.getId()}_${hit.entryId}/${slugify(hit.title)}`;

              hit.description = hit.description && hit.description.length > 250? `${(hit.description + '').substr(0,250)}...` : hit.description;            

              hits.push(hit);         
            });            

            resolve({            
              hits:hits,
              count: searchList.getSize(),
              facets: {},
              esFacets: metaFacets
            });
          })             
      });  
  })   
  }
}