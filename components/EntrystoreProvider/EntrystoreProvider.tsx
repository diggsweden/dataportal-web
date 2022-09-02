import useTranslation from 'next-translate/useTranslation';
import React, { createContext, useEffect, useState } from 'react';
import { EnvSettings } from '../../env/EnvSettings';
import { SettingsUtil } from '../../env/SettingsUtil';

//unfortunate hack to get a entrystore class instance, script is inserted in head
declare var EntryStore: any;

export interface EntrystoreProviderProps {
  env: EnvSettings;
  eid?: string;
  cid?: string;
  children?: React.ReactNode;
  entryUri?: string;
  entrystoreUrl: string | 'admin.dataportal.se';
  fetchMore: boolean;
}

export interface ESEntry {
  env: EnvSettings;
  entrystore: any;
  entry: any;
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
  entry: {},
  title: '',
  description: '',
  publisher: '',
};

export const EntrystoreContext = createContext<ESEntry>(defaultESEntry);

/**
 * Provider for entrystore entry,
 * if contextid and entryid is sent in, we try to retrieve an entry from the configured EntryStore instance
 *
 * TODO - if this is to be used in both datasets, terms etc, we need to expose the graph via the provider, instead of
 * setting properties in the provider state (eg. title)
 */
export const EntrystoreProvider: React.FC<EntrystoreProviderProps> = ({
  children,
  cid,
  eid,
  entryUri,
  entrystoreUrl,
  fetchMore,
}) => {
  const [state, setState] = useState(defaultESEntry);
  const { lang: nextLang } = useTranslation('common');

  const addScripts = (callback: Function) => {
    if (typeof window !== 'undefined' && (window as any).postscribe) {
      const postscribe = (window as any).postscribe;

      postscribe(
        '#scriptsPlaceholder',
        ` 
        <script 
         src="https://dataportal.azureedge.net/cdn/entrystore_2021-03-18.js" 
         crossorigin="anonymous"></script>        
        `,
        {
          done: function () {
            callback();
          },
        }
      );
    }
  };

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
  const getLocalizedValue = async (
    metadataGraph: any,
    prop: any,
    lang: string,
    es: any,
    options: { uriTypeName?: string; resourceURI?: string } = { uriTypeName: 'foaf:name' }
  ) => {
    let val = '';
    const fallbackLang = 'en';
    const { uriTypeName, resourceURI } = options;

    const stmts = metadataGraph.find(resourceURI, prop);
    if (stmts.length > 0) {
      const obj: any = {};
      for (let s = 0; s < stmts.length; s++) {
        let stType = stmts[s].getType();
        let stValue = stmts[s].getValue();

        if (stType && stType == 'uri' && !stValue.includes('mailto:')) {
          let res = await resourcesSearch([stValue], es);
          if (res && res.length > 0) {
            let meta = res[0].getMetadata();

            if (meta)
              obj[stmts[s].getLanguage() || ''] = getLocalizedValue(
                meta,
                uriTypeName || 'foaf:name',
                nextLang,
                es,
                { resourceURI }
              );
          } else obj[stmts[s].getLanguage() || ''] = stValue;
        } else obj[stmts[s].getLanguage() || ''] = stValue;
      }

      if (typeof obj[lang] != 'undefined') {
        val = obj[lang];
      } else if (obj[fallbackLang] && fallbackLang != lang) {
        val = obj[fallbackLang];
      } else {
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
  const resourcesSearch = (resources: string[], es: any): Promise<any> => {
    return new Promise<any>((resolve) => {
      let esQuery = es.newSolrQuery();
      esQuery
        .resource(resources, null)
        .getEntries(0)
        .then((children: any) => {
          resolve(children);
        });
    });
  };

  const parseEmail = (mailStr: string) => {
    if (mailStr && mailStr.includes('mailto:')) {
      return mailStr.replace('mailto:', '');
    }

    return mailStr;
  };

  useEffect(() => {
    addScripts(async () => {
      //if we have an ES url, try to get a active instance of EntryScape
      if (defaultESEntry.env) {
        defaultESEntry.entrystore = new EntryStore.EntryStore(`https://${entrystoreUrl}/store`);
        var util = new EntryStore.EntryStoreUtil(defaultESEntry.entrystore);
        let es = defaultESEntry.entrystore;

        //we have entryUri
        if (entryUri) {
          util.getEntryByResourceURI(entryUri).then(async (entry: any) => {
            defaultESEntry.entry = entry;

            const graph = entry.getMetadata();
            const resourceURI = entry.getResourceURI();
            const valuePromises: Promise<string>[] = [];

            //the getLocalizedValue function might fetch from network, so start all IO with promises
            valuePromises.push(
              getLocalizedValue(graph, 'dcterms:title', nextLang, es, { resourceURI })
            );
            valuePromises.push(
              getLocalizedValue(
                graph,
                'http://www.w3.org/2004/02/skos/core#prefLabel',
                nextLang,
                es
              )
            );
            valuePromises.push(getLocalizedValue(graph, 'dcterms:description', nextLang, es));
            if (fetchMore) {
              valuePromises.push(getLocalizedValue(graph, 'dcterms:publisher', nextLang, es));
              valuePromises.push(
                getLocalizedValue(graph, 'dcat:contactPoint', nextLang, es, {
                  uriTypeName: 'http://www.w3.org/2006/vcard/ns#fn',
                })
              );
              valuePromises.push(
                getLocalizedValue(graph, 'dcat:contactPoint', nextLang, es, {
                  uriTypeName: 'http://www.w3.org/2006/vcard/ns#hasEmail',
                })
              );
            }
            //wait for all values to be fetched
            let results = await Promise.all(valuePromises);

            if (results && results.length > 0) {
              defaultESEntry.title = results[0] || results[1];
              defaultESEntry.description = results[2];
              if (fetchMore) {
                defaultESEntry.publisher = results[3];
                if (results[4] || results[5]) {
                  defaultESEntry.contact = {
                    name: results[4],
                    email: parseEmail(results[5]),
                  };
                }
              }
            }

            setState({
              ...defaultESEntry,
            });
          });
        }
        //we have contextID and entryId,
        else if (cid && eid) {
          let entryURI = '';
          entryURI = es.getEntryURI(cid, eid);

          //fetch entry from entryscape https://entrystore.org/js/stable/doc/
          es.getEntry(entryURI).then(async (entry: any) => {
            defaultESEntry.entry = entry;

            const graph = entry.getMetadata();
            const resourceURI = entry.getResourceURI();
            const valuePromises: Promise<string>[] = [];

            //the getLocalizedValue function might fetch from network, so start all IO with promises
            valuePromises.push(
              getLocalizedValue(graph, 'dcterms:title', nextLang, es, { resourceURI })
            );
            valuePromises.push(
              getLocalizedValue(
                graph,
                'http://www.w3.org/2004/02/skos/core#prefLabel',
                nextLang,
                es
              )
            );
            valuePromises.push(getLocalizedValue(graph, 'dcterms:description', nextLang, es));
            if (fetchMore) {
              valuePromises.push(getLocalizedValue(graph, 'dcterms:publisher', nextLang, es));
              valuePromises.push(
                getLocalizedValue(graph, 'dcat:contactPoint', nextLang, es, {
                  uriTypeName: 'http://www.w3.org/2006/vcard/ns#fn',
                })
              );
              valuePromises.push(
                getLocalizedValue(graph, 'dcat:contactPoint', nextLang, es, {
                  uriTypeName: 'http://www.w3.org/2006/vcard/ns#hasEmail',
                })
              );
            }
            //wait for all values to be fetched
            let results = await Promise.all(valuePromises);

            if (results && results.length > 0) {
              defaultESEntry.title = results[0] || results[1];
              defaultESEntry.description = results[2];
              if (fetchMore) {
                defaultESEntry.publisher = results[3];
                if (results[4] || results[5]) {
                  defaultESEntry.contact = {
                    name: results[4],
                    email: parseEmail(results[5]),
                  };
                }
              }
            }

            setState({
              ...defaultESEntry,
            });
          });
        }
      }
    });
  }, []);

  return <EntrystoreContext.Provider value={state}>{children}</EntrystoreContext.Provider>;
};

export default EntrystoreProvider;
