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
      '<i class="fas fa-key"></i>{{/ifprop}}' +
      '{{#ifprop "dcterms:accessRights" uri="peu:access-right/RESTRICTED"}}' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="21" viewBox="0 0 16 21" fill="none">' +
        '<path d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z" fill="#6E615A"/>' +
      '</svg>{{/ifprop}}' +
      '<span>{{label}}</span>{{/eachprop}}' +
    '</span>{{/ifprop}}' +

    '{{#ifprop "rdf:type"}}' +
    '<span class="indicator" title="TjÃ¤nstens arkitekturstil">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<path d="M5.1222 21C5.5002 21.378 6.0022 21.586 6.5362 21.586C7.0702 21.586 7.5722 21.378 7.9502 21L12.2862 16.664C13.0043 16.8855 13.7517 16.9978 14.5032 16.997C15.4882 17 16.464 16.8076 17.3741 16.4308C18.2843 16.054 19.1106 15.5004 19.8052 14.802C20.8539 13.7563 21.5687 12.4229 21.8592 10.9707C22.1498 9.51846 22.0029 8.0127 21.4372 6.64401L20.8672 5.25601L16.6232 9.49901L14.5022 7.37701L18.7452 3.13401L17.3562 2.56301C16.45 2.18994 15.4792 1.99865 14.4992 2.00001C12.4962 2.00001 10.6132 2.78001 9.1982 4.19601C8.23119 5.15982 7.54645 6.36995 7.21822 7.6952C6.88999 9.02046 6.93079 10.4103 7.3362 11.714L3.0002 16.05C2.6255 16.4252 2.41504 16.9338 2.41504 17.464C2.41504 17.9943 2.6255 18.5028 3.0002 18.878L5.1222 21ZM9.6702 12.209L9.4162 11.593C9.00086 10.5894 8.89281 9.48502 9.10572 8.4199C9.31864 7.35479 9.84294 6.37685 10.6122 5.61001C11.1839 5.03462 11.8765 4.59383 12.6399 4.31966C13.4032 4.04549 14.2181 3.94483 15.0252 4.02501L11.6722 7.37801L16.6212 12.328L19.9762 8.97301C20.0544 9.78062 19.9527 10.5955 19.6783 11.3591C19.4039 12.1227 18.9636 12.8159 18.3892 13.389C16.8392 14.939 14.4252 15.416 12.4052 14.585L11.7902 14.33L6.5362 19.586H6.5372L6.5362 20.586V19.586L4.4142 17.464L9.6702 12.209Z" fill="#6E615A"/>' +
      '</svg>' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<path d="M20.25 17.9167H14.75V15.1667H13.1917C12.1833 17.3667 9.89167 18.8333 7.41667 18.8333C3.84167 18.8333 1 15.9917 1 12.4167C1 8.84167 3.84167 6 7.41667 6C9.89167 6 12.1833 7.46667 13.1917 9.66667H23V15.1667H20.25V17.9167ZM16.5833 16.0833H18.4167V13.3333H21.1667V11.5H11.9083L11.725 10.8583C11.0833 9.025 9.34167 7.83333 7.41667 7.83333C4.85 7.83333 2.83333 9.85 2.83333 12.4167C2.83333 14.9833 4.85 17 7.41667 17C9.34167 17 11.0833 15.8083 11.725 13.975L11.9083 13.3333H16.5833V16.0833ZM7.41667 15.1667C5.85833 15.1667 4.66667 13.975 4.66667 12.4167C4.66667 10.8583 5.85833 9.66667 7.41667 9.66667C8.975 9.66667 10.1667 10.8583 10.1667 12.4167C10.1667 13.975 8.975 15.1667 7.41667 15.1667ZM7.41667 11.5C6.86667 11.5 6.5 11.8667 6.5 12.4167C6.5 12.9667 6.86667 13.3333 7.41667 13.3333C7.96667 13.3333 8.33333 12.9667 8.33333 12.4167C8.33333 11.8667 7.96667 11.5 7.41667 11.5Z" fill="#6E615A"/>' +
      '</svg>' +
      '<span>{{#eachprop "rdf:type"}}' +
        '{{label}}{{separator}}{{/eachprop}}' +
      '</span>' +
    '</span>{{/ifprop}}' +

    '{{#eachprop "dcterms:accrualPeriodicity"}}' +
      '<span class="indicator" title="Uppdateringsfrekvens">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<path d="M5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V12H19V10H5V20H12V22H5ZM19 24C17.7833 24 16.7208 23.6208 15.8125 22.8625C14.9042 22.1042 14.3333 21.15 14.1 20H15.65C15.8667 20.7333 16.2792 21.3333 16.8875 21.8C17.4958 22.2667 18.2 22.5 19 22.5C19.9667 22.5 20.7917 22.1583 21.475 21.475C22.1583 20.7917 22.5 19.9667 22.5 19C22.5 18.0333 22.1583 17.2083 21.475 16.525C20.7917 15.8417 19.9667 15.5 19 15.5C18.5167 15.5 18.0667 15.5875 17.65 15.7625C17.2333 15.9375 16.8667 16.1833 16.55 16.5H18V18H14V14H15.5V15.425C15.95 14.9917 16.475 14.6458 17.075 14.3875C17.675 14.1292 18.3167 14 19 14C20.3833 14 21.5625 14.4875 22.5375 15.4625C23.5125 16.4375 24 17.6167 24 19C24 20.3833 23.5125 21.5625 22.5375 22.5375C21.5625 23.5125 20.3833 24 19 24ZM5 8H19V6H5V8Z" fill="#6E615A"/>' +
      '</svg>' +
      '<span>{{label}}</span>' +
    '</span>{{/eachprop}}' +

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
    '</span>{{/eachprop}}'
  }
