/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entry } from "@entryscape/entrystore-js";
import { Translate } from "next-translate";

import { includeLangInPath } from "@/utilities/check-lang";
import {
  conceptsPathResolver,
  getLocalizedValue,
} from "@/utilities/entrystore/entrystore-helpers";

export const terminologyBlocks = (t: Translate, lang: string) => [
  {
    block: "conceptLink",
    run: function (node: any, a2: any, a3: any, entry: Entry) {
      if (node && node.firstElementChild && entry) {
        const baseUrl = window.location.origin;
        const el = document.createElement("a");

        node.setAttribute("class", "entryscape");

        node.firstElementChild.appendChild(el);

        const label = getLocalizedValue(
          entry.getAllMetadata(),
          "skos:prefLabel",
        );

        el.innerHTML = label;
        const uri = `${baseUrl}${includeLangInPath(lang)}${conceptsPathResolver(
          entry,
        )}`;
        el.setAttribute("href", uri);
      }
    },
    loadEntry: true,
  },
  {
    block: "terminologyBlock",
    extends: "template",
    template: `{{#ifprop "rdf:type" uri="skos:ConceptScheme"}}<h2 class="toplist-header !text-lg">${t(
      "pages|concept_page$first_level_concepts",
    )}</h2>{{topConceptsList}}{{/ifprop}}`,
  },
  {
    block: "topConceptsList",
    extends: "list",
    namedclick: "test",
    relation: "skos:hasTopConcept",
    layout: "raw",
    limit: 20,
    rowhead: "{{conceptLink}}",
    click: "",
  },
];
