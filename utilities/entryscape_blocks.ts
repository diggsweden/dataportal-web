import { Translate } from "next-translate";

export const customIndicators = `
    {
    block: 'customIndicators',
    extends: 'template',
    template: 
    '{{#ifprop "dcterms:accessRights"}}' +
    '{{#eachprop "dcterms:accessRights"}}' +
    '<span class="indicator" title="{{description}}">' +
      '{{#ifprop "dcterms:accessRights" uri="peu:access-right/PUBLIC"}}' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<path d="M12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17ZM18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6H8.9C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM18 20H6V10H18V20Z" fill="#6E615A"/>' +
      '</svg>{{/ifprop}}' +
      '{{#ifprop "dcterms:accessRights" uri="peu:access-right/NON_PUBLIC"}}' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<path d="M7 14C6.45 14 5.97917 13.8042 5.5875 13.4125C5.19583 13.0208 5 12.55 5 12C5 11.45 5.19583 10.9792 5.5875 10.5875C5.97917 10.1958 6.45 10 7 10C7.55 10 8.02083 10.1958 8.4125 10.5875C8.80417 10.9792 9 11.45 9 12C9 12.55 8.80417 13.0208 8.4125 13.4125C8.02083 13.8042 7.55 14 7 14ZM7 18C5.33333 18 3.91667 17.4167 2.75 16.25C1.58333 15.0833 1 13.6667 1 12C1 10.3333 1.58333 8.91667 2.75 7.75C3.91667 6.58333 5.33333 6 7 6C8.11667 6 9.12917 6.275 10.0375 6.825C10.9458 7.375 11.6667 8.1 12.2 9H21L24 12L19.5 16.5L17.5 15L15.5 16.5L13.375 15H12.2C11.6667 15.9 10.9458 16.625 10.0375 17.175C9.12917 17.725 8.11667 18 7 18ZM7 16C7.93333 16 8.75417 15.7167 9.4625 15.15C10.1708 14.5833 10.6417 13.8667 10.875 13H14L15.45 14.025L17.5 12.5L19.275 13.875L21.15 12L20.15 11H10.875C10.6417 10.1333 10.1708 9.41667 9.4625 8.85C8.75417 8.28333 7.93333 8 7 8C5.9 8 4.95833 8.39167 4.175 9.175C3.39167 9.95833 3 10.9 3 12C3 13.1 3.39167 14.0417 4.175 14.825C4.95833 15.6083 5.9 16 7 16Z" fill="#6E615A"/>' +
      '</svg>{{/ifprop}}' +
      '{{#ifprop "dcterms:accessRights" uri="peu:access-right/RESTRICTED"}}' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<path d="M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V10C4 9.45 4.19583 8.97917 4.5875 8.5875C4.97917 8.19583 5.45 8 6 8H7V6C7 4.61667 7.4875 3.4375 8.4625 2.4625C9.4375 1.4875 10.6167 1 12 1C13.3833 1 14.5625 1.4875 15.5375 2.4625C16.5125 3.4375 17 4.61667 17 6V8H18C18.55 8 19.0208 8.19583 19.4125 8.5875C19.8042 8.97917 20 9.45 20 10V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM6 20H18V10H6V20ZM12 17C12.55 17 13.0208 16.8042 13.4125 16.4125C13.8042 16.0208 14 15.55 14 15C14 14.45 13.8042 13.9792 13.4125 13.5875C13.0208 13.1958 12.55 13 12 13C11.45 13 10.9792 13.1958 10.5875 13.5875C10.1958 13.9792 10 14.45 10 15C10 15.55 10.1958 16.0208 10.5875 16.4125C10.9792 16.8042 11.45 17 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z" fill="#6E615A"/>' +
      '</svg>{{/ifprop}}' +
      '<span>{{label}}</span>{{/eachprop}}' +
    '</span>{{/ifprop}}' +

    '{{#ifprop "dcterms:type"}}' +
    '<span class="indicator" title="TjÃ¤nstens arkitekturstil">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<path d="M5.1222 21C5.5002 21.378 6.0022 21.586 6.5362 21.586C7.0702 21.586 7.5722 21.378 7.9502 21L12.2862 16.664C13.0043 16.8855 13.7517 16.9978 14.5032 16.997C15.4882 17 16.464 16.8076 17.3741 16.4308C18.2843 16.054 19.1106 15.5004 19.8052 14.802C20.8539 13.7563 21.5687 12.4229 21.8592 10.9707C22.1498 9.51846 22.0029 8.0127 21.4372 6.64401L20.8672 5.25601L16.6232 9.49901L14.5022 7.37701L18.7452 3.13401L17.3562 2.56301C16.45 2.18994 15.4792 1.99865 14.4992 2.00001C12.4962 2.00001 10.6132 2.78001 9.1982 4.19601C8.23119 5.15982 7.54645 6.36995 7.21822 7.6952C6.88999 9.02046 6.93079 10.4103 7.3362 11.714L3.0002 16.05C2.6255 16.4252 2.41504 16.9338 2.41504 17.464C2.41504 17.9943 2.6255 18.5028 3.0002 18.878L5.1222 21ZM9.6702 12.209L9.4162 11.593C9.00086 10.5894 8.89281 9.48502 9.10572 8.4199C9.31864 7.35479 9.84294 6.37685 10.6122 5.61001C11.1839 5.03462 11.8765 4.59383 12.6399 4.31966C13.4032 4.04549 14.2181 3.94483 15.0252 4.02501L11.6722 7.37801L16.6212 12.328L19.9762 8.97301C20.0544 9.78062 19.9527 10.5955 19.6783 11.3591C19.4039 12.1227 18.9636 12.8159 18.3892 13.389C16.8392 14.939 14.4252 15.416 12.4052 14.585L11.7902 14.33L6.5362 19.586H6.5372L6.5362 20.586V19.586L4.4142 17.464L9.6702 12.209Z" fill="#6E615A"/>' +
      '</svg>' +
      '<span>{{#eachprop "dcterms:type" separator=", "}}{{label}}{{separator}}{{/eachprop}}</span>' +
    '</span>{{/ifprop}}' +

    '{{#ifprop "dcterms:accrualPeriodicity"}}' +
    '<span class="indicator" title="Uppdateringsfrekvens">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<path d="M5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V12H19V10H5V20H12V22H5ZM19 24C17.7833 24 16.7208 23.6208 15.8125 22.8625C14.9042 22.1042 14.3333 21.15 14.1 20H15.65C15.8667 20.7333 16.2792 21.3333 16.8875 21.8C17.4958 22.2667 18.2 22.5 19 22.5C19.9667 22.5 20.7917 22.1583 21.475 21.475C22.1583 20.7917 22.5 19.9667 22.5 19C22.5 18.0333 22.1583 17.2083 21.475 16.525C20.7917 15.8417 19.9667 15.5 19 15.5C18.5167 15.5 18.0667 15.5875 17.65 15.7625C17.2333 15.9375 16.8667 16.1833 16.55 16.5H18V18H14V14H15.5V15.425C15.95 14.9917 16.475 14.6458 17.075 14.3875C17.675 14.1292 18.3167 14 19 14C20.3833 14 21.5625 14.4875 22.5375 15.4625C23.5125 16.4375 24 17.6167 24 19C24 20.3833 23.5125 21.5625 22.5375 22.5375C21.5625 23.5125 20.3833 24 19 24ZM5 8H19V6H5V8Z" fill="#6E615A"/>' +
      '</svg>' +
      '<span>{{#eachprop "dcterms:accrualPeriodicity" separator=", "}}{{label}}{{separator}}{{/eachprop}}</span>' +
    '</span>{{/ifprop}}' +

    '{{#ifprop "dcterms:license"}}' +
    '{{customLicenseIndicator}}' +
    '{{/ifprop}}' +

    '{{#eachprop "http://data.europa.eu/r5r/applicableLegislation"}}' +
    '<span class="indicator" title="Särskilt värdefull datamängd">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<g clip-path="url(#clip0_1139_8914)">' +
          '<path d="M12.0002 23.3L8.6502 20H4.0002V15.35L0.700195 12L4.0002 8.65001V4.00001H8.6502L12.0002 0.700012L15.3502 4.00001H20.0002V8.65001L23.3002 12L20.0002 15.35V20H15.3502L12.0002 23.3ZM12.0002 20.5L14.5002 18H18.0002V14.5L20.5002 12L18.0002 9.50001V6.00001H14.5002L12.0002 3.50001L9.5002 6.00001H6.0002V9.50001L3.5002 12L6.0002 14.5V18H9.5002L12.0002 20.5ZM9.0752 16.25L12.0002 14.475L14.9252 16.25L14.1502 12.925L16.7502 10.675L13.3252 10.4L12.0002 7.25001L10.6752 10.4L7.2502 10.675L9.8502 12.925L9.0752 16.25Z" fill="#6E615A"/>' +
        '</g>' +
        '<defs>' +
          '<clipPath id="clip0_1139_8914">' +
            '<rect width="24" height="24" fill="white"/>' +
          '</clipPath>' +
        '</defs>' +
      '</svg>' +
      '<span>{{label}}</span>' +
    '</span>{{/eachprop}}' +

    '{{#ifprop "schema:offers"}}' +
    '<span class="indicator" title="Avgift">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
      '<path d="M12 21C9.48333 21 7.35417 20.6125 5.6125 19.8375C3.87083 19.0625 3 18.1167 3 17V7C3 5.9 3.87917 4.95833 5.6375 4.175C7.39583 3.39167 9.51667 3 12 3C14.4833 3 16.6042 3.39167 18.3625 4.175C20.1208 4.95833 21 5.9 21 7V17C21 18.1167 20.1292 19.0625 18.3875 19.8375C16.6458 20.6125 14.5167 21 12 21ZM12 9.025C13.4833 9.025 14.975 8.8125 16.475 8.3875C17.975 7.9625 18.8167 7.50833 19 7.025C18.8167 6.54167 17.9792 6.08333 16.4875 5.65C14.9958 5.21667 13.5 5 12 5C10.4833 5 8.99583 5.2125 7.5375 5.6375C6.07917 6.0625 5.23333 6.525 5 7.025C5.23333 7.525 6.07917 7.98333 7.5375 8.4C8.99583 8.81667 10.4833 9.025 12 9.025ZM12 14C12.7 14 13.375 13.9667 14.025 13.9C14.675 13.8333 15.2958 13.7375 15.8875 13.6125C16.4792 13.4875 17.0375 13.3333 17.5625 13.15C18.0875 12.9667 18.5667 12.7583 19 12.525V9.525C18.5667 9.75833 18.0875 9.96667 17.5625 10.15C17.0375 10.3333 16.4792 10.4875 15.8875 10.6125C15.2958 10.7375 14.675 10.8333 14.025 10.9C13.375 10.9667 12.7 11 12 11C11.3 11 10.6167 10.9667 9.95 10.9C9.28333 10.8333 8.65417 10.7375 8.0625 10.6125C7.47083 10.4875 6.91667 10.3333 6.4 10.15C5.88333 9.96667 5.41667 9.75833 5 9.525V12.525C5.41667 12.7583 5.88333 12.9667 6.4 13.15C6.91667 13.3333 7.47083 13.4875 8.0625 13.6125C8.65417 13.7375 9.28333 13.8333 9.95 13.9C10.6167 13.9667 11.3 14 12 14ZM12 19C12.7667 19 13.5458 18.9417 14.3375 18.825C15.1292 18.7083 15.8583 18.5542 16.525 18.3625C17.1917 18.1708 17.75 17.9542 18.2 17.7125C18.65 17.4708 18.9167 17.225 19 16.975V14.525C18.5667 14.7583 18.0875 14.9667 17.5625 15.15C17.0375 15.3333 16.4792 15.4875 15.8875 15.6125C15.2958 15.7375 14.675 15.8333 14.025 15.9C13.375 15.9667 12.7 16 12 16C11.3 16 10.6167 15.9667 9.95 15.9C9.28333 15.8333 8.65417 15.7375 8.0625 15.6125C7.47083 15.4875 6.91667 15.3333 6.4 15.15C5.88333 14.9667 5.41667 14.7583 5 14.525V17C5.08333 17.25 5.34583 17.4917 5.7875 17.725C6.22917 17.9583 6.78333 18.1708 7.45 18.3625C8.11667 18.5542 8.85 18.7083 9.65 18.825C10.45 18.9417 11.2333 19 12 19Z" fill="#6E615A"/>' +
    '</svg>' +
    '<span>Avgift</span>' +
    '</span>{{/ifprop}}'

    },
    {
      block: 'customLicenseIndicator',
              loadEntry: true,
              run: function(node, data, items, entry) {
                  var v = entry.getAllMetadata().findFirstValue(null, 'dcterms:license');
                  if (v.indexOf("http://creativecommons.org/") === 0) {
                      var variant;
                      if (v === "http://creativecommons.org/publicdomain/zero/1.0/") {
                          variant = "zero";
                      } else if (v.indexOf("http://creativecommons.org/licenses/") === 0) {
                          variant = v.substr(36).split('/')[0];
                      } else {
                          return; // Unknown cc version.
                      }
                      node.innerHTML = 
                      '<span class="indicator" title="Licens frÃ¥n Creative Commons">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
                          '<path d="M11.9816 2C14.7788 2 17.1603 2.97656 19.1244 4.92875C20.0644 5.86906 20.7791 6.94375 21.2672 8.15188C21.755 9.36031 21.9997 10.6428 21.9997 12C21.9997 13.3691 21.7581 14.6519 21.2766 15.8478C20.7944 17.0441 20.0828 18.1009 19.1428 19.0175C18.1669 19.9816 17.0597 20.72 15.8212 21.2319C14.5834 21.7437 13.3034 21.9997 11.9822 21.9997C10.6609 21.9997 9.39594 21.7472 8.1875 21.2406C6.97937 20.735 5.89594 20.0028 4.9375 19.0447C3.97906 18.0866 3.25 17.0059 2.75 15.8034C2.25 14.6009 2 13.3334 2 12C2 10.6784 2.25281 9.40781 2.75875 8.1875C3.26469 6.96719 4 5.875 4.96406 4.91062C6.86875 2.97062 9.20781 2 11.9816 2ZM12.0178 3.80375C9.73219 3.80375 7.80938 4.60156 6.24969 6.19656C5.46375 6.99437 4.85969 7.89 4.43719 8.88406C4.01406 9.87812 3.80313 10.9169 3.80313 12.0003C3.80313 13.0719 4.01406 14.1047 4.43719 15.0981C4.86 16.0928 5.46375 16.9797 6.24969 17.7594C7.03531 18.5394 7.92188 19.1341 8.91062 19.5453C9.89844 19.9559 10.9344 20.1613 12.0178 20.1613C13.0891 20.1613 14.1272 19.9534 15.1344 19.5366C16.1403 19.1194 17.0472 18.5187 17.8572 17.7331C19.4166 16.2094 20.1959 14.2987 20.1959 12.0006C20.1959 10.8934 19.9934 9.84594 19.5888 8.85781C19.1847 7.86969 18.595 6.98906 17.8219 6.21469C16.2138 4.6075 14.2797 3.80375 12.0178 3.80375ZM11.8925 10.3397L10.5528 11.0363C10.4097 10.7391 10.2344 10.5303 10.0262 10.4113C9.81781 10.2925 9.62437 10.2328 9.44563 10.2328C8.55312 10.2328 8.10625 10.8219 8.10625 12.0006C8.10625 12.5363 8.21938 12.9644 8.44531 13.2859C8.67156 13.6075 9.005 13.7684 9.44563 13.7684C10.0291 13.7684 10.4397 13.4825 10.6781 12.9113L11.91 13.5363C11.6481 14.0247 11.285 14.4084 10.8206 14.6881C10.3569 14.9681 9.84469 15.1078 9.285 15.1078C8.39219 15.1078 7.67156 14.8344 7.12406 14.2863C6.57656 13.7388 6.30281 12.9769 6.30281 12.0009C6.30281 11.0484 6.57969 10.2928 7.13313 9.73313C7.68656 9.17375 8.38594 8.89375 9.23156 8.89375C10.47 8.89313 11.3566 9.37531 11.8925 10.3397ZM17.6603 10.3397L16.3387 11.0363C16.1959 10.7391 16.02 10.5303 15.8119 10.4113C15.6031 10.2925 15.4034 10.2328 15.2137 10.2328C14.3209 10.2328 13.8741 10.8219 13.8741 12.0006C13.8741 12.5363 13.9875 12.9644 14.2134 13.2859C14.4394 13.6075 14.7725 13.7684 15.2137 13.7684C15.7966 13.7684 16.2075 13.4825 16.4453 12.9113L17.6953 13.5363C17.4219 14.0247 17.0525 14.4084 16.5887 14.6881C16.1244 14.9681 15.6184 15.1078 15.0709 15.1078C14.1659 15.1078 13.4431 14.8344 12.9019 14.2863C12.3594 13.7388 12.0887 12.9769 12.0887 12.0009C12.0887 11.0484 12.3653 10.2928 12.9194 9.73313C13.4725 9.17375 14.1719 8.89375 15.0172 8.89375C16.2553 8.89313 17.1369 9.37531 17.6603 10.3397Z" fill="#6E615A"/>' +
                        '</svg>' +
                        '<span>' + variant.toLowerCase() + '</span>' +
                      '</span>';
                  }
              },
    }, 
`;

