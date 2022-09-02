import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {  ApiExplorerProps, EntrystoreContext, ExternalLink } from '../../components';
import useTranslation from 'next-translate/useTranslation';
import { SettingsContext } from '../SettingsProvider';
import { useRouter } from 'next/router';
import { initBreadcrumb } from '../../pages/_app';
import { linkBase } from '../../utilities';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import Head from 'next/head';
import { Heading } from '@digg/design-system';

const ApiExplorer = dynamic(() =>
  import('../../components/ApiExploring/').then(
    (c) => c.ApiExplorer,
    (e) => e as React.FC<ApiExplorerProps>
  ), {ssr: false}
);

export const DataSetExploreApiPage: React.FC<{
  dataSet: string | string[] | undefined;
  apieid: string | string[] | undefined;
}> = ({ dataSet, apieid }) => {
  const { pathname, query } = useRouter() || {};
  const ids = (typeof dataSet === 'string' && dataSet.split('_')) || [];
  const cid = ids[0];
  const eid = ids[1];
  const { t, lang } = useTranslation();
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);

  const [toggleTabs, setToggleTabs] = useState(1);
  const { trackPageView } = useMatomo();
  let postscribe: any;
  let referredSearch: string = `/${t('routes|datasets$path')}/?q=`;

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
        name: t('routes|api_explore$title'),
        crumbs: [
          { name: 'start', link: { ...linkBase, link: '/' } },
          {
            name: t('routes|datasets$title'),
            link: { ...linkBase, link: `/${t('routes|datasets$path')}?q=&f=` },
          },
          {
            name: (entry.title as string) || '',
            link: {
              ...linkBase,
              link: `/${t('routes|datasets$path')}/${query.dataSet}/${query.name}`,
            },
          },
        ],
      });

    return () => {
      setBreadcrumb && setBreadcrumb(initBreadcrumb);
    };
  }, [entry]);

  useEffect(() => {
    addScriptsDistribution();
  }, []);

  useEffect(() => {
    trackPageView({ documentTitle: `${t('routes|api_explore$title')} - ${apieid}` });
  }, [pathname]);

  const addScriptsDistribution = () => {
    if (typeof window !== 'undefined') {
      postscribe = (window as any).postscribe;

      if (apieid && cid) {
        postscribe(
          '#scriptsPlaceholder',
          ` 
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_DATASETS_PATH ? env.ENTRYSCAPE_DATASETS_PATH : 'admin.dataportal.se'
            }\/store'          
          };
          window.__entryscape_config = [{

            block: 'config',
            page_language: '${lang}',
            entry: '${apieid}', 
            context: '${cid}',
            clicks: {"dataservice-link":"/${lang}/dataservice/\${context}_\${entry}/"},
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
            lang == 'sv' ? env.ENTRYSCAPE_OPENDATA_SV_URL : env.ENTRYSCAPE_OPENDATA_EN_URL
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
      <div className="detailpage__wrapper detailpage__wrapper--apiexplore">
        <div className="detailpage__wrapper-topinfo">
          {/* Beta badge */}
          <span className="text-7-bold beta_badge--xl">BETA</span>

          {/* Title */}
          <Heading
            size="xl"
            className="api-title"
          >
            {t('pages|explore-api-page$explore-api')}{' '}
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
          </Heading>

          {/* Publisher */}
          <span className="text-md api-publisher">{entry.publisher}</span>

          {/* Indicators */}
          <div className="row indicators">
            <div
              data-entryscape="accessRightsIndicator"
              className="accessRightsIndicator"
              data-entryscape-entry={eid}
              data-entryscape-context={cid}
            ></div>
            <div
              data-entryscape="periodicityIndicator"
              className="architectureIndicator"
              data-entryscape-entry={eid}
              data-entryscape-context={cid}
            ></div>
            <div
              data-entryscape="licenseIndicator2"
              className="licenseIndicator"
              data-entryscape-entry={eid}
              data-entryscape-context={cid}
            ></div>

            <div
              data-entryscape="costIndicator2"
              className="costIndicator"
              data-entryscape-entry={eid}
              data-entryscape-context={cid}
            ></div>
          </div>

          {/* Refers to dataset - heading*/}
          <span className="text-md font-bold">
            {t('pages|explore-api-page$belongs-to-dataset')}
          </span>

          {/* Refers to dataset - datset */}
          <span className="api-title-sm text-md">{entry.title}</span>
        </div>

        {/* Tabs navigation */}
        <nav className="tabs-nav">
          <ul>
            <li>
              <button
                className={toggleTabs === 1 ? 'active-tab text-base' : 'text-base'}
                onClick={() => toggleTab(1)}
              >
                {t('pages|explore-api-page$api-contract')}
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
            className={toggleTabs === 1 ? 'content-tab active-content-tab' : 'content-tab'}
          >
            <ApiExplorer
              env={env}
              contextId={cid}
              entryId={apieid as string}
            />
          </div>

          {/* Tab 2 - Information */}
          <div
            id="content-tab-2"
            className={toggleTabs === 2 ? 'active-content-tab content-tab' : 'content-tab'}
          >
            <div data-entryscape="view"></div>

            <div className="content-tab-text">
              <div className="highlight-block">
                <Heading level={2}>{t('pages|explore-api-page$access-to-api')}</Heading>
                <p>{t('pages|explore-api-page$access-to-api-txt')}</p>
                <Heading level={2}>{t('pages|explore-api-page$open-apis')}</Heading>
                <p>{t('pages|explore-api-page$open-apis-txt')}</p>
                <Heading level={2}>{t('pages|explore-api-page$api-key')}</Heading>
                <p>{t('pages|explore-api-page$api-key-txt')}</p>

                {entry.contact && (
                  <>
                    <Heading level={2}>{t('pages|explore-api-page$contact-publisher')}</Heading>
                    <p>
                      <ExternalLink
                        isMail={true}
                        href={`mailto:${entry.contact.email}`}
                      >
                        {entry.contact.name}
                      </ExternalLink>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
