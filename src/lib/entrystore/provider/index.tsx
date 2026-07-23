"use client";

import type { Entry, EntryStore, Metadata } from "@entryscape/entrystore-js";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  createContext,
  type FC,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import type { EnvSettings } from "@/env";
import { SettingsUtil } from "@/env/settings-util";
import { useResourceLabel } from "@/i18n/use-resource-label";
import { useEntryScapeBlocks } from "@/lib/entryscape-blocks/use-blocks";
import { EntrystoreService } from "@/lib/entrystore/entrystore.service";
import {
  type EntryStoreName,
  type ESEntry,
  type PageType,
  ROUTE_CONFIG,
} from "@/lib/entrystore/entrystore-core";
import {
  buildFacetSearchLink,
  formatTerminologyAddress,
  getContactEmail,
  getFirstMatchingValue,
  getLocalizedChoiceLabel,
  getLocalizedValue,
  getTemplateChoices,
  termsPathResolver,
} from "@/lib/entrystore/entrystore-helpers";
import type { OrganisationData } from "@/types/organisation";
import type { ESFacetField, ESFacetFieldValue } from "@/types/search";
import {
  type Choice,
  fetchDCATMeta,
  handleLocale,
  includeLangInPath,
} from "@/utilities";

const defaultESEntry: ESEntry = {
  env: SettingsUtil.getDefault(),
  entrystore: {} as EntryStore,
  entry: {} as Entry,
  loading: true,
  title: "",
  description: "",
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
  includeContact?: boolean;
  pageType: PageType;
}

/**
 * The two physical EntryStores. `admin` (admin.dataportal.se) holds datasets,
 * specifications, MQA and data vocabularies; `editera` (editera.dataportal.se)
 * holds concepts, terminologies, classes and properties. A page uses its
 * primary store and reaches across to the other explicitly for cross-store
 * links (e.g. a property → its data vocabulary).
 */
