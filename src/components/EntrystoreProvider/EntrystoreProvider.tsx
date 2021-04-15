import i18n from 'i18n';
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
}

export interface ESEntry {   
  env: EnvSettings;  
  entrystore: any;  
  entry:any;  
  title: string;
  description: string;  
}

const defaultESEntry: ESEntry = {      
  env: SettingsUtil.getDefault(),
  entrystore: {},
  entry:{},  
  title: '', 
  description: '',
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

  componentDidMount() {        
    this.addScripts(() => {
      //if we have an ES url, try to get a active instance of EntryScape
      if(defaultESEntry.env)
      {      
        defaultESEntry.entrystore = new EntryStore.EntryStore(`https://${this.props.entrystoreUrl}/store`);   
        var util = new EntryStore.EntryStoreUtil(defaultESEntry.entrystore);
        let es = defaultESEntry.entrystore;        

        //we have entryUri
        if(this.props.entryUri)
        {         
          util.getEntryByResourceURI(this.props.entryUri).then((entry:any) => {        
            defaultESEntry.entry = entry;            

            let graph = entry.getMetadata();            

            defaultESEntry.title = this.getLocalizedValue(graph,"dcterms:title", i18n.languages[0]);                
            
            if(!defaultESEntry.title)
              defaultESEntry.title = this.getLocalizedValue(graph,"http://www.w3.org/2004/02/skos/core#prefLabel", i18n.languages[0]);                

            defaultESEntry.description = this.getLocalizedValue(graph,"dcterms:description", i18n.languages[0]);                

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
          es.getEntry(entryURI).then((entry:any) => {        
            defaultESEntry.entry = entry;
            
            let graph = entry.getMetadata();
            
            defaultESEntry.title = this.getLocalizedValue(graph,"dcterms:title", i18n.languages[0]);                
            
            if(!defaultESEntry.title)
              defaultESEntry.title = this.getLocalizedValue(graph,"http://www.w3.org/2004/02/skos/core#prefLabel", i18n.languages[0]);                

            defaultESEntry.description = this.getLocalizedValue(graph,"dcterms:description", i18n.languages[0]);                

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
