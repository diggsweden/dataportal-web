import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { ApiIndexContext, EntrystoreContext, SettingsContext } from '../../components';
import Link from 'next/link';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { linkBase } from '../../utilities';
import { initBreadcrumb } from '../../pages/_app';
import Head from 'next/head';
import { Heading } from '@digg/design-system';
import {
  accessrigthsIndicator,
  architechtureIndicator,
  exploreApiLink,
  licenseIndicator,
  periodicityIndicator,
} from '../../utilities/entryscape_blocks';

export const DataServicePage: React.FC<{
  dataSet: string | string[] | undefined;
  name: string | string[] | undefined;
}> = ({ dataSet, name }) => {
  const { lang, t } = useTranslation();
  const { findDetection } = useContext(ApiIndexContext);
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { asPath } = useRouter() || {};
  const { trackPageView } = useMatomo();
  const ids = (typeof dataSet === 'string' && dataSet.split('_')) || [];
  const cid = ids[0];
  const eid = ids[1];
  let postscribe: any;

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    //we need to reload the page when using the back/forward buttons to a blocks rendered page
    if (typeof window !== 'undefined') {
      //check if reffereing search params is set to hash
      if (window.location && window.location.hash && window.location.hash.includes('ref=?'))
        window.onpopstate = (e: any) => {
          window.location.reload();
        };
    }
    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title || '',
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
  }, [entry.title]);

  useEffect(() => {
    addScripts();
  }, []);

  useEffect(() => {
    trackPageView({ documentTitle: Array.isArray(name) ? name[0] : name });
  }, [asPath]);

  const addScripts = () => {
    if (typeof window !== 'undefined') {
      postscribe = (window as any).postscribe;

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
            'routes|dataservices$path'
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
              ${accessrigthsIndicator},
              ${architechtureIndicator},
              ${periodicityIndicator},
              ${exploreApiLink},
              ${licenseIndicator},
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
      <div className="detailpage__wrapper dataservices">
        {/* Left column */}
        <div className="detailpage__wrapper--leftcol content">
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
          />

          {/* Indicators */}
          <div className="row indicators">
            <div
              data-entryscape="architectureIndicator"
              className="architectureIndicator"
            />
            <div
              data-entryscape="accessRightsIndicator"
              className="accessRightsIndicator"
            />
            <div
              data-entryscape="periodicityIndicator"
              className="architectureIndicator"
            />
            <div
              data-entryscape="licenseIndicator"
              className="licenseIndicator"
            />
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
          />

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
          />

          {findDetection(cid, eid) && (
            <span className="esbRowAlignSecondary">
              <Link
                href={`/${t('routes|dataservices$path')}/${cid}_${eid}/${name}/apiexplore/${eid}`}
                locale={lang}
                className="dataservice-explore-api-link entryscape text-md link"
              >
                Utforska API
              </Link>
              <br />
            </span>
          )}

          <div className="contact__publisher hbbr">
            <Heading level={3}>{t('pages|datasetpage$contact-publisher')}</Heading>
            <p>
              {t('pages|datasetpage$contact-publisher-text')}
              {t('pages|datasetpage$contact-publisher-text2')}{' '}
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
            <Heading
              level={2}
              size="md"
            >
              {t('pages|dataservicepage$api')}
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
