import type { Entry } from "@entryscape/entrystore-js";
import type { Translate } from "@/i18n/types";
import {
  conceptsPathResolver,
  getLocalizedValue,
} from "@/lib/entrystore/entrystore-helpers";
import { includeLangInPath } from "@/utilities/check-lang";

export const terminologyBlocks = (t: Translate, lang: string) => [
  {
    block: "conceptLink",
    run: (node: any, a2: any, a3: any, entry: Entry) => {
      if (node?.firstElementChild && entry) {
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
      "pages.concept_page.first_level_concepts",
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
