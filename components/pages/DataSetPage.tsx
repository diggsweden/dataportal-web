import React, { useContext, useEffect } from 'react';
import { EntrystoreContext } from '..';
import ShowMoreText from 'react-show-more-text';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { SettingsContext } from '../SettingsProvider';
import { initBreadcrumb } from '../../pages/_app';
import { linkBase } from '../../utilities';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import Head from 'next/head';
import { Heading } from '@digg/design-system';
// import "swagger-ui-react/swagger-ui.css"

export const DataSetPage: React.FC = () => {
  const { pathname, query } = useRouter() || {};
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { lang, t } = useTranslation();
  const { trackPageView } = useMatomo();
  const { dataSet, name } = query || {};
  const ids = (typeof dataSet === 'string' && dataSet.split('_')) || [];
  const cid = ids[0];
  const eid = ids[1];
  let referredSearch: string = `/${t('routes|datasets$path')}/?q=`;
  const hasWindow = typeof window !== 'undefined';
  const postscribe = hasWindow && (window as any).postscribe;

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (hasWindow) {
      //check if reffereing search params is set to hash
      if (window.location && window.location.hash && window.location.hash.includes('ref=?'))
        referredSearch = `/${t('routes|datasets$path')}/?${window.location.hash.split('ref=?')[1]}`;

      window.onpopstate = (e: any) => {
        window.location.reload();
      };
    }
  }, []);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title,
        crumbs: [
          { name: 'start', link: { ...linkBase, link: '/' } },
          {
            name: t('routes|datasets$title'),
            link: { ...linkBase, link: `/${t('routes|datasets$path')}?q=&f=` },
          },
        ],
      });

    return () => {
      setBreadcrumb && setBreadcrumb(initBreadcrumb);
    };
  }, [entry]);

  useEffect(() => {
    if (postscribe) {
      addScripts();
    }
  }, [postscribe]);

  useEffect(() => {
    trackPageView({ documentTitle: Array.isArray(name) ? name[0] : name });
  }, [pathname]);

  const addScripts = () => {
    if (hasWindow) {
      if (eid && cid) {
        postscribe(
          '#scriptsPlaceholder',
          ` 
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_DATASETS_PATH ? env.ENTRYSCAPE_DATASETS_PATH : 'admin.dataportal.se'
            }\/store'          
          };          

          function getApiExploreUrl(entryid,apientryid)
          {
            return '/${lang}/${t(
            'routes|datasets$path'
          )}/${cid}_'+entryid+'/${name}/apiexplore/'+apientryid;
          }          
          
          window.__entryscape_config = [{

            block: 'config',
            page_language: '${lang}',
            entry: '${eid}', 
            context: '${cid}',
            clicks: {"dataservice-link":"/dataservice/\${context}_\${entry}/"},
            namespaces:{
              esterms: 'http://entryscape.com/terms/',
              peu: 'http://publications.europa.eu/resource/authority/'
            },

            collections: [
              {
                type: 'facet',
                name: 'format',
                label: 'Format',
                property: 'dcterms:format',
                related: false,
                nodetype: 'literal',
                searchIndextype: 'string',
                limit: 7,
                options: {
                  pdf: ['PDF', 'application/pdf'],
                  html: ['text/html', 'application/xhtml+xml', 'HTML'],
                  xml: ['application/xml', 'text/xml', 'XML'],
                  json: ['application/json', 'application/ld+json', 'application/json-ld', 'application/json+zip'],
                  csv: ['text/csv', 'CSV', '.csv', 'application/zip+csv', 'text/csv+zip'],
                  text: ['text/plain', '.txt'],
                  rdf: ['application/rdf+xml', 'application/sparql-query'],
                  zip: ['ZIP', 'application/zip', 'application/x-zip-compressed'],
                  image: ['jpg', 'image/jpeg', 'image/jpg', 'image/png', 'tiff', 'image/tiff'],
                  atom: ['application/atom+xml'],
                  wfs: ['application/vnd.ogc.wfs_xml', 'application/gml+xml', 'wfs'],
                  wms: ['application/vnd.ogc.wms_xml', 'application/vnd.iso.19139+xml', 'WMS'],
                  wmts: ['application/vnd.ogc.wmts_xml'],
                  wcs: ['application/vnd.ogc.wcs_xml'],
                  kml: ['application/vnd.google-earth.kml+xml'],
                  geojson: ['application/vnd.geo+json'],
                  shp: ['application/x-shapefile', 'application/x-shp'],
                  xls: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', '.xlsx', '.xls'],
                  ods: ['application/vnd.oasis.opendocument.spreadsheet'],
                  '${t('pages|datasetpage$fileformat')}': null,
                },
              },
            ],

            blocks: [
              {
                block: 'formatBadge',
                extends: 'template',
                template: '<div class="">' +
                  '{{#ifprop "dcterms:format" invert="true"}}' +
                  '<span title="Inget format angivet" class="text-md" data-esb-collection-format="__na">-</span>' +
                  '{{/ifprop}}' +
                  '{{#eachprop "dcterms:format"}}' +
                  '<span title="{{value}}" class="text-md" data-esb-collection-format="{{optionvalue}}">{{label}}</span>' +
                  '{{/eachprop}}</div>',
              },
              {
              block: 'formatBadges2',
              extends: 'template',
              template: '{{#eachprop "dcterms:format"}}' +
                '<span title="{{value}}" class="text-md font-bold distribution__format" data-esb-collection-format="{{optionvalue}}">{{label}}</span>' +
                '{{/eachprop}}',
              },
              {
                block: 'distributionAccessCustom',
                extends: 'template',
                template: '{{#ifprop "dcat:downloadURL"}}' +
                  '{{#ifprop "dcat:downloadURL" min="2"}}${t(
                    'pages|datasetpage$several_links'
                  )}{{/ifprop}}' +
                  '{{#ifprop "dcat:downloadURL" min="2" invert="true"}}' +
                  '<a href="{{prop "dcat:downloadURL"}}" class="text-md matomo_download distribution__link download_url" target="_blank">${t(
                    'pages|datasetpage$download_link'
                  )}</a>' +
                  '{{/ifprop}}' +
                  '{{/ifprop}}' +
                  '{{#ifprop "dcat:downloadURL" invert="true"}}' +
                  '<a href="{{prop "dcat:accessURL"}}" class="text-md distribution__link access_url" target="_blank">' +
                  '${t('pages|datasetpage$download_link_adress')}' +
                  '{{/ifprop}}',
              },
              {
                block: 'fileList2',
                extends: 'template',
                directlabel: false,
                template: '{{#unless directlabel}}' +
                  '{{fileListEntries}}' +
                  '{{else}}' +
                  '<div class="escoList"><div class="entryList" aria-live="polite">' +
                  '{{#eachprop "dcat:downloadURL"}}' +
                  
                  '<div class="esbRow distribution__extended-list"><div class="esbRowHead">' +
                  '<div class="esbRowMain">' +
                  '<span class="esbRowAlign"><span class="esbRowAlignPrimary text-base">{{labelish}}</span>' +
                  '<span class="esbRowAlignSecondary text-base"><a href="{{value}}"' +
                  ' class="text-base" target="_blank">' +
                  '${t('pages|datasetpage$download_link')}</a></span></span></div></div></div>' +
                  '{{/eachprop}}' +
                  '</div></div>' +
                  '{{/unless}}',
              },
              {
                block: 'fileListEntries2',
                extends: 'list',
                relation: 'dcat:downloadURL',
                rowhead: '<span class="esbRowAlign">' +
                  '<span class="esbRowAlignPrimary esbRowEllipsis resourceLabel">{{text fallback="{{resourceURI}}"}}</span>' +
                  '<span class="esbRowAlignSecondary">' +
                  '<a href="{{resourceURI}}" class="" role="button" target="_blank">' +
                  'Ladda ner data</a>' +
                  '</span></span>',
              },
              {
                block: 'accessServiceCustom',
                extends: 'template',
                relation: 'dcat:accessService',
                template: '<hr>' +
                  '{{view rdformsid="dcat:endpointDescription,dcat:dcterms:type_ds"}}' +
                  '{{link class="api_readmore text-md link" namedclick="dataservice-link" content="${t(
                    'pages|datasetpage$read_about_api'
                  )}"}}'          
              },
              {
                block: 'aboutDataset',
                extends: 'template',
                relation: 'dcat:Dataset',
                template: '{{viewMetadata rdformsid="dcat:Dataset"}}'          
              },
              {
                block: 'architectureIndicator',
                extends: 'template',
                template: '{{#ifprop "dcterms:type"}}' +
                  '<span class="esbIndicator" title="TjÃ¤nstens arkitekturstil">' +
                  '<span class="material-icons-outlined">build_circle</span>' +
                  '<i class="fas fa-wrench"></i>' +
                  '<span class="esbIndicatorLabel">{{#eachprop "dcterms:type"}}{{label}}{{separator}}{{/eachprop}}</span></span>' +
                  '{{/ifprop}}',
              },
              {
                block: 'costIndicator',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift">' +
                  '<i class="fas fa-coins"></i>' +
                  '<span class="esbIndicatorLabel">Avgift</span></span>' +
                  '{{/ifprop}}',
              },
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
              },
              {
                block: 'periodicityIndicator',
                extends: 'template',
                template: '{{#eachprop "dcterms:accrualPeriodicity"}}<span class="esbIndicator" title="Uppdateringsfrekvens">' +
                  '<i class="fas fa-redo"></i>' +
                  '<span class="">{{label}}</span></span>{{/eachprop}}',
              },
              {
                block: 'licenseIndicatorCustom',
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
              },
              {
                block: 'costIndicator2',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift"><i class="fas fa-coins"></i>' +
                  '<span class="esbIndicatorLabel">Avgift</span></span>{{/ifprop}}',
              },
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
                      el.innerHTML = '${t('pages|datasetpage$explore-api')}'
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
              },
              {
                block: 'distributionListCustom',
                extends: 'list',
                relation: 'dcat:distribution',
                expandTooltip: 'Visa mer',
                unexpandTooltip: 'Visa mindre',
                registry: false,
                clickExpand: false,
                hl: 2,
                listbody: '<div class="formats">{{body}}</div>',
                listplaceholder: '<div class="alert alert-info" role="alert">${t(
                  'pages|datasetpage$no_data'
                )}</div>',
                rowhead:
                  '<span class="esbRowAlign">' +
                  '<span class="esbRowAlignOther">{{formatBadges2}}</span>' +
                  '{{#ifprop "rdf:type" uri="esterms:ServiceDistribution"}}' +
                    '<span class="distribution_api-flag text-md"><i class="icon-cog--before"></i>API</span>' +
                  '{{/ifprop}}' +                  
                  '<span class="esbRowAlignPrimary">{{text fallback="<span class=\\\'distributionNoName\\\'>${t(
                    'pages|datasetpage$no_title'
                  )}</span>"}}</span>' +                  
                  '<div class="distribution_link-row">' +
                  
                  '{{exploreApiLink}}' +

                  '<span class="esbRowAlignSecondary">{{distributionAccessCustom}}</span></span>',
                  rowexpand: '{{#ifprop "dcat:downloadURL"}}' +
                  '</div>' +

                  '{{#ifprop "dcat:downloadURL" min="2"}}' +
                  '<h{{hinc}} class="distribution_files_header">${t(
                    'pages|datasetpage$several_links_header'
                  )}</h{{hinc}}>' +
                  '{{fileList2 directlabel="inherit:registry"}}' +
                  '{{/ifprop}}' +
                  '{{/ifprop}}' +
                  '{{view rdformsid="dcat:Distribution" filterpredicates="dcat:downloadURL,dcterms:title,dcat:accessService"}}' +
                  '{{#ifprop "dcat:accessService"}}{{accessServiceCustom}}{{/ifprop}}',
              },]
          }]
          </script>              

          <script src="${
            lang === 'sv' ? env.ENTRYSCAPE_OPENDATA_SV_URL : env.ENTRYSCAPE_OPENDATA_EN_URL
          }"></script>
          <script src="${env.ENTRYSCAPE_BLOCKS_URL}"></script>                       
          `,
          {
            done: function () {},
          }
        );
      }
    }
  };

  return (
    <div className="detailpage">
      <Head>
        <title>{`${entry.title} - Sveriges dataportal`}</title>
        <meta
          property="og:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
        <meta
          name="twitter:title"
          content={`${entry.title} - Sveriges dataportal`}
        />
      </Head>
      <div className="detailpage__wrapper">
        {/* Left column */}
        <div className="detailpage__wrapper--leftcol">
          {/* Title */}
          <Heading>{entry.title}</Heading>

          {/* Publisher */}
          <script
            type="text/x-entryscape-handlebar"
            data-entryscape="true"
            data-entryscape-component="template"
            dangerouslySetInnerHTML={{
              __html: `
                                <p class="text-md">
                                  {{text relation="dcterms:publisher"}} 
                                <p>
                                `,
            }}
          ></script>

          {/* Indicators */}
          <div className="row indicators">
            <div
              data-entryscape="accessRightsIndicator"
              className="accessRightsIndicator"
            ></div>
            <div
              data-entryscape="periodicityIndicator"
              className="architectureIndicator"
            ></div>
            <div
              data-entryscape="licenseIndicatorCustom"
              className="licenseIndicator"
            ></div>

            <div
              data-entryscape="costIndicator2"
              className="costIndicator"
            ></div>
          </div>

          {/* Description */}
          <div className="description">
            <ShowMoreText
              lines={8}
              more={t('pages|datasetpage$view_more')}
              less={t('pages|datasetpage$view_less')}
              className="text-md"
              anchorClass="text-md view-more-text-link"
              expanded={false}
            >
              <span className="text-md">{entry.description}</span>
            </ShowMoreText>
          </div>

          {/* Use data - header */}
          <Heading
            level={2}
            className="hbbr"
          >
            {t('pages|datasetpage$use-data')}
          </Heading>

          {/* Distribution list */}
          <div
            className="distribution__list"
            data-entryscape="distributionListCustom"
            data-entryscape-registry="true"
          ></div>

          {/* Dataset map */}
          <div
            className="dataset__map"
            data-entryscape="view"
            data-entryscape-rdformsid="dcat:dcterms:spatial_bb_da"
            data-entryscape-label="false"
          ></div>

          {/* Questions  or comments */}
          <div className="contact__publisher hbbr">
            <Heading level={3}>{t('pages|datasetpage$contact-publisher')}</Heading>
            <p className="text-md">
              {t('pages|datasetpage$contact-publisher-text')}
              {t('pages|datasetpage$contact-publisher-text2')}{' '}
              <a
                className="text-md link"
                href="https://community.dataportal.se/"
                lang="en"
              >
                community
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="detailpage__wrapper--rightcol hbbr">
          {/* About dataset - wrapper  */}
          <div className="detailpage__wrapper--rightcol-info text-base">
            <Heading
              level={2}
              size="md"
            >
              {t('pages|datasetpage$about-dataset')}
            </Heading>

            {/* About dataset */}
            <script
              type="text/x-entryscape-handlebar"
              data-entryscape="true"
              data-entryscape-component="template"
              dangerouslySetInnerHTML={{
                __html: `
                                    <div class="viewMetadata">
                                      {{viewMetadata 
                                      template="dcat:Dataset" 
                                      filterpredicates="dcterms:title,dcterms:description,dcterms:publisher,dcat:bbox,dcterms:spatial,dcterms:provenance"}}
                                    </div>
                                  `,
              }}
            ></script>
          </div>

          {/* Catalog informaton wrapper */}
          <div className="detailpage__wrapper--rightcol-info text-base">
            <Heading
              level={2}
              size={'md'}
            >
              {t('pages|datasetpage$catalog')}
            </Heading>

            {/* Catalog */}
            <script
              type="text/x-entryscape-handlebar"
              data-entryscape="true"
              data-entryscape-block="template"
              dangerouslySetInnerHTML={{
                __html: `{{viewMetadata 
                                    relationinverse="dcat:dataset" 
                                    onecol=true 
                                    template="dcat:OnlyCatalog"                               
                                    filterpredicates="dcterms:issued,dcterms:language,dcterms:modified,dcterms:spatial,dcterms:license,dcat:themeTaxonomi"
                                    }}`,
              }}
            ></script>
          </div>

          {/* Download RDF */}
          <script
            className="download__rdf"
            type="text/x-entryscape-handlebar"
            data-entryscape="true"
            data-entryscape-block="template"
            dangerouslySetInnerHTML={{
              __html: `
                              <a class="download__rdf--link matomo_download text-md link" target="_blank" href="{{metadataURI}}?recursive=dcat">${t(
                                'pages|datasetpage$rdf'
                              )}</a>
                              `,
            }}
          ></script>
        </div>
      </div>
    </div>
  );
};
