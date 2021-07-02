import { Box } from '@digg/design-system';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { RouterContext } from '../../../shared/RouterContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { NoJavaScriptWarning } from '../../components/NoJavaScriptWarning';
import { QueryParamProvider } from '../../components/QueryParamProvider';
import { __RouterContext } from 'react-router';
import { Link } from 'react-router-dom';
import { PageMetadata } from '../PageMetadata';
import { encode, decode } from 'qss';
import { Loader } from '../../components/Loader';
import i18n from 'i18n';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { slugify } from 'utilities/urlHelpers';
import {
  EntrystoreProvider,
  EntrystoreContext,
} from '../../components/EntrystoreProvider';
import { PageProps } from '../PageProps';
import ShowMoreText from 'react-show-more-text';
import ChopLines from 'chop-lines';
import { StaticBreadcrumb } from 'components/Breadcrumb';

const MainContent = Box.withComponent('main');

export class DataSetPage extends React.Component<
  PageProps,
  { scriptsAdded: Boolean; scriptsLoaded: Boolean }
> {
  private headerRef: React.RefObject<Header>;
  private postscribe: any;
  private referredSearch: string = `/${i18n.languages[0]}/${i18n.t(
    'routes|datasets|path'
  )}/?q=`;

  constructor(props: PageProps) {
    super(props);
    this.headerRef = React.createRef();
    this.setFocus = this.setFocus.bind(this);
  }

  // componentDidUpdate(){
  //   console.log('update');
  //   console.log(window);
  //   if (typeof window !== 'undefined') {
  //     console.log('window');
  //     window.onpopstate = ((e:any) => {
  //       console.log('pop!');
  //       window.location.reload();
  //     })
  //   }
  // }

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  componentDidMount() {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== 'undefined') {
      //check if reffereing search params is set to hash
      if (
        window.location &&
        window.location.hash &&
        window.location.hash.includes('ref=?')
      )
        this.referredSearch = `/${i18n.languages[0]}/${i18n.t(
          'routes|datasets|path'
        )}/?${window.location.hash.split('ref=?')[1]}`;

      window.onpopstate = (e: any) => {
        window.location.reload();
      };
    }

    this.addScripts();
  }

  addScripts() {
    if (typeof window !== 'undefined') {
      let reactThis = this;

      this.postscribe = (window as any).postscribe;

      if (this.props.match.params.eid && this.props.match.params.cid) {
        this.postscribe(
          '#scriptsPlaceholder',
          ` 
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              this.props.env.ENTRYSCAPE_DATASETS_PATH
                ? this.props.env.ENTRYSCAPE_DATASETS_PATH
                : 'admin.dataportal.se'
            }\/store'          
          };
          window.__entryscape_config = [{

            block: 'config',
            page_language: '${i18n.languages[0]}',
            entry: '${this.props.match.params.eid}', 
            context: '${this.props.match.params.cid}',
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
                  '<a href="{{prop "dcat:downloadURL"}}" class="text-5 distribution__link" target="_blank">${i18n.t(
                    'pages|datasetpage|download_link'
                  )}</a>' +
                  '{{/ifprop}}' +
                  '{{/ifprop}}' +
                  '{{#ifprop "dcat:downloadURL" invert="true"}}' +
                  '<a href="{{prop "dcat:accessURL"}}" class="text-5 distribution__link" target="_blank">' +
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
              ? this.props.env.ENTRYSCAPE_OPENDATA_SV_URL
              : this.props.env.ENTRYSCAPE_OPENDATA_EN_URL
          }"></script>
          <script src="${
            this.props.env.ENTRYSCAPE_BLOCKS_URL
          }"></script>                       
          `,
          {
            done: function () {},
          }
        );
      }
    }
  }

  setFocus() {
    if (this.headerRef.current) {
      this.headerRef.current.setFocusOnMenuButton();
    }
  }

  render() {
    const { location } = this.props;
    let uri = new URLSearchParams(location.search);

    return (
      <EntrystoreProvider
        env={this.props.env}
        cid={this.props.match.params.cid}
        eid={this.props.match.params.eid}
        entrystoreUrl={this.props.env.ENTRYSCAPE_DATASETS_PATH}
      >
        <EntrystoreContext.Consumer>
          {(entry) => (
            <QueryParamProvider params={uri}>
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
                      ? `${this.props.env.CANONICAL_URL}/${
                          i18n.languages[0]
                        }/${i18n.t('routes|datasets|path')}/${
                          this.props.match.params.cid
                        }_${this.props.match.params.eid}/${slugify(
                          entry.title
                        )}`
                      : '',
                }}
                canonicalUrl={
                  entry && entry.title
                    ? `${this.props.env.CANONICAL_URL}/${
                        i18n.languages[0]
                      }/${i18n.t('routes|datasets|path')}/${
                        this.props.match.params.cid
                      }_${this.props.match.params.eid}/${slugify(entry.title)}`
                    : ''
                }
              />

              <Box
                id="top"
                display="flex"
                direction="column"
                minHeight="100vh"
                bgColor="#fff"
              >
                <NoJavaScriptWarning text="" />

                <Header ref={this.headerRef} env={this.props.env} />

                <ErrorBoundary>
                  <MainContent
                    className="detailpage main-container"
                    flex="1 1 auto"
                  >
                    <StaticBreadcrumb
                      env={this.props.env}
                      staticPaths={[
                        {
                          path: this.referredSearch,
                          title: i18n.t('routes|datasets|title'),
                        },
                        {
                          path: `/${i18n.languages[0]}/${i18n.t(
                            'routes|datasets|path'
                          )}/${this.props.match.params.cid}_${
                            this.props.match.params.eid
                          }/${slugify(entry.title)}`,
                          title: entry.title,
                        },
                      ]}
                    />
                    <div className="detailpage__wrapper">
                      {/* Left column */}
                      {/* Left column */}
                      <div className="detailpage__wrapper--leftcol">
                        {/* Title */}
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

                        <div className="description">
                          <ShowMoreText
                            lines={8}
                            more={i18n.t('pages|datasetpage|view_more')}
                            less={i18n.t('pages|datasetpage|view_less')}
                            className="text-5"
                            anchorClass="text-5 view-more-text-link"
                            expanded={false}
                          >
                            <span className="text-5">{entry.description}</span>
                          </ShowMoreText>
                        </div>

                        {/* Use data header */}
                        <h2 className="text-3 hbbr">
                          {i18n.t('pages|datasetpage|use-data')}
                        </h2>

                        {/* List with data files */}
                        <div
                          className="distribution__list"
                          data-entryscape="distributionList2"
                          data-entryscape-registry="true"
                        ></div>

                        <div
                          className="dataset__map"
                          data-entryscape="view"
                          data-entryscape-rdformsid="dcat:dcterms:spatial_bb_da"
                          data-entryscape-label="false"
                        ></div>

                        <div className="contact__publisher hbbr">
                          <h3 className="text-4">
                            {i18n.t('pages|datasetpage|contact-publisher')}
                          </h3>
                          <p className="text-5">
                            {i18n.t('pages|datasetpage|contact-publisher-text')}
                            {i18n.t(
                              'pages|datasetpage|contact-publisher-text2'
                            )}{' '}
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
                            {i18n.t('pages|datasetpage|about-dataset')}
                          </h2>

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

                        <div className="detailpage__wrapper--rightcol-info text-6">
                          <h2 className="text-5-bold">
                            {i18n.t('pages|datasetpage|catalog')}
                          </h2>

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
                              use="cat" 
                              filterpredicates="dcterms:issued,dcterms:language,dcterms:modified,dcterms:spatial,dcterms:license,dcat:themeTaxonomi"
                              }}`,
                            }}
                          ></script>
                        </div>
                        <script
                          className="download__rdf"
                          type="text/x-entryscape-handlebar"
                          data-entryscape="true"
                          data-entryscape-block="template"
                          dangerouslySetInnerHTML={{
                            __html: `
                        <a class="download__rdf--link text-5-link" target="_blank" href="{{metadataURI}}?recursive=dcat">${i18n.t(
                          'pages|datasetpage|rdf'
                        )}</a>
                        `,
                          }}
                        ></script>
                      </div>
                    </div>
                  </MainContent>
                </ErrorBoundary>
                <Footer onToTopButtonPushed={this.setFocus} />
              </Box>
            </QueryParamProvider>
          )}
        </EntrystoreContext.Consumer>
      </EntrystoreProvider>
    );
  }
}
