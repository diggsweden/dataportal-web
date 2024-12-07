/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entry } from "@entryscape/entrystore-js";
import { Translate } from "next-translate";

import { getLocalizedValue } from "@/utilities/entrystore-utils";

export const terminologyBlocks = (t: Translate, lang: string) => [
  {
    block: "conceptLink",
    run: function (node: any, a2: any, a3: any, entry: Entry) {
      if (node && node.firstElementChild && entry) {
        const el = document.createElement("a");

        node.setAttribute("class", "entryscape");

        node.firstElementChild.appendChild(el);

        const contextId = entry.getContext().getId();
        const id = entry.getId();
        const label = getLocalizedValue(
          entry.getAllMetadata(),
          "skos:prefLabel",
        );
        el.innerHTML = label;
        const uri = `/${lang}/concepts/${contextId}_${id}`;
        el.setAttribute("href", uri);
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
