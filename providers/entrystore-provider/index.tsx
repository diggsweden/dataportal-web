import { Entry, EntryStore, Metadata } from "@entryscape/entrystore-js";
import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { createContext, FC, ReactNode, useEffect, useState } from "react";

import { EnvSettings } from "@/env";
import { SettingsUtil } from "@/env/settings-util";
import { ESEntry, PageType } from "@/types/entrystore-core";
import { OrganisationData } from "@/types/organisation";
import { ESFacetField, ESFacetFieldValue } from "@/types/search";
import { Choice, fetchDCATMeta } from "@/utilities";
import {
  formatTerminologyAddress,
  getContactEmail,
  getFirstMatchingValue,
  getLocalizedChoiceLabel,
  getLocalizedValue,
  getTemplateChoices,
} from "@/utilities/entrystore/entrystore-helpers";
import { EntrystoreService } from "@/utilities/entrystore/entrystore.service";

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

export interface EntrystoreProviderProps {
  env: EnvSettings;
  children: ReactNode;
  cid: string;
  eid: string;
  entryUri?: string;
  entrystoreUrl?: string;
  includeContact?: boolean;
  hasResourceUri?: string;
  pageType: PageType;
}

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
  entrystoreUrl,
  includeContact,
  pageType,
  hasResourceUri,
}) => {
  const [state, setState] = useState(defaultESEntry);
  const router = useRouter();
  const { lang, t } = useTranslation();

  const entrystoreService = EntrystoreService.getInstance({
    baseUrl:
      `https://${entrystoreUrl}/store` || "https://admin.dataportal.se/store",
    lang,
    t,
  });

  // TODO: Uncomment this when cors error is fixed
  // es.getREST().disableJSONP();

  entrystoreService.getEntryStoreUtil();

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
      const entry: Entry = await entrystoreService.getEntry(cid, eid);

      if (!entry) return router.push("/404");

      const metadata = entry.getAllMetadata();
      const resourceUri = entry.getResourceURI();

      // Parallel fetch for publisher info
      const publisherPromise =
        pageType !== "mqa"
          ? await entrystoreService.getPublisherInfo(resourceUri, metadata)
          : Promise.resolve({ name: "", entry: null });

      const entryData: Partial<ESEntry> = {
        entrystore: entrystoreService.getEntryStore(),
        entry,
        context: entry.getContext().getId(),
        esId: entry.getId(),
        title: getFirstMatchingValue(metadata, resourceUri, [
          "dcterms:title",
          "skos:prefLabel",
          "foaf:name",
        ]),
        description: getFirstMatchingValue(metadata, resourceUri, [
          "skos:definition",
          "dcterms:description",
        ]),
        address: resourceUri,
        organisationLink: undefined,
        loading: false,
      };

      const { name, entry: publisherEntry } = await publisherPromise;

      entryData.publisher = name;
      if (includeContact) {
        entryData.contact = await entrystoreService.getContactInfo(metadata);
      }

      const pageSpecificData = await getPageSpecificData(
        pageType,
        entry,
        metadata,
        resourceUri,
        entrystoreService,
        publisherEntry,
      );

      setState({
        ...defaultESEntry,
        ...entryData,
        ...pageSpecificData,
      });
    } catch (error) {
      console.error("Failed to fetch entry:", error);
      router.push("/404");
    }
  };

  async function getPageSpecificData(
    pageType: PageType,
    entry: Entry,
    metadata: Metadata,
    resourceUri: string,
    entrystoreService: EntrystoreService,
    publisherEntry: Entry | null,
  ): Promise<Partial<ESEntry>> {
    switch (pageType) {
      case "dataset": {
        // Fetch all data in parallel
        const [specs, keywords, formats, mqa, dataseries, organisationLink] =
          await Promise.all([
            entrystoreService.getRelatedSpecifications(
              entry,
              metadata,
              pageType,
            ),
            entrystoreService.getKeywords(entry),
            entrystoreService.getDownloadFormats(
              entry.getEntryInfo().getMetadataURI(),
            ),
            entrystoreService.getRelatedMQA(entry),
            entrystoreService.getRelatedDatasetSeries(entry, metadata),
            entrystoreService.getOrganisationLink(publisherEntry),
          ]);

        return {
          relatedSpecifications: specs,
          keywords,
          downloadFormats: formats,
          mqaCatalog: mqa,
          relatedDatasetSeries: dataseries,
          organisationLink,
        };
      }

      case "dataset-series":
        return {};

      case "dataservice":
        return {};

      case "apiexplore": {
        const contact = await entrystoreService.getContactInfo(metadata);
        return { contact };
      }

      case "organisation": {
        // Fetch all organisation data in parallel
        const [orgData, formats, mqa] = await Promise.all([
          getOrganisationDatasets(entry, resourceUri, metadata),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
          entrystoreService.getRelatedMQA(entry),
        ]);

        return {
          organisationData: orgData,
          contact: {
            name: metadata.findFirstValue(null, "foaf:name"),
            email: getContactEmail(metadata),
          },
          downloadFormats: formats,
          mqaCatalog: mqa,
        };
      }

      case "terminology": {
        // Fetch specifications and formats in parallel
        const [specs, formats] = await Promise.all([
          entrystoreService.getRelatedSpecifications(
            entry,
            metadata,
            pageType,
            hasResourceUri,
          ),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
        ]);

        return {
          relatedSpecifications: specs,
          address: formatTerminologyAddress(resourceUri),
          downloadFormats: formats,
        };
      }

      case "specification": {
        // Fetch all data in parallel
        const [datasets, keywords, formats] = await Promise.all([
          entrystoreService.getRelatedDatasets(entry),
          entrystoreService.getKeywords(entry),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
        ]);

        return {
          relatedDatasets: datasets,
          keywords,
          downloadFormats: formats,
        };
      }

      case "concept": {
        // Fetch term and formats in parallel
        const [term, formats] = await Promise.all([
          entrystoreService.getRelatedTerm(metadata),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
        ]);

        return {
          relatedTerm: term,
          downloadFormats: formats,
        };
      }

      case "mqa":
        return {};

      default:
        return {};
    }
  }

  const getOrganisationDatasets = async (
    entry: Entry,
    uri: string,
    metadata: Metadata,
  ) => {
    try {
      const data: OrganisationData = {
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
        orgClassification: metadata.findFirstValue(null, "org:classification"),
        orgNumber: metadata.findFirstValue(null, "dcterms:identifier"),
        orgType: "",
      };

      const termsEntrystoreService = EntrystoreService.getInstance({
        baseUrl: `https://${state.env.ENTRYSCAPE_TERMS_PATH}/store`,
        lang,
        t,
      });

      const dcatMeta = await fetchDCATMeta();

      if (dcatMeta && dcatMeta.templates.length > 0) {
        const publisherTypeUri = metadata.findFirstValue(null, "dcterms:type");

        const orgTypeChoices = getTemplateChoices(
          dcatMeta,
          "dcterms:type",
          "adms:publishertype",
        ).find((c: Choice) => c.value === publisherTypeUri);

        if (orgTypeChoices) {
          data.orgType = getLocalizedChoiceLabel(orgTypeChoices, lang);
        }
      }

      let rawFacets: ESFacetField[] = [];

      // Fetch dataset counts
      try {
        const datasetCounts = entrystoreService
          .getEntryStore()
          .newSolrQuery()
          .rdfType(["dcat:Dataset", "esterms:IndependentDataService"])
          .uriProperty("dcterms:publisher", uri)
          .publicRead(true)
          .uriFacet("dcterms:accessRights")
          .uriFacet("rdf:type")
          .uriFacet("http://data.europa.eu/r5r/hvdCategory")
          .uriFacet("schema:offers")
          .uriFacet("dcterms:conformsTo")
          .list();

        await datasetCounts.getEntries();

        rawFacets = datasetCounts.getFacets();

        if (rawFacets.length > 0) {
          const dataAccessFacet = rawFacets.find(
            (f) => f.predicate === "http://purl.org/dc/terms/accessRights",
          );
          const openData = dataAccessFacet?.values?.find(
            (v: ESFacetFieldValue) =>
              v.name ===
              "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
          );

          data.datasets.dataInfo[0].total = openData?.count || 0;

          const protectedDataValues = dataAccessFacet?.values?.filter(
            (v: ESFacetFieldValue) =>
              v.name ===
                "http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC" ||
              v.name ===
                "http://publications.europa.eu/resource/authority/access-right/RESTRICTED",
          );
          const protectedDataCount = protectedDataValues?.reduce(
            (sum: number, v: ESFacetFieldValue) => sum + v.count,
            0,
          );

          data.datasets.dataInfo[1].total = protectedDataCount || 0;

          const apiDataFacet = rawFacets.find(
            (f) =>
              f.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
          );
          const apiData =
            apiDataFacet?.values?.find(
              (v: ESFacetFieldValue) =>
                v.name === "http://entryscape.com/terms/ServedByDataService",
            )?.count || 0;
          data.datasets.dataInfo[2].total = apiData;

          const hvdDataFacet = rawFacets.find(
            (f: ESFacetField) =>
              f.predicate === "http://data.europa.eu/r5r/hvdCategory",
          );
          const hvdData = hvdDataFacet?.valueCount || 0;
          data.datasets.dataInfo[3].total = hvdData;

          const feeDataFacet = rawFacets.find(
            (f: ESFacetField) => f.predicate === "http://schema.org/offers",
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
        const specifications = entrystoreService
          .getEntryStore()
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
            ?.values?.filter((v: ESFacetFieldValue) =>
              specificationUris.includes(v.name),
            )
            ?.reduce((acc: number, v: ESFacetFieldValue) => acc + v.count, 0);

          data.specifications.total = specifications.getSize();

          if (specificationData && specificationData > 0) {
            data.datasets.dataInfo[5].total = specificationData;
          }
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }

      // Fetch terms counts
      try {
        const terms = termsEntrystoreService
          .getEntryStore()
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
              title: getLocalizedValue(t.getAllMetadata(), "dcterms:title"),
              url: `/${lang}/terminology/${t
                .getContext()
                .getId()}_${t.getId()}`,
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

  if (state.loading) return null;

  return (
    <EntrystoreContext.Provider value={state}>
      <Head>
        <title>{`${state.title} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${state.title} - Sveriges dataportal`}
          key="og:title"
        />
        <meta
          name="twitter:title"
          content={`${state.title} - Sveriges dataportal`}
          key="twitter:title"
        />
        <meta
          name="description"
          content={`${state.description} - Sveriges dataportal`}
          key="description"
        />
        <meta
          property="og:description"
          content={`${state.description} - Sveriges dataportal`}
          key="og:description"
        />
        <meta
          name="twitter:description"
          content={`${state.description} - Sveriges dataportal`}
          key="twitter:description"
        />
      </Head>
      {children}
    </EntrystoreContext.Provider>
  );
};
