import type { Entry } from "@entryscape/entrystore-js";
import type { Translate } from "@/i18n/types";
import {
  conceptsPathResolver,
  getLocalizedValue,
  includeLangInPath,
} from "@/utilities";

/**
 * Builds a `run` block that renders a single anchor to an in-app resource page
 * and wires it to the SPA click bridge. `resolve` supplies the per-entry label
 * and app path; everything else (anchor creation, lang prefix, click handling)
 * is shared. A `run` block is needed rather than a `before` + template because
 * the link must have both a computed pretty href and an SPA `onclick` — a
 * template can only express a config named-click or a full-reload anchor.
 */
const resourceLinkBlock = (
  block: string,
  lang: string,
  resolve: (entry: Entry) => { label: string; path: string },
) => ({
  block,
  loadEntry: true,
  run: (node: any, _data: any, _items: any, entry: Entry) => {
    if (!node || !entry) return;
    const { label, path } = resolve(entry);
    const href = `${includeLangInPath(lang)}${path}`;

    const link = document.createElement("a");
    link.setAttribute("href", href);
    link.textContent = label;
    link.onclick = (event) => {
      window.__entryscape_blocks_click?.(href, event);
    };
    node.replaceChildren(link);
  },
});

/**
 * Row/single link for specification listings. Derives the vanity path from the
 * spec entry's resource URI pathname; falls back to store ids only when that is
 * not a /specifications path.
 */
export const specificationLink = (lang: string) =>
  resourceLinkBlock("specificationLink", lang, (entry) => {
    const resourceURI = entry.getResourceURI();

    let path = "";
    try {
      const { pathname } = new URL(resourceURI);
      if (pathname.startsWith("/specifications/")) path = pathname;
    } catch {
      // resourceURI wasn't an absolute URL — fall back to ids below.
    }
    if (!path) {
      path = `/specifications/${entry.getContext().getId()}_${entry.getId()}`;
    }

    return {
      label:
        getLocalizedValue(entry.getAllMetadata(), "dcterms:title") ||
        resourceURI,
      path,
    };
  });

/**
 * Row/single link for concepts. `conceptsPathResolver` yields the pretty path
 * for in-store concepts and the id path otherwise, so the link points straight
 * at the canonical URL (no redirect).
 */
export const conceptLink = (lang: string) =>
  resourceLinkBlock("conceptLink", lang, (entry) => ({
    label:
      getLocalizedValue(entry.getAllMetadata(), "skos:prefLabel") ||
      entry.getResourceURI(),
    path: conceptsPathResolver(entry),
  }));

/**
 * "Utforska API" link, shown only when the current entry has a detected API
 * (`window.__es_has_apis`, populated by ApiIndexProvider). Reused per distribution
 * row on the dataset page and standalone on the data service page, so the button
 * styling and icon live here once. Navigation goes through the `exploreApi`
 * named-click, which each page's config points at the apiexplore route.
 * `linkClass` carries page-specific spacing — empty by default (standalone link);
 * callers that need row/inline spacing pass it in.
 */
export const exploreApiLink = (cid: string, t: Translate, linkClass = "") => ({
  block: "exploreApiLink",
  extends: "template",
  loadEntry: true,
  before: (_node: any, data: any) => {
    const entryId = data?.entry?.getId?.();
    data.hasApi =
      !!entryId &&
      Array.isArray(window.__es_has_apis) &&
      window.__es_has_apis.includes(`${cid}_${entryId}`);
    return Promise.resolve();
  },
  template:
    "{{#if hasApi}}" +
    `{{link namedclick="exploreApi" class="button button--primary button--large ${linkClass}" content="` +
    t("pages.datasetpage.explore-api") +
    " <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><path d='M4.08008 11V13H16.0801L10.5801 18.5L12.0001 19.92L19.9201 12L12.0001 4.08002L10.5801 5.50002L16.0801 11H4.08008Z' fill='currentColor'/></svg>" +
    '"}}' +
    "{{/if}}",
});

/**
 * Per-distribution-row block for a dataset's `dcat:accessService`: shows the
 * linked data service's endpoint/type and a "read about API" button that
 * navigates to the service page via the `dataservice-link` named-click.
 */
export const accessServiceCustom = (t: Translate) => ({
  block: "accessServiceCustom",
  extends: "template",
  relation: "dcat:accessService",
  template:
    '<span class="border-t border-brown-600 pt-md flex flex-col">' +
    '{{view rdformsid="dcat:endpointDescription,dcat:dcterms:type_ds"}}' +
    '{{link namedclick="dataservice-link" class="button button--primary button--large" content="' +
    t("pages.datasetpage.read_about_api") +
    " <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' class='flex-shrink-0'><path d='M4.08008 11V13H16.0801L10.5801 18.5L12.0001 19.92L19.9201 12L12.0001 4.08002L10.5801 5.50002L16.0801 11H4.08008Z' fill='currentColor'/></svg>" +
    '"}}' +
    "</span>",
});
