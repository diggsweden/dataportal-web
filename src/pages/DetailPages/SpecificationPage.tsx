import React, { useEffect } from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageMetadata } from '../PageMetadata';
import i18n from 'i18n';
import {
  EntrystoreProvider,
  EntrystoreContext,
} from '../../components/EntrystoreProvider';
import { PageProps } from '../PageProps';
import { StaticBreadcrumb } from 'components/Breadcrumb';


export const SpecificationPage: React.FC<PageProps> = ({
  env,
  location,
  match,
}) => {
  let postscribe: any;
  let referredSearch: string = `/${i18n.languages[0]}/${i18n.t(
    'routes|specifications|path'
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
          'routes|specifications|path'
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

      if (match.params.curi) {
        postscribe(
          '#scriptsPlaceholder',

          `
          <script>
            var __entryscape_plugin_config = {
              entrystore_base: 'https:\/\/${
                env.ENTRYSCAPE_SPECS_PATH
                  ? env.ENTRYSCAPE_SPECS_PATH
                  : 'editera.dataportal.se'
              }\/store'            
            };
          </script>

          <script>
          window.__entryscape_config = [{
            block: 'config',
            page_language: '${i18n.languages[0]}',            
            routes: [              
              {
                regex:new RegExp('(\/*\/specifications\/)(.+)'),
                uri:'https://dataportal.se/specifications/${match.params.curi}',
                page_language: '${i18n.languages[0]}'
              }              
            ],
            entrystore: 'https://${
              env.ENTRYSCAPE_SPECS_PATH
                ? env.ENTRYSCAPE_SPECS_PATH
                : 'editera.dataportal.se'
            }/store',
            clicks: {
              specification: 'details.html',
              specifications: 'index.html',
            },
            namespaces: {
              adms: 'http://www.w3.org/ns/adms#',
              prof: 'http://www.w3.org/ns/dx/prof/',
            },
            itemstore: {
              bundles: [
                'dcat',
                'https://${
                  env.ENTRYSCAPE_SPECS_PATH
                    ? env.ENTRYSCAPE_SPECS_PATH
                    : 'editera.dataportal.se'
                }/theme/templates/adms.json',
                'https://${
                  env.ENTRYSCAPE_SPECS_PATH
                    ? env.ENTRYSCAPE_SPECS_PATH
                    : 'editera.dataportal.se'
                }/theme/templates/prof.json',
              ],
            },
            collections: [
              {
                type: 'facet',
                name: 'theme',
                label: 'Theme',
                property: 'dcat:theme',
                nodetype: 'uri',
                templatesource: 'dcat:theme-isa',
              },
              {
                type: 'facet',
                name: 'keyword',
                label: 'Keyword',
                property: 'dcat:keyword',
                nodetype: 'literal',
              }],

            blocks: [
              {
                block: 'specificationSearch',
                extends: 'searchList',
                rdftype: ['dcterms:Standard', 'prof:Profile'],
                rdformsid: 'prof:Profile',
                initsearch: true,
                facets: true,
                headless: true,
                rowhead: '<h4>{{ link namedclick="specification" }}</h4>' +
                  '{{ text content="\${dcterms:description}" }}',
              },
              {
                block: 'resourceDescriptors2',
                extends: 'list',
                relation: 'prof:hasResource',
                template: 'prof:ResourceDescriptor',
                expandTooltip: 'Mer information',
                unexpandTooltip: 'Mindre information',
                listbody: '<div class="specification__resource--body">{{body}}</div>',
                listplaceholder: '<div class="alert alert-info" role="alert">Denna specifikation har inga resurser.</div>',
                rowhead:'<span class="specification__resource--header text-4">{{text}}</span>' + 
                  '<span class="specification__resource--type text-5">{{prop "prof:hasRole" class="type" render="label"}}</span>' +
                  '<div class="specification__resource--description text-5 esbDescription">{{ text content="\${skos:definition}" }}</div>' +
                  '<a target="_blank" class="specification__resource--downloadlink text-5" href="{{resourceURI}}">${i18n.t(
                    'pages|specification_page|download'
                  )} {{prop "prof:hasRole" class="type" render="label"}}</a>',
              },
              {
                block: 'indexLink',
                extends: 'template',
                htemplate: '<a class="btn btn-default primaryBtn" href="/theme/specs">' +
                  'Tillbaka till sök' +
                  '</a>',
              },
            ],
          }];
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
      entryUri={`https://dataportal.se/specifications/${match.params.curi}`}
      entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
      fetchMore={false}
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
                        'routes|specifications|path'
                      )}/${match.params.curi}`
                    : '',
              }}
              canonicalUrl={
                entry && entry.title
                  ? `${env.CANONICAL_URL}/${i18n.languages[0]}/${i18n.t(
                      'routes|specifications|path'
                    )}/${match.params.curi}`
                  : ''
              }
            />
            <StaticBreadcrumb
              env={env}
              staticPaths={[
                {
                  path: referredSearch,
                  title: i18n.t('routes|specifications|title'),
                },
                {
                  path: `/${i18n.languages[0]}/${i18n.t(
                    'routes|specifications|path'
                  )}/${match.params.curi}`,
                  title: entry.title,
                },
              ]}
            />
            <div className="detailpage__wrapper">
              {/* Left column */}
              <div className="detailpage__wrapper--leftcol content">
<<<<<<< HEAD
                <span className="text-7-bold beta_badge--xl">BETA</span>

=======
>>>>>>> prod
                <h1 className="text-2">{entry.title}</h1>
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

                <p className="text-5">
                  <span
                    data-entryscape="text"
                    data-entryscape-content="${dcterms:description}"
                  ></span>
                </p>

                <h2 className="text-3">
                  {i18n.t('pages|specification_page|resource_specification')}
                </h2>
                <div
                  className="specification__resource"
                  data-entryscape="resourceDescriptors2"
                  data-entryscape-rdftype="prof:ResourceDescriptor"
                ></div>

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
                    {i18n.t('pages|specification_page|about_specification')}
                  </h2>

                  <div
                    className="specificationDetails"
                    data-entryscape="view"
                    data-entryscape-rdformsid="prof:Profile"
                    data-entryscape-filterpredicates="dcterms:title,dcterms:description,dcat:distribution,dcterms:publisher,prof:hasResource,adms:prev"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </EntrystoreContext.Consumer>
    </EntrystoreProvider>
  );
};
