import { getSimplifiedLocalizedValue } from "@/utilities/entrystoreUtil";
import { Entry } from "@entryscape/entrystore-js";
import { Translate } from "next-translate";

export const terminologyBlocks = (t: Translate, lang: string) => [
  {
    block: "conceptLink",
    run: function (node: any, a2: any, a3: any, entry: Entry) {
      if (node && node.firstElementChild && entry) {
        var el = document.createElement("a");

        node.setAttribute("class", "entryscape");

        node.firstElementChild.appendChild(el);

        var ruri = entry.getResourceURI();
        var label = getSimplifiedLocalizedValue(
          entry.getAllMetadata(),
          "skos:prefLabel",
        );
        el.innerHTML = label;
        var dpUri = getDataportalUri(ruri, lang);
        el.setAttribute("href", dpUri);
      }
    },
    loadEntry: true,
  },
  {
    block: "toppbegrepp",
    extends: "template",
    template: `{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<h2 class="toplist-header !text-lg">${t(
      "pages|concept_page$first_level_concepts",
    )}</h2>{{toppbegreppLista}}{{/ifprop}}`,
  },
  {
    block: "toppbegreppLista",
    extends: "list",
    namedclick: "test",
    relation: "skos:hasTopConcept",
    layout: "raw",
    limit: 20,
    rowhead: "{{conceptLink}}",
    click: "",
  },
];

function getDataportalUri(resourceUri: string, lang: string) {
  if (!resourceUri || !window?.location?.pathname) {
    return resourceUri;
  }
  const currentPath = window.location.pathname;
  const encodedResourceUri = encodeURIComponent(resourceUri);

  if (currentPath.includes("/externalterminology"))
    return `/${lang}/externalconcept?resource=${encodedResourceUri}`;

  if (currentPath.includes("/terminology")) {
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