export const preambleBlock = `
{
  block: 'preambleBlock',
  class: 'preamble',
  extends: 'template',
  template: '{{#ifprop "dcterms:description"}}{{ text content="\${dcterms:description}" }}{{/ifprop}}' +
            '{{#ifprop "skos:definition"}}{{ text content="\${skos:definition}" }}{{/ifprop}}'
},
`;

export const keyword = (t: Translate) => `
  {
    block: 'keyword',
    extends: 'template',
    template:'{{#ifprop "dcat:keyword"}}' + 
        '<div class="rdforms">' +
          '<div class="rdformsRow rdformsTopLevel">' +
            '<div class="rdformsLabel">' +
              '${t("pages|datasetpage$keyword")}' +
            '</div>' +
            '<div>' +
              '{{#eachprop "dcat:keyword" limit=4 expandbutton="${t(
                "pages|datasetpage$view_more",
              )}" unexpandbutton="${t("pages|datasetpage$view_less")}"}}' +
                '<div title="{{value}}" class="text-sm mb-sm font-strong bg-pink-200 w-fit py-xs px-sm" data-esb-collection-format="{{optionvalue}}">{{value}}</div>' +
              '{{/eachprop}}' +
            '</div>' +
          '</div>' +
        '</div>' +
      '{{/ifprop}}',
  },
`;

