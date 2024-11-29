import {
  Entry,
  EntryStore,
  EntryStoreUtil,
  Metadata,
} from "@entryscape/entrystore-js";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { createContext, FC, ReactNode, useEffect, useState } from "react";

import { EnvSettings } from "@/env/env-settings";
import { SettingsUtil } from "@/env/settings-util";
import { getSimplifiedLocalizedValue } from "@/utilities/entrystore-utils";

type RelationObj = {
  title: string;
  url: string;
};

export interface EntrystoreProviderProps {
  env: EnvSettings;
  eid?: string;
  cid?: string;
  children?: ReactNode;
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
  | "organisation"
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
  mqaCatalog?: { title: string; url: string } | null;
  organisationData?: any;
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
export const EntrystoreProvider: FC<EntrystoreProviderProps> = ({
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

  // Add background class based on page type
  useEffect(() => {
    const body = document.querySelector("#top");

    if (pageType === "organisation") {
      body?.classList.add("organisation-background");
    }

    return () => {
      if (pageType === "organisation") {
        body?.classList.remove("organisation-background");
      }
    };
  }, [pageType]);

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
        getSimplifiedLocalizedValue(metadata, "dcterms:title", resourceUri) ||
        getSimplifiedLocalizedValue(metadata, "skos:prefLabel", resourceUri) ||
        getSimplifiedLocalizedValue(metadata, "foaf:name", resourceUri);

      const description =
        getSimplifiedLocalizedValue(metadata, "skos:definition", resourceUri) ||
        getSimplifiedLocalizedValue(
          metadata,
          "dcterms:description",
          resourceUri,
        );

      const publisherUri = metadata.findFirstValue(
        resourceUri,
        "dcterms:publisher",
      );

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
                publisherUri,
              );
            }
          } catch (error) {
            console.error("Failed to fetch publisher:", error);
          }
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
                      publisherUri,
                    );
                  }
                }
              }
            }
          } catch (error) {
            console.error("Failed to fetch publisher:", error);
          }
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
          entryData.mqaCatalog = await getRelatedMQA(entry);

          break;
        case "dataservice":
          break;
        case "apiexplore":
          entryData.contact = await getContactInfo(metadata);
          break;
        case "organisation":
          entryData.organisationData = await getOrganisationDatasets(
            entry,
            resourceUri,
            metadata,
          );
          entryData.contact = {
            name: metadata.findFirstValue(null, "foaf:name"),
            email:
              metadata.findFirstValue(null, "foaf:mbox") ||
              metadata.findFirstValue(null, "foaf:homepage"),
          };

          entryData.downloadFormats = getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          );

          entryData.mqaCatalog = await getRelatedMQA(entry);
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

    const datasetArray = datasets.map((ds: Entry) => {
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

  const getOrganisationDatasets = async (
    entry: Entry,
    uri: string,
    metadata: Metadata,
  ) => {
    try {
      const data: any = {
        datasets: {
          total: 0,
          totTitle: t("pages|organisation_page$all-data"),
          dataInfo: [
            { total: 0, title: t("pages|organisation_page$open-data") },
            { total: 0, title: t("pages|organisation_page$protected-data") },
            { total: 0, title: t("pages|organisation_page$api-data") },
            { total: 0, title: t("pages|organisation_page$hvd-data") },
            { total: 0, title: t("pages|organisation_page$fee-data") },
            { total: 0, title: t("pages|organisation_page$spec-data") },
          ],
          link: `/datasets?f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7C${encodeURIComponent(
            uri,
          )}%7C%7Cfalse%7C%7Curi%7C%7COrganisationer%7C%7C${encodeURIComponent(
            metadata.findFirstValue(null, "foaf:name"),
          )}`,
        },
        specifications: {
          total: 0,
          link: `/specifications?f=http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fpublisher%7C%7C${encodeURIComponent(
            uri,
          )}%7C%7Cfalse%7C%7Curi%7C%7CStandarder%7C%7C${encodeURIComponent(
            metadata.findFirstValue(null, "foaf:name"),
          )}`,
        },
        terms: { total: 0, termsInfo: [] },
      };

      const esTerms = new EntryStore(
        `https://${state.env.ENTRYSCAPE_TERMS_PATH}/store`,
      );

      const dcatMeta = await fetchDCATMeta();

      if (dcatMeta && dcatMeta.templates.length > 0) {
        const publisherTypeUri = entry
          .getAllMetadata()
          .findFirstValue(null, "dcterms:type");

        const orgTypeChoices = getTemplateChoices(
          dcatMeta,
          "dcterms:type",
          "adms:publishertype",
        ).find((c: any) => c.value === publisherTypeUri);

        if (orgTypeChoices) {
          data.orgType = getLocalizedChoiceLabel(orgTypeChoices, lang);
        }
      }

      let rawFacets: any[] = [];

      // Fetch dataset counts
      try {
        const datasetCounts = es
          .newSolrQuery()
          .rdfType(["dcat:Dataset", "esterms:IndependentDataService"])
          .uriProperty("dcterms:publisher", uri)
          .publicRead(true)
          .uriFacet("dcterms:accessRights")
          .uriFacet("rdf:type")
          .uriFacet("http://data.europa.eu/r5r/hvdCategory")
          .uriFacet("https://www.w3.org/ns/org#classification")
          .uriFacet("dcterms:conformsTo")
          .list();

        await datasetCounts.getEntries();

        rawFacets = datasetCounts.getFacets();
        if (rawFacets.length > 0) {
          const dataAccessFacet = rawFacets.find(
            (f) => f.predicate === "http://purl.org/dc/terms/accessRights",
          );
          const openData = dataAccessFacet?.values?.find(
            (v: any) =>
              v.name ===
              "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
          );

          data.datasets.dataInfo[0].total = openData?.count || 0;

          const protectedDataValues = dataAccessFacet?.values?.filter(
            (v: any) =>
              v.name ===
                "http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC" ||
              v.name ===
                "http://publications.europa.eu/resource/authority/access-right/RESTRICTED",
          );
          const protectedDataCount = protectedDataValues?.reduce(
            (sum: number, v: any) => sum + v.count,
            0,
          );

          data.datasets.dataInfo[1].total = protectedDataCount;

          const apiDataFacet = rawFacets.find(
            (f) =>
              f.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
          );
          const apiData =
            apiDataFacet?.values?.find(
              (v: any) =>
                v.name === "http://entryscape.com/terms/ServedByDataService",
            )?.count || 0;
          data.datasets.dataInfo[2].total = apiData;

          const hvdDataFacet = rawFacets.find(
            (f: any) => f.predicate === "http://data.europa.eu/r5r/hvdCategory",
          );
          const hvdData = hvdDataFacet?.valueCount || 0;
          data.datasets.dataInfo[3].total = hvdData;

          const feeDataFacet = rawFacets.find(
            (f: any) =>
              f.predicate === "https://www.w3.org/ns/org#classification",
          );
          const feeData = feeDataFacet?.valueCount || 0;
          data.datasets.dataInfo[4].total = feeData;

          data.datasets.total = datasetCounts.getSize();
        }
      } catch (error) {
        console.error("Error fetching organisation data:", error);
      }

      // Fetch specification counts
      try {
        const specifications = es
          .newSolrQuery()
          .rdfType(["dcterms:Standard", "prof:Profile"])
          .uriProperty("dcterms:publisher", uri)
          .publicRead(true)
          .list();

        const specificationsList = await specifications.getEntries();

        if (specificationsList?.length > 0) {
          const specificationUris = specificationsList.map((s) =>
            s.getResourceURI(),
          );
          const specificationData = rawFacets
            ?.find((f) => f.predicate === "http://purl.org/dc/terms/conformsTo")
            ?.values?.filter((v: any) => specificationUris.includes(v.name))
            ?.reduce((acc: any, v: any) => acc + v.count, 0);

          data.specifications.total = specifications.getSize();

          if (specificationData > 0) {
            data.datasets.dataInfo[5].total = specificationData;
          }
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }

      // Fetch terms counts
      try {
        const terms = esTerms
          .newSolrQuery()
          .publicRead(true)
          .limit(1000)
          .rdfType("http://www.w3.org/2004/02/skos/core#ConceptScheme")
          .uriProperty("dcterms:publisher", uri)
          .list();

        const termsList = await terms.getEntries();

        if (termsList?.length > 0) {
          data.terms.total = terms.getSize();
          data.terms.termsInfo = termsList
            .map((t) => ({
              title: getSimplifiedLocalizedValue(
                t.getAllMetadata(),
                "dcterms:title",
              ),
              url: t.getResourceURI().startsWith("https://dataportal.se")
                ? new URL(t.getResourceURI()).pathname.replace(
                    "concepts",
                    "terminology",
                  )
                : `/${lang}/externalterminology?resource=${t.getResourceURI()}`,
            }))
            .filter((t) => t.title && t.url);
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
      }

      return data;
    } catch (error) {
      console.error("Error fetching organisation data:", error);
    }
  };

  const getRelatedMQA = async (entry: Entry) => {
    try {
      const mqa = es.getEntryURI(entry.getContext().getId(), "_quality");
      const mqaEntry = await es.getEntry(mqa);
      const mqaMetadata = mqaEntry.getAllMetadata();
      const title = getSimplifiedLocalizedValue(mqaMetadata, "dcterms:title");
      const url = `/metadatakvalitet/katalog/_quality/${entry
        .getContext()
        .getId()}`;
      return { title, url };
    } catch {
      return null;
    }
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
          .map((stmt: { getValue: () => string }) => stmt.getValue());

        const resourceEntries = await esu.loadEntriesByResourceURIs(
          specifications,
          null,
          true,
        );

        return resourceEntries
          .filter((e: Entry) => e)
          .map((e: Entry) => ({
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
          .filter((e: Entry) => e)
          .map((e: Entry) => ({
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
      .map((k: { getValue: () => string }) => k.getValue());
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