`;

export const architechtureIndicator = `
  {
    block: 'architectureIndicator',
    extends: 'template',
    template: '{{#ifprop "dcterms:type"}}' +
      '<span class="esbIndicator" title="TjÃ¤nstens arkitekturstil">' +
      '<span class="material-icons-outlined">build_circle</span>' +
      '<i class="fas fa-wrench"></i>' +
      '<span class="esbIndicatorLabel">{{#eachprop "dcterms:type"}}{{label}}{{separator}}{{/eachprop}}</span></span>' +
      '{{/ifprop}}',
  }
`;

'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
  '<path d="M7 14C6.45 14 5.97917 13.8042 5.5875 13.4125C5.19583 13.0208 5 12.55 5 12C5 11.45 5.19583 10.9792 5.5875 10.5875C5.97917 10.1958 6.45 10 7 10C7.55 10 8.02083 10.1958 8.4125 10.5875C8.80417 10.9792 9 11.45 9 12C9 12.55 8.80417 13.0208 8.4125 13.4125C8.02083 13.8042 7.55 14 7 14ZM7 18C5.33333 18 3.91667 17.4167 2.75 16.25C1.58333 15.0833 1 13.6667 1 12C1 10.3333 1.58333 8.91667 2.75 7.75C3.91667 6.58333 5.33333 6 7 6C8.11667 6 9.12917 6.275 10.0375 6.825C10.9458 7.375 11.6667 8.1 12.2 9H21L24 12L19.5 16.5L17.5 15L15.5 16.5L13.375 15H12.2C11.6667 15.9 10.9458 16.625 10.0375 17.175C9.12917 17.725 8.11667 18 7 18ZM7 16C7.93333 16 8.75417 15.7167 9.4625 15.15C10.1708 14.5833 10.6417 13.8667 10.875 13H14L15.45 14.025L17.5 12.5L19.275 13.875L21.15 12L20.15 11H10.875C10.6417 10.1333 10.1708 9.41667 9.4625 8.85C8.75417 8.28333 7.93333 8 7 8C5.9 8 4.95833 8.39167 4.175 9.175C3.39167 9.95833 3 10.9 3 12C3 13.1 3.39167 14.0417 4.175 14.825C4.95833 15.6083 5.9 16 7 16Z" fill="#6E615A"/>' +
  "</svg>" +
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
  '<path d="M12 21C9.48333 21 7.35417 20.6125 5.6125 19.8375C3.87083 19.0625 3 18.1167 3 17V7C3 5.9 3.87917 4.95833 5.6375 4.175C7.39583 3.39167 9.51667 3 12 3C14.4833 3 16.6042 3.39167 18.3625 4.175C20.1208 4.95833 21 5.9 21 7V17C21 18.1167 20.1292 19.0625 18.3875 19.8375C16.6458 20.6125 14.5167 21 12 21ZM12 9.025C13.4833 9.025 14.975 8.8125 16.475 8.3875C17.975 7.9625 18.8167 7.50833 19 7.025C18.8167 6.54167 17.9792 6.08333 16.4875 5.65C14.9958 5.21667 13.5 5 12 5C10.4833 5 8.99583 5.2125 7.5375 5.6375C6.07917 6.0625 5.23333 6.525 5 7.025C5.23333 7.525 6.07917 7.98333 7.5375 8.4C8.99583 8.81667 10.4833 9.025 12 9.025ZM12 14C12.7 14 13.375 13.9667 14.025 13.9C14.675 13.8333 15.2958 13.7375 15.8875 13.6125C16.4792 13.4875 17.0375 13.3333 17.5625 13.15C18.0875 12.9667 18.5667 12.7583 19 12.525V9.525C18.5667 9.75833 18.0875 9.96667 17.5625 10.15C17.0375 10.3333 16.4792 10.4875 15.8875 10.6125C15.2958 10.7375 14.675 10.8333 14.025 10.9C13.375 10.9667 12.7 11 12 11C11.3 11 10.6167 10.9667 9.95 10.9C9.28333 10.8333 8.65417 10.7375 8.0625 10.6125C7.47083 10.4875 6.91667 10.3333 6.4 10.15C5.88333 9.96667 5.41667 9.75833 5 9.525V12.525C5.41667 12.7583 5.88333 12.9667 6.4 13.15C6.91667 13.3333 7.47083 13.4875 8.0625 13.6125C8.65417 13.7375 9.28333 13.8333 9.95 13.9C10.6167 13.9667 11.3 14 12 14ZM12 19C12.7667 19 13.5458 18.9417 14.3375 18.825C15.1292 18.7083 15.8583 18.5542 16.525 18.3625C17.1917 18.1708 17.75 17.9542 18.2 17.7125C18.65 17.4708 18.9167 17.225 19 16.975V14.525C18.5667 14.7583 18.0875 14.9667 17.5625 15.15C17.0375 15.3333 16.4792 15.4875 15.8875 15.6125C15.2958 15.7375 14.675 15.8333 14.025 15.9C13.375 15.9667 12.7 16 12 16C11.3 16 10.6167 15.9667 9.95 15.9C9.28333 15.8333 8.65417 15.7375 8.0625 15.6125C7.47083 15.4875 6.91667 15.3333 6.4 15.15C5.88333 14.9667 5.41667 14.7583 5 14.525V17C5.08333 17.25 5.34583 17.4917 5.7875 17.725C6.22917 17.9583 6.78333 18.1708 7.45 18.3625C8.11667 18.5542 8.85 18.7083 9.65 18.825C10.45 18.9417 11.2333 19 12 19Z" fill="#6E615A"/>' +
  "</svg>" +
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
  '<path d="M9.21388 22L8.81587 18.8C8.60028 18.7167 8.39713 18.6167 8.20641 18.5C8.0157 18.3833 7.82913 18.2583 7.64671 18.125L4.68651 19.375L1.9502 14.625L4.51238 12.675C4.4958 12.5583 4.48751 12.4458 4.48751 12.3375V11.6625C4.48751 11.5542 4.4958 11.4417 4.51238 11.325L1.9502 9.375L4.68651 4.625L7.64671 5.875C7.82913 5.74167 8.01985 5.61667 8.21885 5.5C8.41786 5.38333 8.61686 5.28333 8.81587 5.2L9.21388 2H14.6865L15.0845 5.2C15.3001 5.28333 15.5033 5.38333 15.694 5.5C15.8847 5.61667 16.0713 5.74167 16.2537 5.875L19.2139 4.625L21.9502 9.375L19.388 11.325C19.4046 11.4417 19.4129 11.5542 19.4129 11.6625V12.3375C19.4129 12.4458 19.3963 12.5583 19.3631 12.675L21.9253 14.625L19.189 19.375L16.2537 18.125C16.0713 18.2583 15.8805 18.3833 15.6815 18.5C15.4825 18.6167 15.2835 18.7167 15.0845 18.8L14.6865 22H9.21388ZM10.9552 20H12.9203L13.2686 17.35C13.7827 17.2167 14.2595 17.0208 14.699 16.7625C15.1384 16.5042 15.5406 16.1917 15.9054 15.825L18.3681 16.85L19.3383 15.15L17.199 13.525C17.2819 13.2917 17.3399 13.0458 17.3731 12.7875C17.4062 12.5292 17.4228 12.2667 17.4228 12C17.4228 11.7333 17.4062 11.4708 17.3731 11.2125C17.3399 10.9542 17.2819 10.7083 17.199 10.475L19.3383 8.85L18.3681 7.15L15.9054 8.2C15.5406 7.81667 15.1384 7.49583 14.699 7.2375C14.2595 6.97917 13.7827 6.78333 13.2686 6.65L12.9452 4H10.98L10.6318 6.65C10.1177 6.78333 9.64091 6.97917 9.20144 7.2375C8.76197 7.49583 8.35981 7.80833 7.99497 8.175L5.53228 7.15L4.56214 8.85L6.70144 10.45C6.61852 10.7 6.56048 10.95 6.52731 11.2C6.49414 11.45 6.47756 11.7167 6.47756 12C6.47756 12.2667 6.49414 12.525 6.52731 12.775C6.56048 13.025 6.61852 13.275 6.70144 13.525L4.56214 15.15L5.53228 16.85L7.99497 15.8C8.35981 16.1833 8.76197 16.5042 9.20144 16.7625C9.64091 17.0208 10.1177 17.2167 10.6318 17.35L10.9552 20ZM11.9999 15.5C12.9618 15.5 13.7827 15.1583 14.4626 14.475C15.1426 13.7917 15.4825 12.9667 15.4825 12C15.4825 11.0333 15.1426 10.2083 14.4626 9.525C13.7827 8.84167 12.9618 8.5 11.9999 8.5C11.0215 8.5 10.1965 8.84167 9.52482 9.525C8.85318 10.2083 8.51736 11.0333 8.51736 12C8.51736 12.9667 8.85318 13.7917 9.52482 14.475C10.1965 15.1583 11.0215 15.5 11.9999 15.5Z" fill="#6E615A"/>' +
  "</svg>";

export const periodicityIndicator = `
  {
    block: 'periodicityIndicator',
    extends: 'template',
    template: '{{#eachprop "dcterms:accrualPeriodicity"}}<span class="esbIndicator" title="Uppdateringsfrekvens">' +
      '<i class="fas fa-redo"></i>' +
      '<span class="">{{label}}</span></span>{{/eachprop}}',
  }
