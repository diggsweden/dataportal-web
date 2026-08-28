import type { Translate } from "@/i18n/types";

import { esbIcon } from "./icons";

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
    ` ${esbIcon("arrow")}` +
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
    ` ${esbIcon("arrow")}` +
    '"}}' +
    "</span>",
});
