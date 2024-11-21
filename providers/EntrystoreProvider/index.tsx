import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { EnvSettings } from "@/env/EnvSettings";
import { SettingsUtil } from "@/env/SettingsUtil";
import { getSimplifiedLocalizedValue } from "@/utilities";
import {
  Entry,
  EntryStore,
  EntryStoreUtil,
  Metadata,
} from "@entryscape/entrystore-js";

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
  isConcept?: boolean;
  hasResourceUri?: string;
  includeContact?: boolean;
  pageType: PageType;
}

type PageType =
  | "concept"
  | "terminology"
  | "specification"
  | "dataset"
  | "dataservice"
  | "apiexplore"
  | "mqa";

export interface ESEntry {
  env: EnvSettings;
  entrystore: EntryStore;
  entry: Entry;
  context: string;
  esId: string;
  loading: boolean;
  title: string;
  description: string;
  publisher: string;
  termPublisher: string;
  definition: string;
  contact?: ESContact;
  conformsTo?: RelationObj[];
  hasResource?: RelationObj[];
  address: string;
  downloadFormats?: Array<{ title: string; url: string }>;
  relatedSpecifications?: Array<{ title: string; url: string }>;
  relatedTerm?: { title: string; url: string };
  relatedConcepts?: Array<{ title: string; url: string }>;
  relatedDatasets?: Array<{ title: string; url: string }>;
  keywords?: Array<string>;
  mqaCatalog?: string;
}

export interface ESContact {
  name: string;
  email?: string;
}

const defaultESEntry: ESEntry = {
  env: SettingsUtil.getDefault(),
  entrystore: {} as EntryStore,
  entry: {} as Entry,
  loading: true,
  title: "",
  description: "",
  publisher: "",
  termPublisher: "",
  definition: "",
  conformsTo: [],
  hasResource: [],
  address: "",
  context: "",
  esId: "",
};

export const EntrystoreContext = createContext<ESEntry>(defaultESEntry);

/**
 * Provider for entrystore entry,
 * if contextid and entryid is sent in, we try to retrieve an entry from the configured EntryStore instance
 *
 * setting properties in the provider state (eg. title)
 */
