import React, { useEffect } from 'react';
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

export const DataServicePage: React.FC<PageProps> = ({ env, match }) => {
  let postscribe: any;
  let referredSearch: string = `/${i18n.languages[0]}/${i18n.t(
    'routes|datasets|path'
  )}/?q=`;

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== 'undefined') {
      //check if reffereing search params is set to hash
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
            entry: '${match.params.eid}', 
            context: '${match.params.cid}',
            namespaces:{
              esterms: 'http://entryscape.com/terms/',
              peu: 'http://publications.europa.eu/resource/authority/'
            },

            blocks: [
              {
                block: 'dataserviceReferences2',
                extends: 'template',
                hl: '2',
                template: '{{#ifprop "dcat:servesDataset"}}' +
                  '  {{dataserviceForwardReferences hl="inherit:hl"}}' +
                  '{{/ifprop}}' +
                  '{{#ifprop "dcat:servesDataset" invert="true"}}' +
                  '  {{dataserviceBackwardReferences hl="inherit:hl"}}' +
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
                block: 'architectureIndicator',
                extends: 'template',
                template: '{{#ifprop "dcterms:type"}}' +
                  '<span class="esbIndicator" title="TjÃ¤nstens arkitekturstil">' +
                  '<i class="fas fa-wrench"></i>' +
                  '<span class="text-5">{{#eachprop "dcterms:type"}}{{label}}{{separator}}{{/eachprop}}</span></span>' +
                  '{{/ifprop}}',
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
                block: 'dataserviceForwardReferences2',
                extends: 'list',
                relation: 'dcat:servesDataset',
                hl: '2',
                limit: '3',
                listhead: '<h{{hl}}>DatamÃ¤ngder som anvÃ¤nder detta API</h{{hl}}>',
                rowhead: '{{link namedclick="dataset"}}',
              },
              {
                block: 'dataserviceBackwardReferences2',
                extends: 'list',
                relationinverse: 'dcat:accessService',
                layout: 'raw',
                hl: '2',
                limit: '3',
                listhead: '<h{{hl}}>DatamÃ¤ngder som anvÃ¤nder detta API</h{{hl}}>',
                rowhead: '{{link relationinverse="dcat:distribution" namedclick="dataset"}}',
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

  return (
    <EntrystoreProvider
      env={env}
      cid={match.params.cid}
      eid={match.params.eid}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
    >
      <EntrystoreContext.Consumer>
        {(entry) => (
          <div className="detailpage">
            <PageMetadata
              seoTitle={`${entry.title} - ${i18n.t('common|seo-title')}`}
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
                        'routes|dataservices|path'
                      )}/${match.params.cid}_${match.params.eid}/${slugify(
                        entry.title
                      )}`
                    : '',
              }}
              canonicalUrl={
                entry && entry.title
                  ? `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t(
                      'routes|dataservices|path'
                    )}/${match.params.cid}_${match.params.eid}/${slugify(
                      entry.title
                    )}`
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
                    'routes|dataservices|path'
                  )}/${match.params.cid}_${match.params.eid}/${slugify(
                    entry.title
                  )}`,
                  title: entry.title,
                },
              ]}
            />
            <div className="detailpage__wrapper">
              {/* Left column */}
              <div className="detailpage__wrapper--leftcol content">
                <h1 className="text-2">{entry.title}</h1>

                {/* Publisher */}
                <script
                  type="text/x-entryscape-handlebar"
                  data-entryscape="true"
                  data-entryscape-component="template"
                  dangerouslySetInnerHTML={{
                    __html: `
                          <p class="text-5">
                            {{text relation="dcterms:publisher"}} 
                          <p>
                          `,
                  }}
                ></script>

                {/* Indicators */}
                <div className="row indicators">
                  <div
                    data-entryscape="architectureIndicator"
                    className="architectureIndicator"
                  ></div>
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
                </div>

                {/* Description */}
                <script
                  type="text/x-entryscape-handlebar"
                  data-entryscape="true"
                  data-entryscape-component="template"
                  dangerouslySetInnerHTML={{
                    __html: `
                          <div class="description text-5">{{text content="\${dcterms:description}"}}</div>
                          `,
                  }}
                ></script>

                <script
                  type="text/x-entryscape-handlebar"
                  data-entryscape="true"
                  data-entryscape-component="template"
                  dangerouslySetInnerHTML={{
                    __html: `
                        
                        <div class="dataservice__access">
                          {{viewMetadata 
                              template="dcat:DataService"
                              filterpredicates="dcterms:title,dcterms:publisher,dcterms:type,dcterms:license,dcterms:accessRights,dcat:landingPage,foaf:page"
                            }}
                        </div>
                        `,
                  }}
                ></script>

                <div className="contact__publisher hbbr">
                  <h3 className="text-4">
                    {i18n.t('pages|datasetpage|contact-publisher')}
                  </h3>
                  <p className="text-5">
                    {i18n.t('pages|datasetpage|contact-publisher-text')}
                    {i18n.t('pages|datasetpage|contact-publisher-text2')}{' '}
                    <a
                      className="text-5-link"
                      href="https://community.dataportal.se/"
                    >
                      community
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Right column */}
              <div className="detailpage__wrapper--rightcol hbbr">
                <div className="detailpage__wrapper--rightcol-info text-6">
                  <h2 className="text-5-bold">
                    {i18n.t('pages|dataservicepage|api')}
                  </h2>

                  <script
                    type="text/x-entryscape-handlebar"
                    data-entryscape="true"
                    data-entryscape-component="template"
                    dangerouslySetInnerHTML={{
                      __html: `
                                <div class="dataservice_moreinfo">
                                  {{viewMetadata 
                                      template="dcat:DataService"
                                      filterpredicates="dcterms:title,dcterms:publisher,dcat:endpointURL"
                                    }}
                                </div>
                                `,
                    }}
                  ></script>
                </div>
              </div>
            </div>
          </div>
        )}
      </EntrystoreContext.Consumer>
    </EntrystoreProvider>
  );
};
