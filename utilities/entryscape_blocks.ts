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

export const architechtureIndicator =  `
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
      var v = entry.getMetadata().findFirstValue(null, 'dcterms:license');
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
          node.firstElementChild.appendChild(el);
          el.innerHTML = '${t("pages|datasetpage$explore-api")}'
          el.setAttribute('href', getApiExploreUrl('${eid}',entryId))
          el.setAttribute('class', 'explore-api-link entryscape text-md link') 
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