export const EntrystoreProvider: React.FC<EntrystoreProviderProps> = ({
  children,
  cid,
  eid,
  entryUri,
  entrystoreUrl,
  hasResourceUri,
  includeContact,
  pageType,
}) => {
  const [state, setState] = useState(defaultESEntry);
  const router = useRouter();
  const { lang, t } = useTranslation();

  const es = new EntryStore(
    `https://${entrystoreUrl}/store` || "https://admin.dataportal.se/store",
  );
  const esu = new EntryStoreUtil(es);
  esu.loadOnlyPublicEntries(true);
  let entry = {} as Entry;

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      if (entryUri) {
        entry = await esu.getEntryByResourceURI(entryUri);
      } else if (cid && eid) {
        entry = await es.getEntry(es.getEntryURI(cid, eid));
      }

      if (!entry) return router.push("/404");

      const metadata = entry.getAllMetadata();
      const resourceUri = entry.getResourceURI();

      const title =
        getSimplifiedLocalizedValue(metadata, "dcterms:title") ||
        getSimplifiedLocalizedValue(metadata, "skos:prefLabel");

      const description =
        getSimplifiedLocalizedValue(metadata, "skos:definition") ||
        getSimplifiedLocalizedValue(metadata, "dcterms:description");

      const publisherUri = metadata.findFirstValue(null, "dcterms:publisher");

      let publisher = "";
      if (pageType !== "mqa") {
        if (publisherUri) {
          try {
            const publisherEntry =
              await esu.getEntryByResourceURI(publisherUri);
            if (publisherEntry) {
              publisher = getSimplifiedLocalizedValue(
                publisherEntry.getAllMetadata(),
                "foaf:name",
              );
            }
          } catch (error) {}
        } else {
          try {
            const specification = metadata.findFirstValue(
              null,
              "skos:inScheme",
            );
            if (specification) {
              const specificationEntry =
                await esu.getEntryByResourceURI(specification);
              if (specificationEntry) {
                const specificationMeta = specificationEntry.getAllMetadata();
                const publisherUri = specificationMeta.findFirstValue(
                  null,
                  "dcterms:publisher",
                );

                if (publisherUri) {
                  const publisherEntry =
                    await esu.getEntryByResourceURI(publisherUri);
                  if (publisherEntry) {
                    publisher = getSimplifiedLocalizedValue(
                      publisherEntry.getAllMetadata(),
                      "foaf:name",
                    );
                  }
                }
              }
            }
          } catch (error) {}
        }
      }

      const entryData: Partial<ESEntry> = {
        entrystore: es,
        entry,
        context: entry.getContext().getId(),
        esId: entry.getId(),
        title,
        address: resourceUri,
        description,
        publisher,
        loading: false,
      };

      if (includeContact) entryData.contact = await getContactInfo(metadata);

      switch (pageType) {
        case "dataset":
          entryData.relatedSpecifications = await getRelatedSpecifications(
            entry,
            metadata,
            pageType,
          );
          entryData.keywords = await getKeywords(entry);
          entryData.downloadFormats = getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          );
          break;
        case "dataservice":
          break;
        case "apiexplore":
          entryData.contact = await getContactInfo(metadata);
          break;
        case "terminology":
          entryData.relatedSpecifications = await getRelatedSpecifications(
            entry,
            metadata,
            pageType,
          );
          entryData.address = resourceUri.startsWith("https://dataportal.se")
            ? resourceUri.replace("concepts", "terminology")
            : resourceUri;
          entryData.downloadFormats = getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          );
          break;
        case "specification":
          entryData.relatedDatasets = await getRelatedDatasets(entry);
          entryData.keywords = await getKeywords(entry);
          entryData.downloadFormats = getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          );
          break;
        case "concept":
          entryData.relatedTerm = await getRelatedTerm(metadata);
          entryData.downloadFormats = getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          );
          break;
        case "mqa":
          break;
      }

      setState({
        ...defaultESEntry,
        ...entryData,
      });
    } catch (error) {
      router.push("/404");
      console.error("Failed to fetch entry:", error);
    }
  };

  const getContactInfo = async (metadata: Metadata) => {
    const contactPoint = metadata.findFirstValue(null, "dcat:contactPoint");

    const contactEntry = await esu.getEntryByResourceURI(contactPoint);
    const name = getSimplifiedLocalizedValue(
      contactEntry.getAllMetadata(),
      "http://www.w3.org/2006/vcard/ns#fn",
    );
    const email = parseEmail(
      getSimplifiedLocalizedValue(
        contactEntry.getAllMetadata(),
        "http://www.w3.org/2006/vcard/ns#hasEmail",
      ),
    );

    return { name, email };
  };

  const getRelatedDatasets = async (entry: Entry) => {
    const datasets = await es
      .newSolrQuery()
      .rdfType(["dcat:Dataset", "esterms:IndependentDataService"])
      .publicRead(true)
      .uriProperty("dcterms:conformsTo", entry.getResourceURI())
      .getEntries();

    const datasetArray = datasets.map((ds: any) => {
      return {
        title: getSimplifiedLocalizedValue(
          ds.getAllMetadata(),
          "dcterms:title",
        ),
        url: `/${lang}/datasets/${es.getContextId(
          ds.getEntryInfo().getMetadataURI(),
        )}_${ds.getId()}`,
      };
    });

    return datasetArray;
  };

  const getDownloadFormats = (baseUri: string) => {
    return [
      {
        title: t("pages|datasetpage$download-metadata-as") + " RDF/XML",
        url: baseUri,
      },
      {
        title: t("pages|datasetpage$download-metadata-as") + " TURTLE",
        url: baseUri + "?format=text/turtle",
      },
      {
        title: t("pages|datasetpage$download-metadata-as") + " N-TRIPLES",
        url: baseUri + "?format=text/n-triples",
      },
      {
        title: t("pages|datasetpage$download-metadata-as") + " JSON-LD",
        url: baseUri + "?format=application/ld+json",
      },
    ];
  };

  const getRelatedTerm = async (metadata: Metadata) => {
    const termUri = metadata.findFirstValue(null, "skos:inScheme");
    const termEntry = await esu.getEntryByResourceURI(termUri);

    console.log("termEntry", termUri);

    return {
      title: getSimplifiedLocalizedValue(
        termEntry.getAllMetadata(),
        "dcterms:title",
      ),
      url: termUri.startsWith("https://dataportal.se")
        ? new URL(termUri).pathname.replace("concepts", "terminology")
        : `/${lang}/externalterminology?resource=${termUri}`,
    };
  };

  const getRelatedSpecifications = async (
    entry: Entry,
    metadata: Metadata,
    pageType: PageType,
  ) => {
    try {
      if (pageType === "dataset") {
        const specifications = metadata
          .find(entry.getResourceURI(), "dcterms:conformsTo")
          .map((stmt: any) => stmt.getValue());

        const resourceEntries = await esu.loadEntriesByResourceURIs(
          specifications,
          null,
          true,
        );

        return resourceEntries
          .filter((e: any) => e)
          .map((e: any) => ({
            title: getSimplifiedLocalizedValue(
              e.getAllMetadata(),
              "dcterms:title",
            ),
            url: e.getResourceURI().startsWith("https://dataportal.se")
              ? new URL(e.getResourceURI()).pathname
              : `/${lang}/externalspecification?resource=${e.getResourceURI()}`,
          }));
      } else if (pageType === "terminology") {
        const specifications = await es
          .newSolrQuery()
          .uriProperty(
            "http://www.w3.org/ns/dx/prof/hasResource",
            hasResourceUri || entry.getResourceURI(),
          )
          .rdfType(["dcterms:Standard", "prof:Profile"])
          .publicRead(true)
          .getEntries();

        return specifications
          .filter((e: any) => e)
          .map((e: any) => ({
            title: getSimplifiedLocalizedValue(
              e.getAllMetadata(),
              "dcterms:title",
            ),
            url: e.getResourceURI().startsWith("https://dataportal.se")
              ? new URL(e.getResourceURI()).pathname
              : `/${lang}/externalspecification?resource=${e.getResourceURI()}`,
          }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching specifications:", error);
      return [];
    }
  };

  const getKeywords = async (entry: Entry) => {
    return entry
      .getAllMetadata()
      .find(null, "dcat:keyword")
      .map((k: any) => k.getValue());
  };

  const parseEmail = (email: string) => {
    return email.startsWith("mailto:") ? email : `mailto:${email}`;
  };

  if (state.loading) return null;

  return (
    <EntrystoreContext.Provider value={state}>
      {children}
    </EntrystoreContext.Provider>
  );
};

export default EntrystoreProvider;
