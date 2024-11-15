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
import { entryCache } from "./localCache";
import { Choice, ChoiceTemplate, DCATData } from "./dcatUtils";

export const getLocalizedMetadataValue = (
  metadataGraph: any,
  prop: any,
  lang: string,
  options?: { resourceURI?: string },
) => {
  let val = "";
  const fallbackLang = "en";

  const stmts = metadataGraph.find(options?.resourceURI, prop);
  if (stmts.length > 0) {
    const obj: any = {};
    for (let s = 0; s < stmts.length; s++) {
      obj[stmts[s].getLanguage() || ""] = stmts[s].getValue();
    }

    if (typeof obj[lang] !== "undefined") {
      val = obj[lang];
    } else if (lang === "sv" && typeof obj[fallbackLang] !== "undefined") {
      val = obj[fallbackLang];
    } else {
      val = Object.entries(obj)[0][1] as string;
    }
  }

  return val;
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
export const getLocalizedValue = async (
  metadataGraph: any,
  prop: any,
  lang: string,
  es: any,
  options: { uriTypeName?: string; resourceURI?: string } = {
    uriTypeName: "foaf:name",
  },
) => {
  let val = "";
  const fallbackLang = "en";
  const { uriTypeName, resourceURI } = options;
  const stmts = metadataGraph.find(resourceURI, prop);
  if (stmts.length > 0) {
    const obj: any = {};
    for (let s = 0; s < stmts.length; s++) {
      let stType = stmts[s].getType();
      let stValue = stmts[s].getValue();

      if (stType && stType == "uri" && !stValue.includes("mailto:")) {
        let res = await resourcesSearch([stValue], es);
        if (res && res.length > 0) {
          let meta = res[0].getAllMetadata();

          if (meta)
            obj[stmts[s].getLanguage() || ""] = await getLocalizedValue(
              meta,
              uriTypeName || "foaf:name",
              lang,
              es,
              { resourceURI },
            );
        } else obj[stmts[s].getLanguage() || ""] = stValue;
      } else obj[stmts[s].getLanguage() || ""] = stValue;
    }

    if (typeof obj[lang] != "undefined") {
      val = obj[lang];
    } else if (obj[fallbackLang] && fallbackLang != lang) {
      val = obj[fallbackLang];
    } else {
      val = Object.entries(obj)[0][1] as string;
    }
  }

  return val;
};

export const getSimplifiedLocalizedValue = (
  metadata: Metadata,
  property: string,
) => {
  const values = metadata.find(null, property);
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
    (uri): uri is string => uri !== null && !cache.has(uri),
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
      if (entry) {
        const metadata = entry.getMetadata();
        const uri = entry.getResourceURI();
        const name =
          getSimplifiedLocalizedValue(metadata, "dcterms:title") ||
          getSimplifiedLocalizedValue(metadata, "foaf:name") ||
          getSimplifiedLocalizedValue(metadata, "skos:prefLabel") ||
          getSimplifiedLocalizedValue(metadata, "rdfs:label") ||
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
    let esQuery = es.newSolrQuery();
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
  let fallbackLang = "sv";

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
