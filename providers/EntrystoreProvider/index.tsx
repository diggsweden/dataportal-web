import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { EnvSettings } from "@/env/EnvSettings";
import { SettingsUtil } from "@/env/SettingsUtil";
import { getLocalizedValue } from "@/utilities";

//unfortunate hack to get a entrystore class instance, script is inserted in head
declare var ESJS: any;

type RelationObj = {
  title: string;
  url: string;
};

export interface EntrystoreProviderProps {
  env: EnvSettings;
  eid?: string;
  cid?: string;
  children?: React.ReactNode;
  entryUri?: string;
  entrystoreUrl: string | "admin.dataportal.se";
  fetchMore: boolean;
  isConcept?: boolean;
  hasResourceUri?: string;
}

export interface ESEntry {
  env: EnvSettings;
  entrystore: any;
  entry: any;
  title: string;
  description: string;
  publisher: string;
  termPublisher: string;
  definition: string;
  contact?: ESContact;
  conformsTo?: RelationObj[];
  hasResource?: RelationObj[];
  mqaCatalog?: string;
}

export interface ESContact {
  name: string;
  email?: string;
}

const defaultESEntry: ESEntry = {
  env: SettingsUtil.getDefault(),
  entrystore: {},
  entry: {},
  title: "",
  description: "",
  publisher: "",
  termPublisher: "",
  definition: "",
  conformsTo: [],
  hasResource: [],
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
  isConcept,
  hasResourceUri,
}) => {
  const [state, setState] = useState(defaultESEntry);
  const { lang: nextLang } = useTranslation("common");
  const router = useRouter();

  const addScripts = (callback: Function) => {
    if (typeof window !== "undefined" && (window as any).postscribe) {
      const postscribe = (window as any).postscribe;

      postscribe(
        "#scriptsPlaceholder",
        ` 
        <script 
         src="https://entrystore.org/js/4.15.0-dev/entrystore.js"
         crossorigin="anonymous"></script>        
        `,
        {
          done: function () {
            callback();
          },
        },
      );
    }
  };

  const parseEmail = (mailStr: string) => {
    if (mailStr && mailStr.includes("mailto:")) {
      return mailStr.replace("mailto:", "");
    }

    return mailStr;
  };

  useEffect(() => {
    addScripts(async () => {
      //if we have an ES url, try to get a active instance of EntryScape
      if (defaultESEntry.env) {
        defaultESEntry.entrystore = new ESJS.EntryStore(
          `https://${entrystoreUrl}/store`,
        );
        defaultESEntry.entrystore.getREST().disableJSONP();
        defaultESEntry.entrystore.getREST().disableCredentials();

        var util = new ESJS.EntryStoreUtil(defaultESEntry.entrystore);
        const es = defaultESEntry.entrystore;
        //we have entryUri
        if (entryUri) {
          util
            .getEntryByResourceURI(entryUri)
            .then(async (entry: any) => {
              defaultESEntry.entry = entry;

              const graph = entry.getAllMetadata();
              const resourceURI = entry.getResourceURI();
              const valuePromises: Promise<string>[] = [];

              const datasets = await es
                .newSolrQuery()
                .rdfType(["dcat:Dataset", "dcat:DataService"])
                .publicRead(true)
                .uriProperty("dcterms:conformsTo", resourceURI)
                .getEntries();

              const hasResource = await es
                .newSolrQuery()
                .uriProperty(
                  "http://www.w3.org/ns/dx/prof/hasResource",
                  hasResourceUri || entryUri,
                )
                .rdfType(["dcterms:Standard", "prof:Profile"])
                .publicRead(true)
                .getEntries();

              const datasetArr = await Promise.all(
                datasets.map(async (ds: any) => {
                  const title = await getLocalizedValue(
                    ds.getAllMetadata(),
                    "dcterms:title",
                    nextLang,
                    es,
                  );
                  return {
                    title: title,
                    url: `/${es.getContextId(
                      ds.getEntryInfo().getMetadataURI(),
                    )}_${ds.getId()}/${title.toLowerCase().replace(/ /g, "-")}`,
                  };
                }),
              );

              const resourceArr = await Promise.all(
                hasResource.map(async (spec: any) => {
                  const title = await getLocalizedValue(
                    spec.getAllMetadata(),
                    "dcterms:title",
                    nextLang,
                    es,
                  );
                  return {
                    title: title,
                    url: spec.getResourceURI(),
                  };
                }),
              );

              //the getLocalizedValue function might fetch from network, so start all IO with promises
              valuePromises.push(
                getLocalizedValue(graph, "dcterms:title", nextLang, es, {
                  resourceURI,
                }),
              );
              valuePromises.push(
                getLocalizedValue(
                  graph,
                  "http://www.w3.org/2004/02/skos/core#prefLabel",
                  nextLang,
                  es,
                ),
              );
              valuePromises.push(
                getLocalizedValue(graph, "dcterms:description", nextLang, es),
              );
              valuePromises.push(
                getLocalizedValue(graph, "dcterms:publisher", nextLang, es),
              );
              valuePromises.push(
                getLocalizedValue(graph, "skos:definition", nextLang, es),
              );
              if (fetchMore && !isConcept) {
                valuePromises.push(
                  getLocalizedValue(graph, "dcat:contactPoint", nextLang, es, {
                    uriTypeName: "http://www.w3.org/2006/vcard/ns#fn",
                  }),
                );
                valuePromises.push(
                  getLocalizedValue(graph, "dcat:contactPoint", nextLang, es, {
                    uriTypeName: "http://www.w3.org/2006/vcard/ns#hasEmail",
                  }),
                );
              }
              if (isConcept && !fetchMore) {
                const termEntry = await util.getEntryByResourceURI(
                  graph.findFirstValue(resourceURI, "skos:inScheme"),
                );
                const termGraph = termEntry.getAllMetadata();

                valuePromises.push(
                  getLocalizedValue(
                    termGraph,
                    "dcterms:publisher",
                    nextLang,
                    es,
                  ),
                );
              }

              //wait for all values to be fetched
              let results = await Promise.all(valuePromises);

              if (results && results.length > 0) {
                defaultESEntry.title = results[0] || results[1];
                defaultESEntry.description = results[2];
                defaultESEntry.publisher = results[3];
                defaultESEntry.definition = results[4];
                defaultESEntry.conformsTo = datasetArr || null;
                defaultESEntry.hasResource = resourceArr || null;

                if (fetchMore && !isConcept) {
                  if (results[5] || results[6]) {
                    defaultESEntry.contact = {
                      name: results[5],
                      email: parseEmail(results[6]),
                    };
                  }
                }
                if (isConcept && !fetchMore) {
                  defaultESEntry.termPublisher = results[5];
                }
              }

              setState({
                ...defaultESEntry,
              });
            })
            .catch((err: any) => {
              console.error(err);
              router.push("/404");
            });
        }
        //we have contextID and entryId,
        else if (cid && eid) {
          let mqaCataog = es.getEntryURI(cid, "_quality");
          const mqaEntry = await es.getEntry(mqaCataog);
          const mqaMetadata = await mqaEntry.getAllMetadata();

          let entryURI = "";
          entryURI = es.getEntryURI(cid, eid);
          //fetch entry from entryscape https://entrystore.org/js/stable/doc/

          es.getEntry(entryURI)

            .then(async (entry: any) => {
              defaultESEntry.entry = entry;
              if (!entry) return;

              const graph = entry.getAllMetadata();
              const resourceURI = entry.getResourceURI();
              const valuePromises: Promise<string>[] = [];

              const conformsToURIs = graph
                .find(resourceURI, "dcterms:conformsTo")
                .map((stmt: any) => stmt.getValue());
              const util = new ESJS.EntryStoreUtil(
                new ESJS.EntryStore(`https://editera.dataportal.se/store`),
              );
              util.loadOnlyPublicEntries(true);

              const conformsToEntries = await util.loadEntriesByResourceURIs(
                conformsToURIs,
                undefined,
                true,
              );
              const specfications = conformsToEntries.filter((s: any) => s);
              const extractHREF = (s: any) => {
                if (s.getResourceURI().startsWith("https://dataportal.se"))
                  return s.getResourceURI();
                return `https://dataportal.se/externalspecification/${s.getResourceURI()}`;
              };

              const specificationHREF = specfications.map((s: any) =>
                extractHREF(s),
              );

              const specArr = await Promise.all(
                conformsToEntries.map(async (spec: any) => {
                  return {
                    title: await getLocalizedValue(
                      spec.getAllMetadata(),
                      "dcterms:title",
                      nextLang,
                      es,
                    ),
                    url: specificationHREF[0],
                  };
                }),
              );

              //the getLocalizedValue function might fetch from network, so start all IO with promises
              valuePromises.push(
                getLocalizedValue(graph, "dcterms:title", nextLang, es, {
                  resourceURI,
                }),
              );

              valuePromises.push(
                getLocalizedValue(
                  graph,
                  "http://www.w3.org/2004/02/skos/core#prefLabel",
                  nextLang,
                  es,
                ),
              );
              valuePromises.push(
                getLocalizedValue(graph, "dcterms:description", nextLang, es, {
                  resourceURI,
                }),
              );
              valuePromises.push(
                getLocalizedValue(graph, "dcterms:publisher", nextLang, es),
              );
              valuePromises.push(
                getLocalizedValue(graph, "skos:definition", nextLang, es),
              );
              if (fetchMore && !isConcept) {
                valuePromises.push(
                  getLocalizedValue(graph, "dcat:contactPoint", nextLang, es, {
                    uriTypeName: "http://www.w3.org/2006/vcard/ns#fn",
                  }),
                );
                valuePromises.push(
                  getLocalizedValue(graph, "dcat:contactPoint", nextLang, es, {
                    uriTypeName: "http://www.w3.org/2006/vcard/ns#hasEmail",
                  }),
                );
              }
              valuePromises.push(
                getLocalizedValue(mqaMetadata, "dcterms:title", nextLang, es),
              );
              if (isConcept && !fetchMore) {
                const termEntry = await util.getEntryByResourceURI(
                  graph.findFirstValue(resourceURI, "skos:inScheme"),
                );
                const termGraph = termEntry.getAllMetadata();

                valuePromises.push(
                  getLocalizedValue(
                    termGraph,
                    "dcterms:publisher",
                    nextLang,
                    es,
                  ),
                );
              }
              //wait for all values to be fetched
              let results = await Promise.all(valuePromises);

              if (results && results.length > 0) {
                defaultESEntry.title = results[0] || results[1];
                defaultESEntry.description = results[2];
                defaultESEntry.publisher = results[3];
                defaultESEntry.definition = results[4];
                defaultESEntry.mqaCatalog = results[5];
                defaultESEntry.conformsTo = specArr || null;

                if (fetchMore && !isConcept) {
                  if (results[5] || results[6]) {
                    defaultESEntry.contact = {
                      name: results[5],
                      email: parseEmail(results[6]),
                    };
                  }
                }
                if (isConcept && !fetchMore) {
                  defaultESEntry.termPublisher = results[5];
                }
              }

              setState({
                ...defaultESEntry,
              });
            })
            .catch((error: any) => {
              console.error({ error });
              if (
                error.message ===
                "Failed fetching entry. Error: Connection issue"
              ) {
                router.push("/404");
              }
            });
        } else {
          router.push("/404");
        }
      }
    });
  }, []);

  return (
    <EntrystoreContext.Provider value={state}>
      {children}
    </EntrystoreContext.Provider>
  );
};

export default EntrystoreProvider;
