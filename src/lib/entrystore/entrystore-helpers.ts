/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Entry,
  EntryStoreUtil,
  Metadata,
  MetadataValue,
} from "@entryscape/entrystore-js";
import type { EnvSettings } from "@/env";
import { SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import type { ResourceLabel } from "@/i18n/types";
import { ROUTE_CONFIG } from "@/lib/entrystore/entrystore-core";
import type { RedirectConfig } from "@/types/global";

import type { Choice, ChoiceTemplate, DCATData } from "@/utilities/dcat-utils";
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

    if (typeof obj[lang] !== "undefined") {
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
  resourceLabel: ResourceLabel,
  _property?: string,
  hasCustomProperties?: boolean,
) => {
  const cache = entryCache.get();
  const uniqueUris = Array.from(new Set(facetValues)).filter(
    (uri): uri is string =>
      uri !== null && uri !== "" && (!cache.has(uri) || cache.get(uri) === uri),
  );

  if (!uniqueUris.length) return cache;

  if (hasCustomProperties) {
    for (const uri of uniqueUris) {
      cache.set(uri, resourceLabel(uri));
    }
    return cache;
  }

  try {
    const entries = await esu.loadEntriesByResourceURIs(uniqueUris, null, true);
    for (const entry of entries as any[]) {
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
    }
    for (const uri of uniqueUris) {
      if (!cache.has(uri)) cache.set(uri, uri);
    }
  } catch (error) {
    console.error("Error fetching URI names:", error);
    for (const uri of uniqueUris) {
      cache.set(uri, uri);
    }
  }
  return cache;
};

/**
 * Search URL with one URI facet pre-selected (the `f=` facet-value format).
 * `rdfType` optionally restricts the result type via `rt=` (an `ESRdfType`
 * key, e.g. `term_class` / `term_property`).
 */
export function buildFacetSearchLink(
  path: string,
  predicate: string,
  resource: string,
  facetLabel: string,
  title: string,
  rdfType?: string,
): string {
  const facetValue = `${predicate}||${resource}||false||uri||${facetLabel}||${title}`;
  const rt = rdfType ? `&rt=${rdfType}` : "";
  return `/${path}?q=&f=${encodeURIComponent(facetValue)}${rt}`;
}

/** Base URL of the EntryStore, resolved against the given env. */
export function entryStoreBaseUrl(env: EnvSettings) {
  return `https://${env.ENTRYSCAPE_ADMIN_PATH}/store`;
}

export function createPathResolver(config: RedirectConfig) {
  return (hitMeta: Entry) => {
    const resourceUri = hitMeta.getResourceURI();
    const env = resourceUri.includes("sandbox")
      ? new Settings_Sandbox()
      : SettingsUtil.create();
    const baseUrl = resourceUri.includes("sandbox")
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

export const specsPathResolver = createPathResolver(ROUTE_CONFIG.specification);
export const conceptsPathResolver = createPathResolver(ROUTE_CONFIG.concept);
export const termsPathResolver = createPathResolver(ROUTE_CONFIG.terminology);
export const classPathResolver = createPathResolver(ROUTE_CONFIG.class);
export const propertyPathResolver = createPathResolver(ROUTE_CONFIG.property);

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
    choice.label.en ||
    choice.value
  );
}

// ============================================================================
// Formatting Helpers
// ============================================================================

export function parseEmail(email: string): string {
  return email.startsWith("mailto:") ? email : `mailto:${email}`;
}
