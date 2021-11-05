import i18n from 'i18n';
import { result } from 'lodash';
import React, { createContext } from 'react';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { SettingsUtil } from '../../../config/env/SettingsUtil';

//unfortunate hack to get a entrystore class instance, script is inserted in head
declare var EntryStore:any;

export interface EntrystoreProviderProps{
  env: EnvSettings;
  eid?: string;
  cid?: string;
  entryUri?: string;
  entrystoreUrl: string | 'admin.dataportal.se';
  fetchMore: boolean
}

export interface ESEntry {   
  env: EnvSettings;  
  entrystore: any;  
  entry:any;  
  title: string;
  description: string;
  publisher: string;
  contact?: ESContact;  
}

export interface ESContact {
  name: string;
  email?: string;
}

const defaultESEntry: ESEntry = {      
  env: SettingsUtil.getDefault(),
  entrystore: {},
  entry:{},  
  title: '', 
  description: '',
  publisher: '',  
};

export const EntrystoreContext = createContext<ESEntry>(
  defaultESEntry
);


/**
 * Provider for entrystore entry, 
 * if contextid and entryid is sent in, we try to retrieve an entry from the configured EntryStore instance
 * 
 * TODO - if this is to be used in both datasets, terms etc, we need to expose the graph via the provider, instead of 
 * setting properties in the provider state (eg. title)
 */
export class EntrystoreProvider extends React.Component<EntrystoreProviderProps, ESEntry> {
  private postscribe: any;

  constructor(props:EntrystoreProviderProps){
    super(props);    

    this.state = {
      ...defaultESEntry,     
    }
  }

  addScripts(callback:Function) {
    if (typeof window !== 'undefined') {
      let reactThis = this;

      this.postscribe = (window as any).postscribe;
     
      this.postscribe(
        '#scriptsPlaceholder',
        ` 
        <script
         src="https://dataportal.azureedge.net/cdn/entrystore_2021-03-18.js" 
         crossorigin="anonymous"></script>        
        `,
        {
          done: function() {
            callback();
          }
        }
      );      
    }
    else{
      callback();
    }
  }