export interface EntryStores {
  admin: EntrystoreService;
  editera: EntrystoreService;
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
  env,
  cid,
  eid,
  rUri,
  includeContact,
  pageType,
}) => {
  const [state, setState] = useState(defaultESEntry);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const lang = useLocale();
  const resourceLabel = useResourceLabel();
  let entry: Entry;
  let resourceUri: string;

  // Both physical stores, always available. The page's `store` picks the
  // primary (used to load the entry and for its own-store fetches); cross-store
  // work names the other one explicitly.
  const makeStore = (name: EntryStoreName) =>
    EntrystoreService.getInstance({ store: name, env, lang, t, resourceLabel });
  const stores: EntryStores = {
    admin: makeStore("admin"),
    editera: makeStore("editera"),
  };
  const entrystoreService = stores[ROUTE_CONFIG[pageType].store];

  entrystoreService.getEntryStoreUtil();

  useEntryScapeBlocks({
    entrystoreBase: entrystoreService.getEntryStore().getBaseURI(),
    env,
    lang,
    pageType,
    context: state.context,
    esId: state.esId,
  });

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
    if (pathname)
      handleLocale(window.location.pathname, lang, pathname, router);
  }, [pathname]);

  // Refetch when the entry identifiers change so SPA navigation between two
  // resources of the same type loads the new entry instead of reusing the
  // first mount's data (the provider instance persists across such navigation).
  useEffect(() => {
    fetchEntry();
  }, [cid, eid]);

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

      // Publishers live in the admin store.
      const publisherPromise =
        pageType !== "mqa"
          ? await stores.admin.getPublisherInfo(resourceUri, metadata)
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
          "rdfs:label",
        ]),
        description: getFirstMatchingValue(metadata, resourceUri, [
          "skos:definition",
          "dcterms:description",
        ]),
        address: resourceUri,
        loading: false,
      };

      const { name, entry: publisherEntry } = await publisherPromise;

      // The publisher name is the default related resource (shown as plain text
      // where there is no link). Org-based pages add the organisation-page link
      // in getPageSpecificData, and concept/class/property override it entirely.
      entryData.relatedResource = name ? { title: name } : undefined;
      if (includeContact) {
        entryData.contact = await entrystoreService.getContactInfo(metadata);
      }

      const pageSpecificData = await getPageSpecificData(
        pageType,
        entry,
        metadata,
        resourceUri,
        entrystoreService,
        stores,
        publisherEntry,
        name,
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
    stores: EntryStores,
    publisherEntry: Entry | null,
    publisherName: string,
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
          relatedSpecifications: specs.all,
          keywords,
          downloadFormats: formats,
          mqaCatalog: mqa,
          relatedDatasetSeries: dataseries,
          relatedResource: publisherName
            ? { title: publisherName, url: organisationLink || undefined }
            : undefined,
        };
      }

      case "dataset-series": {
        // Fetch all data in parallel for dataset-series
        const [keywords, formats, mqa, contact] = await Promise.all([
          entrystoreService.getKeywords(entry),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
          entrystoreService.getRelatedMQA(entry),
          entrystoreService.getContactInfo(metadata),
        ]);

        return {
          keywords,
          downloadFormats: formats,
          mqaCatalog: mqa,
          contact,
        };
      }

      case "dataservice":
        return {};

      case "apiexplore": {
        const [contact, organisationLink] = await Promise.all([
          entrystoreService.getContactInfo(metadata),
          entrystoreService.getOrganisationLink(publisherEntry),
        ]);
        return {
          contact,
          relatedResource: publisherName
            ? { title: publisherName, url: organisationLink || undefined }
            : undefined,
        };
      }

      case "organisation": {
        // Fetch all organisation data in parallel
        const [orgData, formats, mqa] = await Promise.all([
          getOrganisationDatasets(entry, resourceUri, metadata, stores),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
          entrystoreService.getRelatedMQA(entry, pageType),
        ]);

        return {
          organisationData: orgData,
          contact: {
            title: metadata.findFirstValue(null, "foaf:name"),
            url: getContactEmail(metadata),
          },
          downloadFormats: formats,
          mqaCatalog: mqa,
        };
      }

      case "terminology": {
        // Fetch specifications and formats in parallel. Specs live in the
        // admin store.
        const [specs, formats, organisationLink] = await Promise.all([
          stores.admin.getRelatedSpecifications(entry, metadata, pageType),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
          entrystoreService.getOrganisationLink(publisherEntry),
        ]);

        return {
          relatedSpecifications: specs.all,
          address: formatTerminologyAddress(resourceUri, [
            env.PRODUCTION_BASE_URL,
            env.SANDBOX_BASE_URL,
          ]),
          downloadFormats: formats,
          relatedResource: publisherName
            ? { title: publisherName, url: organisationLink || undefined }
            : undefined,
        };
      }

      case "specification": {
        // Fetch all data in parallel
        const [datasets, keywords, formats, organisationLink, image, terms] =
          await Promise.all([
            entrystoreService.getRelatedDatasets(entry),
            entrystoreService.getKeywords(entry),
            entrystoreService.getDownloadFormats(
              entry.getEntryInfo().getMetadataURI(),
            ),
            entrystoreService.getOrganisationLink(publisherEntry),
            entrystoreService.getSpecificationImage(entry),
            entrystoreService.getSpecTerms(entry, stores.editera),
          ]);

        return {
          relatedDatasets: datasets.all,
          relatedDatasetsGrunddata: datasets.grunddata,
          keywords,
          downloadFormats: formats,
          image,
          ...terms,
          relatedResource: publisherName
            ? { title: publisherName, url: organisationLink || undefined }
            : undefined,
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
        // Specs live in the admin store.
        const spec = await stores.admin.getRelatedSpecifications(
          termEntry,
          termEntry.getAllMetadata(),
          pageType,
        );

        return {
          relatedResource: {
            title: getLocalizedValue(
              termEntry.getAllMetadata(),
              "dcterms:title",
            ),
            url: `${includeLangInPath(lang)}${termsPathResolver(termEntry)}`,
          },
          downloadFormats: formats,
          relatedSpecifications: spec.all,
        };
      }

      case "class":
      case "property": {
        // Fetch data structure details and formats in parallel
        const [definedBy, formats] = await Promise.all([
          entrystoreService.getDataVocabularyLink(metadata, stores.admin),
          entrystoreService.getDownloadFormats(
            entry.getEntryInfo().getMetadataURI(),
          ),
        ]);

        return {
          relatedResource: definedBy,
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
    stores: EntryStores,
  ) => {
    try {
      const data: OrganisationData = {
        datasets: {
          total: 0,
          totTitle: t("pages.organisation_page.all-data"),
          dataInfo: [
            { total: 0, title: t("pages.organisation_page.open-data") },
            { total: 0, title: t("pages.organisation_page.protected-data") },
            { total: 0, title: t("pages.organisation_page.api-data") },
            { total: 0, title: t("pages.organisation_page.hvd-data") },
            { total: 0, title: t("pages.organisation_page.fee-data") },
            { total: 0, title: t("pages.organisation_page.spec-data") },
          ],
          link: buildFacetSearchLink(
            "datasets",
            "http://purl.org/dc/terms/publisher",
            uri,
            "Organisationer",
            metadata.findFirstValue(null, "foaf:name"),
          ),
        },
        specifications: {
          total: 0,
          link: buildFacetSearchLink(
            "specifications",
            "http://purl.org/dc/terms/publisher",
            uri,
            "Standarder",
            metadata.findFirstValue(null, "foaf:name"),
          ),
        },
        terms: { total: 0, termsInfo: [] },
        orgClassification: metadata.findFirstValue(null, "org:classification"),
        orgNumber: metadata.findFirstValue(null, "dcterms:identifier"),
        orgType: "",
        showcases: [],
      };

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
        const terms = stores.editera
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
              url: `${includeLangInPath(lang)}/terminology/${t
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
      {children}
    </EntrystoreContext.Provider>
  );
};
