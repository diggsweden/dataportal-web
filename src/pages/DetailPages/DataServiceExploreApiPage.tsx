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

export const DataServiceExploreApiPage: React.FC<PageProps> = ({
  env,
  location,
  match,
}) => {
  const [toggleState, setToggleState] = useState(1);
  let postscribe: any;
  let referredSearch: string = `/${i18n.languages[0]}/${i18n.t(
    'routes|datasets|path'
  )}/?q=`;

 //Toggle between tabs
 const toggleTab = (index: any) => {
    setToggleState(index);
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

    addScripts();
  }, []);

  const addScripts = () => {
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
                block: 'formatBadge',
                extends: 'template',
                template: '<div class="">' +
                  '{{#ifprop "dcterms:format" invert="true"}}' +
                  '<span title="Inget format angivet" class="text-5" data-esb-collection-format="__na">-</span>' +
                  '{{/ifprop}}' +
                  '{{#eachprop "dcterms:format"}}' +
                  '<span title="{{value}}" class="text-5" data-esb-collection-format="{{optionvalue}}">{{label}}</span>' +
                  '{{/eachprop}}</div>',
              },
              {
              block: 'formatBadges2',
              extends: 'template',
              template: '{{#eachprop "dcterms:format"}}' +
                '<span title="{{value}}" class="text-5-bold distribution__format" data-esb-collection-format="{{optionvalue}}">{{label}}</span>' +
                '{{/eachprop}}',
              },
              {
                block: 'distributionAccess2',
                extends: 'template',
                template: '{{#ifprop "dcat:downloadURL"}}' +
                  '{{#ifprop "dcat:downloadURL" min="2"}}${i18n.t(
                    'pages|datasetpage|several_links'
                  )}{{/ifprop}}' +
                  '{{#ifprop "dcat:downloadURL" min="2" invert="true"}}' +
                  '<a href="{{prop "dcat:downloadURL"}}" class="text-5 matomo_download distribution__link" target="_blank">${i18n.t(
                    'pages|datasetpage|download_link'
                  )}</a>' +
                  '{{/ifprop}}' +
                  '{{/ifprop}}' +
                  '{{#ifprop "dcat:downloadURL" invert="true"}}' +
                  '<a href="{{prop "dcat:accessURL"}}" class="text-5 matomo_download distribution__link" target="_blank">' +
                  '${i18n.t('pages|datasetpage|download_link_adress')}' +
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
                  '<span class="esbRowAlign"><span class="esbRowAlignPrimary text-6">{{labelish}}</span>' +
                  '<span class="esbRowAlignSecondary text-6"><a href="{{value}}"' +
                  ' class="text-6" target="_blank">' +
                  '${i18n.t(
                    'pages|datasetpage|download_link'
                  )}</a></span></span></div></div></div>' +
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
                block: 'accessService2',
                extends: 'template',
                relation: 'dcat:accessService',
                template: '<hr>' +
                  '{{view rdformsid="dcat:endpointDescription,dcat:dcterms:type_ds"}}' +
                  '{{link class="api_readmore text-5-link" namedclick="dataservice-link" content="${i18n.t(
                    'pages|datasetpage|read_about_api'
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
                block: 'costIndicator2',
                extends: 'template',
                template: '{{#ifprop "schema:offers"}}<span class="esbIndicator" title="Avgift"><i class="fas fa-coins"></i>' +
                  '<span class="esbIndicatorLabel">Avgift</span></span>{{/ifprop}}',
              },

              {
                block: 'distributionList2',
                extends: 'list',
                relation: 'dcat:distribution',
                expandTooltip: 'Mer information',
                unexpandTooltip: 'Mindre information',
                registry: false,
                clickExpand: false,
                hl: 2,
                listbody: '<div class="formats">{{body}}</div>',
                listplaceholder: '<div class="alert alert-info" role="alert">${i18n.t(
                  'pages|datasetpage|no_data'
                )}</div>',
                rowhead:
                  '<span class="esbRowAlign">' +
                  '<span class="esbRowAlignOther">{{formatBadges2}}</span>' +
                  '{{#ifprop "rdf:type" uri="esterms:ServiceDistribution"}}' +
                    '<span class="distribution_api-flag text-5"><i class="fas fa-cog"></i>API</span>' +
                  '{{/ifprop}}' +
                  '<span class="esbRowAlignPrimary">{{text fallback="<span class=\\\'distributionNoName\\\'>${i18n.t(
                    'pages|datasetpage|no_title'
                  )}</span>"}}</span>' +
                  '<span class="esbRowAlignSecondary">{{distributionAccess2}}</span></span>',
                  rowexpand: '{{#ifprop "dcat:downloadURL"}}' +
                  '{{#ifprop "dcat:downloadURL" min="2"}}' +
                  '<h{{hinc}} class="distribution_files_header">${i18n.t(
                    'pages|datasetpage|several_links_header'
                  )}</h{{hinc}}>' +
                  '{{fileList2 directlabel="inherit:registry"}}' +
                  '{{/ifprop}}' +
                  '{{/ifprop}}' +
                  '{{view rdformsid="dcat:Distribution" filterpredicates="dcat:downloadURL,dcterms:title,dcat:accessService"}}' +
                  '{{#ifprop "dcat:accessService"}}{{accessService2}}{{/ifprop}}',
              },]
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
                    seoTitle={`${i18n.t('routes|api_explore|title')} - ${entry.title} - ${i18n.t('common|seo-title')}`}
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
                          ? `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t('routes|dataservices|path')}/${match.params.cid}_${match.params.eid}/${slugify(entry.title)}/${i18n.t('routes|api_explore|path')}/${match.params.apieid}`
                          : '',
                    }}
                    canonicalUrl={
                      entry && entry.title
                        ? `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t('routes|dataservices|path')}/${match.params.cid}_${match.params.eid}/${slugify(entry.title)}/${i18n.t('routes|api_explore|path')}/${match.params.apieid}`
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
                        path: `/${i18n.languages[0]}/${i18n.t('routes|dataservices|path')}/${match.params.cid}_${match.params.eid}/${slugify(entry.title)}`,
                        title: entry.title,
                      },
                      {
                        path: `/${i18n.languages[0]}/${i18n.t('routes|dataservices|path')}/${match.params.cid}_${match.params.eid}/${slugify(entry.title)}/${i18n.t('routes|api_explore|path')}/${match.params.apieid}`,
                        title: i18n.t('routes|api_explore|title'),
                      },
                    ]}
                  />
                  <div className="detailpage__wrapper detailpage__wrapper--apiexplore">
                    <div className="detailpage__wrapper-topinfo">
                      <span className="text-7-bold beta_badge--xl">BETA</span>

                      {/* Title */}
                      <h1 className="api-title">
                        Utforska API{' '}
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

                      <span className="text-5 api-publisher">
                        {entry.publisher}
                      </span>

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
                          data-entryscape="licenseIndicator2"
                          className="licenseIndicator"
                        ></div>

                        <div
                          data-entryscape="costIndicator2"
                          className="costIndicator"
                        ></div>
                      </div>

                      {/* Publisher */}
                      <span className="text-5-bold">Tillhör datamängd</span>
                      <span className="text-5">{entry.title}</span>
                    </div>

                    <nav className="tabs-nav">
                      <ul>
                        <li>
                          <button
                            className={
                              toggleState === 1 ? 'active-tab text-6' : 'text-6'
                            }
                            onClick={() => toggleTab(1)}
                          >
                            API-kontrakt
                          </button>
                        </li>
                        <li>
                          <button
                            className={toggleState === 2 ? 'active-tab' : ''}
                            onClick={() => toggleTab(2)}
                          >
                            Information
                          </button>
                        </li>
                        <li>
                          <button
                            className={
                              toggleState === 3 ? 'active-tab text-6' : 'text-6'
                            }
                            onClick={() => toggleTab(3)}
                          >
                            Åtkomst
                          </button>
                        </li>
                      </ul>
                    </nav>

                    <div className="content-tabs-wrapper">
                      <div
                        id="content-tab-1"
                        className={
                          toggleState === 1
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
                      <div
                        id="content-tab-2"
                        className={
                          toggleState === 2
                            ? 'active-content-tab content-tab'
                            : 'content-tab'
                        }
                      >
                        <div
                          data-entryscape="view"
                          data-entryscape-filterpredicates="dcterms:title,dcterms:license,dcat:accessURL"
                        ></div>
                      </div>
                      <div
                        id="content-tab-3"
                        className={
                          toggleState === 3
                            ? 'content-tab active-content-tab'
                            : 'content-tab'
                        }
                      >
                        <div className="text-5">
                          <div className="content-tab-text">
                            <h2 className="text-5-bold">
                              Webbadress för åtkomst
                            </h2>{' '}
                            <p>
                              <script
                                type="text/x-entryscape-handlebar"
                                data-entryscape="true"
                                data-entryscape-component="template"
                                dangerouslySetInnerHTML={{
                                  __html: `
                                    <a class="text-6 link" href="{{prop "dcat:accessURL"}}" >{{text content="\${dcat:accessURL}"}}</a>
                                    `,
                                }}
                              ></script>
                            </p>
                            <h2 className="text-5-bold">Licens</h2>{' '}
                            <p>
                              <script
                                type="text/x-entryscape-handlebar"
                                data-entryscape="true"
                                data-entryscape-component="template"
                                dangerouslySetInnerHTML={{
                                  __html: `
                                    <a class="text-6 link" href="{{prop "dcterms:license"}}" >{{text content="\${dcterms:license}"}}</a>
                                    `,
                                }}
                              ></script>
                            </p>
                            {entry.contact && (
                              <>
                                <h2 className="text-5-bold">Kontakt</h2>
                                <p>
                                  <a
                                    className="text-6 link"
                                    href={`mailto:${entry.contact.email}`}
                                  >
                                    {entry.contact.name}
                                  </a>
                                </p>
                              </>
                            )}
                            <div className="highlight-block">
                              <h2 className="text-5-bold">
                                Åtkomst till API:er
                              </h2>
                              <p>
                                På dataportalen tillhandahålls både API:er som
                                är helt öppna och de som kräver en API-nyckel.
                              </p>
                              <h2 className="text-5-bold">API som är öppet</h2>
                              <p>
                                För API:er som är öppna går det direkt att göra
                                anrop och utforska datat.
                              </p>
                              <h2 className="text-5-bold">
                                API som kräver API-nyckel
                              </h2>
                              <p>
                                Vissa API:er måste låsas upp med en API-nyckel
                                för att möjliggöra att kunna göra anrop och
                                utforska datat. För att få tillgång till en
                                API-nyckel behöver tillhandahållande myndighet
                                eller organisation kontaktas.
                              </p>
                            </div>
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
