import { SearchHit, SearchResult, SearchRequest, SearchFacetValue, SearchFacet, HitSpecification, FacetSpecification, FacetSpecificationItem, SearchSortOrder } from './Search';
import i18next from 'i18next';
import { request } from 'express';

//unfortunate hack to get a entrystore class instance, script is inserted in head
declare var EntryStore:any;

//#region ES members

export enum ESType {
  unknown = 'unknown',
  literal_s = 'literal_s',
  literal = 'literal',
  uri = 'uri'
}

export enum ESRdfType {
  dataset = 'http\://www.w3.org/ns/dcat#Dataset',
  spec_profile = 'http\://www.w3.org/ns/dx/prof',
  spec_standard = 'http\://purl.org/dc/terms/Standard',
  term = 'http\://www.w3.org/2004/02/skos/core#Concept'
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
  hitSpecification:HitSpecification;
  facetSpecification:FacetSpecification;

  constructor(entryscapeUrl:string, hitSpecification?:HitSpecification, facetSpecification?: FacetSpecification){
    this.entryscapeUrl = entryscapeUrl;    
    this.hitSpecification = hitSpecification || { path:'/datamangd/'};    
    this.facetSpecification = facetSpecification || {};    
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
        if(f.type == ESType.literal || f.type == ESType.literal_s)
        {               
          literalFacets[f.predicate] = {
            name: f.name,
            facetValues:[],
            show: 25,
            predicate: f.predicate,            
            title: i18next.t('resource|'+f.predicate)
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
                let entry = res.find((entry:any) => entry.getResourceURI() == f.resource);

                if(entry){
                    f.title = entry.getMetadata().findFirstValue(null, "http://xmlns.com/foaf/0.1/name")
                    || f.resource;       
                    
                    f.title =f.title!.trim();
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
      values['organisation_literal'] = es.getMetadata().find(null, "http://www.w3.org/ns/dcat#keyword").map((f:any) => {return f.getValue()} );      
      values['theme_literal'] = es.getMetadata().find(null, "http://www.w3.org/ns/dcat#theme")
        .map((f:any) => {
          return i18next.t('resource|' + f.getValue())
        });      
      values['format_literal'] = es.getMetadata().find(null, "http://purl.org/dc/terms/format").map((f:any) => {return f.getValue()} );      

      //theme needs to be translated
      //if(values['theme_literal'])
        //values['theme_literal'] = i18next.t('facetvalues|'+values['theme_literal']);
    }    
    return values;
  }

  /**
   * Make @param str URL-friendly  
   */
  slugify(str:string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    if(!str)
      return '';

    return str.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  /**
   * Search graph for localized value from meta graph
   * 
   * value retrieve order:
   * 1. exists in sent in lang 
   * 2. exists in fallback lang (en)
   * 3. take first
   * 
   * @param metadataGraph 
   * @param prop 
   * @param lang 
   */
  getLocalizedValue(metadataGraph:any, prop:any, lang:string) {

    let val = '';
    let fallbackLang = 'en';

    const stmts = metadataGraph.find(null, prop);
    if (stmts.length > 0) {      
      const obj:any = {};
      for (let s = 0; s < stmts.length; s++) {
        obj[stmts[s].getLanguage() || ''] = stmts[s].getValue();
      }

      if(typeof obj[lang] != "undefined")
      {        
        val = obj[lang];
      }
      else if(obj[fallbackLang] && fallbackLang != lang)
      {       
        val = obj[fallbackLang];
      }
      else
      {        
        val = Object.entries(obj)[0][1] as string;
      }
    }

    return val;
  };

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
      let modifiedQuery = query.split(' ');
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
              esQuery.literalFacet(fSpec.resource);
            else if(fSpec.type == ESType.uri)
              esQuery.uriFacet(fSpec.resource);
          });
        }
        // esQuery
        //   .uriFacet('http://www.w3.org/ns/dcat#theme')  
        //   .uriFacet('http://purl.org/dc/terms/publisher')                            
        //   // .uriFacet('http://purl.org/dc/terms/type',true) //Vi tar bort org.typ i MVP 1      
        //   .literalFacet('http://purl.org/dc/terms/format')
        //   .uriFacet('http://purl.org/dc/terms/accessRights')
        //   //.uriFacet('http://www.w3.org/1999/02/22-rdf-syntax-ns#type') //typer av resurser
      }

      if(modifiedQuery && modifiedQuery.length > 0)
      modifiedQuery.forEach((q) => {
        let trimmed = q.trim();
        if(trimmed) {
          esQuery.or({title:`${trimmed}`,'tag.literal':`${trimmed}`,description:`${trimmed}`});
          //For adding search tolerance use the following, TODO: setting
          //esQuery.or({title:`${trimmed}~1`,'tag.literal':`${trimmed}`,description:`${trimmed}~1`});
        }
      })

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
                esQuery.literalProperty(key,fvalue.map(f => {return f.title}),null,fvalue[0].related);                
                break;
              case ESType.uri:                                          
                esQuery.uriProperty(key,fvalue.map(f => {return f.resource}),null,fvalue[0].related);                
                break;
            } 
        });        
      }      

      
      if(request.sortOrder)
        switch(request.sortOrder)
        {
          case SearchSortOrder.modified_asc:
            esQuery.sort('modified asc');
            break;
          case SearchSortOrder.modified_desc:
            esQuery.sort('modified desc');
            break;
          case SearchSortOrder.score_asc:
            esQuery.sort('score asc');
            break;
          case SearchSortOrder.score_desc:
            esQuery.sort('score desc');
            break;
        }        

      esQuery        
        .limit(request.take || 10)                
        .rdfType(request.esRdfTypes || [ESRdfType.dataset]) //we will use dataset as default if no resource type is defined                                
        .publicRead(true);

      searchList = es.createSearchList(esQuery);      

      searchList                  
        .getEntries(request.page || 0)
        .then((children:any) => {                           

           //facets must be retrieved explicitly if requested
           if(request.fetchFacets)
           {
              var metaFacets = searchList.getFacets();                            
           }                  
                      
          //construct SearchHit-array
          children.forEach((child:any) => {      
            
            let metaData = child.getMetadata();
            let context = child.getContext();            

            let hit = {
              entryId: child.getId(),
              title: this.getLocalizedValue(metaData,this.hitSpecification.titleResource || "dcterms:title",lang),
              description: this.getLocalizedValue(metaData,this.hitSpecification.descriptionResource || "dcterms:description",lang),
              esEntry: child,
              metadata: this.getMetaValues(child),
              url:''
            };
            hit.url = `${this.hitSpecification.path || 'datamangd'}${context.getId()}_${hit.entryId}/${this.slugify(hit.title)}`;
            hit.description = hit.description && hit.description.length > 250? `${(hit.description + '').substr(0,250)}...` : hit.description;            

            hits.push(hit);         
          });

          resolve({
            hits:hits,
            count: searchList.getSize(),
            facets: {},
            esFacets: metaFacets   
          });
        });     
    });     
  }
}