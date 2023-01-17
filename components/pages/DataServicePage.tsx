import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import {
  ApiIndexContext,
  EntrystoreContext,
  SettingsContext,
} from "../../components";
import Link from "next/link";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Head from "next/head";
import { Heading } from "@digg/design-system";

export const DataServicePage: React.FC<{
  dataSet: string | string[] | undefined;
  name: string | string[] | undefined;
}> = ({ dataSet, name }) => {
  const { lang, t } = useTranslation();
  const { findDetection } = useContext(ApiIndexContext);
  const { env } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { asPath } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];
  let postscribe: any;

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== "undefined") {
      //check if reffereing search params is set to hash
      if (
        window.location &&
        window.location.hash &&
        window.location.hash.includes("ref=?")
      )
        window.onpopstate = () => {
          window.location.reload();
        };
    }
  }, [entry.title]);

  useEffect(() => {
    addScripts();
  }, []);

  useEffect(() => {
    trackPageView({ documentTitle: Array.isArray(name) ? name[0] : name });
  }, [asPath]);

  const addScripts = () => {
    if (typeof window !== "undefined") {
      postscribe = (window as any).postscribe;

      if (eid && cid) {
        postscribe(
          "#scriptsPlaceholder",
          ` 
          <script>
          var __entryscape_plugin_config = {
            entrystore_base: 'https:\/\/${
              env.ENTRYSCAPE_DATASETS_PATH
                ? env.ENTRYSCAPE_DATASETS_PATH
                : "admin.dataportal.se"
            }\/store'          
          };

          function getApiExploreUrl(entryid,apientryid)
          {
            return '/${t(
              "routes|dataservices$path"
            )}/${cid}_'+entryid+'/${name}/apiexplore/'+apientryid
          }

          window.__entryscape_config = [{

            block: 'config',
            page_language: '${lang}',
            entry: '${eid}', 
            context: '${cid}',
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
                  '<span class="text-md">{{#eachprop "dcterms:type"}}{{label}}{{separator}}{{/eachprop}}</span></span>' +
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
                      el.innerHTML = 'Utforska API'
                      el.setAttribute('href', getApiExploreUrl('${eid}',entryId))
                      el.setAttribute('class', 'entryscape explore-api-link text-md link') 
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
            lang == "sv"
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
      <div className="detailpage__wrapper dataservices">
        {/* Left column */}
        <div className="detailpage__wrapper--leftcol content">
          <Heading weight="light" size={"3xl"}>
            {entry.title}
          </Heading>

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
                          <div class="description text-md">{{text content="\${dcterms:description}"}}</div>
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

          {findDetection(cid, eid) && (
            <span className="esbRowAlignSecondary">
              <Link
                href={`/${t(
                  "routes|dataservices$path"
                )}/${cid}_${eid}/${name}/apiexplore/${eid}`}
                locale={lang}
                className="dataservice-explore-api-link entryscape text-md link"
              >
                Utforska API
              </Link>
              <br />
            </span>
          )}

          <div className="contact__publisher hbbr">
            <Heading level={3}>
              {t("pages|datasetpage$contact-publisher")}
            </Heading>
            <p>
              {t("pages|datasetpage$contact-publisher-text")}
              {t("pages|datasetpage$contact-publisher-text2")}{" "}
              <a
                className="link"
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
          <div className="detailpage__wrapper--rightcol-info text-base">
            <Heading color="pinkPop" level={2} size={"xl"} weight="light">
              {t("pages|dataservicepage$api")}
            </Heading>

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
  );
};
