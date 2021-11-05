import React, { useContext, useEffect, useState } from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import { slugify } from 'utilities/urlHelpers';
import {
  EntrystoreProvider,
  EntrystoreContext,
} from '../../components/EntrystoreProvider';
import { PageProps } from '../PageProps';
import { StaticBreadcrumb } from 'components/Breadcrumb';
import {
  ApiExplorer,
  ApiIndexContext,
  ApiIndexProvider,
} from 'components/ApiExploring';

export const DataSetExploreApiPage: React.FC<PageProps> = ({
  env,
  location,
  match,
}) => {
  const [toggleTabs, setToggleTabs] = useState(1);
  let postscribe: any;
  let referredSearch: string = `/${i18n.languages[0]}/${i18n.t(
    'routes|datasets|path'
  )}/?q=`;

  //Toggle between tabs
  const toggleTab = (index: any) => {
    setToggleTabs(index);
  };

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== 'undefined') {
      //check if refering search params is set to hash
      if (
        window.location &&
        window.location.hash &&
        window.location.hash.includes('ref=?')
      )
        referredSearch = `/${i18n.languages[0]}/${i18n.t(
          'routes|datasets|path'
        )}/?${window.location.hash.split('ref=?')[1]}`;

      window.onpopstate = (e: any) => {
        window.location.reload();
      };
    }

    addScriptsDistribution();
  }, []);

  const addScriptsDistribution = () => {
    if (typeof window !== 'undefined') {
      postscribe = (window as any).postscribe;

      if (match.params.apieid && match.params.cid) {
        postscribe(
          '#scriptsPlaceholder',
          ` 
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_DATASETS_PATH
                ? env.ENTRYSCAPE_DATASETS_PATH
                : 'admin.dataportal.se'
            }\/store'          
          };
          window.__entryscape_config = [{

            block: 'config',
            page_language: '${i18n.languages[0]}',
            entry: '${match.params.apieid}', 
            context: '${match.params.cid}',
            clicks: {"dataservice-link":"/${
              i18n.languages[0]
            }/dataservice/\${context}_\${entry}/"},
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
                  '${i18n.t('pages|datasetpage|fileformat')}': null,
                },
              },
            ],

            blocks: [
              {
                block: 'licenseIndicator2',
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
                block: 'costIndicator2',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift"><i class="fas fa-coins"></i>' +
                  '<span class="esbIndicatorLabel">Avgift</span></span>{{/ifprop}}',
              },         
          ]
          }]
          </script>              

          <script src="${
            i18n.languages[0] == 'sv'
              ? env.ENTRYSCAPE_OPENDATA_SV_URL
              : env.ENTRYSCAPE_OPENDATA_EN_URL
          }"></script>
          <script src="${
            env.ENTRYSCAPE_BLOCKS_URL
          }"></script>                       
          `,
          {
            done: function () {},
          }
        );
      }
    }
  };

  const addScriptsDataset = () => {
    if (typeof window !== 'undefined') {
      postscribe = (window as any).postscribe;

      if (match.params.eid && match.params.cid) {
        postscribe(
          '#scriptsPlaceholder',
          ` 
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_DATASETS_PATH
                ? env.ENTRYSCAPE_DATASETS_PATH
                : 'admin.dataportal.se'
            }\/store'          
          };          

          function getApiExploreUrl(entryid,apientryid)
          {
            return '/${i18n.languages[0]}/${i18n.t('routes|datasets|path')}/${
            match.params.cid
          }_'+entryid+'/${match.params.name}/apiexplore/'+apientryid
          }          

          window.__entryscape_config.push({

            block: 'config',
            page_language: '${i18n.languages[0]}',
            entry: '${match.params.eid}', 
            context: '${match.params.cid}',
            clicks: {"dataservice-link":"/${
              i18n.languages[0]
            }/dataservice/\${context}_\${entry}/"},
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
                  '${i18n.t('pages|datasetpage|fileformat')}': null,
                },
              },
            ],

            blocks: [
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
                block: 'costIndicator2',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift"><i class="fas fa-coins"></i>' +
                  '<span class="esbIndicatorLabel">Avgift</span></span>{{/ifprop}}',
              },
            ]
          })
          </script>              

          <script src="${
            i18n.languages[0] == 'sv'
              ? env.ENTRYSCAPE_OPENDATA_SV_URL
              : env.ENTRYSCAPE_OPENDATA_EN_URL
          }"></script>
          <script src="${
            env.ENTRYSCAPE_BLOCKS_URL
          }"></script>                       
          `,
          {
            done: function () {},
          }
        );
      }
    }
  };

  return (
    <EntrystoreProvider
      env={env}
      cid={match.params.cid}
      eid={match.params.eid}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
      fetchMore={true}
    >
      <ApiIndexProvider apiIndexFileUrl={env.API_DETECTION_PATH}>
        <EntrystoreContext.Consumer>
          {(entry) => (
            <ApiIndexContext.Consumer>
              {(apiIndex) => (
                <div className="detailpage">
                  <PageMetadata
                    seoTitle={`${i18n.t('routes|api_explore|title')} - ${
                      entry.title
                    } - ${i18n.t('common|seo-title')}`}
                    seoDescription=""
                    seoImageUrl=""
                    seoKeywords=""
                    robotsFollow={true}
                    robotsIndex={true}
                    lang={i18n.languages[0]}
                    socialMeta={{
                      socialDescription: entry.description,
                      socialTitle: entry.title,
                      socialUrl:
                        entry && entry.title
                          ? `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t(
                              'routes|datasets|path'
                            )}/${match.params.cid}_${
                              match.params.eid
                            }/${slugify(entry.title)}/${i18n.t(
                              'routes|api_explore|path'
                            )}/${match.params.apieid}`
                          : '',
                    }}
                    canonicalUrl={
                      entry && entry.title
                        ? `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t(
                            'routes|datasets|path'
                          )}/${match.params.cid}_${match.params.eid}/${slugify(
                            entry.title
                          )}/${i18n.t('routes|api_explore|path')}/${
                            match.params.apieid
                          }`
                        : ''
                    }
                  />
                  <StaticBreadcrumb
                    env={env}
                    staticPaths={[
                      {
                        path: referredSearch,
                        title: i18n.t('routes|datasets|title'),
                      },
                      {
                        path: `/${i18n.languages[0]}/${i18n.t(
                          'routes|datasets|path'
                        )}/${match.params.cid}_${match.params.eid}/${slugify(
                          entry.title
                        )}`,
                        title: entry.title,
                      },
                      {
                        path: `/${i18n.languages[0]}/${i18n.t(
                          'routes|datasets|path'
                        )}/${match.params.cid}_${match.params.eid}/${slugify(
                          entry.title
                        )}/${i18n.t('routes|api_explore|path')}/${
                          match.params.apieid
                        }`,
                        title: i18n.t('routes|api_explore|title'),
                      },
                    ]}
                  />
                  <div className="detailpage__wrapper detailpage__wrapper--apiexplore">
                    <div className="detailpage__wrapper-topinfo">
                      {/* Beta badge */}
                      <span className="text-7-bold beta_badge--xl">BETA</span>

                      {/* Title */}
                      <h1 className="api-title">
                        {i18n.t('pages|explore-api-page|explore-api')}{' '}
                        <script
                          type="text/x-entryscape-handlebar"
                          data-entryscape="true"
                          data-entryscape-component="template"
                          dangerouslySetInnerHTML={{
                            __html: `
                           <span>{{text content="\${dcterms:title}"}}</span>
                          `,
                          }}
                        ></script>
                      </h1>

                      {/* Publisher */}
                      <span className="text-5 api-publisher">
                        {entry.publisher}
                      </span>

                      {/* Indicators */}
                      <div className="row indicators">
                        <div
                          data-entryscape="accessRightsIndicator"
                          className="accessRightsIndicator"
                          data-entryscape-entry={match.params.eid}
                          data-entryscape-context={match.params.cid}
                        ></div>
                        <div
                          data-entryscape="periodicityIndicator"
                          className="architectureIndicator"
                          data-entryscape-entry={match.params.eid}
                          data-entryscape-context={match.params.cid}
                        ></div>
                        <div
                          data-entryscape="licenseIndicator2"
                          className="licenseIndicator"
                          data-entryscape-entry={match.params.eid}
                          data-entryscape-context={match.params.cid}
                        ></div>

                        <div
                          data-entryscape="costIndicator2"
                          className="costIndicator"
                          data-entryscape-entry={match.params.eid}
                          data-entryscape-context={match.params.cid}
                        ></div>                     
                      </div>

                      {/* Refers to dataset - heading*/}
                      <span className="text-5-bold">
                        {i18n.t('pages|explore-api-page|belongs-to-dataset')}
                      </span>

                      {/* Refers to dataset - datset */}
                      <span className="api-title-sm text-5">{entry.title}</span>
                    </div>

                    {/* Tabs navigation */}
                    <nav className="tabs-nav">
                      <ul>
                        <li>
                          <button
                            className={
                              toggleTabs === 1 ? 'active-tab text-6' : 'text-6'
                            }
                            onClick={() => toggleTab(1)}
                          >
                            {i18n.t('pages|explore-api-page|api-contract')}
                          </button>
                        </li>
                        <li>
                          <button
                            className={toggleTabs === 2 ? 'active-tab' : ''}
                            onClick={() => toggleTab(2)}
                          >
                            Information
                          </button>
                        </li>
                      </ul>
                    </nav>

                    {/* Tabs */}
                    <div className="content-tabs-wrapper">
                      {/* Tab 1 - Swagger*/}
                      <div
                        id="content-tab-1"
                        className={
                          toggleTabs === 1
                            ? 'content-tab active-content-tab'
                            : 'content-tab'
                        }
                      >
                        <ApiExplorer
                          env={env}
                          contextId={match.params.cid}
                          entryId={match.params.apieid}
                        />
                      </div>

                      {/* Tab 2 - Information */}
                      <div
                        id="content-tab-2"
                        className={
                          toggleTabs === 2
                            ? 'active-content-tab content-tab'
                            : 'content-tab'
                        }
                      >
                        <div
                          data-entryscape="view"
                        ></div>

                        <div className="content-tab-text">
                          <div className="highlight-block">
                            <h2 className="text-5-bold">
                              {i18n.t('pages|explore-api-page|access-to-api')}
                            </h2>
                            <p>
                              {i18n.t(
                                'pages|explore-api-page|access-to-api-txt'
                              )}
                            </p>
                            <h2 className="text-5-bold">
                              {i18n.t('pages|explore-api-page|open-apis')}
                            </h2>
                            <p>
                              {i18n.t('pages|explore-api-page|open-apis-txt')}
                            </p>
                            <h2 className="text-5-bold">
                              {i18n.t('pages|explore-api-page|api-key')}
                            </h2>
                            <p>
                              {i18n.t('pages|explore-api-page|api-key-txt')}
                            </p>

                            {entry.contact && (
                              <>
                                <h2 className="text-5-bold">
                                  {i18n.t(
                                    'pages|explore-api-page|contact-publisher'
                                  )}
                                </h2>
                                <p>
                                  <a
                                    className="text-6"
                                    href={`mailto:${entry.contact.email}`}
                                  >
                                    {entry.contact.name}
                                  </a>
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ApiIndexContext.Consumer>
          )}
        </EntrystoreContext.Consumer>
      </ApiIndexProvider>
    </EntrystoreProvider>
  );
};