  /**
   * Search graph for localized value from meta graph
   * 
   * Supports uri-types (will fetch uri and display foaf:name, if any) 
   * TODO: support 
   * 
   * value type retrieve order:
   * 1. exists in sent in lang 
   * 2. exists in fallback lang (en)
   * 3. take first
   * 
   * @param metadataGraph 
   * @param prop 
   * @param lang 
   */
  async getLocalizedValue(metadataGraph:any, prop:any, lang:string,es:any, uriTypeName:string = "foaf:name") {

    let val = '';
    let fallbackLang = 'en';

    const stmts = metadataGraph.find(null, prop);

    if (stmts.length > 0) {      
      const obj:any = {};
      for (let s = 0; s < stmts.length; s++) {
        let stType = stmts[s].getType();
        let stValue = stmts[s].getValue();

        if(stType && stType == "uri" && !stValue.includes('mailto:'))
        {          
          let res = await this.resourcesSearch([stValue],es);          
          if(res && res.length > 0)
          {            
            let meta = res[0].getMetadata();            
            
            if(meta)            
              obj[stmts[s].getLanguage() || ''] = this.getLocalizedValue(meta,uriTypeName, i18n.languages[0],es);
          }
          else
            obj[stmts[s].getLanguage() || ''] = stValue;  
        }
        else
          obj[stmts[s].getLanguage() || ''] = stValue;
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
   * Make SolrSearch and retrive entries from entryscape
   * Does not handle to large resource arrays, can leed to request URI errors,
   * use in batches
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

  parseEmail(mailStr:string){
    if(mailStr && mailStr.includes("mailto:")){
      return mailStr.replace("mailto:","");
    }

    return mailStr;
  }

  componentDidMount()  {        
    this.addScripts(async () => {
      //if we have an ES url, try to get a active instance of EntryScape
      if(defaultESEntry.env)
      {      
        defaultESEntry.entrystore = new EntryStore.EntryStore(`https://${this.props.entrystoreUrl}/store`);   
        var util = new EntryStore.EntryStoreUtil(defaultESEntry.entrystore);
        let es = defaultESEntry.entrystore;        

        //we have entryUri
        if(this.props.entryUri)
        {         
          util.getEntryByResourceURI(this.props.entryUri).then(async (entry:any) => {        
            defaultESEntry.entry = entry;            

            let graph = entry.getMetadata();            

            let valuePromises:Promise<string>[] = []; 

            //the getLocalizedValue function might fetch from network, so start all IO with promises 
            valuePromises.push(this.getLocalizedValue(graph,"dcterms:title", i18n.languages[0],es));
            valuePromises.push(this.getLocalizedValue(graph,"http://www.w3.org/2004/02/skos/core#prefLabel", i18n.languages[0],es));            
            valuePromises.push(this.getLocalizedValue(graph,"dcterms:description", i18n.languages[0],es));
            if(this.props.fetchMore)
            {
              valuePromises.push(this.getLocalizedValue(graph,"dcterms:publisher", i18n.languages[0],es,"foaf:name"));
              valuePromises.push(this.getLocalizedValue(graph,"dcat:contactPoint", i18n.languages[0],es,"http://www.w3.org/2006/vcard/ns#fn"));
              valuePromises.push(this.getLocalizedValue(graph,"dcat:contactPoint", i18n.languages[0],es,"http://www.w3.org/2006/vcard/ns#hasEmail"));
            }
            //wait for all values to be fetched
            let results = await Promise.all(valuePromises);

            if(results && results.length > 0)
            {              
              defaultESEntry.title = results[0] || results[1];
              defaultESEntry.description = results[2];
              if(this.props.fetchMore)
              {
                defaultESEntry.publisher = results[3];              
                if(results[4] || results[5]){
                  defaultESEntry.contact = {
                    name : results[4],
                    email : this.parseEmail(results[5])
                  } 
                }              
              }
            }   

            this.setState({
              ...defaultESEntry
            });        
          });       
        }
        //we have contextID and entryId,
        else if(this.props.cid && this.props.eid)
        {
          var entryURI = "";        
          entryURI = es.getEntryURI(this.props.cid, this.props.eid);                  

          //fetch entry from entryscape https://entrystore.org/js/stable/doc/
          es.getEntry(entryURI).then(async (entry:any) => {        
            defaultESEntry.entry = entry;
            
            let graph = entry.getMetadata();
          
            let valuePromises:Promise<string>[] = []; 

            //the getLocalizedValue function might fetch from network, so start all IO with promises 
            valuePromises.push(this.getLocalizedValue(graph,"dcterms:title", i18n.languages[0],es));
            valuePromises.push(this.getLocalizedValue(graph,"http://www.w3.org/2004/02/skos/core#prefLabel", i18n.languages[0],es));            
            valuePromises.push(this.getLocalizedValue(graph,"dcterms:description", i18n.languages[0],es));
            if(this.props.fetchMore)
            {
              valuePromises.push(this.getLocalizedValue(graph,"dcterms:publisher", i18n.languages[0],es,"foaf:name"));
              valuePromises.push(this.getLocalizedValue(graph,"dcat:contactPoint", i18n.languages[0],es,"http://www.w3.org/2006/vcard/ns#fn"));
              valuePromises.push(this.getLocalizedValue(graph,"dcat:contactPoint", i18n.languages[0],es,"http://www.w3.org/2006/vcard/ns#hasEmail"));
            }
            //wait for all values to be fetched
            let results = await Promise.all(valuePromises);

            if(results && results.length > 0)
            {              
              defaultESEntry.title = results[0] || results[1];
              defaultESEntry.description = results[2];
              if(this.props.fetchMore)
              {
                defaultESEntry.publisher = results[3];              
                if(results[4] || results[5]){
                  defaultESEntry.contact = {
                    name : results[4],
                    email : this.parseEmail(results[5])
                  } 
                }              
              }
            }                             
            
            this.setState({
              ...defaultESEntry
            });        
          });    
        }    
      }
    })
  }

  render() {    
    return (    
        <EntrystoreContext.Provider
          value={this.state}
        >          
          {this.props.children}
        </EntrystoreContext.Provider>      
    );
  }
}