`;

export const licenseIndicator = `
  {
    block: 'licenseIndicator',
    loadEntry: true,
    run: function(node, data, items, entry) {
      var v = entry.getAllMetadata().findFirstValue(null, 'dcterms:license');
      if (v.indexOf("http://creativecommons.org/") === 0) {

        var variant;
        
        if (v === "http://creativecommons.org/publicdomain/zero/1.0/") {
          variant = "Creative Commons";
        } else if (v.indexOf("http://creativecommons.org/licenses/") === 0) {
          variant = "Creative commons";
        } else {
          return; // Unknown cc version.
        }
        node.innerHTML = '<span class="esbIndicator" title="Licens från Creative Commons">' +
          '<i class="license-icon fab fa-creative-commons"></i>' +
          '<span class="esbIndicatorLabel">' + variant.toLowerCase() + '</span></span>';
      }
    },
  }
`;

export const hvdIndicator = `
  {
    block: 'hvdIndicator',
    extends: 'template',
    template: '{{#eachprop "http://data.europa.eu/r5r/applicableLegislation"}}<span class="esbIndicator" title="Särskilt värdefull datamängd">' +
     '<i class="fas fa-star"></i>' +
      '<span class="ml-xs">{{label}}</span></span>{{/eachprop}}',
  }`;

export const costIndicator = `
{
  block: 'costIndicator',
  extends: 'template',
  template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift">' +
    '<i class="fas fa-coins"></i>' +
    '<span class="esbIndicatorLabel">Avgift</span></span>' +
    '{{/ifprop}}',
},
{
  block: 'costIndicator2',
  extends: 'template',
  template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift"><i class="fas fa-coins"></i>' +
    '<span class="esbIndicatorLabel">Avgift</span></span>{{/ifprop}}',
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

      if(window.location.pathname.indexOf("/specifications/") > -1)
        linkTitle = '${t("pages|specification_page$address")}';
      
      if (resourceURI.indexOf('https://dataportal.se/') === 0) {
        node.innerHTML='<h3 class="!mt-none">' + linkTitle + ':</h3> <a class="hemvist mb-lg" href='+resourceURI+'>'+resourceURI+'</a>';
      }
      else
      {
        node.innerHTML='<h3 class="!mt-none">'+linkTitle+'</h3> <a class="hemvist mb-lg" href='+resourceURI+'>'+resourceURI+'</a>';
      } 
    }
  }
`;
