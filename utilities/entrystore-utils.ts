/* eslint-disable @typescript-eslint/no-explicit-any */
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

import {
  EntryStoreUtil,
  Metadata,
  MetadataValue,
} from "@entryscape/entrystore-js";

import { Choice, ChoiceTemplate, DCATData } from "./dcat-utils";
import { entryCache } from "./local-cache";

export const getLocalizedValue = (
  metadata: Metadata,
  property: string,
  resourceURI?: string,
) => {
  const values = metadata.find(resourceURI || null, property);
  // Try to find Swedish value first
  const svValue = values.find((v: MetadataValue) => v.getLanguage() === "sv");
  // Fall back to English if no Swedish
  const enValue = values.find((v: MetadataValue) => v.getLanguage() === "en");
  // Fall back to first value if neither Swedish nor English
  return (svValue || enValue || values[0])?.getValue() || "";
};

export const getUriNames = async (
  facetValues: string[],
  esu: EntryStoreUtil,
  property?: string,
) => {
  const cache = entryCache.get();
  // Filter out null values and already cached URIs
  const uniqueUris = Array.from(new Set(facetValues)).filter(
    (uri): uri is string => uri !== null && uri !== "" && !cache.has(uri),
  );

  if (uniqueUris.length === 0) {
    return cache;
  }

  try {
    // Load all entries in one batch with a single request
    const entries = await esu.loadEntriesByResourceURIs(
      uniqueUris,
      null,
      true,
      property,
    );

    // TODO: This is not efficient, we need to find another way in handling this
    // Process all entries at once
    entries.forEach((entry: any) => {
      console.log(entry);

      if (entry) {
        const metadata = entry.getMetadata();
        const uri = entry.getResourceURI();
        const name =
          getLocalizedValue(metadata, "dcterms:title", uri) ||
          getLocalizedValue(metadata, "foaf:name", uri) ||
          getLocalizedValue(metadata, "skos:prefLabel", uri) ||
          getLocalizedValue(metadata, "rdfs:label", uri) ||
          uri;

        cache.set(uri, name);
      }
    });

    // Cache any URIs that weren't found
    uniqueUris.forEach((uri) => {
      if (!cache.has(uri)) {
        cache.set(uri, uri);
      }
    });

    return cache;
  } catch (error) {
    console.error("Error fetching URI names:", error);
    uniqueUris.forEach((uri) => cache.set(uri, uri));
    return cache;
  }
};

/**
 * Get template choices from DCAT metadata
 * @param dcatMeta
 * @param propertyUri
 * @param id
 * @returns
 */
export function getTemplateChoices(
  dcatMeta: DCATData,
  propertyUri: string,
  id?: string,
) {
  // Find all templates with matching property URI
  const template = dcatMeta.templates.find(
    (t): t is ChoiceTemplate =>
      t.property === propertyUri && t.type === "choice" && (!id || t.id === id),
  );

  return template?.choices || [];
}

/**
 * Get localized choice label from template choices
 * @param choice
 * @param lang
 * @returns
 */
export function getLocalizedChoiceLabel(choice: Choice, lang: string) {
  return (
    choice.label[lang as keyof typeof choice.label] ||
    choice.label["en"] ||
    choice.value
  );
}

/**
 * Make SolrSearch and retrive entries from entryscape
 * Does not handle to large resource arrays, can leed to request URI errors,
 * use in batches
 *
 * @param resources
 * @param es
 */
export const resourcesSearch = (resources: string[], es: any): Promise<any> => {
  return new Promise<any>((resolve) => {
    const esQuery = es.newSolrQuery();
    esQuery.publicRead(true);
    esQuery
      .resource(resources, null)
      .getEntries(0)
      .then((children: any) => {
        resolve(children);
      });
  });
};

export const getEntryLang = (metadataGraph: any, prop: any, lang: string) => {
  let val = "";
  const fallbackLang = "sv";

  const stmts = metadataGraph.find(null, prop);
  if (stmts.length > 0) {
    const obj: any = {};
    for (let s = 0; s < stmts.length; s++) {
      obj[stmts[s].getLanguage() || ""] = stmts[s].getValue();
    }

    if (typeof obj[lang] != "undefined") {
      val = lang;
    } else {
      val = fallbackLang;
    }
  }

  return val;
};
