import React, { createContext } from 'react';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { SettingsUtil } from '../../../config/env/SettingsUtil';

//unfortunate hack to get a entrystore class instance, script is inserted in head
declare var EntryStore:any;

export interface EntrystoreProviderProps{
  env: EnvSettings;
  eid: string;
  cid: string;
}

export interface ESEntry {   
  env: EnvSettings;  
  entrystore: any;  
  entry:any;  
  title: string;  
}

const defaultESEntry: ESEntry = {      
  env: SettingsUtil.getDefault(),
  entrystore: {},
  entry:{},  
  title: '',  
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
        src="https://dataportal.azureedge.net/cdn/entrystore.4.7.5.modified.js" 
        crossorigin="anonymous"></script>
        <script
          src="https://dataportal.azureedge.net/cdn/rdfjson.4.7.5.modified.js" 
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

  componentDidMount() {        
    this.addScripts(() => {
      //if we have an ES url, contextID and entryId, try to get a active instance of EntryScape
      if(defaultESEntry.env && defaultESEntry.env.ENTRYSCAPE_DATASETS_PATH && this.props.cid && this.props.eid)
      {      
        defaultESEntry.entrystore = new EntryStore.EntryStore(defaultESEntry.env.ENTRYSCAPE_DATASETS_PATH? `https://${defaultESEntry.env.ENTRYSCAPE_DATASETS_PATH}/store`: 'https://registrera.oppnadata.se/store');   
        let es = defaultESEntry.entrystore;

        var entryURI = es.getEntryURI(this.props.cid, this.props.eid);

        //fetch entry from entryscape https://entrystore.org/js/stable/doc/
        es.getEntry(entryURI).then((entry:any) => {        
          defaultESEntry.entry = entry;

          let graph = entry.getMetadata();
          
          defaultESEntry.title = graph.findFirstValue(entry.getResourceURI(), "dcterms:title");                
          
          this.setState({
            ...defaultESEntry
          });
        });
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
