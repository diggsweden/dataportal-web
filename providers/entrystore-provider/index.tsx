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
import {
  Choice,
  fetchDCATMeta,
  handleLocale,
  includeLangInPath,
} from "@/utilities";
import {
  formatTerminologyAddress,
  getContactEmail,
  getFirstMatchingValue,
  getLocalizedChoiceLabel,
  getLocalizedValue,
  getTemplateChoices,
  termsPathResolver,
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
  cid?: string;
  eid?: string;
  rUri?: string;
  entryUri?: string;
  entrystoreUrl?: string;
  includeContact?: boolean;
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
  rUri,
  entrystoreUrl,
  includeContact,
  pageType,
}) => {
  const [state, setState] = useState(defaultESEntry);
  const router = useRouter();
  const { lang, t } = useTranslation();
  let entry: Entry;
  let resourceUri: string;

  const entrystoreService = EntrystoreService.getInstance({
    baseUrl:
      `https://${entrystoreUrl}/store` || "https://admin.dataportal.se/store",
    lang,
    t,
  });

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

  // Remove locale from path if it's the default locale
  useEffect(() => {
    handleLocale(window.location.pathname, lang, router.asPath, router);
  }, [router.asPath]);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      if (cid && eid) {
        entry = await entrystoreService.getEntry(cid, eid);
        resourceUri = entry.getResourceURI();
      } else if (rUri) {
        resourceUri = rUri;
        entry = await entrystoreService.getEntryByResourceURI(rUri);
      }

      if (!entry) return router.push("/404");

      const metadata = entry.getAllMetadata();

      // Parallel fetch for publisher info
      // TODO: Remove this when concepts and terminologies are moved to admin.dataportal.se
      const adminEntrystoreService =
        pageType === "concept" || pageType === "terminology"
          ? EntrystoreService.getInstance({
              baseUrl: `https://${
                entry.getEntryInfo().getMetadataURI().includes("sandbox")
                  ? "sandbox."
                  : ""
              }admin.dataportal.se/store`,
              lang,
              t,
            })
          : entrystoreService;
      const publisherPromise =
        pageType !== "mqa"
          ? await adminEntrystoreService.getPublisherInfo(resourceUri, metadata)
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
        adminEntrystoreService,
        publisherEntry,
        defaultESEntry.env,
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
    adminEntrystoreService: EntrystoreService,
    publisherEntry: Entry | null,
    env: EnvSettings,
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
        const [contact, organisationLink] = await Promise.all([
          entrystoreService.getContactInfo(metadata),
          entrystoreService.getOrganisationLink(publisherEntry),
        ]);
        return { contact, organisationLink };
      }

      case "organisation": {
        // Fetch all organisation data in parallel
        const [orgData, formats, mqa] = await Promise.all([
          getOrganisationDatasets(entry, resourceUri, metadata),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
          entrystoreService.getRelatedMQA(entry, pageType),
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
        // TODO: replace adminEntrystoreService with entrystoreService when concepts and terminologies are moved to admin.dataportal.se
        const [specs, formats, organisationLink] = await Promise.all([
          adminEntrystoreService.getRelatedSpecifications(
            entry,
            metadata,
            pageType,
          ),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
          entrystoreService.getOrganisationLink(publisherEntry),
        ]);

        return {
          relatedSpecifications: specs,
          address: formatTerminologyAddress(resourceUri, [
            env.PRODUCTION_BASE_URL,
            env.SANDBOX_BASE_URL,
          ]),
          downloadFormats: formats,
          organisationLink,
        };
      }

      case "specification": {
        // Fetch all data in parallel
        const [datasets, keywords, formats, organisationLink] =
          await Promise.all([
            entrystoreService.getRelatedDatasets(entry),
            entrystoreService.getKeywords(entry),
            entrystoreService.getDownloadFormats(
              entry.getEntryInfo().getMetadataURI(),
            ),
            entrystoreService.getOrganisationLink(publisherEntry),
          ]);

        return {
          relatedDatasets: datasets,
          keywords,
          downloadFormats: formats,
          organisationLink,
        };
      }

      case "concept": {
        // Fetch term and formats in parallel
        const [termEntry, formats] = await Promise.all([
          entrystoreService.getRelatedTerm(metadata, true) as Promise<Entry>,
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
        ]);
        // TODO: replace adminEntrystoreService with entrystoreService when concepts and terminologies are moved to admin.dataportal.se
        const spec = await adminEntrystoreService.getRelatedSpecifications(
          termEntry,
          termEntry.getAllMetadata(),
          pageType,
        );

        return {
          relatedTerm: {
            title: getLocalizedValue(
              termEntry.getAllMetadata(),
              "dcterms:title",
            ),
            url: `${includeLangInPath(lang)}${termsPathResolver(termEntry)}`,
          },
          downloadFormats: formats,
          relatedSpecifications: spec,
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
        showcases: [],
      };

      const termsEntrystoreService = EntrystoreService.getInstance({
        baseUrl: `https://${
          entry.getEntryInfo().getMetadataURI().includes("sandbox")
            ? "sandbox."
            : ""
        }editera.dataportal.se/store`,
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
          .uriFacet("dcterms:conformsTo")
          .list();

        await datasetCounts.getEntries();

        rawFacets = datasetCounts.getFacets();

        data.showcases = await entrystoreService.getShowcases(entry);

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

          const rdfTypeFacet = rawFacets.find(
            (f) =>
              f.predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
          );
          const apiData =
            rdfTypeFacet?.values?.find(
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

          const feeDataFacet = rdfTypeFacet?.values?.find(
            (f: ESFacetFieldValue) => f.name === "http://schema.org/Offer",
          );
          const feeData = feeDataFacet?.count || 0;
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
        <meta name="robots" content="index, follow" />
      </Head>
      {children}
    </EntrystoreContext.Provider>
  );
};
