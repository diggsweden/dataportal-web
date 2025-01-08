import { Translate } from "next-translate";

export const specificationBlocks = (t: Translate, iconSize: number) => [
  {
    block: "resourceDescriptors2",
    extends: "list",
    relation: "prof:hasResource",
    template: "prof:ResourceDescriptor",
    expandTooltip: t("pages|datasetpage$view_more"),
    unexpandTooltip: t("pages|datasetpage$view_less"),
    expandButton: false,
    listbody: '<div class="specification__resource--body">{{body}}</div>',
    listplaceholder:
      '<div class="alert alert-info" role="alert">Denna specifikation har inga resurser.</div>',
    rowhead:
      "<span>{{text}}</span>" +
      '<span class="block mb-md">{{prop "prof:hasRole" class="type" render="label"}}</span>' +
      '<div>{{ text content="${skos:definition}" }}</div>' +
      '<div class="flex justify-between items-end md:items-center mt-md md:mt-lg gap-lg">' +
      '<a href="{{resourceURI}}">' +
      '<span class="button button--primary button--large text-white">' +
      t("pages|specification_page$specification_download") +
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      1.5 * iconSize +
      '" height="' +
      1.5 * iconSize +
      '" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">' +
      '<path d="M4.08008 11V13H16.0801L10.5801 18.5L12.0001 19.92L19.9201 12L12.0001 4.08002L10.5801 5.50002L16.0801 11H4.08008Z" fill="#6E615A"/>' +
      "</svg>" +
      "</span>" +
      "</a>" +
      "</div>",
  },
];
