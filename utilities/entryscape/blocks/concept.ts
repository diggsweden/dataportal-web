/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entry } from "@entryscape/entrystore-js";
import { Translate } from "next-translate";

import { getSimplifiedLocalizedValue } from "@/utilities/entrystore-utils";

export const conceptBlocks = (t: Translate, iconSize: number, lang: string) => [
  {
    block: "broaderList",
    extends: "template",
    relation: "skos:broader",
    class: "entryscape",
    template: "{{conceptLink}}",
  },
  {
    block: "narrowerList",
    extends: "list",
    layout: "raw",
    rowhead: "{{conceptLink}}",
    relation: "skos:narrower",
    click: "./",
    class: "text-md link",
    limit: 20,
    content: "${skos:prefLabel}",
  },
  {
    block: "relatedList",
    extends: "list",
    layout: "raw",
    relation: "skos:related",
    click: "./",
    limit: 20,
    class: "text-md link",
    content: "${skos:prefLabel}",
    rowhead: "{{conceptLink}}",
  },
  {
    block: "conceptLink",
    run: function (node: any, a2: any, a3: any, entry: Entry) {
      if (node && node.firstElementChild && entry) {
        const el = document.createElement("a");

        node.setAttribute("class", "entryscape");

        node.firstElementChild.appendChild(el);

        const ruri = entry.getResourceURI();
        const label = getSimplifiedLocalizedValue(
          entry.getAllMetadata(),
          "skos:prefLabel",
        );
        el.innerHTML = label;
        const dpUri = getDataportalUri(ruri, lang);
        el.setAttribute("href", dpUri);
      }
    },
    loadEntry: true,
  },
  {
    block: "conceptBlock",
    class: "conceptDetail",
    extends: "template",
    template:
      '{{#ifprop "skos:altLabel"}}' +
      "<div><h2>" +
      t("pages|concept_page$alternativ_term") +
      '</h2><span>{{ text content="${skos:altLabel}" }}</span></div>' +
      "{{/ifprop}}" +
      '{{#ifprop "skos:example"}}<div><h2>' +
      t("pages|concept_page$example") +
      '</h2><span>{{ text content="${skos:example}" }}</span></div>' +
      "{{/ifprop}}" +
      '{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}' +
      '{{#ifprop "skos:broader"}}' +
      "<div>" +
      "<h2>" +
      t("pages|concept_page$superior_concept") +
      "</h2>" +
      "{{broaderList}}" +
      "</div>" +
      "{{/ifprop}}" +
      '{{#ifprop "skos:broader" invert="true"}}' +
      "<div>" +
      "<h2>" +
      t("pages|concept_page$superior_concept") +
      "</h2>" +
      '<span class="mb-xl">' +
      t("pages|concept_page$no_superior_concept") +
      "</span>" +
      "</div>" +
      "{{/ifprop}}" +
      '{{#ifprop "skos:narrower"}}' +
      '<div class="totConcepts">' +
      "<h2>" +
      t("pages|concept_page$subordinate_concepts") +
      "</h2>" +
      "{{narrowerList}}" +
      "</div>" +
      "{{/ifprop}}" +
      '{{#ifprop "skos:narrower" invert="true"}}' +
      "<div>" +
      "<h2>" +
      t("pages|concept_page$subordinate_concepts") +
      "</h2>" +
      "<span>" +
      t("pages|concept_page$no_subordinate_concepts") +
      "</span>" +
      "</div>" +
      "{{/ifprop}}" +
      '{{#ifprop "skos:related"}}' +
      "<div>" +
      "<h2>" +
      t("pages|concept_page$related_concepts") +
      "</h2>" +
      "{{relatedList}}" +
      "</div>" +
      "{{/ifprop}}" +
      '{{#ifprop "skos:related" invert="true"}}' +
      "<div>" +
      "<h2>" +
      t("pages|concept_page$related_concepts") +
      "</h2>" +
      "<span>" +
      t("pages|concept_page$no_related_concepts") +
      "</span>" +
      "</div>" +
      "{{/ifprop}}" +
      "{{/ifprop}}" +
      '{{#ifprop "skos:historyNote"}}' +
      "<div>" +
      "<h2>" +
      t("pages|concept_page$historical_note") +
      "</h2>" +
      '<span>{{ text content="${skos:historyNote}" }}</span>' +
      "</div>" +
      "{{/ifprop}}" +
      '{{#ifprop "skos:editorialNote"}}' +
      "<div>" +
      "<h2>" +
      t("pages|concept_page$editorial_note") +
      "</h2>" +
      '<span>{{ text content="${skos:editorialNote}" }}</span>' +
      "</div>" +
      "{{/ifprop}}" +
      '{{#ifprop "skos:note"}}' +
      "<div>" +
      "<h2>" +
      t("pages|concept_page$note") +
      "</h2>" +
      '<span>{{ text content="${skos:note}" }}</span>' +
      "</div>" +
      "{{/ifprop}}",
  },
  {
    block: "conceptHierarchy",
    extends: "template",
    template: `{{#ifprop "rdf:type" uri="skos:ConceptScheme" invert="true"}}<h2>${t(
      "pages|concept_page$visualization_concepts",
    )}</h2><div class="concept_hierarchy">{{hierarchy scale="1.7"}}</div>{{/ifprop}}`,
  },
];

function getDataportalUri(resourceUri: string, lang: string) {
  if (!resourceUri || !window?.location?.pathname) {
    return resourceUri;
  }
  const currentPath = window.location.pathname;
  const encodedResourceUri = encodeURIComponent(resourceUri);

  if (currentPath.includes("/externalconcept"))
    return `/${lang}/externalconcept?resource=${encodedResourceUri}`;

  if (currentPath.includes("/concepts/")) {
    let entryPath = "";
    if (resourceUri.includes("https://www-sandbox.dataportal.se/concepts"))
      entryPath = resourceUri.replace(
        "https://www-sandbox.dataportal.se/concepts",
        "",
      );
    else entryPath = resourceUri.replace("https://dataportal.se/concepts", "");

    return `/${lang}/concepts${entryPath}`;
  }

  return resourceUri;
}
