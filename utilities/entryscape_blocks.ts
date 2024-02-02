import { Translate } from "next-translate";

export const accessrigthsIndicator = `
  {
    block: 'accessRightsIndicator',
    extends: 'template',
    template: '{{#ifprop "dcterms:accessRights"}}' +
      '{{#eachprop "dcterms:accessRights"}}<span class="esbIndicator" title="{{description}}">' +
      '{{#ifprop "dcterms:accessRights" uri="peu:access-right/PUBLIC"}}' +
      '<i class="fas fa-lock-open"></i>{{/ifprop}}' +
      '{{#ifprop "dcterms:accessRights" uri="peu:access-right/NON_PUBLIC"}}' +
      '<i class="fas fa-key"></i>{{/ifprop}}' +
      '{{#ifprop "dcterms:accessRights" uri="peu:access-right/RESTRICTED"}}' +
      '<i class="fas fa-lock"></i>{{/ifprop}}' +
      '<span class="esbIndicatorLabel">{{label}}</span>{{/eachprop}}' +
      '</span>{{/ifprop}}',
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
     '<i class="fas fa-dollar-sign"></i>' +
      '<span class="ml-xs">{{label}}</span></span>{{/eachprop}}',
  }`;

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
          el.setAttribute('class', 'explore-api-btn') 
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
        node.innerHTML=linkTitle + ': <a class="hemvist" href='+resourceURI+'>'+resourceURI+'</a>';
      }
      else
      {
        node.innerHTML='<span class="text-sm text-textSecondary">'+linkTitle+'</span> <a href='+resourceURI+'>'+resourceURI+'</a>';
      } 
    }
  }
`;