export const theme = (t: Translate) => `
  {
    block: 'theme',
    extends: 'template',
    template:'{{#ifprop "dcat:theme"}}' + 
        '<div class="rdforms">' +
          '<div class="rdformsRow rdformsTopLevel">' +
            '<div class="rdformsLabel">' +
              '${t("pages|datasetpage$category")}' +
            '</div>' +
            '<div>' +
              '{{#eachprop "dcat:theme" limit=4 expandbutton="${t(
                "pages|datasetpage$view_more",
              )}" unexpandbutton="${t("pages|datasetpage$view_less")}"}}' +
                '<div title="{{value}}" class="text-sm mb-sm font-strong bg-pink-200 w-fit py-xs px-sm" data-esb-collection-format="{{optionvalue}}">{{label}}</div>' +
              '{{/eachprop}}' +
            '</div>' +
          '</div>' +
        '</div>' +
      '{{/ifprop}}',
  },
`;

export const catalog = `
{
  block: 'catalog',
  extends: 'template',
  template:'',
},
`;

export const exploreApiLink = (cid: string, eid: string, t: Translate) => `
  {
    block: 'exploreApiLinkRun',                     
    run: function(node,a2,a3,entry) {                                        
      if(node && node.firstElementChild)
      { 
        var showExploreApi = false;                   
        var entryId = entry.getId();
        var contextId = '${cid}';

        if(window.__es_has_apis)
          for(var a in window.__es_has_apis)
          {
            if(window.__es_has_apis[a] === contextId + '_' + entryId)
              showExploreApi = true;                    
          }
        
        if(showExploreApi)
        {
          var el = document.createElement('a');       
          var label = document.createElement('span');       
          var svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svgIcon.setAttribute('width', '24');
          svgIcon.setAttribute('height', '24');
          svgIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.08008 11V13H16.0801L10.5801 18.5L12.0001 19.92L19.9201 12L12.0001 4.08002L10.5801 5.50002L16.0801 11H4.08008Z" fill="#6E615A"/></svg>';
          node.firstElementChild.appendChild(el);
          el.appendChild(label);
          el.appendChild(svgIcon);
          label.innerHTML = '${t("pages|datasetpage$explore-api")}'
          el.setAttribute('href', getApiExploreUrl('${eid}',entryId))
          el.setAttribute('class', 'explore-api-btn noUnderline') 
        }
      }
    },
    loadEntry:true
  },
  {
    block: 'exploreApiLink',
    extends: 'template',
    template: '{{exploreApiLinkRun}}' 
  }
`;

export const hemvist = (t: Translate) => `
  {
    block: 'hemvist',
    loadEntry: true,
    run: function(node, data, items, entry) {
      
      var resourceURI = entry.getResourceURI();
      var linkTitle = '${t("pages|concept_page$concept_adress")}';

      if(window.location.pathname.indexOf("/terminology/") > -1 || window.location.pathname.indexOf("/externalterminology/") > -1)
        linkTitle = '${t("pages|concept_page$term_adress")}';

      if(window.location.pathname.indexOf("/specifications/") > -1 || window.location.pathname.indexOf("/externalspecification/") > -1)
        linkTitle = '${t("pages|specification_page$address")}';
      
      if (resourceURI.indexOf('https://dataportal.se/') === 0 || resourceURI.indexOf('https://www-sandbox.dataportal.se/') === 0) {
        node.innerHTML='<h3 class="!mt-none">' + linkTitle + ':</h3> <a class="hemvist mb-lg" href='+resourceURI+'>'+resourceURI+'</a>';
      }
      else
      {
        node.innerHTML='<h3 class="!mt-none">'+linkTitle+'</h3> <a class="hemvist mb-lg" href='+resourceURI+'>'+resourceURI+'</a>';
      } 
    }
  }
`;
