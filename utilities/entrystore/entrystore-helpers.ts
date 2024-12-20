/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Entry,
  EntryStoreUtil,
  Metadata,
  MetadataValue,
} from "@entryscape/entrystore-js";
// @ts-expect-error no types
import lucene from "lucene";

import { SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import { RedirectConfig } from "@/types/global";

import { Choice, ChoiceTemplate, DCATData } from "../dcat-utils";
import { entryCache } from "./local-cache";

// ============================================================================
// Metadata Value Helpers
// ============================================================================

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

export function getFirstMatchingValue(
  metadata: Metadata,
  resourceUri: string,
  predicates: string[],
): string {
  for (const predicate of predicates) {
    const value = getLocalizedValue(metadata, predicate, resourceUri);
    if (value) return value;
  }
  return "";
}

export function getContactEmail(metadata: Metadata): string {
  return (
    metadata.findFirstValue(null, "foaf:mbox") ||
    metadata.findFirstValue(null, "foaf:homepage") ||
    ""
  );
}

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

// ============================================================================
// URI and Resource Helpers
// ============================================================================

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

export function formatDatasetUrl(
  ds: Entry,
  lang: string,
  contextId: string,
  baseUrls: string[],
): string {
  return baseUrls.some((url) => ds.getResourceURI().startsWith(url))
    ? new URL(ds.getResourceURI()).pathname
    : `/${lang}/datasets/${contextId}_${ds.getId()}`;
}

export function formatSpecificationUrl(
  uri: string,
  lang: string,
  baseUrls: string[],
): string {
  return baseUrls.some((url) => uri.startsWith(url))
    ? new URL(uri).pathname
    : `/${lang}/externalspecification?resource=${uri}`;
}

export function formatTerminologyAddress(
  resourceUri: string,
  baseUrls: string[],
): string {
  return baseUrls.some((url) => resourceUri.startsWith(url))
    ? resourceUri.replace("concepts", "terminology")
    : resourceUri;
}

export function createPathResolver(config: RedirectConfig) {
  return (hitMeta: Entry) => {
    const resourceUri = hitMeta.getResourceURI();
    const env = resourceUri.includes("sandbox")
      ? new Settings_Sandbox()
      : SettingsUtil.create();
    const baseUrl = env[config.entrystorePathKey].includes("sandbox")
      ? env.SANDBOX_BASE_URL
      : env.PRODUCTION_BASE_URL;

    if (!resourceUri) return "";

    if (!resourceUri.startsWith(baseUrl)) {
      return `${config.redirectPath}/${hitMeta
        .getContext()
        .getId()}_${hitMeta.getId()}`;
    }
    if (resourceUri.startsWith(baseUrl)) {
      return `${config.redirectPath}${resourceUri.replace(
        `${baseUrl}${config.pathPrefix}`,
        "",
      )}`;
    }

    return resourceUri;
  };
}

export const specsPathResolver = createPathResolver({
  pathPrefix: "/specifications",
  redirectPath: "/specifications",
  entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
});

export const conceptsPathResolver = createPathResolver({
  pathPrefix: "/concepts",
  redirectPath: "/concepts",
  entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
});

export const termsPathResolver = createPathResolver({
  pathPrefix: "/concepts",
  redirectPath: "/terminology",
  entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
});

// ============================================================================
// Template and Choice Helpers
// ============================================================================

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

export function getLocalizedChoiceLabel(choice: Choice, lang: string) {
  return (
    choice.label[lang as keyof typeof choice.label] ||
    choice.label["en"] ||
    choice.value
  );
}

// ============================================================================
// Search and Query Helpers
// ============================================================================

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

export function luceneFriendlyQuery(query: string): string {
  if (query === "AND" || query === "NOT" || query === "OR") return "*";
  try {
    const ast = lucene.parse(query);
    let q = lucene.toString(ast);
    q = q
      .replace(/\\~ /g, "~")
      .replace(/\+-/g, "")
      .replace(/ NOT -/g, " NOT ")
      .replace(/ AND NOT /g, "+NOT+")
      .replace(/ OR NOT /g, "+NOT+")
      .replace(/ OR /g, "+OR+")
      .replace(/ AND /g, "+AND+")
      .replace(/ NOT /g, "+-");
    if (q.indexOf('"') === -1) q = q.replace(/ /g, "+AND+");
    return q || "*";
  } catch {
    // eslint-disable-next-line no-useless-escape
    return query.replace(/[\!\*\-\+\&\|\(\)\[\]\{\}\^\\~\?\:\"]/g, "").trim();
  }
}

// ============================================================================
// Formatting Helpers
// ============================================================================

export function parseEmail(email: string): string {
  return email.startsWith("mailto:") ? email : `mailto:${email}`;
}
